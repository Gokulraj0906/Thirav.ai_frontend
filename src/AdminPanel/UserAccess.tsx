import { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Cookies from 'js-cookie';
import { Toaster, toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Loader2, 
  UserPlus, 
  Mail, 
  BookOpen, 
  Clock, 
  Users,
  Search,
  RefreshCw,
  Eye,
  BarChart3,
  Activity,
  Award,
  Percent,
  AlertCircle,
} from 'lucide-react';

// API Base URL
const baseUrl = import.meta.env.VITE_BACKEND_API;

// Form Schemas
const grantAccessSchema = z.object({
  email: z.string().email('Invalid email address'),
  courseSelection: z.enum(['id', 'name']),
  courseId: z.string().optional(),
  courseName: z.string().optional(),
}).refine((data) => {
  if (data.courseSelection === 'id' && !data.courseId) {
    return false;
  }
  if (data.courseSelection === 'name' && !data.courseName) {
    return false;
  }
  return true;
}, {
  message: "Please select a course",
  path: ["courseId"],
});

type GrantAccessFormData = z.infer<typeof grantAccessSchema>;

interface Course {
  _id: string;
  title: string;
  description: string;
  totalMinutes: number;
}

interface UserInfo {
  _id: string;
  email: string;
  username: string;
}

interface CourseInfo {
  _id: string;
  title: string;
  totalMinutes: number;
}

interface UserProgress {
  _id: string;
  userId: UserInfo;
  courseId: CourseInfo;
  completedMinutes: number;
  totalMinutes: number;
  progress: number;
  status: string;
  lastUpdated?: string;
  createdAt?: string;
  updatedAt?: string;
  faceNotFound?: boolean;
  faceSimilarityScore?: number;
}

interface ProgressStats {
  totalUsers: number;
  activeUsers: number;
  completedCourses: number;
  averageProgress: number;
}

const UserAccess = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [isGranting, setIsGranting] = useState(false);
  // Removed unused dialogOpen state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserProgress | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);

  const form = useForm<GrantAccessFormData>({
    resolver: zodResolver(grantAccessSchema),
    defaultValues: {
      email: '',
      courseSelection: 'id',
      courseId: '',
      courseName: '',
    },
  });

  const courseSelection = form.watch('courseSelection');

  useEffect(() => {
    fetchCourses();
    fetchProgressReview();
  }, [refreshKey]);

  const fetchCourses = async () => {
    try {
      const token = Cookies.get('auth_token');
      const response = await axios.get(`${baseUrl}/course/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data.courses || response.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
    }
  };

  const fetchProgressReview = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('auth_token');
      const response = await axios.get(`${baseUrl}/admin/progress-review`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUserProgress(response.data);
    } catch (error) {
      console.error('Error fetching progress review:', error);
      toast.error('Failed to fetch progress review');
    } finally {
      setLoading(false);
    }
  };

  const grantAccess = async (data: GrantAccessFormData) => {
    setIsGranting(true);
    try {
      const token = Cookies.get('auth_token');
      const payload: any = { email: data.email };
      
      if (data.courseSelection === 'id') {
        payload.courseId = data.courseId;
      } else {
        payload.courseName = data.courseName;
      }

      await axios.post(`${baseUrl}/admin/grant-access`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      toast.success(`Access granted to ${data.email}`);
      form.reset();
      setRefreshKey(prev => prev + 1);
    } catch (error: any) {
      console.error('Error granting access:', error);
      toast.error(error.response?.data?.message || 'Failed to grant access');
    } finally {
      setIsGranting(false);
    }
  };

  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Filter users based on search and status
  const filteredUsers = userProgress.filter(user => {
    const matchesSearch = searchQuery === '' || 
      user.userId.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userId.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.courseId.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats: ProgressStats = {
    totalUsers: userProgress.length,
    activeUsers: userProgress.filter(u => u.status === 'in progress').length,
    completedCourses: userProgress.filter(u => u.progress === 100).length,
    averageProgress: userProgress.length > 0 
      ? Math.round(userProgress.reduce((acc, u) => acc + u.progress, 0) / userProgress.length)
      : 0
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'in progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'not started':
        return <Badge variant="secondary">Not Started</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatLastAccessed = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
  };

  const viewUserDetails = (user: UserProgress) => {
    setSelectedUser(user);
    setUserDetailsOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <Toaster position="top-right" richColors />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          User Access Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Grant course access and monitor user progress
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Enrollments</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-blue-600">{stats.activeUsers}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedCourses}</p>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Progress</p>
                <p className="text-2xl font-bold">{stats.averageProgress}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="progress-review" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grant-access">Grant Access</TabsTrigger>
          <TabsTrigger value="progress-review">Progress Review</TabsTrigger>
        </TabsList>

        <TabsContent value="grant-access">
          <Card>
            <CardHeader>
              <CardTitle>Grant Course Access</CardTitle>
              <CardDescription>
                Provide course access to users by email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(grantAccess)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              placeholder="user@example.com" 
                              className="pl-10"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Enter the email address of the user
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="courseSelection"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Course By</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="id">Course ID</SelectItem>
                            <SelectItem value="name">Course Name</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {courseSelection === 'id' ? (
                    <FormField
                      control={form.control}
                      name="courseId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a course" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {courses.map((course) => (
                                <SelectItem key={course._id} value={course._id}>
                                  {course.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select the course to grant access to
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="courseName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <BookOpen className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input 
                                placeholder="Course name" 
                                className="pl-10"
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Enter the exact name of the course
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <Button type="submit" disabled={isGranting}>
                    {isGranting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Granting Access...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Grant Access
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress-review">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>User Progress Review</CardTitle>
                  <CardDescription>
                    Monitor user engagement and course completion
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search users or courses..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value)}
                  >
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="in progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="not started">Not Started</SelectItem>
                    </SelectContent>
                  </Select>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={refreshData}>
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Refresh data</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    {searchQuery || statusFilter !== 'all' 
                      ? 'No users match your search criteria'
                      : 'No user progress data available'}
                  </p>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Time Spent</TableHead>
                          <TableHead>Last Activity</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{user.userId.username}</span>
                                <span className="text-sm text-gray-500">{user.userId.email}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">{user.courseId.title}</span>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">{user.progress}%</span>
                                </div>
                                <Progress value={user.progress} className="h-2" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                <span>{user.completedMinutes} / {user.totalMinutes} min</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {user.lastUpdated ? formatLastAccessed(user.lastUpdated) : 'Never'}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(user.status)}
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => viewUserDetails(user)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Details Dialog */}
      <Dialog open={userDetailsOpen} onOpenChange={setUserDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle>User Progress Details</DialogTitle>
                <DialogDescription>
                  Detailed information about user's course progress
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">User</h4>
                  <p className="text-sm">{selectedUser.userId.username}</p>
                  <p className="text-sm text-gray-500">{selectedUser.userId.email}</p>
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Course</h4>
                  <p className="text-sm">{selectedUser.courseId.title}</p>
                  <p className="text-sm text-gray-500">ID: {selectedUser.courseId._id}</p>
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Progress</h4>
                  <div className="flex items-center">
                    <Progress value={selectedUser.progress} className="h-2 flex-grow mr-2" />
                    <span className="text-sm font-medium">{selectedUser.progress}%</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Status</h4>
                  <div>{getStatusBadge(selectedUser.status)}</div>
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Time Spent</h4>
                  <p className="text-sm">{selectedUser.completedMinutes} / {selectedUser.totalMinutes} minutes</p>
                  <p className="text-sm text-gray-500">{Math.round((selectedUser.completedMinutes / selectedUser.totalMinutes) * 100)}% of total time</p>
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Last Activity</h4>
                  <p className="text-sm">{selectedUser.lastUpdated ? formatLastAccessed(selectedUser.lastUpdated) : 'Never'}</p>
                  {selectedUser.lastUpdated && (
                    <p className="text-sm text-gray-500">{formatDate(selectedUser.lastUpdated)}</p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Enrollment Date</h4>
                  <p className="text-sm">{selectedUser.createdAt ? formatDate(selectedUser.createdAt) : 'N/A'}</p>
                </div>
                
                {selectedUser.faceSimilarityScore !== undefined && (
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Face Similarity</h4>
                    <div className="flex items-center gap-2">
                      <Progress value={selectedUser.faceSimilarityScore * 100} className="h-2 flex-grow" />
                      <span className="text-sm font-medium">{Math.round(selectedUser.faceSimilarityScore * 100)}%</span>
                    </div>
                    <p className="text-sm text-gray-500">Face detection: {selectedUser.faceNotFound ? 'Failed' : 'Success'}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Activity Summary</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">Time Spent</p>
                          <p className="text-lg font-semibold">{selectedUser.completedMinutes} min</p>
                        </div>
                        <Clock className="h-5 w-5 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">Progress</p>
                          <p className="text-lg font-semibold">{selectedUser.progress}%</p>
                        </div>
                        <Percent className="h-5 w-5 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button onClick={() => setUserDetailsOpen(false)}>Close</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserAccess;