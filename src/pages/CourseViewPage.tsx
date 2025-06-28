import React, { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Toaster,toast } from 'sonner';

// Lucide React icons
import {
  ArrowLeft,
  CheckCircle2,
  Info,
  Clock,
  Video,
  User,
  PlayCircle,
  ChevronRight,
  AlertCircle,
  Loader2,
} from "lucide-react";

// ==================== TYPES ====================
interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  thumbnailUrl?: string;
  instructor?: string;
  totalMinutes: number;
  sections: CourseSection[];
  createdAt?: string;
  updatedAt?: string;
}

interface CourseSection {
  _id: string;
  sectionTitle: string;
  videos: CourseVideo[];
}

interface CourseVideo {
  _id: string;
  title: string;
  description: string;
  url: string;
  duration: number;
}

interface EnrollmentStatus {
  enrolled: boolean;
  enrollmentDate?: string;
  progress?: number;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthCheckResponse {
  isLoggedIn: boolean;
  userId: string;
  username: string;
  email: string;
}

interface CourseResponse {
  courses: Course[];
}

interface PaymentOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

// ==================== API SERVICE ====================
const API_BASE_URL = import.meta.env.VITE_BACKEND_API;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add auth token to requests from cookies
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== MAIN COMPONENT ====================
const CourseViewAndEnrollPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  // State management
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState<EnrollmentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [showCourseList, setShowCourseList] = useState(!courseId);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingEnrollmentStatus, setCheckingEnrollmentStatus] = useState(false);
  const [couponCode, setCouponCode] = useState<string>('');

  // Check authentication status
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await api.get<AuthCheckResponse>('/auth/check');
      if (response.data.isLoggedIn) {
        setIsAuthenticated(true);
        setUser({
          id: response.data.userId,
          name: response.data.username,
          email: response.data.email,
        });
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      toast.error(`Authentication check failed: ${error}`);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // Fetch all courses
  useEffect(() => {
    fetchAllCourses();
  }, []);

  // Fetch specific course when courseId changes
  useEffect(() => {
    if (courseId) {
      setShowCourseList(false);
      fetchCourseDetails(courseId);
    } else {
      setShowCourseList(true);
    }
  }, [courseId]);

  // Check enrollment when user authentication changes
  useEffect(() => {
    if (isAuthenticated && user && courseId) {
      checkEnrollmentAndAccess(courseId);
    }
  }, [isAuthenticated, user, courseId]);

  const fetchAllCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get<CourseResponse>('/course/courses');
      setCourses(response.data.courses || []);
    } catch (error) {
      toast.error(`Error fetching courses: ${error}`);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const course = courses.find((c) => c._id === id);
      if (course) {
        setSelectedCourse(course);
      } else {
        const response = await api.get<Course>(`/course/${id}`);
        setSelectedCourse(response.data);
      }
    } catch (error) {
      toast.error(`Error fetching course details: ${error}`);
      setError('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentAndAccess = async (courseId: string) => {
    if (!user?.id) return;

    try {
      setCheckingEnrollmentStatus(true);
      setEnrollmentStatus(null);

      const enrollmentResponse = await api.get('/api/enrollment/check', {
        params: { userId: user.id, courseId },
      });
      setEnrollmentStatus(enrollmentResponse.data);

      const accessResponse = await api.get(`/payment/check-access/${courseId}`);
    } catch (error) {
      toast.error(`Error checking enrollment: ${error}`);
      setEnrollmentStatus(null);
    } finally {
      setCheckingEnrollmentStatus(false);
    }
  };

  // Helper function to determine if the user can access the course (learn)
  const canAccessCourse = () => {
    return enrollmentStatus?.enrolled === true;
  };

  const handleEnrollment = async () => {
    if (!isAuthenticated || !user) {
      setError('Please login to enroll in this course');
      setTimeout(() => {
        navigate('/auth', { state: { from: `/course/${selectedCourse?._id}` } });
      }, 2000);
      return;
    }

    if (!selectedCourse) return;

    setEnrolling(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (selectedCourse.price === 0) {
        // Free course - direct enrollment
        await api.post('/api/enrollment/enroll', {
          userId: user.id,
          courseId: selectedCourse._id,
        });
        setSuccessMessage('Successfully enrolled in the course!');
        setTimeout(async () => {
          await checkEnrollmentAndAccess(selectedCourse._id);
        }, 1000);
      } else {
        // Paid course - initiate payment
        await initiatePayment();
      }
    } catch (error: any) {
      toast.error('Enrollment error:', error);
      setError(error.response?.data?.message || 'Failed to enroll in the course');
    } finally {
      setEnrolling(false);
    }
  };

  const initiatePayment = async () => {
  if (!selectedCourse) return;

  try {
    // Create the request payload
    const payload: { courseId: string; couponCode?: string } = {
      courseId: selectedCourse._id,
    };

    // Only add the couponCode if it's not empty
    if (couponCode && couponCode.trim()) {
      payload.couponCode = couponCode.trim();
    }

    // Create payment order with the proper payload
    const orderResponse = await api.post<PaymentOrderResponse>(
      '/payment/create-order', 
      payload
    );

    const { orderId, amount, currency, key } = orderResponse.data;

    const options = {
      key: key || 'rzp_test_your_key',
      amount: amount,
      currency: currency,
      name: 'Thirav.ai',
      description: `Enrollment for ${selectedCourse.title}`,
      order_id: orderId,
      handler: function (response: any) {
        verifyPaymentAndEnroll({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });
      },
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
      },
      theme: {
        color: '#3B82F6',
      },
      modal: {
        ondismiss: function () {
          setError('Payment cancelled');
        },
      },
    };

    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };
      document.body.appendChild(script);
    } else {
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    }
  } catch (error: any) {
    toast.error('Payment initiation error:', error);
    // Provide more specific error message if available
    const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to initiate payment';
    setError(errorMessage);
  }
};


  const verifyPaymentAndEnroll = async (paymentDetails: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    if (!selectedCourse || !user) return;

    try {
      await api.post('/payment/verify', paymentDetails);
      await api.post('/api/enrollment/enroll', {
        userId: user.id,
        courseId: selectedCourse._id,
      });
      setSuccessMessage('Payment successful! You are now enrolled in the course.');
      setTimeout(async () => {
        await checkEnrollmentAndAccess(selectedCourse._id);
      }, 1000);
    } catch (error: any) {
      toast.error('Payment verification error:', error);
      setError(error.response?.data?.message || 'Payment verification failed. Please contact support.');
    }
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const countTotalVideos = (course: Course): number => {
    return course.sections.reduce((total, section) => total + section.videos.length, 0);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading course content...</p>
        </div>
      </div>
    );
  }

  // Course List View
  if (showCourseList) {
    return (
      <div className="min-h-screen bg-background">
        <Toaster position="top-right" richColors closeButton />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <h1 className="text-3xl font-bold mb-8">Available Courses</h1>
          
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card 
                key={course._id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/course/${course._id}`)}
              >
                <div className="h-48 bg-muted">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatDuration(course.totalMinutes)}</span>
                    </div>
                    <div className="flex items-center">
                      <Video className="h-4 w-4 mr-1" />
                      <span>{countTotalVideos(course)} videos</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <Badge variant={course.price === 0 ? "outline" : "default"} className="text-lg py-1 px-2 bg-blue-500 text-white">
                  {course.price === 0 ? 'Free' : `₹${course.price}`}
                  </Badge>
                  <Button variant="ghost" className="flex items-center text-blue-500">
                  View Details <ChevronRight className="h-4 w-4 ml-1 text-blue-500" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {courses.length === 0 && !loading && (
            <div className="text-center py-12 bg-background rounded-lg border border-border">
              <Info className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">No courses found</h3>
              <p className="mt-1 text-muted-foreground">Check back later for new courses.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Course Detail View
  if (!selectedCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Course not found</p>
          <Button
            variant="link"
            onClick={() => navigate('/dashboard')}
            className="mt-4 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to courses
        </Button>

        {/* Authentication status indicator */}
        <div className="mb-4">
          {isAuthenticated && user ? (
            <div className="flex items-center text-green-600">
            </div>
          ) : (
            <div className="flex items-center text-amber-600">
              <Info className="h-4 w-4 mr-1" />
              <span className="text-sm">
                You are not logged in - <a href="/auth" className="underline">Login</a> to enroll
              </span>
            </div>
          )}
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-success/10 text-success p-4 rounded-lg mb-6 flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            {successMessage}
          </div>
        )}

        {/* Course Header */}
        <Card className="mb-8">
          <div className="md:flex">
            <div className="md:w-2/3 p-8">
              <h1 className="text-3xl font-bold mb-4">{selectedCourse.title}</h1>
              <p className="text-muted-foreground mb-6">{selectedCourse.description}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
                {selectedCourse.instructor && (
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    {selectedCourse.instructor}
                  </div>
                )}
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  {formatDuration(selectedCourse.totalMinutes)}
                </div>
                <div className="flex items-center">
                  <Video className="h-5 w-5 mr-2" />
                  {countTotalVideos(selectedCourse)} videos
                </div>
              </div>

              {/* For paid courses, add an input field for coupon code */}
              {selectedCourse.price > 0 && !canAccessCourse() && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Coupon Code (optional)
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      value={couponCode}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="w-full max-w-sm"
                    //   icon={<Tag className="h-4 w-4 text-muted-foreground" />}
                    />
                  </div>
                </div>
              )}

              {/* Enrollment Button */}
              <div className="mt-6">
                {checkingEnrollmentStatus ? (
                  <div className="flex items-center text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Checking enrollment status...
                  </div>
                ) : canAccessCourse() ? (
                  <Button
                    size="lg"
                    onClick={() => navigate(`/dashboard`)}
                    className="gap-2"
                  >
                    <PlayCircle className="h-5 w-5" />
                    Go to Mycourse to view the course
                  </Button>
                ) : (
                  <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-center">
                    <Button
                      size="lg"
                      onClick={handleEnrollment}
                      disabled={enrolling || !isAuthenticated}
                      className="gap-2"
                    >
                      {enrolling ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          {selectedCourse.price === 0 ? 'Enroll for Free' : `Enroll for ₹${selectedCourse.price}`}
                        </>
                      )}
                    </Button>
                    
                    {selectedCourse.price > 0 && (
                      <span className="text-sm text-muted-foreground">
                        Secure payment via Razorpay
                      </span>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Course Thumbnail */}
            <div className="md:w-1/3 bg-muted">
              {selectedCourse.thumbnailUrl ? (
                <img
                  src={selectedCourse.thumbnailUrl}
                  alt={selectedCourse.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Video className="h-32 w-32 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
        </Card>
        
        {/* Course Content */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Course Content</CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            {selectedCourse.sections.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {selectedCourse.sections.map((section) => (
                  <AccordionItem key={section._id} value={section._id}>
                    <AccordionTrigger className="px-4 hover:bg-accent rounded-lg">
                      <div className="flex justify-between items-center w-full pr-4">
                        <span className="text-lg font-medium">{section.sectionTitle}</span>
                        <Badge variant="outline" className="ml-2">
                          {section.videos.length} videos
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4">
                      <div className="space-y-2 pt-2">
                        {section.videos.map((video) => (
                          <div
                            key={video._id}
                            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/20"
                          >
                            <div className="flex items-center">
                              <PlayCircle className="h-5 w-5 mr-3 text-muted-foreground" />
                              <div>
                                <h4 className="font-medium">{video.title}</h4>
                                <p className="text-xs text-muted-foreground">{video.description}</p>
                              </div>
                            </div>
                            <Badge variant="secondary">{formatDuration(video.duration)}</Badge>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No content available for this course yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Enrollment CTA for mobile */}
        <div className="md:hidden mt-6">
          {!canAccessCourse() && (
            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-2xl text-primary">
                  {selectedCourse.price === 0 ? 'Free' : `₹${selectedCourse.price}`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedCourse.price > 0 && !canAccessCourse() && (
                  <div className="mb-4">
                    <Input
                      type="text"
                      value={couponCode}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code (optional)"
                    />
                  </div>
                )}
                
                <Button
                  onClick={handleEnrollment}
                  disabled={enrolling || !isAuthenticated}
                  className="w-full"
                  size="lg"
                >
                  {enrolling ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {enrolling ? 'Processing...' : 'Enroll Now'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseViewAndEnrollPage;