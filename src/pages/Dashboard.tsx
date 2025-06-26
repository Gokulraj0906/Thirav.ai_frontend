// import { useState, useEffect } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { Toaster, toast } from "sonner";
// import CoursesView from "./Course";
// import CertificatePortal from "./Certificate";
// import UserAccess from "@/AdminPanel/UserAccess";
// import CouponManager from "@/AdminPanel/CouponManager";
// import CourseManagement from "@/AdminPanel/CourseManagement";
// import Settingss from "@/AdminPanel/Settings";
// import CourseViewAndEnrollPage from "./CourseViewPage";
// import { Settings } from "lucide-react";
// import { Avatar } from "@radix-ui/react-avatar";
// // API Base URL
// const baseUrl = import.meta.env.VITE_BACKEND_API;

// // Icons
// const DashboardIcon = () => (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
//     </svg>
// );

// const CoursesIcon = () => (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//     </svg>
// );

// const UsersIcon = () => (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
//     </svg>
// );

// const SettingsIcon = () => (
//  <Settings className="w-6 h-6 text-gray-600 hover:text-gray-900" />

// );


// const LogoutIcon = () => (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//     </svg>
// );

// const CouponsIcon = () => (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10M7 11h10M7 15h10" />
//     </svg>
// );

// const CertificatesIcon = () => (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 8a9 9 0 11-18 0 9 9 0 0118 0z" />
//     </svg>
// );



// // Loading Screen Component
// const LoadingScreen = () => (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
//         <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//             <p className="text-slate-600 dark:text-slate-400">Loading...</p>
//         </div>
//     </div>
// );

// // Dashboard Layout Component
// function DashboardLayout({ user, isAdmin, onLogout }: { user: any; isAdmin: boolean; onLogout: () => void }) {
//     const [currentView, setCurrentView] = useState('dashboard');

//     const navigation = [
//         { id: 'dashboard', name: 'Dashboard', icon: DashboardIcon },
//         { id: 'courses', name: 'My Courses', icon: CoursesIcon },
//         { id: 'course-enrollment', name: 'Course Enrollment', icon: CoursesIcon },
//         { id: 'settings', name: 'Settings', icon: SettingsIcon },
//         ...(isAdmin ? [{ id: 'users', name: 'Users', icon: UsersIcon },{ id: 'coupons', name: 'Coupons', icon: CouponsIcon },{ id: 'certificates', name: 'Certificates', icon: CertificatesIcon },{ id: 'course-management', name: 'Course Management', icon: CoursesIcon }] : []),
//     ];

//     return (
//         <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
//             {/* Sidebar */}
//             <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 shadow-lg">
//                 <div className="flex h-full flex-col">
//                     {/* Logo */}
//                     <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-200 dark:border-slate-700">
//                         <h1 className="text-xl font-bold text-slate-900 dark:text-white">
//                             Thirav.AI
//                         </h1>
//                     </div>

//                     {/* Navigation */}
//                     <nav className="flex flex-1 flex-col p-4">
//                         <ul className="flex flex-1 flex-col gap-y-2">
//                             {navigation.map((item) => (
//                                 <li key={item.id}>
//                                     <button
//                                         onClick={() => setCurrentView(item.id)}
//                                         className={`group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
//                                             currentView === item.id
//                                                 ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
//                                                 : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700'
//                                         }`}
//                                     >
//                                         <item.icon />
//                                         <span className="ml-3">{item.name}</span>
//                                     </button>
//                                 </li>
//                             ))}
//                         </ul>

//                         {/* User Profile & Logout */}
//                         <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
//                             <div className="flex items-center px-3 py-2 mb-2">
//                                 <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
//                                     <span className="text-sm font-medium text-white">
//                                     <Avatar className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
//                                         {user?.username?.[0]?.toUpperCase() || 'U'}
//                                     </Avatar>
//                                     </span>
//                                 </div>
//                                 <div className="ml-3">
//                                     <p className="text-sm font-medium text-slate-900 dark:text-white">
//                                         {user?.username || 'User'}
//                                     </p>
//                                     <p className="text-xs text-slate-500 dark:text-slate-400">
//                                         {user?.email}
//                                     </p>
//                                 </div>
//                             </div>
//                             <button
//                                 onClick={onLogout}
//                                 className="group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
//                             >
//                                 <LogoutIcon />
//                                 <span className="ml-3">Logout</span>
//                             </button>
//                         </div>
//                     </nav>
//                 </div>
//             </div>

