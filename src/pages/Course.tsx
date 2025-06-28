// // import { useState, useEffect } from "react";
// // import axios from "axios";
// // import Cookies from "js-cookie";
// // import { Toaster, toast } from "sonner";
// // import { IndianRupee } from "lucide-react";

// // // Define proper types
// // interface Course {
// //   _id: string;
// //   title: string;
// //   description: string;
// //   price: number;
// //   totalMinutes: number;
// //   sections: Section[];
// // }

// // interface Section {
// //   _id: string;
// //   sectionTitle: string;
// //   videos: Video[];
// // }

// // interface Video {
// //   _id: string;
// //   title: string;
// //   description: string;
// //   url: string;
// //   duration: number;
// // }

// // interface ProgressState {
// //   overall: number;
// //   videos: Record<string, number>;
// // }

// // // API Base URL
// // const baseUrl = import.meta.env.VITE_BACKEND_API;

// // // Additional Icons for Course Views
// // const PlayIcon = () => (
// //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
// //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
// //     </svg>
// // );

// // const TimeIcon = () => (
// //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
// //     </svg>
// // );

// // const ChevronDownIcon = () => (
// //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
// //     </svg>
// // );

// // const ChevronUpIcon = () => (
// //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
// //     </svg>
// // );

// // const MyCourses = () => {
// //     const [courses, setCourses] = useState<Course[]>([]);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState<string | null>(null);
// //     const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

// //     useEffect(() => {
// //         const fetchEnrolledCourses = async () => {
// //             try {
// //                 const token = Cookies.get("auth_token");
// //                 if (!token) {
// //                     setError("Authentication token not found");
// //                     setLoading(false);
// //                     return;
// //                 }
                
// //                 const response = await axios.get(`${baseUrl}/api/enrollment/my-courses`, {
// //                     headers: { Authorization: `Bearer ${token}` }
// //                 });
// //                 setCourses(response.data.courses || []);
// //                 setLoading(false);
// //             } catch (error) {
// //                 console.error("Error fetching enrolled courses:", error);
// //                 setError("Failed to load enrolled courses. Please try again later.");
// //                 setLoading(false);
// //             }
// //         };

// //         fetchEnrolledCourses();
// //     }, []);

// //     const viewCourse = (course: Course) => {
// //         setSelectedCourse(course);
// //     };

// //     if (loading) {
// //         return (
// //             <div className="flex justify-center items-center h-64">
// //                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
// //             </div>
// //         );
// //     }

// //     if (error) {
// //         return (
// //             <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-700 dark:text-red-400">
// //                 <p>{error}</p>
// //             </div>
// //         );
// //     }

// //     if (selectedCourse) {
// //         return <CourseDetailView course={selectedCourse} enrolled={true} onBack={() => setSelectedCourse(null)} onEnroll={() => {}} />;
// //     }

// //     return (
// //         <div>
// //             <Toaster position="top-right" richColors />
// //             <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
// //                 My Courses
// //             </h1>
            
// //             {courses.length === 0 ? (
// //                 <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
// //                     <p className="text-slate-600 dark:text-slate-400">You are not enrolled in any courses yet.</p>
// //                 </div>
// //             ) : (
// //                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                     {courses.filter(course => course).map((course) => (
// //                         <div 
// //                             key={course._id} 
// //                             className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
// //                         >
// //                             <div className="p-6">
// //                                 <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
// //                                     {course.title}
// //                                 </h2>
// //                                 <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
// //                                     {course.description}
// //                                 </p>
                                
// //                                 <div className="flex items-center justify-between mb-4">
// //                                     <div className="flex items-center text-slate-500 dark:text-slate-400">
// //                                         <TimeIcon />
// //                                         <span className="ml-1 text-sm">{course.totalMinutes} mins</span>
// //                                     </div>
                                    
// //                                     <div className="flex items-center text-slate-500 dark:text-slate-400">
// //                                         <IndianRupee />
// //                                         <span className="ml-1 text-sm">{course.price}</span>
// //                                     </div>
// //                                 </div>
                                
// //                                 <div className="flex justify-between mt-4">

// //                                     <button
// //                                         onClick={() => viewCourse(course)}
// //                                         className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
// //                                     >
// //                                         View Details
// //                                     </button>
                                    
                                   
                                       
