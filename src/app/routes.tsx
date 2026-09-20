import { lazy, Suspense, type ComponentType, type ReactNode } from 'react'
import { Link, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { PortalLayout } from '@/layouts'
import { MahaSetuBrand } from '@/components/branding/MahaSetuBrand'
import { useAuth } from '@/context/AuthContext'
import { Loader2, ShieldX } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { recordRouteEvent } from '@/features/audit/routeAudit'
import type { Role } from '@/types'

/* Public (eager) */
import Landing from '@/pages/public/Landing'
import Services from '@/pages/public/Services'
import ServiceDetail from '@/pages/public/ServiceDetail'
import Schemes from '@/pages/public/Schemes'
import Departments from '@/pages/public/Departments'
import News from '@/pages/public/News'
import Login from '@/pages/public/Login'
import Register from '@/pages/public/Register'
import ForgotMahaId from '@/pages/public/ForgotMahaId'
import ForgotPassword from '@/pages/public/ForgotPassword'
import Track from '@/pages/public/Track'
import { LifeEvents, LifeEventDetail } from '@/pages/public/LifeEvents'

/* Citizen (lazy) */
const CitizenDashboard = lazy(() => import('@/pages/citizen/Dashboard'))
const CitizenServices = lazy(() => import('@/pages/citizen/Services'))
const CitizenLifeEvents = lazy(() => import('@/pages/citizen/LifeEvents'))
const CitizenLifeEventDetail = lazy(() => import('@/pages/citizen/LifeEventDetail'))
const CitizenApplications = lazy(() => import('@/pages/citizen/Applications'))
const CitizenApplicationDetail = lazy(() => import('@/pages/citizen/ApplicationDetail'))
const CitizenDocuments = lazy(() => import('@/pages/citizen/Documents'))
const CitizenSchemes = lazy(() => import('@/pages/citizen/Schemes'))
const CitizenGrievances = lazy(() => import('@/pages/citizen/Grievances'))
const CitizenPayments = lazy(() => import('@/pages/citizen/Payments'))
const CitizenNotifications = lazy(() => import('@/pages/citizen/Notifications'))
const CitizenAI = lazy(() => import('@/pages/citizen/AIAssistant'))
const CitizenNearby = lazy(() => import('@/pages/citizen/Nearby'))
const CitizenConsent = lazy(() => import('@/pages/citizen/Consent'))
const CitizenProfile = lazy(() => import('@/pages/citizen/Profile'))
const CitizenSettings = lazy(() => import('@/pages/citizen/Settings'))

/* Official (lazy) */
const OfficialDashboard = lazy(() => import('@/pages/official/Dashboard'))
const OfficialApplications = lazy(() => import('@/pages/official/Applications'))
const OfficialApplicationDetail = lazy(() => import('@/pages/official/ApplicationDetail'))
const OfficialGrievances = lazy(() => import('@/pages/official/Grievances'))
const OfficialDocuments = lazy(() => import('@/pages/official/Documents'))
const OfficialInteroperability = lazy(() => import('@/pages/official/Interoperability'))
const OfficialReports = lazy(() => import('@/pages/official/Reports'))
const OfficialProfile = lazy(() => import('@/pages/official/Profile'))

/* Business (lazy) */
const BusinessDashboard = lazy(() => import('@/pages/business/Dashboard'))
const BusinessServices = lazy(() => import('@/pages/business/Services'))
const BusinessApplications = lazy(() => import('@/pages/business/Applications'))
const BusinessLicences = lazy(() => import('@/pages/business/Licences'))
const BusinessCompliance = lazy(() => import('@/pages/business/Compliance'))
const BusinessSchemes = lazy(() => import('@/pages/business/Schemes'))
const BusinessDocuments = lazy(() => import('@/pages/business/Documents'))
const BusinessGrievances = lazy(() => import('@/pages/business/Grievances'))
const BusinessConnect = lazy(() => import('@/pages/business/Connect'))
const BusinessProfile = lazy(() => import('@/pages/business/Profile'))

/* Department admin (lazy) */
const DeptDashboard = lazy(() => import('@/pages/department-admin/Dashboard'))
const DeptServices = lazy(() => import('@/pages/department-admin/Services'))
const DeptApplications = lazy(() => import('@/pages/department-admin/Applications'))
const DeptWorkflows = lazy(() => import('@/pages/department-admin/Workflows'))
const DeptOfficials = lazy(() => import('@/pages/department-admin/Officials'))
const DeptInteroperability = lazy(() => import('@/pages/department-admin/Interoperability'))
const DeptAnalytics = lazy(() => import('@/pages/department-admin/Analytics'))
const DeptGrievances = lazy(() => import('@/pages/department-admin/Grievances'))
const DeptAudit = lazy(() => import('@/pages/department-admin/Audit'))
const DeptSettings = lazy(() => import('@/pages/department-admin/Settings'))

/* Super admin (lazy) */
const AdminOverview = lazy(() => import('@/pages/mahasetu-admin/Overview'))
const AdminDepartments = lazy(() => import('@/pages/mahasetu-admin/Departments'))
const AdminRegistry = lazy(() => import('@/pages/mahasetu-admin/Registry'))
const AdminInterop = lazy(() => import('@/pages/mahasetu-admin/Interoperability'))
const AdminSystemHealth = lazy(() => import('@/pages/mahasetu-admin/SystemHealth'))
const AdminAnalytics = lazy(() => import('@/pages/mahasetu-admin/Analytics'))
const AdminGrievances = lazy(() => import('@/pages/mahasetu-admin/Grievances'))
const AdminSecurity = lazy(() => import('@/pages/mahasetu-admin/Security'))
const AdminAudit = lazy(() => import('@/pages/mahasetu-admin/Audit'))
const AdminConfiguration = lazy(() => import('@/pages/mahasetu-admin/Configuration'))

/* Shared */
const ApplyFlow = lazy(() => import('@/pages/shared/ApplyFlow'))
const GlobalSearch = lazy(() => import('@/pages/shared/GlobalSearch'))
const Platform = lazy(() => import('@/pages/public/Platform'))
const NotFound = lazy(() => import('@/pages/public/NotFound'))

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-slate-400">
      <MahaSetuBrand variant="compact" className="mb-5" />
      <Loader2 className="w-7 h-7 animate-spin text-primary-600" />
      <div className="text-sm mt-3">Loading MahaSetu…</div>
    </div>
  )
}

function PublicOnly({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const location = useLocation()
  if (user) {
    return <Navigate to="/citizen" replace state={{ from: location }} />
  }
  return <>{children}</>
}

function RequireRole({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  if (!roles.includes(user.role)) {
    // RBAC: the authenticated account's role does not authorize this portal.
    return (
      <PortalGate path={location.pathname} role={user.role} userId={user.id}>
        <AccessDenied attempted={location.pathname} />
      </PortalGate>
    )
  }
  return <>{children}</>
}

/** Records one `route_denied` audit event per attempted portal path (never on legit pages). */
function PortalGate({ path, role, userId, children }: { path: string; role: Role; userId: string; children: ReactNode }) {
  const logged = useRef<string | null>(null)
  useEffect(() => {
    if (logged.current !== path) {
      logged.current = path
      recordRouteEvent('route_denied', path, role, userId)
    }
  }, [path, role, userId])
  return <>{children}</>
}

function AccessDenied({ attempted }: { attempted: string }) {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-canvas">
      <div className="max-w-md w-full text-center rounded-3xl bg-white border border-slate-200 shadow-pop p-8">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto">
          <ShieldX className="w-7 h-7 text-rose-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mt-4">Access denied</h1>
        <p className="text-sm text-slate-500 mt-2">
          Your account role <span className="font-semibold text-slate-700">{user?.role.replace('_', ' ')}</span> is not
          authorized for <span className="font-mono text-slate-700">{attempted}</span>. Role-based access control is simulated in this prototype.
        </p>
        <div className="mt-6 flex flex-col gap-2.5">
          <Link to={ROLE_HOME[user?.role ?? 'citizen']} className="rounded-xl bg-primary-900 text-white font-semibold py-3 text-sm hover:bg-primary-800">
            Go to my dashboard
          </Link>
          <button onClick={logout} className="rounded-xl border border-slate-300 text-slate-700 font-medium py-3 text-sm hover:bg-slate-50">
            Log out & sign in as a different account
          </button>
        </div>
      </div>
    </div>
  )
}

const ROLE_HOME: Record<string, string> = {
  citizen: '/citizen', official: '/official', business: '/business', department_admin: '/department-admin', super_admin: '/admin',
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/life-events" element={<LifeEvents />} />
          <Route path="/life-events/:id" element={<LifeEventDetail />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/news" element={<News />} />
          <Route path="/updates" element={<News />} />
          <Route path="/platform" element={
            <Suspense fallback={<PageLoader />}><Platform /></Suspense>
          } />
          <Route path="/track" element={<Track />} />
          <Route path="/apply/:serviceId" element={
            <Suspense fallback={<PageLoader />}><ApplyFlow /></Suspense>
          } />
        </Route>

        <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
        <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
        <Route path="/forgot-maha-id" element={<PublicOnly><ForgotMahaId /></PublicOnly>} />
        <Route path="/forgot-password" element={<PublicOnly><ForgotPassword /></PublicOnly>} />

        {/* Citizen */}
        <Route element={<RequireRole roles={['citizen']}><PortalLayout /></RequireRole>}>
          <Route path="/citizen" element={<CitizenDashboard />} />
          <Route path="/citizen/services" element={<CitizenServices />} />
          <Route path="/citizen/services/:id" element={<CitizenServiceDetail />} />
          <Route path="/citizen/life-events" element={<CitizenLifeEvents />} />
          <Route path="/citizen/life-events/:id" element={<CitizenLifeEventDetail />} />
          <Route path="/citizen/applications" element={<CitizenApplications />} />
          <Route path="/citizen/applications/:id" element={<CitizenApplicationDetail />} />
          <Route path="/citizen/documents" element={<CitizenDocuments />} />
          <Route path="/citizen/schemes" element={<CitizenSchemes />} />
          <Route path="/citizen/grievances" element={<CitizenGrievances />} />
          <Route path="/citizen/payments" element={<CitizenPayments />} />
          <Route path="/citizen/notifications" element={<CitizenNotifications />} />
          <Route path="/citizen/ai" element={<CitizenAI />} />
          <Route path="/citizen/nearby" element={<CitizenNearby />} />
          <Route path="/citizen/consent" element={<CitizenConsent />} />
          <Route path="/citizen/profile" element={<CitizenProfile />} />
          <Route path="/citizen/settings" element={<CitizenSettings />} />
        </Route>

        {/* Official */}
        <Route element={<RequireRole roles={['official']}><PortalLayout /></RequireRole>}>
          <Route path="/official" element={<OfficialDashboard />} />
          <Route path="/official/applications" element={<OfficialApplications />} />
          <Route path="/official/applications/:id" element={<OfficialApplicationDetail />} />
          <Route path="/official/grievances" element={<OfficialGrievances />} />
          <Route path="/official/documents" element={<OfficialDocuments />} />
          <Route path="/official/interoperability" element={<OfficialInteroperability view="official" />} />
          <Route path="/official/reports" element={<OfficialReports />} />
          <Route path="/official/profile" element={<OfficialProfile />} />
        </Route>

        {/* Business */}
        <Route element={<RequireRole roles={['business']}><PortalLayout /></RequireRole>}>
          <Route path="/business" element={<BusinessDashboard />} />
          <Route path="/business/services" element={<BusinessServices />} />
          <Route path="/business/applications" element={<BusinessApplications />} />
          <Route path="/business/licences" element={<BusinessLicences />} />
          <Route path="/business/compliance" element={<BusinessCompliance />} />
          <Route path="/business/schemes" element={<BusinessSchemes />} />
          <Route path="/business/documents" element={<BusinessDocuments />} />
          <Route path="/business/grievances" element={<BusinessGrievances />} />
          <Route path="/business/connect" element={<BusinessConnect />} />
          <Route path="/business/profile" element={<BusinessProfile />} />
        </Route>

        {/* Department admin */}
        <Route element={<RequireRole roles={['department_admin']}><PortalLayout /></RequireRole>}>
          <Route path="/department-admin" element={<DeptDashboard />} />
          <Route path="/department-admin/services" element={<DeptServices />} />
          <Route path="/department-admin/applications" element={<DeptApplications />} />
          <Route path="/department-admin/workflows" element={<DeptWorkflows />} />
          <Route path="/department-admin/officials" element={<DeptOfficials />} />
          <Route path="/department-admin/interoperability" element={<DeptInteroperability />} />
          <Route path="/department-admin/analytics" element={<DeptAnalytics />} />
          <Route path="/department-admin/grievances" element={<DeptGrievances />} />
          <Route path="/department-admin/audit" element={<DeptAudit />} />
          <Route path="/department-admin/settings" element={<DeptSettings />} />
        </Route>

        {/* Super admin */}
        <Route element={<RequireRole roles={['super_admin']}><PortalLayout /></RequireRole>}>
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/departments" element={<AdminDepartments />} />
          <Route path="/admin/services" element={<AdminRegistry />} />
          <Route path="/admin/interoperability" element={<AdminInterop />} />
          <Route path="/admin/orchestration" element={<AdminInterop />} />
          <Route path="/admin/system-health" element={<AdminSystemHealth />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/grievances" element={<AdminGrievances />} />
          <Route path="/admin/security" element={<AdminSecurity />} />
          <Route path="/admin/audit" element={<AdminAudit />} />
          <Route path="/admin/configuration" element={<AdminConfiguration />} />
        </Route>

        {/* Global search */}
        <Route path="/search" element={
          <Suspense fallback={<PageLoader />}><GlobalSearch /></Suspense>
        } />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

/* Lazy citizen service detail referenced above */
const CitizenServiceDetail = lazy(() => import('@/pages/citizen/ServiceDetail'))