//             <div className="pl-64">
//                 <main className="p-6">
//                     {currentView === 'dashboard' && <DashboardView user={user} isAdmin={isAdmin} />}
//                     {currentView === 'courses' && <CoursesView />}
//                     {currentView === 'users' && isAdmin && <UserAccess />}
//                     {currentView === 'coupons' && <CouponManager />}
//                     {currentView === 'certificates' && <CertificatePortal />}
//                     {currentView === 'course-management' && <CourseManagement />}
//                     {currentView === 'course-enrollment' && <CourseViewAndEnrollPage />}
//                     {currentView === 'settings' && <Settingss />}
//                 </main>
//             </div>
//         </div>
//     );
// }

// // Dashboard View Component
// const DashboardView = ({ user, isAdmin }: { user: any; isAdmin: boolean }) => {
//     const [stats, setStats] = useState({
//         totalCourses: 0,
//         totalUsers: 0,
//         enrollments: 0,
//         completions: 0
//     });

//     useEffect(() => {
//         const fetchStats = async () => {
//             try {
//                 const token = Cookies.get("auth_token");
//                 const response = await axios.get(`${baseUrl}/auth/check`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 setStats(response.data);
//             } catch (error) {
//                 console.error("Error fetching stats:", error);
//             }
//         };

//         fetchStats();
//     }, []);

//     return (
//         <div>
//             <div className="mb-8">
//                 <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
//                     Welcome back, {user?.username || 'User'}!
//                 </h1>
//                 <p className="text-slate-600 dark:text-slate-400">
//                     Here's what's happening with your learning platform today.
//                 </p>
//             </div>

//             {/* Stats Grid */}
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
//                 <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
//                     <div className="flex items-center">
//                         <div className="flex-shrink-0">
//                             <CoursesIcon />
//                         </div>
//                         <div className="ml-4">
//                             <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
//                                 Total Courses
//                             </p>
//                             <p className="text-2xl font-bold text-slate-900 dark:text-white">
//                                 {stats.totalCourses}
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 {isAdmin && (
//                     <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
//                         <div className="flex items-center">
//                             <div className="flex-shrink-0">
//                                 <UsersIcon />
//                             </div>
//                             <div className="ml-4">
//                                 <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
//                                     Total Users
//                                 </p>
//                                 <p className="text-2xl font-bold text-slate-900 dark:text-white">
//                                     {stats.totalUsers}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
//                     <div className="flex items-center">
//                         <div className="flex-shrink-0">
//                             <DashboardIcon />
//                         </div>
//                         <div className="ml-4">
//                             <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
//                                 Enrollments
//                             </p>
//                             <p className="text-2xl font-bold text-slate-900 dark:text-white">
//                                 {stats.enrollments}
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
//                     <div className="flex items-center">
//                         <div className="flex-shrink-0">
//                             <SettingsIcon />
//                         </div>
//                         <div className="ml-4">
//                             <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
//                                 Completions
//                             </p>
//                             <p className="text-2xl font-bold text-slate-900 dark:text-white">
//                                 {stats.completions}
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Recent Activity */}
//             <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
//                 <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
//                     <h2 className="text-lg font-medium text-slate-900 dark:text-white">
//                         Recent Activity
//                     </h2>
//                 </div>
//                 <div className="p-6">
//                     <p className="text-slate-600 dark:text-slate-400">
//                         No recent activity to display.
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };


// // Main Dashboard Component - Updated with separate role check
// const DashboardApp = () => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [isAdmin, setIsAdmin] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);
//     const [user, setUser] = useState(null);

//     useEffect(() => {
//         const checkAuth = async () => {
//             try {
//                 const token = Cookies.get("auth_token");
//                 if (!token) {
//                     setIsAuthenticated(false);
//                     setIsLoading(false);
//                     return;
//                 }

//                 // Check authentication status
//                 const authResponse = await axios.get(`${baseUrl}/auth/check`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });

