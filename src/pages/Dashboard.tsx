import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Toaster, toast } from "sonner";
import CoursesView from "./Course";
import CertificatePortal from "./Certificate";
import UserAccess from "@/AdminPanel/UserAccess";
import CouponManager from "@/AdminPanel/CouponManager";
import Settingss from "@/AdminPanel/Settings";
import { Settings } from "lucide-react";
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
 <Settings className="w-6 h-6 text-gray-600 hover:text-gray-900" />

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
    </div>
);

// Dashboard Layout Component
function DashboardLayout({ user, isAdmin, onLogout }: { user: any; isAdmin: boolean; onLogout: () => void }) {
    const [currentView, setCurrentView] = useState('dashboard');

    const navigation = [
        { id: 'dashboard', name: 'Dashboard', icon: DashboardIcon },
        { id: 'courses', name: 'My Courses', icon: CoursesIcon },
        ...(isAdmin ? [{ id: 'users', name: 'Users', icon: UsersIcon },{ id: 'coupons', name: 'Coupons', icon: CouponsIcon },{ id: 'certificates', name: 'Certificates', icon: CertificatesIcon }] : []),
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 shadow-lg">
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-200 dark:border-slate-700">
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                            Thirav.AI
                        </h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-1 flex-col p-4">
                        <ul className="flex flex-1 flex-col gap-y-2">
                            {navigation.map((item) => (
                                <li key={item.id}>
                                    <button
                                        onClick={() => setCurrentView(item.id)}
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
                        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex items-center px-3 py-2 mb-2">
                                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                                    <span className="text-sm font-medium text-white">
                                    <Avatar className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                        {user?.username?.[0]?.toUpperCase() || 'U'}
                                    </Avatar>
                                    </span>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        {user?.username || 'User'}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
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

            <div className="pl-64">
                <main className="p-6">
                    {currentView === 'dashboard' && <DashboardView user={user} isAdmin={isAdmin} />}
                    {currentView === 'courses' && <CoursesView />}
                    {currentView === 'users' && isAdmin && <UserAccess />}
                    {currentView === 'coupons' && <CouponManager />}
                    {currentView === 'certificates' && <CertificatePortal />}
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

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = Cookies.get("auth_token");
                const response = await axios.get(`${baseUrl}/auth/check`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Welcome back, {user?.username || 'User'}!
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Here's what's happening with your learning platform today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <CoursesIcon />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Total Courses
                            </p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {stats.totalCourses}
                            </p>
                        </div>
                    </div>
                </div>

                {isAdmin && (
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <UsersIcon />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Total Users
                                </p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {stats.totalUsers}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <DashboardIcon />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Enrollments
                            </p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {stats.enrollments}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <SettingsIcon />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Completions
                            </p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {stats.completions}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                        Recent Activity
                    </h2>
                </div>
                <div className="p-6">
                    <p className="text-slate-600 dark:text-slate-400">
                        No recent activity to display.
                    </p>
                </div>
            </div>
        </div>
    );
};


// Main Dashboard Component - Updated with separate role check
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
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                        Access Denied
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Please log in to access your dashboard.
                    </p>
                    <button
                        onClick={() => window.location.href = "/auth"}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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