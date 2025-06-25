import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Home from "./pages/Home";
import AuthPage from "./pages/Auth";
import DashboardApp from './pages/Dashboard';
import CourseProgress from './pages/CourseProgress';
import CouponManager from './AdminPanel/CouponManager';
import UserAccess from './AdminPanel/UserAccess';
import CertificatePortal from './pages/Certificate';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardApp />} />
        <Route path="/course-progress" element={<CourseProgress />} />
        <Route path="/coupons" element={<CouponManager />} />
        <Route path="/user-access" element={<UserAccess />} />
        <Route path="/certificate-portal" element={<CertificatePortal />} />
        {/* Add more routes as needed */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;