//                 if (authResponse.data) {
//                     const userData = authResponse.data.user || authResponse.data;

//                     if (userData && (userData.email || userData.id)) {
//                         setIsAuthenticated(true);
//                         setUser(userData);

//                         // Check admin role using separate /role endpoint
//                         try {
//                             const roleResponse = await axios.get(`${baseUrl}/role`, {
//                                 headers: { Authorization: `Bearer ${token}` }
//                             });

//                             // Assuming the response returns a boolean or an object with role info
//                             const isAdminRole = roleResponse.data === true || roleResponse.data.isAdmin === true;
//                             setIsAdmin(isAdminRole);
//                         } catch (roleError) {
//                             console.error("Role check error:", roleError);
//                             setIsAdmin(false);
//                         }
//                     } else {
//                         throw new Error("Invalid user data");
//                     }
//                 } else {
//                     throw new Error("No response data");
//                 }
//                 setIsLoading(false);
//             } catch (error) {
//                 console.error("Auth check error:", error);
//                 Cookies.remove("auth_token");
//                 setIsAuthenticated(false);
//                 setIsLoading(false);
//                 toast.error("Authentication failed. Please log in again.");
//             }
//         };

//         checkAuth();
//     }, []);

//     const handleLogout = () => {
//         Cookies.remove("auth_token");
//         setIsAuthenticated(false);
//         setUser(null);
//         setIsAdmin(false);
//         toast.success("Logged out successfully");
//         window.location.href = "/";
//     };

//     if (isLoading) {
//         return <LoadingScreen />;
//     }

//     if (!isAuthenticated) {
//         return (
//             <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
//                 <div className="text-center">
//                     <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
//                         Access Denied
//                     </h2>
//                     <p className="text-slate-600 dark:text-slate-400 mb-6">
//                         Please log in to access your dashboard.
//                     </p>
//                     <button
//                         onClick={() => window.location.href = "/auth"}
//                         className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                     >
//                         Go to Login
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <>
//             <DashboardLayout user={user} isAdmin={isAdmin} onLogout={handleLogout} />
//             <Toaster position="top-right" />
//         </>
//     );
// };

// export default DashboardApp;

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Toaster, toast } from "sonner";
import CoursesView from "./Course";
import CertificatePortal from "./Certificate";
import UserAccess from "@/AdminPanel/UserAccess";
import CouponManager from "@/AdminPanel/CouponManager";
import CourseManagement from "@/AdminPanel/CourseManagement";
import Settingss from "@/AdminPanel/Settings";
import CourseViewAndEnrollPage from "./CourseViewPage";
import { Settings, Sun, Moon } from "lucide-react";
import { Avatar } from "@radix-ui/react-avatar";

// API Base URL
const baseUrl = import.meta.env.VITE_BACKEND_API;

// Icons
const DashboardIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
    </svg>
);

const CoursesIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const UsersIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
);

const SettingsIcon = () => (
 <Settings className="w-6 h-6 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors" />
);

const LogoutIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

const CouponsIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10M7 11h10M7 15h10" />
    </svg>
);

const CertificatesIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 8a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// Loading Screen Component
const LoadingScreen = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 transition-colors">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400 transition-colors">Loading...</p>
        </div>
    </div>
);

