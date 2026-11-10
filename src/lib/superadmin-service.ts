import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { db, createTenantAdminAuthAccount } from "./firebase";
import type { Org, Admin, AuditLog, SuperAdminUser } from "./types";

// ─── AUDIT LOGGING ────────────────────────────────────────────────────────────
export async function recordAuditLog(
  actor: string,
  action: string,
  resource: string,
  org: string,
  result: 'success' | 'failed' = 'success',
  ip: string = '127.0.0.1'
) {
  try {
    const logsRef = collection(db, "audit_logs");
    const logId = `LOG-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    await setDoc(doc(logsRef, logId), {
      id: logId,
      timestamp: new Date().toISOString(),
      createdAt: serverTimestamp(),
      actor,
      actorType: "Super Admin",
      action,
      resource,
      org,
      ip,
      result
    });
  } catch (err) {
    console.warn("Failed to write audit log:", err);
  }
}

export function subscribeAuditLogs(callback: (logs: AuditLog[]) => void): () => void {
  const q = query(collection(db, "audit_logs"), limit(100));
  return onSnapshot(q, (snapshot) => {
    const logs: AuditLog[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        timestamp: data.timestamp || (data.createdAt?.toDate ? data.createdAt.toDate().toLocaleString() : new Date().toLocaleString()),
        actor: data.actor || 'Super Admin',
        actorType: data.actorType || 'Super Admin',
        action: data.action || 'Unknown action',
        resource: data.resource || 'System',
        org: data.org || 'Workzi Global',
        ip: data.ip || '127.0.0.1',
        result: data.result || 'success'
      };
    });

    // Sort descending by timestamp
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    callback(logs);
  }, (err) => {
    console.error("subscribeAuditLogs error:", err);
  });
}

// ─── SUPER ADMIN PERMISSION & PROFILE ─────────────────────────────────────────
export async function verifySuperAdmin(uid: string): Promise<SuperAdminUser | null> {
  try {
    const adminSnap = await getDoc(doc(db, "admin_users", uid));
    if (adminSnap.exists()) {
      const d = adminSnap.data();
      return {
        uid,
        email: d.email || "",
        name: d.name || "Super Admin",
        role: d.role === "platform_admin" ? "platform_admin" : "super_admin",
        avatarUrl: d.avatarUrl,
        twoFaEnabled: Boolean(d.twoFaEnabled)
      };
    }
    return null;
  } catch (err) {
    console.warn("verifySuperAdmin check failed:", err);
    return null;
  }
}

export async function bootstrapSuperAdmin(uid: string, email: string, name: string): Promise<SuperAdminUser> {
  const profile: SuperAdminUser = {
    uid,
    email: email.toLowerCase(),
    name: name || email.split("@")[0],
    role: "super_admin",
    twoFaEnabled: false
  };

  await setDoc(doc(db, "admin_users", uid), {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }, { merge: true });

  await recordAuditLog(email, "Bootstrap Super Admin", `admin_users/${uid}`, "Workzi Global");
  return profile;
}

// ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────
function parseEmployeeCount(val: any): number {
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (!val) return 1;
  if (typeof val === 'string') {
    const parts = val.split(/[–\-+]/);
    if (parts.length > 1) {
      const parsed = parseInt(parts[parts.length - 1].replace(/\D/g, ''), 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    const parsed = parseInt(val.replace(/\D/g, ''), 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return 1;
}

function parseCreatedDate(val: any): string {
  if (!val) return "Recent";
  if (val.toDate && typeof val.toDate === "function") {
    return val.toDate().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }
  if (typeof val === "string") {
    try {
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric"
        });
      }
    } catch {
      // fallback
    }
    return val;
  }
  return "Recent";
}

function mapOrgRecord(id: string, data: any): Org {
  const plan = data.plan || "Business";
  const calculatedMrr =
    typeof data.mrr === "number"
      ? data.mrr
      : plan === "Enterprise"
      ? 124000
      : plan === "Business"
      ? 48200
      : plan === "Professional"
      ? 23400
      : 0;

  const orgName = data.companyName || data.name || data.organizationName || data.portalName || id;
  const rawStatus = (data.status || "active").toLowerCase();
  const status: "active" | "trial" | "suspended" | "pending" =
    rawStatus === "suspended" || rawStatus === "rejected"
      ? "suspended"
      : rawStatus === "trial"
      ? "trial"
      : rawStatus === "pending" || rawStatus === "pending_admin_setup"
      ? "pending"
      : "active";

  const users = parseEmployeeCount(data.employeeCount || data.userCount || data.totalEmployees);

  return {
    id,
    name: orgName,
    plan,
    status,
    users,
    admins: Number(data.adminCount || 1),
    usage: Number(data.usage || 75),
    subscription: data.subscription || `₹${calculatedMrr.toLocaleString("en-IN")}/mo`,
    created: parseCreatedDate(data.createdAt || data.approvedAt),
    lastActivity: data.lastActivity || "Active recently",
    industry: data.industry || data.businessType || "Technology",
    region: data.region || data.city || data.state || "Mumbai",
    mrr: calculatedMrr
  };
}

// ─── ORGANIZATIONS SUBSCRIPTION & MANAGEMENT ─────────────────────────────────
export function subscribeOrganizations(callback: (orgs: Org[]) => void): () => void {
  let orgsFromOrgs: Org[] = [];
  let orgsFromCompanies: Org[] = [];

  const update = () => {
    const combinedMap = new Map<string, Org>();
    for (const o of orgsFromOrgs) {
      combinedMap.set(o.id, o);
    }
    for (const c of orgsFromCompanies) {
      if (!combinedMap.has(c.id)) {
        combinedMap.set(c.id, c);
      }
    }
    const result = Array.from(combinedMap.values());
    callback(result);
  };

  const unsubOrgs = onSnapshot(collection(db, "organizations"), (snapshot) => {
    orgsFromOrgs = snapshot.docs.map(d => mapOrgRecord(d.id, d.data()));
    update();
  }, (err) => {
    console.warn("subscribeOrganizations error:", err);
  });

  const unsubCompanies = onSnapshot(collection(db, "companies"), (snapshot) => {
    orgsFromCompanies = snapshot.docs.map(d => mapOrgRecord(d.id, d.data()));
    update();
  }, (err) => {
    console.warn("subscribeCompanies error:", err);
    update();
  });

  return () => {
    unsubOrgs();
    unsubCompanies();
  };
}

export interface NewOrgPayload {
  name: string;
  industry: string;
  region: string;
  size: string;
  website?: string;
  gst?: string;
  adminName: string;
  adminEmail: string;
  adminPhone?: string;
  adminRole?: string;
  plan: string;
  billing: string;
  initialPassword?: string;
}

export async function createTenantOrganization(
  payload: NewOrgPayload,
  actorEmail: string
): Promise<{ success: boolean; orgId: string; error?: string }> {
  try {
    const cleanEmail = payload.adminEmail.trim().toLowerCase();
    const sanitizedOrgSlug = payload.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 24);
    const orgId = `org_${sanitizedOrgSlug}_${Date.now().toString(36)}`;

    // 1. Calculate MRR
    const mrr =
      payload.plan === "Enterprise"
        ? 124000
        : payload.plan === "Business"
        ? 48200
        : payload.plan === "Professional"
        ? 23400
        : 0;

    // 2. Create Organization Doc in Firestore
    const orgDocRef = doc(db, "organizations", orgId);
    await setDoc(orgDocRef, {
      id: orgId,
      name: payload.name,
      industry: payload.industry,
      region: payload.region,
      size: payload.size,
      website: payload.website || "",
      gst: payload.gst || "",
      plan: payload.plan,
      billing: payload.billing,
      status: "active",
      userCount: 1,
      adminCount: 1,
      usage: 10,
      subscription: payload.billing === "Annual" ? `₹${Math.round(mrr * 0.8).toLocaleString("en-IN")}/mo` : `₹${mrr.toLocaleString("en-IN")}/mo`,
      mrr: payload.billing === "Annual" ? Math.round(mrr * 0.8) : mrr,
      primaryContact: {
        name: payload.adminName,
        email: cleanEmail,
        phone: payload.adminPhone || ""
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdVia: "superadmin_platform"
    });

    // 3. Create Tenant HR Admin in Firebase Auth
    const defaultPassword = payload.initialPassword || "Workzi@2026!";
    const authRes = await createTenantAdminAuthAccount(cleanEmail, defaultPassword);
    const adminUid = authRes.uid || `auth_pending_${Date.now()}`;

    // 4. Provision in approved_users collection (Head of Organization = HR Admin)
    const approvedUserRef = doc(db, "approved_users", cleanEmail);
    await setDoc(approvedUserRef, {
      uid: adminUid,
      email: cleanEmail,
      name: payload.adminName,
      phone: payload.adminPhone || "",
      companyId: orgId,
      companyName: payload.name,
      orgId: orgId,
      role: "hr_admin",
      status: "active",
      setupComplete: true,
      initialPasswordProvided: Boolean(payload.initialPassword),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });

    // 5. Add to organization's members subcollection
    const memberRef = doc(db, "organizations", orgId, "members", adminUid);
    await setDoc(memberRef, {
      uid: adminUid,
      email: cleanEmail,
      name: payload.adminName,
      role: "hr_admin",
      status: "active",
      joinedAt: serverTimestamp()
    }, { merge: true });

    // 6. Record Audit Log
    await recordAuditLog(
      actorEmail,
      `Create Organization`,
      `organizations/${orgId}`,
      payload.name,
      "success"
    );

    return { success: true, orgId };
  } catch (err: any) {
    console.error("createTenantOrganization error:", err);
    await recordAuditLog(
      actorEmail,
      `Create Organization Failed`,
      `organizations`,
      payload.name,
      "failed"
    );
    return { success: false, orgId: "", error: err.message || "Failed to create organization" };
  }
}

export async function toggleOrganizationStatus(
  orgId: string,
  orgName: string,
  newStatus: "active" | "suspended",
  actorEmail: string
): Promise<boolean> {
  try {
    await updateDoc(doc(db, "organizations", orgId), {
      status: newStatus,
      updatedAt: serverTimestamp()
    });

    await recordAuditLog(
      actorEmail,
      `${newStatus === "suspended" ? "Suspend" : "Reactivate"} Organization`,
      `organizations/${orgId}`,
      orgName,
      "success"
    );
    return true;
  } catch (err) {
    console.error("toggleOrganizationStatus error:", err);
    return false;
  }
}

export async function updateOrganizationPlan(
  orgId: string,
  orgName: string,
  newPlan: string,
  actorEmail: string
): Promise<boolean> {
  try {
    const mrr =
      newPlan === "Enterprise"
        ? 124000
        : newPlan === "Business"
        ? 48200
        : newPlan === "Professional"
        ? 23400
        : 0;

    await updateDoc(doc(db, "organizations", orgId), {
      plan: newPlan,
      subscription: `₹${mrr.toLocaleString("en-IN")}/mo`,
      mrr: mrr,
      updatedAt: serverTimestamp()
    });

    await recordAuditLog(
      actorEmail,
      `Update Plan to ${newPlan}`,
      `organizations/${orgId}`,
      orgName,
      "success"
    );
    return true;
  } catch (err) {
    console.error("updateOrganizationPlan error:", err);
    return false;
  }
}

// ─── GLOBAL USERS & ADMINISTRATORS ────────────────────────────────────────────
export function subscribeUsers(callback: (users: Admin[]) => void): () => void {
  const colRef = collection(db, "approved_users");
  return onSnapshot(colRef, (snapshot) => {
    const list: Admin[] = snapshot.docs.map((d) => {
      const data = d.data();
      const rawRole = (data.role || "employee").toLowerCase();
      const displayRole =
        rawRole === "hr_admin" || rawRole === "admin" || rawRole === "super_admin" || rawRole === "hr"
          ? "HR Admin"
          : rawRole === "manager"
          ? "Manager"
          : "Employee";

      const createdStr = parseCreatedDate(data.createdAt || data.approvedAt);
      const rawStatus = (data.status || "active").toLowerCase();
      const status: "active" | "suspended" | "pending" =
        rawStatus === "suspended" || rawStatus === "rejected"
          ? "suspended"
          : rawStatus === "pending" || rawStatus === "pending_approval"
          ? "pending"
          : "active";

      const userName = data.name || data.displayName || data.fullName || (data.email ? data.email.split("@")[0] : d.id.split("@")[0]);
      const orgName = data.companyName || data.companyId || "Workzi Org";

      return {
        id: d.id,
        name: userName,
        org: orgName,
        email: data.email || d.id,
        role: displayRole,
        status,
        lastLogin: data.lastLogin || (data.updatedAt ? "Recently" : "Active"),
        twoFa: Boolean(data.twoFaEnabled),
        created: createdStr
      };
    });

    callback(list);
  }, (err) => {
    console.error("subscribeUsers error:", err);
  });
}

export async function toggleUserStatus(
  email: string,
  name: string,
  orgName: string,
  newStatus: "active" | "suspended",
  actorEmail: string
): Promise<boolean> {
  try {
    await updateDoc(doc(db, "approved_users", email.toLowerCase()), {
      status: newStatus,
      updatedAt: serverTimestamp()
    });

    await recordAuditLog(
      actorEmail,
      `${newStatus === "suspended" ? "Suspend" : "Reactivate"} User Account`,
      `approved_users/${email}`,
      orgName,
      "success"
    );
    return true;
  } catch (err) {
    console.error("toggleUserStatus error:", err);
    return false;
  }
}