// //                                     <span className="text-sm text-slate-500 dark:text-slate-400">
// //                                         {course.sections.length} sections
// //                                     </span>
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     ))}
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };

// // // Course Detail View Component
// // interface CourseDetailViewProps {
// //     course: Course;
// //     enrolled: boolean;
// //     onBack: () => void;
// //     onEnroll: () => void;
// // }

// // const CourseDetailView = ({ course, enrolled, onBack }: CourseDetailViewProps) => {
// //     const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
// //     const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
// //     const [progress, setProgress] = useState<ProgressState>({
// //         overall: 0,
// //         videos: {}
// //     });

// //     useEffect(() => {
// //         // Initialize with all sections expanded
// //         const initialExpandedState: Record<string, boolean> = {};
// //         course.sections.forEach((section) => {
// //             initialExpandedState[section._id] = true;
// //         });
// //         setExpandedSections(initialExpandedState);

// //         if (enrolled) {
// //             fetchProgress();
// //         }
// //     }, [course, enrolled]);

// //     const fetchProgress = async () => {
// //         try {
// //             const token = Cookies.get("auth_token");
// //             if (!token) {
// //                 console.error("Auth token not found");
// //                 return;
// //             }
            
// //             const response = await axios.get(`${baseUrl}/api/progress/get?courseId=${course._id}`, {
// //                 headers: { Authorization: `Bearer ${token}` }
// //             });
            
// //             if (response.data) {
// //                 setProgress({
// //                     overall: response.data.progress || 0,
// //                     videos: response.data.videoProgress || {}
// //                 });
// //             }
// //         } catch (error) {
// //             console.error("Error fetching progress:", error);
// //         }
// //     };

// //     const toggleSection = (sectionId: string): void => {
// //         setExpandedSections(prev => ({
// //             ...prev,
// //             [sectionId]: !prev[sectionId]
// //         }));
// //     };

// //     const playVideo = (videoUrl: string, videoId: string) => {
// //         if (!enrolled) {
// //             toast.error("Please enroll in this course to watch videos");
// //             return;
// //         }
        
// //         setActiveVideoUrl(videoUrl);
        
// //         // Update progress when a video is watched
// //         const updateProgress = async () => {
// //             try {
// //                 const token = Cookies.get("auth_token");
// //                 if (!token) {
// //                     console.error("Auth token not found");
// //                     return;
// //                 }
                
// //                 const tokenParts = token.split('.');
// //                 if (tokenParts.length !== 3) {
// //                     console.error("Invalid token format");
// //                     return;
// //                 }
                
// //                 const payload = JSON.parse(atob(tokenParts[1]));
// //                 const userId = payload.id;
                
// //                 const currentProgress = progress.videos[videoId] || 0;
                
// //                 await axios.post(
// //                     `${baseUrl}/api/progress/update`,
// //                     {
// //                         userId,
// //                         courseId: course._id,
// //                         videoId,
// //                         watchedMinutes: 1, // Just a small increment for demo
// //                         progress: Math.min(currentProgress + 10, 100) // Increment by 10% for demo
// //                     },
// //                     { headers: { Authorization: `Bearer ${token}` } }
// //                 );
                
// //                 // Refresh progress
// //                 fetchProgress();
                
// //             } catch (error) {
// //                 console.error("Error updating progress:", error);
// //             }
// //         };
        
// //         updateProgress();
// //     };

// //     return (
// //         <div>
// //             <button
// //                 onClick={onBack}
// //                 className="mb-6 flex items-center text-blue-600 hover:text-blue-700 transition-colors"
// //             >
// //                 <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
// //                 </svg>
// //                 Back to Courses
// //             </button>

// //             <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden mb-6">
// //                 <div className="p-6">
// //                     <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
// //                         {course.title}
// //                     </h1>
                    
// //                     <p className="text-slate-600 dark:text-slate-400 mb-4">
// //                         {course.description}
// //                     </p>
                    
// //                     <div className="flex flex-wrap gap-4 mb-4">
// //                         <div className="flex items-center text-slate-500 dark:text-slate-400">
// //                             <TimeIcon />
// //                             <span className="ml-1">{course.totalMinutes} mins total</span>
// //                         </div>
                        
// //                         <div className="flex items-center text-slate-500 dark:text-slate-400">
// //                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
// //                             </svg>
// //                             <span className="ml-1">{course.sections.length} sections</span>
// //                         </div>
                        