// Dashboard Layout Component
function DashboardLayout({ user, isAdmin, onLogout }: { user: any; isAdmin: boolean; onLogout: () => void }) {
    const [currentView, setCurrentView] = useState('dashboard');
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check if user prefers dark mode or has previously set it
        return localStorage.getItem('theme') === 'dark' || 
               (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Apply dark mode class to html element
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const navigation = [
        { id: 'dashboard', name: 'Dashboard', icon: DashboardIcon },
        { id: 'courses', name: 'My Courses', icon: CoursesIcon },
        { id: 'course-enrollment', name: 'Course Enrollment', icon: CoursesIcon },
        { id: 'settings', name: 'Settings', icon: SettingsIcon },
        ...(isAdmin ? [
            { id: 'users', name: 'Users', icon: UsersIcon },
            { id: 'coupons', name: 'Coupons', icon: CouponsIcon },
            { id: 'certificates', name: 'Certificates', icon: CertificatesIcon },
            { id: 'course-management', name: 'Course Management', icon: CoursesIcon }
        ] : []),
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
            {/* Mobile menu toggle */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                    className="p-2 bg-white dark:bg-slate-800 rounded-md shadow-md transition-colors"
                >
                    <svg className="w-6 h-6 text-slate-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-800 shadow-lg transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="flex h-full flex-col">
                    {/* Logo and theme toggle */}
                    <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-slate-200 dark:border-slate-700 transition-colors">
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white transition-colors">
                            Thirav.AI
                        </h1>
                        <button 
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? (
                                <Sun className="w-5 h-5 text-yellow-400" />
                            ) : (
                                <Moon className="w-5 h-5 text-slate-700" />
                            )}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-1 flex-col p-4 overflow-y-auto">
                        <ul className="flex flex-1 flex-col gap-y-2">
                            {navigation.map((item) => (
                                <li key={item.id}>
                                    <button
                                        onClick={() => {
                                            setCurrentView(item.id);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                            currentView === item.id
                                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                                : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700'
                                        }`}
                                    >
                                        <item.icon />
                                        <span className="ml-3">{item.name}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {/* User Profile & Logout */}
                        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700 transition-colors">
                            <div className="flex items-center px-3 py-2 mb-2">
                                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                                    <span className="text-sm font-medium text-white">
                                    <Avatar className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                        {user?.username?.[0]?.toUpperCase() || 'U'}
                                    </Avatar>
                                    </span>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white transition-colors">
                                        {user?.username || 'User'}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onLogout}
                                className="group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <LogoutIcon />
                                <span className="ml-3">Logout</span>
                            </button>
                        </div>
                    </nav>
                </div>
            </div>

            {/* Mobile backdrop */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            <div className="pl-0 md:pl-64 transition-all">
                <main className="p-4 md:p-6 max-w-7xl mx-auto">
                    {currentView === 'dashboard' && <DashboardView user={user} isAdmin={isAdmin} />}
                    {currentView === 'courses' && <CoursesView />}
                    {currentView === 'users' && isAdmin && <UserAccess />}
                    {currentView === 'coupons' && <CouponManager />}
                    {currentView === 'certificates' && <CertificatePortal />}
                    {currentView === 'course-management' && <CourseManagement />}
                    {currentView === 'course-enrollment' && <CourseViewAndEnrollPage />}
                    {currentView === 'settings' && <Settingss />}
                </main>
            </div>
        </div>
    );
}

// Dashboard View Component
const DashboardView = ({ user, isAdmin }: { user: any; isAdmin: boolean }) => {
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalUsers: 0,
        enrollments: 0,
        completions: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [activities, setActivities] = useState<{ id: number; type: string; course: string; date: Date }[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            try {
                const token = Cookies.get("auth_token");
                const response = await axios.get(`${baseUrl}/auth/check`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(response.data);
                
                // Simulate fetching activities (you can replace with real API call)
                setTimeout(() => {
                    setActivities([
                        { id: 1, type: 'enrollment', course: 'Introduction to AI', date: new Date(Date.now() - 3600000) },
                        { id: 2, type: 'completion', course: 'Machine Learning Basics', date: new Date(Date.now() - 86400000) },
                        { id: 3, type: 'certificate', course: 'Python for Data Science', date: new Date(Date.now() - 259200000) }
                    ]);
                    setIsLoading(false);
                }, 500);
            } catch (error) {
                console.error("Error fetching stats:", error);
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Format dates for better readability
    const formatDate = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        return date.toLocaleDateString();
    };

    // Get appropriate icon and message for each activity type
    const getActivityDetails = (activity: { id?: number; type: any; course: any; date?: Date; }) => {
        switch(activity.type) {
            case 'enrollment':
                return { 
                    icon: <CoursesIcon />,
                    message: `Enrolled in ${activity.course}`
                };
            case 'completion':
                return { 
                    icon: <DashboardIcon />,
                    message: `Completed ${activity.course}` 
                };
            case 'certificate':
                return { 
                    icon: <CertificatesIcon />,
                    message: `Earned certificate for ${activity.course}` 
                };
            default:
                return { 
                    icon: <CoursesIcon />,
                    message: `Activity on ${activity.course}` 
                };
        }
    };

    return (
        <div className="animate-fadeIn">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">
                    Welcome back, {user?.username || 'User'}!
                </h1>
                <p className="text-slate-600 dark:text-slate-400 transition-colors">
                    Here's what's happening with your learning platform today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {/* Stats Cards */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 hover:shadow-md transition-all">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                            <CoursesIcon />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors">
                                Total Courses
                            </p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">
                                {isLoading ? (
                                    <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                                ) : stats.totalCourses}
                            </p>
                        </div>
                    </div>
                </div>

                {isAdmin && (
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 hover:shadow-md transition-all">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                                <UsersIcon />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors">
                                    Total Users
                                </p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">
                                    {isLoading ? (
                                        <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                                    ) : stats.totalUsers}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 hover:shadow-md transition-all">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 p-2 bg-green-50 dark:bg-green-900/20 rounded-full">
                            <DashboardIcon />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors">
                                Enrollments
                            </p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">
                                {isLoading ? (
                                    <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                                ) : stats.enrollments}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 hover:shadow-md transition-all">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-full">
                            <SettingsIcon />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors">
                                Completions
                            </p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">
                                {isLoading ? (
                                    <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                                ) : stats.completions}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-md transition-all">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 transition-colors">
                    <h2 className="text-lg font-medium text-slate-900 dark:text-white transition-colors">
                        Recent Activity
                    </h2>
                </div>
                <div className="p-6">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center animate-pulse">
                                    <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                                    <div className="ml-4 flex-1">
                                        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                                        <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : activities.length > 0 ? (
                        <ul className="divide-y divide-slate-100 dark:divide-slate-700 transition-colors">
                            {activities.map((activity) => {
                                const { icon, message } = getActivityDetails(activity);
                                return (
                                    <li key={activity.id} className="py-3 first:pt-0 last:pb-0">
                                        <div className="flex items-start">
                                            <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 transition-colors">
                                                {icon}
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white transition-colors">
                                                    {message}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 transition-colors">
                                                    {formatDate(activity.date)}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="text-slate-600 dark:text-slate-400 transition-colors">
                            No recent activity to display.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Main Dashboard Component
const DashboardApp = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = Cookies.get("auth_token");
                if (!token) {
                    setIsAuthenticated(false);
                    setIsLoading(false);
                    return;
                }

                // Check authentication status
                const authResponse = await axios.get(`${baseUrl}/auth/check`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (authResponse.data) {
                    const userData = authResponse.data.user || authResponse.data;

                    if (userData && (userData.email || userData.id)) {
                        setIsAuthenticated(true);
                        setUser(userData);

                        // Check admin role using separate /role endpoint
                        try {
                            const roleResponse = await axios.get(`${baseUrl}/role`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });

                            // Assuming the response returns a boolean or an object with role info
                            const isAdminRole = roleResponse.data === true || roleResponse.data.isAdmin === true;
                            setIsAdmin(isAdminRole);
                        } catch (roleError) {
                            console.error("Role check error:", roleError);
                            setIsAdmin(false);
                        }
                    } else {
                        throw new Error("Invalid user data");
                    }
                } else {
                    throw new Error("No response data");
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Auth check error:", error);
                Cookies.remove("auth_token");
                setIsAuthenticated(false);
                setIsLoading(false);
                toast.error("Authentication failed. Please log in again.");
            }
        };

        checkAuth();
    }, []);

    const handleLogout = () => {
        Cookies.remove("auth_token");
        setIsAuthenticated(false);
        setUser(null);
        setIsAdmin(false);
        toast.success("Logged out successfully");
        window.location.href = "/";
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 transition-colors">
                <div className="text-center bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg max-w-md mx-auto transition-colors">
                    <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 transition-colors">
                        Access Denied
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 transition-colors">
                        Please log in to access your dashboard.
                    </p>
                    <button
                        onClick={() => window.location.href = "/auth"}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-all"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <DashboardLayout user={user} isAdmin={isAdmin} onLogout={handleLogout} />
            <Toaster position="top-right" />
        </>
    );
};

export default DashboardApp;