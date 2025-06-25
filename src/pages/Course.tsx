import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Toaster, toast } from "sonner";
import { IndianRupee } from "lucide-react";

// API Base URL
const baseUrl = import.meta.env.VITE_BACKEND_API;

// Additional Icons for Course Views
const PlayIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const TimeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const ChevronUpIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
);

const MyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            try {
                const token = Cookies.get("auth_token");
                const response = await axios.get(`${baseUrl}/api/enrollment/my-courses`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCourses(response.data.courses || []);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching enrolled courses:", error);
                setError("Failed to load enrolled courses. Please try again later.");
                setLoading(false);
            }
        };

        fetchEnrolledCourses();
    }, []);

    const viewCourse = (course: any) => {
        setSelectedCourse(course);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-700 dark:text-red-400">
                <p>{error}</p>
            </div>
        );
    }

    if (selectedCourse) {
        return <CourseDetailView course={selectedCourse} enrolled={true} onBack={() => setSelectedCourse(null)} onEnroll={() => {}} />;
    }

    return (
        <div>
            <Toaster position="top-right" richColors />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                My Courses
            </h1>
            
            {courses.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                    <p className="text-slate-600 dark:text-slate-400">You are not enrolled in any courses yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div 
                            key={course._id} 
                            className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                    {course.title}
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                                    {course.description}
                                </p>
                                
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center text-slate-500 dark:text-slate-400">
                                        <TimeIcon />
                                        <span className="ml-1 text-sm">{course.totalMinutes} mins</span>
                                    </div>
                                    
                                    <div className="flex items-center text-slate-500 dark:text-slate-400">
                                        <IndianRupee />
                                        <span className="ml-1 text-sm">{course.price}</span>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between mt-4">

                                    <button
                                        onClick={() => viewCourse(course)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        View Details
                                    </button>
                                    
                                    <button
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg cursor-default"
                                    >
                                        Enrolled
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Course Detail View Component
interface CourseDetailViewProps {
    course: any;
    enrolled: boolean;
    onBack: () => void;
    onEnroll: () => void;
}

const CourseDetailView = ({ course, enrolled, onBack, onEnroll }: CourseDetailViewProps) => {
    const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
    const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
    const [progress, setProgress] = useState({
        overall: 0,
        videos: {}
    });

    useEffect(() => {
        // Initialize with all sections expanded
        const initialExpandedState: {[key: string]: boolean} = {};
        course.sections.forEach((section: any) => {
            initialExpandedState[section._id] = true;
        });
        setExpandedSections(initialExpandedState);

        if (enrolled) {
            fetchProgress();
        }
    }, [course, enrolled]);

    const fetchProgress = async () => {
        try {
            const token = Cookies.get("auth_token");
            const response = await axios.get(`${baseUrl}/api/progress/get?courseId=${course._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data) {
                setProgress({
                    overall: response.data.progress || 0,
                    videos: response.data.videoProgress || {}
                });
            }
        } catch (error) {
            console.error("Error fetching progress:", error);
        }
    };

    const toggleSection = (sectionId: string): void => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const playVideo = (videoUrl: string, videoId: string) => {
        if (!enrolled) {
            toast.error("Please enroll in this course to watch videos");
            return;
        }
        
        setActiveVideoUrl(videoUrl);
        
        // Update progress when a video is watched
        const updateProgress = async () => {
            try {
                const token = Cookies.get("auth_token");
                const userId = JSON.parse(atob(token.split('.')[1])).id;
                
                await axios.post(
                    `${baseUrl}/api/progress/update`,
                    {
                        userId,
                        courseId: course._id,
                        videoId,
                        watchedMinutes: 1, // Just a small increment for demo
                        progress: Math.min((progress.videos[videoId] || 0) + 10, 100) // Increment by 10% for demo
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                // Refresh progress
                fetchProgress();
                
            } catch (error) {
                console.error("Error updating progress:", error);
            }
        };
        
        updateProgress();
    };

    return (
        <div>
            <button
                onClick={onBack}
                className="mb-6 flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Courses
            </button>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden mb-6">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {course.title}
                    </h1>
                    
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        {course.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center text-slate-500 dark:text-slate-400">
                            <TimeIcon />
                            <span className="ml-1">{course.totalMinutes} mins total</span>
                        </div>
                        
                        <div className="flex items-center text-slate-500 dark:text-slate-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span className="ml-1">{course.sections.length} sections</span>
                        </div>
                        
                        <div className="flex items-center text-slate-500 dark:text-slate-400">
                            <IndianRupee />
                            <span className="ml-1">{course.price}</span>
                        </div>
                    </div>
                    
                    {enrolled && (
                        <div className="mb-6">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Course Progress
                                </span>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {progress.overall}%
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{ width: `${progress.overall}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                    
                    {activeVideoUrl && (
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                                Now Playing
                            </h3>
                            <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden">
                                <video 
                                    className="absolute inset-0 w-full h-full"
                                    controls
                                    src={activeVideoUrl}
                                    onContextMenu={(e) => e.preventDefault()}
                                    controlsList="nodownload noplaybackrate"
                                    disablePictureInPicture
                                ></video>
                            </div>
                        </div>
                    )}
                    
                    <div>
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                            Course Content
                        </h3>
                        
                        <div className="space-y-4">
                            {course.sections.map((section) => (
                                <div key={section._id} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => toggleSection(section._id)}
                                        className="flex justify-between items-center w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 text-left"
                                    >
                                        <span className="font-medium text-slate-900 dark:text-white">
                                            {section.sectionTitle}
                                        </span>
                                        {expandedSections[section._id] ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                    </button>
                                    
                                    {expandedSections[section._id] && (
                                        <div className="p-4 space-y-2">
                                            {section.videos.map((video) => (
                                                <div 
                                                    key={video._id}
                                                    className={`flex justify-between items-center p-3 rounded-lg ${
                                                        enrolled ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50' : ''
                                                    }`}
                                                    onClick={() => enrolled && playVideo(video.url, video._id)}
                                                >
                                                    <div className="flex items-center">
                                                        <PlayIcon />
                                                        <div className="ml-3">
                                                            <h4 className="font-medium text-slate-900 dark:text-white">
                                                                {video.title}
                                                            </h4>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                                {video.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center space-x-3">
                                                        {enrolled && (
                                                            <div className="w-16">
                                                                <div className="flex justify-between mb-1">
                                                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                                        {progress.videos[video._id] || 0}%
                                                                    </span>
                                                                </div>
                                                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                                                                    <div 
                                                                        className="bg-blue-600 h-1.5 rounded-full" 
                                                                        style={{ width: `${progress.videos[video._id] || 0}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        <div className="flex items-center text-slate-500 dark:text-slate-400">
                                                            <TimeIcon />
                                                            <span className="ml-1 text-sm">{video.duration} mins</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyCourses;