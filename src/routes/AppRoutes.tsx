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

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
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
        <Route path="/help" element={<HelpPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