// //                         <div className="flex items-center text-slate-500 dark:text-slate-400">
// //                             <IndianRupee />
// //                             <span className="ml-1">{course.price}</span>
// //                         </div>
// //                     </div>
                    
// //                     {enrolled && (
// //                         <div className="mb-6">
// //                             <div className="flex justify-between mb-2">
// //                                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
// //                                     Course Progress
// //                                 </span>
// //                                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
// //                                     {progress.overall}%
// //                                 </span>
// //                             </div>
// //                             <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
// //                                 <div 
// //                                     className="bg-blue-600 h-2.5 rounded-full" 
// //                                     style={{ width: `${progress.overall}%` }}
// //                                 ></div>
// //                             </div>
// //                         </div>
// //                     )}
                    
// //                     {activeVideoUrl && (
// //                         <div className="mb-6">
// //                             <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
// //                                 Now Playing
// //                             </h3>
// //                             <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden">
// //                                 <video 
// //                                     className="absolute inset-0 w-full h-full"
// //                                     controls
// //                                     src={activeVideoUrl}
// //                                     onContextMenu={(e) => e.preventDefault()}
// //                                     controlsList="nodownload noplaybackrate"
// //                                     disablePictureInPicture
// //                                 ></video>
// //                             </div>
// //                         </div>
// //                     )}
                    
// //                     <div>
// //                         <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
// //                             Course Content
// //                         </h3>
                        
// //                         <div className="space-y-4">
// //                             {course.sections.map((section: Section) => (
// //                                 <div key={section._id} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
// //                                     <button
// //                                         onClick={() => toggleSection(section._id)}
// //                                         className="flex justify-between items-center w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 text-left"
// //                                     >
// //                                         <span className="font-medium text-slate-900 dark:text-white">
// //                                             {section.sectionTitle}
// //                                         </span>
// //                                         {expandedSections[section._id] ? <ChevronUpIcon /> : <ChevronDownIcon />}
// //                                     </button>
                                    
// //                                     {expandedSections[section._id] && (
// //                                         <div className="p-4 space-y-2">
// //                                             {section.videos.map((video: Video) => (
// //                                                 <div 
// //                                                     key={video._id}
// //                                                     className={`flex justify-between items-center p-3 rounded-lg ${
// //                                                         enrolled ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50' : ''
// //                                                     }`}
// //                                                     onClick={() => enrolled && playVideo(video.url, video._id)}
// //                                                 >
// //                                                     <div className="flex items-center">
// //                                                         <PlayIcon />
// //                                                         <div className="ml-3">
// //                                                             <h4 className="font-medium text-slate-900 dark:text-white">
// //                                                                 {video.title}
// //                                                             </h4>
// //                                                             <p className="text-sm text-slate-500 dark:text-slate-400">
// //                                                                 {video.description}
// //                                                             </p>
// //                                                         </div>
// //                                                     </div>
                                                    
// //                                                     <div className="flex items-center space-x-3">
// //                                                         {enrolled && (
// //                                                             <div className="w-16">
// //                                                                 <div className="flex justify-between mb-1">
// //                                                                     <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
// //                                                                         {(progress.videos[video._id] || 0)}%
// //                                                                     </span>
// //                                                                 </div>
// //                                                                 <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
// //                                                                     <div 
// //                                                                         className="bg-blue-600 h-1.5 rounded-full" 
// //                                                                         style={{ width: `${progress.videos[video._id] || 0}%` }}
// //                                                                     ></div>
// //                                                                 </div>
// //                                                             </div>
// //                                                         )}
                                                        
// //                                                         <div className="flex items-center text-slate-500 dark:text-slate-400">
// //                                                             <TimeIcon />
// //                                                             <span className="ml-1 text-sm">{video.duration} mins</span>
// //                                                         </div>
// //                                                     </div>
// //                                                 </div>
// //                                             ))}
// //                                         </div>
// //                                     )}
// //                                 </div>
// //                             ))}
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default MyCourses;

// import { useState, useEffect } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { Toaster, toast } from "sonner";
// import { IndianRupee } from "lucide-react";

// // Define proper types
// interface Course {
//   _id: string;
//   title: string;
//   description: string;
//   price: number;
//   totalMinutes: number;
//   sections: Section[];
// }

