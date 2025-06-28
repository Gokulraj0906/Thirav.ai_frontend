import { useState, useEffect, useRef } from "react"; // Added useRef
import axios from "axios";
import Cookies from "js-cookie";
import { Toaster, toast } from "sonner";
import { IndianRupee } from "lucide-react";

// Define proper types
interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  totalMinutes: number;
  sections: Section[];
}

interface Section {
  _id: string;
  sectionTitle: string;
  videos: Video[];
}

interface Video {
  _id: string;
  title: string;
  description: string;
  url: string;
  duration: number;
}

interface ProgressState {
  overall: number;
  videos: Record<string, number>; // Maps videoId to its percentage (0-100)
}

// API Base URL
const baseUrl = import.meta.env.VITE_BACKEND_API;

// Additional Icons for Course Views (unchanged)
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

// MyCourses component - renamed from Course to MyCourses as per usage in DashboardLayout
// This component now accepts a 'courseId' prop to view a specific course detail,
// or displays all enrolled courses if no courseId is provided.
const MyCourses = ({ courseId }: { courseId?: string | null }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            setLoading(true);
            try {
                const token = Cookies.get("auth_token");
                if (!token) {
                    setError("Authentication token not found");
                    setLoading(false);
                    return;
                }
                
                const response = await axios.get(`${baseUrl}/api/enrollment/my-courses`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const fetchedCourses = response.data.courses.filter((c: Course | null) => c !== null); // Filter out nulls
                setCourses(fetchedCourses);

                // If a specific courseId is provided, try to select that course
                if (courseId) {
                    const courseToSelect = fetchedCourses.find((c: Course) => c._id === courseId);
                    if (courseToSelect) {
                        setSelectedCourse(courseToSelect);
                    } else {
                        toast.error("The requested course was not found in your enrollments.");
                        setSelectedCourse(null); // Go back to list if not found
                    }
                } else {
                    setSelectedCourse(null); // Show list if no courseId
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching enrolled courses:", error);
                setError("Failed to load enrolled courses. Please try again later.");
                setLoading(false);
            }
        };

        fetchEnrolledCourses();
    }, [courseId]); // Re-fetch when courseId changes

    const viewCourse = (course: Course) => {
        setSelectedCourse(course);
    };

    // Callback to go back from CourseDetailView to the list of courses
    const handleBackToList = () => {
        setSelectedCourse(null);
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
        // Pass enrolled=true since this is MyCourses
        return <CourseDetailView course={selectedCourse} enrolled={true} onBack={handleBackToList} />;
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
                    {courses.map((course) => ( // Already filtered out nulls in useEffect
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
                                        View Course
                                    </button>
                                    
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {course.sections.length} sections
                                    </span>
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
    course: Course;
    enrolled: boolean; // True if the user is enrolled, false otherwise
    onBack: () => void;
}

const CourseDetailView = ({ course, enrolled, onBack }: CourseDetailViewProps) => {
    const videoRef = useRef<HTMLVideoElement>(null); // Ref for the video element
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    const [currentVideo, setCurrentVideo] = useState<Video | null>(null); // Stores the current Video object being played
    const [progress, setProgress] = useState<ProgressState>({
        overall: 0,
        videos: {}
    });

    // Initialize with all sections expanded by default & fetch initial progress if enrolled
    useEffect(() => {
        const initialExpandedState: Record<string, boolean> = {};
        course.sections.forEach((section) => {
            initialExpandedState[section._id] = true;
        });
        setExpandedSections(initialExpandedState);

        // In a real app, you would fetch initial progress from your backend here
        // Example: fetchProgressFromBackend();

    }, [course, enrolled]); 

    // Function to calculate overall progress from individual video progresses
    const calculateOverallProgress = (currentVideoProgress: Record<string, number>): number => {
        let totalVideos = 0;
        let sumOfVideoProgress = 0;

        course.sections.forEach(section => {
            section.videos.forEach(video => {
                totalVideos++;
                sumOfVideoProgress += (currentVideoProgress[video._id] || 0); // Use 0 if video not in map
            });
        });

        if (totalVideos === 0) return 0;
        return (sumOfVideoProgress / totalVideos);
    };


    const toggleSection = (sectionId: string): void => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    // This function now simulates the progress update on the frontend only
    const simulateProgressUpdate = (video: Video, currentTime: number) => {
        const videoDuration = video.duration * 60; // Convert minutes to seconds for accurate calculation
        if (videoDuration === 0) return; // Avoid division by zero

        let newVideoPercentage = (currentTime / videoDuration) * 100;
        newVideoPercentage = Math.min(newVideoPercentage, 100); // Cap at 100%

        // Update the videos progress map
        const updatedVideosProgress = {
            ...progress.videos,
            [video._id]: newVideoPercentage
        };

        // Calculate the new overall progress based on updated individual video progresses
        const newOverallProgress = calculateOverallProgress(updatedVideosProgress);

        // Update the state
        setProgress({
            overall: newOverallProgress,
            videos: updatedVideosProgress
        });

    };

    const playVideo = (video: Video) => {
        if (!enrolled) {
            toast.error("Please enroll in this course to watch videos");
            return;
        }
        
        setCurrentVideo(video); // Set the video object being played

        // Set the active URL first, then try to play
        // The actual play/seek will happen in onLoadedMetadata or via ref.play()
        if (videoRef.current) {
            const lastKnownTime = progress.videos[video._id] && video.duration > 0
                ? (progress.videos[video._id] / 100) * (video.duration * 60)
                : 0; // Convert duration from minutes to seconds
            
            videoRef.current.src = video.url; // Set the source
            videoRef.current.load(); // Load the video
            
            videoRef.current.onloadedmetadata = () => {
                if (videoRef.current) {
                    // Only set current time if it's less than duration to avoid errors
                    if (lastKnownTime < videoRef.current.duration) {
                        videoRef.current.currentTime = lastKnownTime;
                    }
                    videoRef.current.play().catch(error => console.error("Error playing video:", error));
                }
            };
        }
    };

    const handleVideoTimeUpdate = () => {
        if (videoRef.current && currentVideo && !videoRef.current.paused && !videoRef.current.ended) {
            // Update progress only if playing, and not ended/paused
            simulateProgressUpdate(currentVideo, videoRef.current.currentTime);
        }
    };

    const handleVideoPause = () => {
        if (videoRef.current && currentVideo) {
            simulateProgressUpdate(currentVideo, videoRef.current.currentTime);
            toast.info(`Video paused. Progress saved.`);
        }
    };

    const handleVideoEnded = () => {
        if (videoRef.current && currentVideo) {
            simulateProgressUpdate(currentVideo, currentVideo.duration * 60); // Mark as 100%
            toast.success(`Video "${currentVideo.title}" completed!`);
            setCurrentVideo(null); // Clear active video
            if (videoRef.current) {
                videoRef.current.src = ''; // Clear video source
            }
        }
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
                                    {Math.floor(progress.overall)}%
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{ width: `${Math.floor(progress.overall)}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                    
                    {currentVideo && ( // Use currentVideo instead of activeVideoUrl for rendering
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                                Now Playing: {currentVideo.title}
                            </h3>
                            <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden">
                                <video 
                                    ref={videoRef} // Attach ref to video element
                                    className="absolute inset-0 w-full h-full"
                                    controls
                                    onContextMenu={(e) => e.preventDefault()}
                                    controlsList="nodownload noplaybackrate"
                                    disablePictureInPicture
                                    onTimeUpdate={handleVideoTimeUpdate} // Handle time updates
                                    onPause={handleVideoPause} // Handle pause
                                    onEnded={handleVideoEnded} // Handle video end
                                ></video>
                            </div>
                        </div>
                    )}
                    
                    <div>
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                            Course Content
                        </h3>
                        
                        <div className="space-y-4">
                            {course.sections.map((section: Section) => (
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
                                            {section.videos.map((video: Video) => (
                                                <div 
                                                    key={video._id}
                                                    className={`flex justify-between items-center p-3 rounded-lg ${
                                                        enrolled ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50' : ''
                                                    }`}
                                                    onClick={() => playVideo(video)} // Pass the full video object
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
                                                                        {Math.floor(progress.videos[video._id] || 0)}%
                                                                    </span>
                                                                </div>
                                                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                                                                    <div 
                                                                        className="bg-blue-600 h-1.5 rounded-full" 
                                                                        style={{ width: `${Math.floor(progress.videos[video._id] || 0)}%` }}
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