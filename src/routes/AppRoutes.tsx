import { Routes, Route } from 'react-router-dom';
import { Layout } from '../components/common/Layout';
import { HomePage } from '../pages/Home/HomePage';
import { SearchPage } from '../pages/Search/SearchPage';
import { ServicesPage } from '../pages/Services/ServicesPage';
import { ServiceDetailsPage } from '../pages/ServiceDetails/ServiceDetailsPage';
import { EligibilityPage } from '../pages/Eligibility/EligibilityPage';
import { ApplicationPage } from '../pages/Application/ApplicationPage';
import { ApplicationsPage } from '../pages/Applications/ApplicationsPage';
import { ApplicationDetailPage } from '../pages/Applications/ApplicationDetailPage';
import { DocumentsPage } from '../pages/Documents/DocumentsPage';
import { ProfilePage } from '../pages/Profile/ProfilePage';
import { HelpPage, AboutPage } from '../pages/Help/HelpPage';
import { UpdatesPage } from '../pages/Updates/UpdatesPage';
import { NotFoundPage } from '../pages/NotFound/NotFoundPage';
<<<<<<< HEAD
=======
import { LandingPage } from '../pages/Landing/LandingPage';
import { LoginPage } from '../pages/Auth/LoginPage';
import { PublicLayout } from '../components/landing/PublicLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleGuard } from './RoleGuard';
import { ROLES } from '../types';
import { DepartmentDashboard, AdminDashboard } from '../pages/Rbac/RoleDashboards';
import { ForgotPasswordPage, ResetPasswordPage, VerifyOtpPage } from '../pages/Auth/RecoveryPages';
import { PersonaSelectionPage } from '../pages/Auth/PersonaSelectionPage';
>>>>>>> 824b4f9 (Landing + RBAC)

export function AppRoutes() {
  return (
    <Routes>
<<<<<<< HEAD
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
=======
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/role-selection" element={<PersonaSelectionPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/help" element={<HelpPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
      <Route element={<Layout />}>
        <Route element={<RoleGuard allowedRoles={[ROLES.USER]} />}>
        <Route path="/dashboard" element={<HomePage />} />
>>>>>>> 824b4f9 (Landing + RBAC)
        <Route path="/search" element={<SearchPage />} />
        <Route path="/education" element={<ServicesPage />} />
        <Route path="/employability" element={<ServicesPage />} />
        <Route path="/browse/:departmentId" element={<ServicesPage />} />
        <Route path="/services/:serviceId" element={<ServiceDetailsPage />} />
        <Route path="/services/:serviceId/eligibility" element={<EligibilityPage />} />
        <Route path="/services/:serviceId/apply" element={<ApplicationPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/applications/:applicationId" element={<ApplicationDetailPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/updates" element={<UpdatesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
<<<<<<< HEAD
        <Route path="/help" element={<HelpPage />} />
        <Route path="/about" element={<AboutPage />} />
=======
        </Route>
        <Route element={<RoleGuard allowedRoles={[ROLES.DEPARTMENT_OFFICER]} />}>
          <Route path="/department" element={<DepartmentDashboard />} />
        </Route>
        <Route element={<RoleGuard allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>
      </Route>
      <Route element={<PublicLayout />}>
>>>>>>> 824b4f9 (Landing + RBAC)
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