// interface Section {
//   _id: string;
//   sectionTitle: string;
//   videos: Video[];
// }

// interface Video {
//   _id: string;
//   title: string;
//   description: string;
//   url: string;
//   duration: number;
// }

// interface ProgressState {
//   overall: number;
//   videos: Record<string, number>; // Maps videoId to its percentage (0-100)
// }

// // API Base URL
// const baseUrl = import.meta.env.VITE_BACKEND_API;

// // Additional Icons for Course Views (unchanged)
// const PlayIcon = () => (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//     </svg>
// );

// const TimeIcon = () => (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//     </svg>
// );

// const ChevronDownIcon = () => (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//     </svg>
// );

// const ChevronUpIcon = () => (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
//     </svg>
// );

// // MyCourses component - renamed from Course to MyCourses as per usage in DashboardLayout
// // This component now accepts a 'courseId' prop to view a specific course detail,
// // or displays all enrolled courses if no courseId is provided.
// const MyCourses = ({ courseId }: { courseId?: string | null }) => {
//     const [courses, setCourses] = useState<Course[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

//     useEffect(() => {
//         const fetchEnrolledCourses = async () => {
//             setLoading(true);
//             try {
//                 const token = Cookies.get("auth_token");
//                 if (!token) {
//                     setError("Authentication token not found");
//                     setLoading(false);
//                     return;
//                 }
                
//                 const response = await axios.get(`${baseUrl}/api/enrollment/my-courses`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 const fetchedCourses = response.data.courses.filter((c: Course | null) => c !== null); // Filter out nulls
//                 setCourses(fetchedCourses);

//                 // If a specific courseId is provided, try to select that course
//                 if (courseId) {
//                     const courseToSelect = fetchedCourses.find((c: Course) => c._id === courseId);
//                     if (courseToSelect) {
//                         setSelectedCourse(courseToSelect);
//                     } else {
//                         toast.error("The requested course was not found in your enrollments.");
//                         setSelectedCourse(null); // Go back to list if not found
//                     }
//                 } else {
//                     setSelectedCourse(null); // Show list if no courseId
//                 }

//                 setLoading(false);
//             } catch (error) {
//                 console.error("Error fetching enrolled courses:", error);
//                 setError("Failed to load enrolled courses. Please try again later.");
//                 setLoading(false);
//             }
//         };

//         fetchEnrolledCourses();
//     }, [courseId]); // Re-fetch when courseId changes

//     const viewCourse = (course: Course) => {
//         setSelectedCourse(course);
//     };

//     // Callback to go back from CourseDetailView to the list of courses
//     const handleBackToList = () => {
//         setSelectedCourse(null);
//     };

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-700 dark:text-red-400">
//                 <p>{error}</p>
//             </div>
//         );
//     }

//     if (selectedCourse) {
//         // Pass enrolled=true since this is MyCourses
//         return <CourseDetailView course={selectedCourse} enrolled={true} onBack={handleBackToList} />;
//     }

//     return (
//         <div>
//             <Toaster position="top-right" richColors />
//             <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
//                 My Courses
//             </h1>
            
