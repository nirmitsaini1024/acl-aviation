import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import LoginPage from './pages/login';
import ForgotPasswordPage from './pages/forget-password';
import AppLayout from './components/layouts/app-layout';
import AdminDashboard from './pages/admin-dashboard/admin-dashboard';
import UsersPage from './pages/admin-dashboard/onboarding/user';
import RolesPage from './pages/admin-dashboard/onboarding/role';
import DocumentsPage from './pages/admin-dashboard/onboarding/document-category';
import AccessControlPage from './pages/admin-dashboard/access-control/access-page';
import EmailIntegrationPage from './pages/admin-dashboard/tools/email';
import Office365IntegrationPage from './pages/admin-dashboard/tools/office365';
import DocuSignIntegrationPage from './pages/admin-dashboard/tools/docusign';
import DocDetails from './pages/dashboard/doc-details';
import DocCenter from './pages/dashboard/doc-center';
import EscalationTable from './pages/dashboard/escalation-center';
import NotificationCenterPage from './pages/admin-dashboard/notification-center';
import PageUrlMapping from './pages/admin-dashboard/configure-page';
import NavDoc3 from './pages/dashboard/nav-doc-3';
import Orchestration from './pages/admin-dashboard/approval-center/orchestration';
import { Toaster } from './components/ui/sonner';
import UserRolesPage from './pages/admin-dashboard/access-control/assign-user';
import DocumentRoleAssignmentPage from './pages/admin-dashboard/access-control/assign-docs';
import GroupsPage from './pages/admin-dashboard/onboarding/group';
import DepartmentsPage from './pages/admin-dashboard/onboarding/department';
import { useState } from 'react';
import DocReviewManagementCenter from './pages/dashboard/doc-review-management-center';
import ReviewRelated from './pages/dashboard/review-related-content';
import StepperApp from './pages/dashboard/StepperApp';
import PDFVisualDiffViewer from './components/doc-reviewer-2/main';
import CustomPDFTextDiffViewer from './components/doc-reviewer-2/custom-pdf-diff';
import RefDocPage from './pages/dashboard/refDoc';
import CrmDashboard from './components/landing-page/crm-dashboard';
import PersonalPage from './pages/dashboard/personal-page';
import MyActivitiesLog from './pages/dashboard/my-activities';

function App() {
  const [user, setUser] = useState({
    name: 'John Doe',
    profilePic: '/profile.avif',
    sig: '/sig-2.png'
  });
  console.log(user);

  const [isBotOpen, setIsBotOpen] = useState(false);
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages (without sidebar) */}
        <Route path="/" element={<LoginPage setUser={setUser}/>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/refdoc" element={<RefDocPage />} />
        
        {/* Protected routes with sidebar */}
        <Route element={<AppLayout user={user} isBotOpen={isBotOpen} setIsBotOpen={setIsBotOpen}/>}>
          <Route path="/doc-center" element={<DocCenter setIsBotOpen={setIsBotOpen}/>} />
          <Route path="/doc-diff-center" element={<CustomPDFTextDiffViewer />} />
          <Route path="/escalation-center" element={<EscalationTable />} />
          <Route path="/landing-page" element={<CrmDashboard />} />
          <Route path="/navigate-document" element={<NavDoc3/>} />
          <Route path="/doc-review-management-center" element={<StepperApp setIsBotOpen={setIsBotOpen}/>} />
          <Route path="/review-related" element={<ReviewRelated/>} />
          <Route path="/personal-page" element={<PersonalPage setUser={setUser} user={user}/>} />
          <Route path="my-activities" element={<MyActivitiesLog />} />
          <Route path="/admin-dashboard/notification-center" element={<NotificationCenterPage />} />
          <Route path="/admin-dashboard/approval-center/orchestration" element={<Orchestration />} />
          <Route path="/doc-center/doc-details/:docId" element={<DocDetails />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-dashboard/users" element={<UsersPage />} />
          <Route path="/admin-dashboard/roles" element={<RolesPage />} /> 
          <Route path="/admin-dashboard/documents" element={<DocumentsPage />} />
          <Route path="/admin-dashboard/groups" element={<GroupsPage />} />
          <Route path="/admin-dashboard/departments" element={<DepartmentsPage />} />
          <Route path="/admin-dashboard/access-page" element={<AccessControlPage />} />
          <Route path="/admin-dashboard/assign-user" element={<UserRolesPage />} />
          <Route path="/admin-dashboard/assign-docs" element={<DocumentRoleAssignmentPage />} />
          <Route path="/admin-dashboard/tools/email" element={<EmailIntegrationPage />} />
          
          <Route path="/admin-dashboard/tools/docusign" element={<DocuSignIntegrationPage />} />
          <Route path="/admin-dashboard/tools/office365" element={<Office365IntegrationPage />} />
          <Route path="/admin-dashboard/configure-page" element={<PageUrlMapping />} />
          <Route path="/ad" element={<PDFVisualDiffViewer />} />
        </Route>
      </Routes>
      <Toaster/>
    </BrowserRouter>
  );
}

export default App;