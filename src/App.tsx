import { useState } from 'react'
import type { Page, AuthStep } from './lib/types'
import Auth from './pages/Auth'
import Shell from './components/Shell'
import Dashboard from './pages/Dashboard'
import Organizations, { OrgDetail } from './pages/Organizations'
import Administrators from './pages/Administrators'
import Identity from './pages/Identity'
import PlatformServices from './pages/PlatformServices'
import Integrations from './pages/Integrations'
import Marketplace from './pages/Marketplace'
import Billing from './pages/Billing'
import Security from './pages/Security'
import Analytics from './pages/Analytics'
import Monitoring from './pages/Monitoring'
import Automation from './pages/Automation'
import AIManagement from './pages/AIManagement'
import Support from './pages/Support'
import AuditLogs from './pages/AuditLogs'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import { ConfirmDialog, Toast } from './components/ui'

export default function App() {
  const [authStep, setAuthStep] = useState<AuthStep>('login')
  const [authenticated, setAuthenticated] = useState(false)
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [logoutToast, setLogoutToast] = useState(false)

  const handleAuth = () => {
    setAuthenticated(true)
  }

  const handleLogout = () => {
    setShowLogoutConfirm(true)
  }

  const confirmLogout = () => {
    setShowLogoutConfirm(false)
    setAuthenticated(false)
    setAuthStep('login')
    setCurrentPage('dashboard')
    setSelectedOrg(null)
  }

  const navigate = (page: Page) => {
    setCurrentPage(page)
    if (page !== 'org-detail') setSelectedOrg(null)
    window.scrollTo(0, 0)
  }

  const handleOrgSelect = (id: string) => {
    setSelectedOrg(id)
    setCurrentPage('org-detail')
  }

  if (!authenticated) {
    return (
      <Auth
        step={authStep}
        setStep={setAuthStep}
        onAuth={handleAuth}
      />
    )
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard setPage={navigate} setSelectedOrg={handleOrgSelect} />

      case 'organizations':
        return <Organizations setPage={navigate} selectedOrg={selectedOrg} setSelectedOrg={handleOrgSelect} />

      case 'org-detail':
        return selectedOrg
          ? <OrgDetail orgId={selectedOrg} setPage={navigate} />
          : <Organizations setPage={navigate} selectedOrg={null} setSelectedOrg={handleOrgSelect} />

      case 'administrators':
        return <Administrators />

      case 'identity':
        return <Identity />

      case 'platform-services':
        return <PlatformServices />

      case 'integrations':
        return <Integrations />

      case 'marketplace':
        return <Marketplace />

      case 'billing':
        return <Billing />

      case 'security':
        return <Security />

      case 'analytics':
        return <Analytics />

      case 'monitoring':
        return <Monitoring />

      case 'automation':
        return <Automation />

      case 'ai':
        return <AIManagement />

      case 'support':
        return <Support />

      case 'audit':
        return <AuditLogs />

      case 'settings':
        return <Settings />

      case 'profile':
        return <Profile />

      default:
        return <Dashboard setPage={navigate} setSelectedOrg={handleOrgSelect} />
    }
  }

  return (
    <>
      <Shell currentPage={currentPage} setPage={navigate} onLogout={handleLogout}>
        <div key={currentPage} className="page-enter">
          {renderPage()}
        </div>
      </Shell>

      {showLogoutConfirm && (
        <ConfirmDialog
          title="Sign out of Super Admin?"
          message="You will be signed out of all active sessions. You will need to sign in again to access the platform control center."
          confirmLabel="Sign out"
          onConfirm={confirmLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </>
  )
}