//             {courses.length === 0 ? (
//                 <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
//                     <p className="text-slate-600 dark:text-slate-400">You are not enrolled in any courses yet.</p>
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {courses.map((course) => ( // Already filtered out nulls in useEffect
//                         <div 
//                             key={course._id} 
//                             className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
//                         >
//                             <div className="p-6">
//                                 <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
//                                     {course.title}
//                                 </h2>
//                                 <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
//                                     {course.description}
//                                 </p>
                                
//                                 <div className="flex items-center justify-between mb-4">
//                                     <div className="flex items-center text-slate-500 dark:text-slate-400">
//                                         <TimeIcon />
//                                         <span className="ml-1 text-sm">{course.totalMinutes} mins</span>
//                                     </div>
                                    
//                                     <div className="flex items-center text-slate-500 dark:text-slate-400">
//                                         <IndianRupee />
//                                         <span className="ml-1 text-sm">{course.price}</span>
//                                     </div>
//                                 </div>
                                
//                                 <div className="flex justify-between mt-4">

//                                     <button
//                                         onClick={() => viewCourse(course)}
//                                         className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                                     >
//                                         View Course
//                                     </button>
                                    
//                                     <span className="text-sm text-slate-500 dark:text-slate-400">
//                                         {course.sections.length} sections
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// // Course Detail View Component (Renamed from CourseDetailView to avoid conflict and accept onEnroll prop)
// // This component should be used both for enrolled courses and potentially for un-enrolled ones (e.g., from CourseViewAndEnrollPage).
// // Therefore, the 'enrolled' prop indicates if the user is already enrolled and can watch videos.
// interface CourseDetailViewProps {
//     course: Course;
//     enrolled: boolean; // True if the user is enrolled, false otherwise
//     onBack: () => void;
//     // Removed onEnroll from props since it's only called from CourseViewAndEnrollPage for new enrollments
//     // and this component is mainly for displaying content/progress.
// }

// const CourseDetailView = ({ course, enrolled, onBack }: CourseDetailViewProps) => {
//     const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
//     const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
//     const [progress, setProgress] = useState<ProgressState>({
//         overall: 0,
//         videos: {}
//     });

//     useEffect(() => {
//         // Initialize with all sections expanded by default
//         const initialExpandedState: Record<string, boolean> = {};
//         course.sections.forEach((section) => {
//             initialExpandedState[section._id] = true;
//         });
//         setExpandedSections(initialExpandedState);

//         if (enrolled) {
//             fetchProgress();
//         }
//     }, [course, enrolled]); 

//     const fetchProgress = async () => {
//         try {
//             const token = Cookies.get("auth_token");
//             if (!token) {
//                 console.error("Auth token not found");
//                 return;
//             }
            
//             const response = await axios.get(`${baseUrl}/api/progress/get?courseId=${course._id}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
            
//             console.log("Progress fetched from backend:", response.data); // LOGGING: Data received from GET
            
//             if (response.data) {
//                 // Ensure default values if backend returns null/undefined for progress or videoProgress
//                 setProgress({
//                     overall: response.data.progress || 0, 
//                     videos: response.data.videoProgress || {} 
//                 });
//             }
//         } catch (error) {
//             console.error("Error fetching progress:", error);
//             toast.error("Failed to fetch course progress."); // Added toast for user feedback
//         }
//     };

//     const toggleSection = (sectionId: string): void => {
//         setExpandedSections(prev => ({
//             ...prev,
//             [sectionId]: !prev[sectionId]
//         }));
//     };

//     // New function to handle the backend progress update
//     const updateProgressOnBackend = async (playedVideo: Video) => {
//         try {
//             const token = Cookies.get("auth_token");
//             if (!token) {
//                 console.error("Auth token not found");
//                 toast.error("Authentication required to update progress.");
//                 return;
//             }

//             const tokenParts = token.split('.');
//             if (tokenParts.length !== 3) {
//                 console.error("Invalid token format");
//                 toast.error("Invalid user session.");
//                 return;
//             }

//             const payload = JSON.parse(atob(tokenParts[1]));
//             const userId = payload.id;

//             // Payload for /api/progress/update
//             const dataToSend = {
//                 userId: userId,
//                 courseId: course._id,
//                 videoId: playedVideo._id,
//                 completedMinutes: playedVideo.duration,
//                 progress: Math.min((progress.videos[playedVideo._id] || 0) + 10, 100),
//                 faceSimilarityScore: null,
//                 faceNotFound: false
//             };

//             console.log("Sending progress update to backend:", dataToSend);

//             const response = await axios.post(
//                 `${baseUrl}/api/progress/update`,
//                 dataToSend,
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             if (response.data && response.data.message === 'Video progress updated') {
//                 console.log("Progress update sent successfully.");
//                 toast.success(`Progress for "${playedVideo.title}" updated.`);
//                 fetchProgress(); // Refresh progress after update
//             } else {
//                 console.error("Failed to update progress on backend:", response.data);
//                 toast.error("Failed to update progress. Please try again.");
//             }
//         } catch (error) {
//             console.error("Error updating progress on backend:", error);
//             toast.error("An error occurred while updating progress.");
//         }
//     };

//     // Modified playVideo function to use the new updateProgressOnBackend logic
//     const playVideo = (video: Video) => { // Now accepts the full Video object
//         if (!enrolled) {
//             toast.error("Please enroll in this course to watch videos");
//             return;
//         }
        
//         setActiveVideoUrl(video.url);
        
//         // Trigger the backend update logic using the full video object
//         updateProgressOnBackend(video);
//     };

//     return (
//         <div>
//             <button
//                 onClick={onBack}
//                 className="mb-6 flex items-center text-blue-600 hover:text-blue-700 transition-colors"
//             >
//                 <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                 </svg>
//                 Back to Courses
//             </button>

//             <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden mb-6">
//                 <div className="p-6">
//                     <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
//                         {course.title}
//                     </h1>
                    
//                     <p className="text-slate-600 dark:text-slate-400 mb-4">
//                         {course.description}
//                     </p>
                    
//                     <div className="flex flex-wrap gap-4 mb-4">
//                         <div className="flex items-center text-slate-500 dark:text-slate-400">
//                             <TimeIcon />
//                             <span className="ml-1">{course.totalMinutes} mins total</span>
//                         </div>
                        
//                         <div className="flex items-center text-slate-500 dark:text-slate-400">
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//                             </svg>
//                             <span className="ml-1">{course.sections.length} sections</span>
//                         </div>
                        
//                         <div className="flex items-center text-slate-500 dark:text-slate-400">
//                             <IndianRupee />
//                             <span className="ml-1">{course.price}</span>
//                         </div>
//                     </div>
                    
//                     {enrolled && (
//                         <div className="mb-6">
//                             <div className="flex justify-between mb-2">
//                                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                                     Course Progress
//                                 </span>
//                                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                                     {Math.floor(progress.overall)}%
//                                 </span>
//                             </div>
//                             <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
//                                 <div 
//                                     className="bg-blue-600 h-2.5 rounded-full" 
//                                     style={{ width: `${Math.floor(progress.overall)}%` }}
//                                 ></div>
//                             </div>
//                         </div>
//                     )}
                    
//                     {activeVideoUrl && (
//                         <div className="mb-6">
//                             <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
//                                 Now Playing
//                             </h3>
//                             <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden">
//                                 <video 
//                                     className="absolute inset-0 w-full h-full"
//                                     controls
//                                     src={activeVideoUrl}
//                                     onContextMenu={(e) => e.preventDefault()}
//                                     controlsList="nodownload noplaybackrate"
//                                     disablePictureInPicture
//                                 ></video>
//                             </div>
//                         </div>
//                     )}
                    
//                     <div>
//                         <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
//                             Course Content
//                         </h3>
                        
//                         <div className="space-y-4">
//                             {course.sections.map((section: Section) => (
//                                 <div key={section._id} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
//                                     <button
//                                         onClick={() => toggleSection(section._id)}
//                                         className="flex justify-between items-center w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 text-left"
//                                     >
//                                         <span className="font-medium text-slate-900 dark:text-white">
//                                             {section.sectionTitle}
//                                         </span>
//                                         {expandedSections[section._id] ? <ChevronUpIcon /> : <ChevronDownIcon />}
//                                     </button>
                                    
//                                     {expandedSections[section._id] && (
//                                         <div className="p-4 space-y-2">
//                                             {section.videos.map((video: Video) => (
//                                                 <div 
//                                                     key={video._id}
//                                                     className={`flex justify-between items-center p-3 rounded-lg ${
//                                                         enrolled ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50' : ''
//                                                     }`}
//                                                     onClick={() => playVideo(video)} // Pass the full video object
//                                                 >
//                                                     <div className="flex items-center">
//                                                         <PlayIcon />
//                                                         <div className="ml-3">
//                                                             <h4 className="font-medium text-slate-900 dark:text-white">
//                                                                 {video.title}
//                                                             </h4>
//                                                             <p className="text-sm text-slate-500 dark:text-slate-400">
//                                                                 {video.description}
//                                                             </p>
//                                                         </div>
//                                                     </div>
                                                    
//                                                     <div className="flex items-center space-x-3">
//                                                         {enrolled && (
//                                                             <div className="w-16">
//                                                                 <div className="flex justify-between mb-1">
//                                                                     <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
//                                                                         {Math.floor(progress.videos[video._id] || 0)}%
//                                                                     </span>
//                                                                 </div>
//                                                                 <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
//                                                                     <div 
//                                                                         className="bg-blue-600 h-1.5 rounded-full" 
//                                                                         style={{ width: `${Math.floor(progress.videos[video._id] || 0)}%` }}
//                                                                     ></div>
//                                                                 </div>
//                                                             </div>
//                                                         )}
                                                        
//                                                         <div className="flex items-center text-slate-500 dark:text-slate-400">
//                                                             <TimeIcon />
//                                                             <span className="ml-1 text-sm">{video.duration} mins</span>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MyCourses;
import { useState, useEffect } from "react";
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

// Course Detail View Component (Renamed from CourseDetailView to avoid conflict and accept onEnroll prop)
// This component should be used both for enrolled courses and potentially for un-enrolled ones (e.g., from CourseViewAndEnrollPage).
// Therefore, the 'enrolled' prop indicates if the user is already enrolled and can watch videos.
interface CourseDetailViewProps {
    course: Course;
    enrolled: boolean; // True if the user is enrolled, false otherwise
    onBack: () => void;
}

const CourseDetailView = ({ course, enrolled, onBack }: CourseDetailViewProps) => {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
    // const [setProgress] = useState<ProgressState>({
    //     overall: 0,
    //     videos: {}
    // });
    const [simulatedProgress, setSimulatedProgress] = useState<ProgressState>({
        overall: 0,
        videos: {}
    });
    const [isSimulatingProgress, setIsSimulatingProgress] = useState(false);

    useEffect(() => {
        // Initialize with all sections expanded by default
        const initialExpandedState: Record<string, boolean> = {};
        course.sections.forEach((section) => {
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
            if (!token) {
                console.error("Auth token not found");
                return;
            }
            
            const response = await axios.get(`${baseUrl}/api/progress/get?courseId=${course._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log("Progress fetched from backend:", response.data); // LOGGING: Data received from GET
            
            if (response.data) {
                // Ensure default values if backend returns null/undefined for progress or videoProgress
                // setProgress({
                //     overall: response.data.progress || 0, 
                //     videos: response.data.videoProgress || {} 
                // });
                // Reset simulated progress to match fetched progress
                setSimulatedProgress({
                    overall: response.data.progress || 0,
                    videos: response.data.videoProgress || {}
                });
            }
        } catch (error) {
            console.error("Error fetching progress:", error);
            toast.error("Failed to fetch course progress."); // Added toast for user feedback
        }
    };

    const toggleSection = (sectionId: string): void => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    // Function to simulate progress increment
    const incrementSimulatedProgress = (videoId: string, videoDuration: number) => {
        // Increment video progress
        setSimulatedProgress(prev => {
            const newVideoProgress = Math.min((prev.videos[videoId] || 0) + 1, 100);
            const newOverallProgress = Math.min(
                prev.overall + (1 / course.totalMinutes) * videoDuration, 
                100
            );

            return {
                overall: newOverallProgress,
                videos: {
                    ...prev.videos,
                    [videoId]: newVideoProgress
                }
            };
        });
    };

    // Function to start progress simulation
    const startProgressSimulation = (video: Video) => {
        if (isSimulatingProgress) return; // Prevent multiple simulations

        setIsSimulatingProgress(true);
        const simulationInterval = setInterval(() => {
            incrementSimulatedProgress(video._id, video.duration);

            // Stop simulation when video progress reaches 100%
            if (simulatedProgress.videos[video._id] >= 100) {
                clearInterval(simulationInterval);
                setIsSimulatingProgress(false);
            }
        }, 1000); // Increment every second

        return () => {
            clearInterval(simulationInterval);
            setIsSimulatingProgress(false);
        };
    };

    // Modified playVideo function to use the new progress simulation
    const playVideo = (video: Video) => {
        if (!enrolled) {
            toast.error("Please enroll in this course to watch videos");
            return;
        }
        
        setActiveVideoUrl(video.url);
        
        // Start progress simulation
        startProgressSimulation(video);
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
                                    {Math.floor(simulatedProgress.overall)}%
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{ width: `${Math.floor(simulatedProgress.overall)}%` }}
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
                                                    onClick={() => playVideo(video)}
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
                                                                        {Math.floor(simulatedProgress.videos[video._id] || 0)}%
                                                                    </span>
                                                                </div>
                                                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                                                                    <div 
                                                                        className="bg-blue-600 h-1.5 rounded-full" 
                                                                        style={{ width: `${Math.floor(simulatedProgress.videos[video._id] || 0)}%` }}
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