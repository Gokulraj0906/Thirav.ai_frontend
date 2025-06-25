import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

const baseUrl = "https://thirav-ai.onrender.com";

interface Video {
  title: string;
  description: string;
  duration: number;
  url: string;
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
}

const CourseDetailView = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchCourseAndCheckAccess = async () => {
      try {
        if (!courseId) {
          toast.error("Course ID is missing from URL.");
          return;
        }

        const token = Cookies.get("auth_token");
        if (!token) {
          toast.error("Please login to continue.");
          navigate("/auth");
          return;
        }

        // Get user
        const authRes = await axios.get(`${baseUrl}/auth/check`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = authRes.data.user || authRes.data;
        const currentUserId = user._id || user.id;
        setUserId(currentUserId);

        // Fetch course
        const courseRes = await axios.get(`${baseUrl}/course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = courseRes.data;
        const courseData = data.course || data; // support both types
        if (!courseData || !courseData._id) {
          toast.error("Course not found.");
          return;
        }
        setCourse(courseData);

        // Check enrollment
        const enrollRes = await axios.get(
          `${baseUrl}/api/enrollment/check?userId=${currentUserId}&courseId=${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setIsEnrolled(enrollRes.data === true);
      } catch (error: any) {
        console.error("Error fetching course or checking access:", error.response?.data || error.message);
        toast.error("Error loading course.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndCheckAccess();
  }, [courseId, navigate]);

  const goToPayment = () => {
    navigate(`/checkout?courseId=${courseId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-600 dark:text-gray-300">
        Loading course...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center text-red-500 font-medium mt-10">
        Course not found.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-slate-800 dark:text-white">{course.title}</h1>
      <p className="mb-6 text-gray-700 dark:text-gray-300">{course.description}</p>

      {course.sections.map((section) => (
        <div key={section._id} className="mb-10">
          <h2 className="text-xl font-semibold mb-2 text-blue-700 dark:text-blue-300">
            {section.sectionTitle}
          </h2>
          {section.videos.map((video, idx) => (
            <div key={idx} className="mb-4 border rounded-lg p-4 bg-white dark:bg-slate-800">
              <h3 className="font-medium text-slate-800 dark:text-white">{video.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{video.description}</p>
              <p className="text-xs text-gray-400 italic">Duration: {video.duration} min</p>

              {isEnrolled ? (
                <video
                  controls
                  src={video.url}
                  className="mt-2 w-full rounded max-h-[400px]"
                />
              ) : (
                <div className="text-red-500 mt-3 font-medium flex flex-col gap-2">
                  🔒 You are not enrolled in this course.
                  <button
                    onClick={goToPayment}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded w-max"
                  >
                    Enroll Now
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CourseDetailView;
