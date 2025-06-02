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
import { useState, useEffect } from 'react';
import DocReviewManagementCenter from './pages/dashboard/doc-review-management-center';
import ReviewRelated from './pages/dashboard/review-related-content';
import StepperApp from './pages/dashboard/StepperApp';
import PDFVisualDiffViewer from './components/doc-reviewer-2/main';
import CustomPDFTextDiffViewer from './components/doc-reviewer-2/custom-pdf-diff';
import RefDocPage from './pages/dashboard/refDoc';
import CrmDashboard from './components/landing-page/crm-dashboard';
import PersonalPage from './pages/dashboard/personal-page';
import MyActivitiesLog from './pages/dashboard/my-activities';

// Import CASL components
import { AbilityProvider } from './components/review-administration/sections/Can';
import { defineAbilitiesFor } from './components/review-administration/sections/ability';

function App() {
  const [user, setUser] = useState(() => {
    // Try to get user from localStorage on initial load
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : {
      name: 'John Doe',
      profilePic: '/profile.avif',
      sig: '/sig-2.png',
      role: 'user' // Add default role
    };
  });

  const [ability, setAbility] = useState(null);
  const [isBotOpen, setIsBotOpen] = useState(false);

  // Initialize ability when component mounts or user changes
  useEffect(() => {
    const userAbility = defineAbilitiesFor(user);
    setAbility(userAbility);
  }, [user]);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  // Function to switch user role
  const switchUserRole = (newRole) => {
    const updatedUser = { ...user, role: newRole };
    setUser(updatedUser);
  };

  // Function to update user (for login and other user updates)
  const updateUser = (userData) => {
    const updatedUser = { 
      ...userData, 
      role: userData.role || 'user' // Ensure role is always set
    };
    setUser(updatedUser);
  };

  if (!ability) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading permissions...</div>
      </div>
    );
  }

  return (
    <AbilityProvider ability={ability}>
      <BrowserRouter>
        {/* Role Switcher - Only show on protected routes */}
        <RoleSwitcher 
          currentRole={user.role} 
          onRoleSwitch={switchUserRole} 
        />
        
        <Routes>
          {/* Auth pages (without sidebar) */}
          <Route path="/" element={<LoginPage setUser={updateUser}/>} />
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
            <Route path="/personal-page" element={<PersonalPage setUser={updateUser} user={user}/>} />
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
    </AbilityProvider>
  );
}

// Role Switcher Component
const RoleSwitcher = ({ currentRole, onRoleSwitch }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Only show on protected routes (not on login/auth pages)
  const shouldShow = !window.location.pathname.includes('/') || 
                    window.location.pathname.length > 1;

  if (!shouldShow) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Switch User Role"
      >
        👤
      </button>

      {/* Role switcher panel */}
      {isVisible && (
        <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-[200px]">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Current Role: <span className="text-blue-600 font-semibold">{currentRole}</span>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => {
                onRoleSwitch('admin');
                setIsVisible(false);
              }}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                currentRole === 'admin' 
                  ? 'bg-red-100 text-red-700 font-medium' 
                  : 'hover:bg-red-50 text-red-600'
              }`}
            >
              🔴 Admin User
            </button>

            <button
              onClick={() => {
                onRoleSwitch('manager');
                setIsVisible(false);
              }}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                currentRole === 'manager' 
                  ? 'bg-orange-100 text-orange-700 font-medium' 
                  : 'hover:bg-orange-50 text-orange-600'
              }`}
            >
              🟠 Manager User
            </button>
            
            <button
              onClick={() => {
                onRoleSwitch('user');
                setIsVisible(false);
              }}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                currentRole === 'user' 
                  ? 'bg-green-100 text-green-700 font-medium' 
                  : 'hover:bg-green-50 text-green-600'
              }`}
            >
              🟢 Security User
            </button>
          </div>
          
          <div className="mt-3 pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              Click to switch between roles for testing permissions
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;