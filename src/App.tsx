import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Home from "./pages/Home";
import AuthPage from "./pages/Auth";
import DashboardApp from './pages/Dashboard';
import CouponManager from './AdminPanel/CouponManager';
import UserAccess from './AdminPanel/UserAccess';
import CertificatePortal from './pages/Certificate';
import CourseEnrollmentPage from './pages/CourseViewPage';
import CourseManagement from './AdminPanel/CourseManagement';
import ErrorPage from './pages/Error';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardApp />} />
        <Route path="/coupons" element={<CouponManager />} />
        <Route path="/user-access" element={<UserAccess />} />
        <Route path="/course-enrollment" element={<CourseEnrollmentPage />} />
        <Route path="/courses" element={<CourseEnrollmentPage />} />
        <Route path="/certificate-portal" element={<CertificatePortal />} />
        <Route path="/course-management" element={<CourseManagement />} />
        <Route path="/course/:courseId" element={<CourseEnrollmentPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;