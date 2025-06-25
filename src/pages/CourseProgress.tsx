import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Toaster, toast } from "sonner";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Play, Clock, ChevronDown, ChevronUp, Check, RefreshCw } from "lucide-react";

// API Base URL
const baseUrl = import.meta.env.VITE_BACKEND_API;

// --- Interfaces ---
interface ProgressData {
  overall: number;
  videos: Record<string, number>;
  totalMinutes: number;
  completedMinutes: number;
}

interface Video {
  _id: string;
  title: string;
  duration: number;
  url: string;
  description: string;
}

interface Section {
  _id: string;
  sectionTitle: string;
  videos: Video[];
}

interface Course {
  _id: string;
  title: string;
  description: string;
  sections: Section[];
  totalMinutes: number;
}

// --- Component ---
const CourseProgress = () => {
  const { courseId: paramCourseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // --- State Variables ---
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<ProgressData>({
    overall: 0,
    videos: {},
    totalMinutes: 0,
    completedMinutes: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // --- Effects ---

  // Effect 1: Fetch all enrolled courses to determine which one to display
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = Cookies.get("auth_token");
        if (!token) {
          throw new Error("Authentication required. Please log in.");
        }

        const response = await axios.get(`${baseUrl}/api/enrollment/my-courses`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const courses = response.data.courses || [];
        setEnrolledCourses(courses);

        if (paramCourseId) {
          if (courses.some((c: Course) => c._id === paramCourseId)) {
            setSelectedCourseId(paramCourseId);
          } else {
            setError("You are not enrolled in this course or it does not exist.");
            setLoading(false);
          }
        } else if (location.state?.courseId) {
            if (courses.some((c: Course) => c._id === location.state.courseId)) {
                setSelectedCourseId(location.state.courseId);
            } else {
                setError("You are not enrolled in this course or it does not exist.");
                setLoading(false);
            }
        } else if (courses.length === 1) {
          setSelectedCourseId(courses[0]._id);
        } else if (courses.length > 1) {
          setLoading(false); // Let user select a course
        } else {
          setError("You are not enrolled in any courses yet.");
          setLoading(false);
        }
      } catch (error: any) {
        console.error("Error fetching enrolled courses:", error);
        setError(error.response?.data?.message || "Failed to load enrolled courses.");
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [paramCourseId, location.state, navigate]);

  // Effect 2: Fetch specific course details and progress once a course is selected
  useEffect(() => {
    if (!selectedCourseId) return;

    const fetchCourseAndProgress = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("auth_token");
        if (!token) throw new Error("Authentication required.");

        const selectedCourseData = enrolledCourses.find(c => c._id === selectedCourseId);
        setCourse(selectedCourseData || null);

        if (selectedCourseData) {
          const initialExpandedState: Record<string, boolean> = {};
          selectedCourseData.sections?.forEach((section) => {
            if (section && section._id) {
              initialExpandedState[section._id] = true;
            }
          });
          setExpandedSections(initialExpandedState);
        }

        try {
          const progressResponse = await axios.get(`${baseUrl}/api/progress/get?courseId=${selectedCourseId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          setProgress({
            overall: progressResponse.data.progress || 0,
            videos: progressResponse.data.videoProgress || {},
            totalMinutes: progressResponse.data.totalMinutes || selectedCourseData?.totalMinutes || 0,
            completedMinutes: progressResponse.data.completedMinutes || 0
          });
        } catch (progressError) {
          console.log("No existing progress found, starting fresh.");
          setProgress({
            overall: 0,
            videos: {},
            totalMinutes: selectedCourseData?.totalMinutes || 0,
            completedMinutes: 0
          });
        }
      } catch (error: any) {
        console.error("Error fetching course data:", error);
        setError(error.response?.data?.message || "Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndProgress();
  }, [selectedCourseId, enrolledCourses]);

  // --- Handlers ---
  const selectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    navigate(`/progress/${courseId}`);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const playVideo = async (video: Video) => {
    setActiveVideo(video);
    setIsPlaying(true);

    try {
      const token = Cookies.get("auth_token");
      if (!token) throw new Error("Authentication token is missing");

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.id || decodedToken.userId || decodedToken._id;
      if (!userId) throw new Error("User ID could not be extracted from token");

      const response = await axios.post(
        `${baseUrl}/api/progress/update`,
        { userId, courseId: selectedCourseId, videoId: video._id, watchedMinutes: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProgress(prev => ({
          ...prev,
          overall: response.data.overallProgress,
          videos: response.data.videoProgress,
          completedMinutes: response.data.totalCompletedMinutes
      }));
      toast.success("Progress updated");
    } catch (error: any) {
      console.error("Error updating progress:", error);
      toast.error(error.response?.data?.message || "Failed to update progress");
    }
  };

  const resetVideoProgress = async (videoId: string) => {
    try {
      const token = Cookies.get("auth_token");
      if (!token) throw new Error("Authentication token is missing");
      
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.id || decodedToken.userId || decodedToken._id;

      await axios.post(
        `${baseUrl}/api/progress/reset-video`,
        { userId, courseId: selectedCourseId, videoId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const progressResponse = await axios.get(`${baseUrl}/api/progress/get?courseId=${selectedCourseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProgress({
        overall: progressResponse.data.progress || 0,
        videos: progressResponse.data.videoProgress || {},
        totalMinutes: progressResponse.data.totalMinutes || course?.totalMinutes || 0,
        completedMinutes: progressResponse.data.completedMinutes || 0
      });
      toast.success("Video progress reset successfully");
    } catch (error: any) {
      console.error("Error resetting video progress:", error);
      toast.error(error.response?.data?.message || "Failed to reset video progress");
    }
  };

  const getVideoProgress = (videoId?: string): number => {
    if (!videoId || !progress || !progress.videos) return 0;
    return progress.videos[videoId] || 0;
  };

  const getTotalVideosCount = (): number => {
    if (!course || !course.sections) return 0;
    return course.sections.reduce((acc, section) => {
      if (!section || !section.videos) return acc;
      return acc + section.videos.length;
    }, 0);
  };

  const getCompletedVideosCount = (): number => {
    if (!progress || !progress.videos) return 0;
    return Object.values(progress.videos).filter(p => p === 100).length;
  };

  // --- Render Logic ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg text-red-700 dark:text-red-400">
          <p className="font-semibold">{error}</p>
          <button 
            onClick={() => navigate('/my-courses')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to My Courses
          </button>
        </div>
      </div>
    );
  }

  // Course Selection UI
  if (!selectedCourseId && enrolledCourses.length > 1) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Toaster position="top-right" richColors />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Select a Course to View Progress</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((enrolledCourse) => (
            <div 
              key={enrolledCourse._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => selectCourse(enrolledCourse._id)}
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{enrolledCourse.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{enrolledCourse.description}</p>
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm">{enrolledCourse.totalMinutes} minutes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg text-yellow-700 dark:text-yellow-400">
          <p>Course data could not be loaded.</p>
          <button 
            onClick={() => navigate('/my-courses')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to My Courses
          </button>
        </div>
      </div>
    );
  }

  // Main Progress View
  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" richColors />
      
      <div className="mb-8">
        <button
          onClick={() => navigate('/my-courses')}
          className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-4"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Courses
        </button>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{course.description}</p>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Course Progress</h2>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {progress.completedMinutes} / {progress.totalMinutes || course.totalMinutes} minutes
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div 
              className="bg-blue-600 h-4 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
              style={{ width: `${progress.overall}%` }}
            >
              {progress.overall > 5 && (
                <span className="text-xs font-medium text-white">{progress.overall}%</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {activeVideo && isPlaying && (
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="relative pt-[56.25%] bg-black">
                <video 
                  className="absolute inset-0 w-full h-full"
                  controls autoPlay src={activeVideo.url}
                  onEnded={() => setIsPlaying(false)}
                  onContextMenu={(e) => e.preventDefault()}
                  controlsList="nodownload noplaybackrate"
                  disablePictureInPicture
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{activeVideo.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{activeVideo.description}</p>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Course Content</h2>
              <div className="space-y-4">
                {course.sections && course.sections.map((section) => {
                  if (!section) return null;
                  return (
                    <div key={section._id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection(section._id)}
                        className="flex justify-between items-center w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <span className="font-medium text-gray-900 dark:text-white">{section.sectionTitle}</span>
                        {expandedSections[section._id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                      
                      {expandedSections[section._id] && section.videos && (
                        <div className="p-4 space-y-2">
                          {section.videos.map((video) => {
                            if (!video) return null;
                            return (
                              <div 
                                key={video._id}
                                className="flex justify-between items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                              >
                                <div className="flex items-center flex-1" onClick={() => playVideo(video)}>
                                  {getVideoProgress(video._id) === 100 ? (
                                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                  ) : (
                                    <Play className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
                                  )}
                                  <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">{video.title}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{video.description}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-4 ml-4">
                                  <div className="w-24">
                                    <div className="text-xs text-right font-medium text-gray-500 dark:text-gray-400 mb-1">
                                      {getVideoProgress(video._id)}%
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                                      <div 
                                        className="bg-blue-600 h-1.5 rounded-full" 
                                        style={{ width: `${getVideoProgress(video._id)}%` }}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                                    <Clock className="w-4 h-4 mr-1" />
                                    <span>{video.duration} min</span>
                                  </div>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); resetVideoProgress(video._id); }}
                                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" title="Reset progress"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Progress Summary</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Completion</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{progress.overall}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress.overall}%` }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Spent</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {progress.completedMinutes} / {progress.totalMinutes || course.totalMinutes || 1} min
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(progress.completedMinutes / (progress.totalMinutes || course.totalMinutes || 1)) * 100}%` }} 
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Videos Completed</h4>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white mr-2">
                    {getCompletedVideosCount()}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    / {getTotalVideosCount()} videos
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Details</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Clock className="w-5 h-5 mr-3 text-gray-500" />
                <span>Total Duration: {course.totalMinutes || 0} minutes</span>
              </div>
              
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Sections: {course.sections?.length || 0}</span>
              </div>
              
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Play className="w-5 h-5 mr-3 text-gray-500" />
                <span>Videos: {getTotalVideosCount()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;