import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Lucide React icons
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Clock,
  Video,
  Book,
  AlertCircle,
  Loader2,
  RefreshCw,
  Eye,
  Upload,
  Save,
  FileVideo,
  CheckCircle,
  Copy,
  Check,
  Image as ImageIcon, // Renamed to avoid conflict with HTML ImageElement
} from "lucide-react";

// Types
interface VideoFile {
  file: File;
  url: string;
}

interface VideoInfo {
  title: string;
  description: string;
  url: string;
  duration: number;
  _id?: string;
}

interface Section {
  sectionTitle: string;
  videos: VideoInfo[];
  _id?: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  sections: Section[];
  totalMinutes: number;
  updatedAt?: string;
  thumbnailUrl?: string; // Added thumbnailUrl to Course interface
}

interface UploadedVideo {
  originalName: string;
  url: string;
  key: string;
}

// API Base URL
const API_BASE_URL = import.meta.env.VITE_BACKEND_API;

export default function CourseManagement() {
  const navigate = useNavigate();

  // Course list state
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<"course-list" | "course-form" | "video-upload">(
    "course-list"
  );

  // Edit mode
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [videoUploadTargetSectionIndex, setVideoUploadTargetSectionIndex] = useState<number | null>(null);

  // Course form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formSections, setFormSections] = useState<Section[]>([
    { sectionTitle: "", videos: [] },
  ]);
  // Thumbnail states
  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState<string | null>(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);


  // Video upload state
  const [selectedFiles, setSelectedFiles] = useState<VideoFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    setLoading(true);
    try {
      const token = Cookies.get("auth_token");
      const res = await axios.get(`${API_BASE_URL}/course/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.courses ?? []);
      setError(null);
    } catch (e) {
      console.error(e);
      setError("Failed loading courses");
    } finally {
      setLoading(false);
    }
  }

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const files = Array.from(e.target.files)
      .filter((f) => f.type.startsWith("video/"))
      .map((file) => ({ file, url: URL.createObjectURL(file) }));
    setSelectedFiles((prev) => [...prev, ...files]);
  }

  function removeSelectedFile(idx: number) {
    URL.revokeObjectURL(selectedFiles[idx].url);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedUrl(text);
      toast.success("URL copied to clipboard");
      setTimeout(() => setCopiedUrl(null), 2000);
    });
  }

  function addVideoToForm(uploadedVideo: UploadedVideo) {
    if (videoUploadTargetSectionIndex === null) {
      toast.error("Please select a section first");
      return;
    }

    setFormSections((prevSections) => {
      const sectionsCopy = [...prevSections];
      const targetSection = sectionsCopy[videoUploadTargetSectionIndex];
      
      if (targetSection) {
        targetSection.videos.push({
          title: uploadedVideo.originalName.replace(/\.[^/.]+$/, ""),
          description: "",
          url: uploadedVideo.url,
          duration: 0,
        });
      }
      
      return sectionsCopy;
    });

    toast.success(`Video added to ${formSections[videoUploadTargetSectionIndex]?.sectionTitle || `Section ${videoUploadTargetSectionIndex + 1}`}`);
  }

  async function uploadVideos() {
    if (!selectedFiles.length) {
      toast.error("Please select videos first");
      return;
    }

    setUploading(true);
    try {
      const token = Cookies.get("auth_token");
      const form = new FormData();
      
      // Append files with proper field names
      selectedFiles.forEach(({ file }) => {
        form.append("videos", file);
      });

      const res = await axios.post(`${API_BASE_URL}/course/upload-videos`, form, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          "Content-Type": "multipart/form-data" 
        },
      });

      // Handle the specific response format
      if (res.data && res.data.uploadedVideos) {
        const newUploadedVideos = res.data.uploadedVideos as UploadedVideo[];
        setUploadedVideos((prev) => [...prev, ...newUploadedVideos]);
        
        // Automatically add to section if section is selected
        if (videoUploadTargetSectionIndex !== null) {
          setFormSections((prevSections) => {
            const sectionsCopy = [...prevSections];
            const targetSection = sectionsCopy[videoUploadTargetSectionIndex];
            
            if (targetSection) {
              newUploadedVideos.forEach(video => {
                targetSection.videos.push({
                  title: video.originalName.replace(/\.[^/.]+$/, ""),
                  description: "",
                  url: video.url,
                  duration: 0,
                });
              });
            }
            
            return sectionsCopy;
          });
          
          toast.success(`${newUploadedVideos.length} videos uploaded and added to section`);
        } else {
          toast.success(`${newUploadedVideos.length} videos uploaded successfully`);
        }

        // Clean up
        selectedFiles.forEach((f) => URL.revokeObjectURL(f.url));
        setSelectedFiles([]);
      } else {
        toast.error("Upload succeeded but response format was unexpected");
      }
    } catch (e: any) {
      console.error("Video upload error:", e);
      toast.error(e.response?.data?.message || "Failed to upload videos");
    } finally {
      setUploading(false);
    }
  }

  // New: Thumbnail Upload Logic
  function handleThumbnailSelect(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedThumbnailFile(file);
      if (thumbnailPreviewUrl) {
        URL.revokeObjectURL(thumbnailPreviewUrl); // Clean up previous preview
      }
      setThumbnailPreviewUrl(URL.createObjectURL(file));
      setUploadedThumbnailUrl(null); // Clear previously uploaded URL if new file selected
    } else {
      setSelectedThumbnailFile(null);
      if (thumbnailPreviewUrl) {
        URL.revokeObjectURL(thumbnailPreviewUrl);
      }
      setThumbnailPreviewUrl(null);
    }
  }

  async function uploadThumbnail() {
    if (!selectedThumbnailFile) {
      toast.error("Please select a thumbnail file first.");
      return;
    }

    setUploadingThumbnail(true);
    try {
      const token = Cookies.get("auth_token");
      const formData = new FormData();
      formData.append("thumbnail", selectedThumbnailFile); // Assuming backend expects 'thumbnail' field

      const res = await axios.post(`${API_BASE_URL}/course/upload-thumbnail`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // FIX: Correctly extract thumbnailUrl from the response
      if (res.data && res.data.thumbnailUrl) { 
        setUploadedThumbnailUrl(res.data.thumbnailUrl); // Use res.data.thumbnailUrl
        toast.success("Thumbnail uploaded successfully!");
        setSelectedThumbnailFile(null); // Clear selected file after upload
        if (thumbnailPreviewUrl) {
          URL.revokeObjectURL(thumbnailPreviewUrl); // Clean up preview URL
        }
        setThumbnailPreviewUrl(null);
      } else {
        toast.error("Thumbnail upload succeeded but response format was unexpected. Missing 'thumbnailUrl'.");
        console.error("Unexpected thumbnail upload response:", res.data);
      }
    } catch (e: any) {
      console.error("Thumbnail upload error:", e);
      toast.error(e.response?.data?.message || "Failed to upload thumbnail.");
    } finally {
      setUploadingThumbnail(false);
    }
  }

  function clearThumbnail() {
    setSelectedThumbnailFile(null);
    if (thumbnailPreviewUrl) {
      URL.revokeObjectURL(thumbnailPreviewUrl);
    }
    setThumbnailPreviewUrl(null);
    setUploadedThumbnailUrl(null);
  }
  // End New: Thumbnail Upload Logic


  function addSection() {
    setFormSections((prev) => [...prev, { sectionTitle: "", videos: [] }]);
  }

  function removeSection(idx: number) {
    if (formSections.length <= 1) {
      toast.error("At least one section is required");
      return;
    }
    setFormSections((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateSectionTitle(idx: number, title: string) {
    setFormSections((prev) => {
      const copy = [...prev];
      copy[idx].sectionTitle = title;
      return copy;
    });
  }

  function addVideoToSection(idx: number) {
    setFormSections((prev) => {
      const copy = [...prev];
      copy[idx].videos.push({ title: "", description: "", url: "", duration: 0 });
      return copy;
    });
  }

  function removeVideoFromSection(secIdx: number, vidIdx: number) {
    setFormSections((prev) => {
      const copy = [...prev];
      copy[secIdx].videos.splice(vidIdx, 1);
      return copy;
    });
  }

  function updateVideo(
    secIdx: number,
    vidIdx: number,
    field: keyof VideoInfo,
    value: string | number
  ) {
    setFormSections((prev) => {
      const copy = [...prev];
      (copy[secIdx].videos[vidIdx] as any)[field] = value;
      return copy;
    });
  }

  async function handleSubmitCourse(e: FormEvent) {
    e.preventDefault();
    const token = Cookies.get("auth_token");
    if (!token) {
      toast.error("Authentication token missing");
      return;
    }

    if (!formTitle.trim() || !formDescription.trim()) {
      toast.error("Please fill in title and description");
      return;
    }

    // Validate sections
    for (let i = 0; i < formSections.length; i++) {
      if (!formSections[i].sectionTitle.trim()) {
        toast.error(`Section ${i + 1} title is required`);
        return;
      }
    }

    // Calculate total minutes
    const totalMinutes = formSections.reduce((total, section) => {
      return total + section.videos.reduce((sectionTotal, video) => {
        return sectionTotal + (video.duration || 0);
      }, 0);
    }, 0);

    try {
      const courseData = {
        title: formTitle,
        description: formDescription,
        price: parseFloat(formPrice) || 0,
        sections: formSections,
        totalMinutes,
        thumbnailUrl: uploadedThumbnailUrl || editingCourse?.thumbnailUrl || undefined, // Include thumbnail URL
      };


      if (isEditing && editingCourse) {
        await axios.put(
          `${API_BASE_URL}/course/${editingCourse._id}`,
          courseData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Course updated successfully");
      } else {
        await axios.post(
          `${API_BASE_URL}/course/create`,
          courseData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Course created successfully");
      }

      fetchCourses();
      resetForm();
      setActiveTab("course-list");
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.message || "Failed to save course");
    }
  }

  function editCourse(courseId: string) {
    const c = courses.find((c) => c._id === courseId);
    if (!c) return;
    setEditingCourse(c);
    setIsEditing(true);
    setFormTitle(c.title);
    setFormDescription(c.description);
    setFormPrice(String(c.price));
    setUploadedThumbnailUrl(c.thumbnailUrl || null); // Set thumbnail URL when editing
    // Ensure existing thumbnailUrl is displayed, clearing any temporary preview
    if (c.thumbnailUrl) {
      setThumbnailPreviewUrl(null); 
      setSelectedThumbnailFile(null);
    }
    // Deep copy to avoid reference issues
    setFormSections(JSON.parse(JSON.stringify(c.sections)));
    setActiveTab("course-form");
  }

  async function deleteCourse(courseId: string) {
    try {
      const token = Cookies.get("auth_token");
      await axios.delete(`${API_BASE_URL}/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Course deleted successfully");
      fetchCourses();
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.message || "Failed to delete course");
    }
  }

  function resetForm() {
    setFormTitle("");
    setFormDescription("");
    setFormPrice("");
    setFormSections([{ sectionTitle: "", videos: [] }]);
    setEditingCourse(null);
    setIsEditing(false);
    setVideoUploadTargetSectionIndex(null);
    clearThumbnail(); // Also clear thumbnail states
  }

  function calculateTotalVideos(course: Course) {
    return course.sections.reduce((sum, s) => sum + s.videos.length, 0);
  }


  return (
    <div className="container mx-auto py-8 px-4">
      <Toaster position="top-right" richColors />
      <h1 className="text-3xl font-bold mb-6">Course Management</h1>

      <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as "course-list" | "course-form" | "video-upload")} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="course-list">Course List</TabsTrigger>
          <TabsTrigger value="course-form">{isEditing ? "Edit Course" : "Create Course"}</TabsTrigger>
          <TabsTrigger value="video-upload">Upload Videos</TabsTrigger>
        </TabsList>

        {/* Course List Tab */}
        <TabsContent value="course-list">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent>
                    <Skeleton className="h-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg flex items-center">
              <AlertCircle className="mr-2" />
              {error}
            </div>
          ) : (
            <>
                <div className="flex justify-between mb-4 text-blue-600">
                <Button onClick={fetchCourses} variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-100">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
                <Badge variant="outline" className="border-blue-600 text-blue-600">
                  {courses.length} Courses
                </Badge>
                <Button onClick={() => { resetForm(); setActiveTab("course-form"); }} className="bg-blue-600 text-white hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  New Course
                </Button>
                </div>
              {courses.length === 0 ? (
                <Card className="p-6 text-center">
                  <Book className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p>No courses found.</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {courses.map((c) => (
                    <Card key={c._id}>
                      <CardHeader>
                        <div className="flex justify-between">
                          <CardTitle>{c.title}</CardTitle>
                            <Badge variant="outline" className="border-blue-600 text-blue-600">₹{c.price}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-2">{c.description}</p>
                        {c.thumbnailUrl && (
                          <div className="mb-2">
                            <img src={c.thumbnailUrl} alt="Course Thumbnail" className="w-32 h-auto rounded-md object-cover" />
                          </div>
                        )}
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="mr-1 h-4 w-4" />
                            {c.totalMinutes} mins
                          </div>
                          <div className="flex items-center">
                            <Video className="mr-1 h-4 w-4" />
                            {calculateTotalVideos(c)} videos
                          </div>
                          <div className="flex items-center">
                            <Book className="mr-1 h-4 w-4" />
                            {c.sections.length} sections
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/course/${c._id}`)}>
                          <Eye className="mr-1 h-4 w-4" />
                          Preview
                        </Button>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => editCourse(c._id)}>
                            <Pencil className="mr-1 h-4 w-4" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="mr-1 h-4 w-4" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{c.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteCourse(c._id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Course Form Tab */}
        <TabsContent value="course-form">
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? "Edit Course" : "Create Course"}</CardTitle>
              <CardDescription>
                {isEditing ? "Update your course details" : "Fill in the details to create a new course"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitCourse} className="space-y-6">
                {/* Basic Course Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Course Title</Label>
                    <Input 
                      id="title" 
                      value={formTitle} 
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="Enter course title"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Course Description</Label>
                  <Textarea
                    id="description"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={4}
                    placeholder="Enter course description"
                    required
                  />
                </div>

                <Separator />
                
                {/* Course Thumbnail */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Course Thumbnail</h3>
                  <div className="flex items-center gap-4">
                    {(thumbnailPreviewUrl || uploadedThumbnailUrl) && (
                      <div className="relative w-32 h-32 flex-shrink-0">
                        <img 
                          src={thumbnailPreviewUrl || uploadedThumbnailUrl || undefined} 
                          alt="Thumbnail Preview" 
                          className="w-full h-full object-cover rounded-md border" 
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={clearThumbnail}
                          disabled={uploadingThumbnail}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="thumbnail-file">Select Thumbnail Image</Label>
                      <Input
                        id="thumbnail-file"
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailSelect}
                        disabled={uploadingThumbnail}
                      />
                      <Button
                        type="button"
                        onClick={uploadThumbnail}
                        disabled={!selectedThumbnailFile || uploadingThumbnail}
                        className="w-full"
                      >
                        {uploadingThumbnail ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Upload Thumbnail
                          </>
                        )}
                      </Button>
                      {uploadedThumbnailUrl && (
                        <div className="mt-2 text-sm text-muted-foreground flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                          <span className="truncate flex-1">Uploaded: {uploadedThumbnailUrl}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(uploadedThumbnailUrl)}
                            className="ml-2"
                          >
                            {copiedUrl === uploadedThumbnailUrl ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Sections */}
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Course Sections</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addSection}>
                    <Plus className="mr-1 h-4 w-4" />
                    Add Section
                  </Button>
                </div>

                <Accordion type="multiple" className="w-full">
                  {formSections.map((section, sectionIdx) => (
                    <AccordionItem key={sectionIdx} value={`section-${sectionIdx}`} className="border mb-4">
                      <AccordionTrigger className="px-4">
                        <div className="flex justify-between w-full items-center">
                          <span>{section.sectionTitle || `Section ${sectionIdx + 1}`}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{section.videos.length} videos</Badge>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeSection(sectionIdx);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="p-4">
                        <div className="mb-4">
                          <Label htmlFor={`section-title-${sectionIdx}`}>Section Title</Label>
                          <Input
                            id={`section-title-${sectionIdx}`}
                            value={section.sectionTitle}
                            onChange={(e) => updateSectionTitle(sectionIdx, e.target.value)}
                            placeholder="Enter section title"
                            required
                          />
                        </div>

                        <div className="flex justify-between items-center mb-4">
                          <span className="font-medium">Videos</span>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addVideoToSection(sectionIdx)}
                            >
                              <FileVideo className="mr-1 h-4 w-4" />
                              Add Video
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setVideoUploadTargetSectionIndex(sectionIdx);
                                setActiveTab("video-upload");
                              }}
                            >
                              <Upload className="mr-1 h-4 w-4" />
                              Upload Videos
                            </Button>
                          </div>
                        </div>

                        {section.videos.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No videos added to this section</p>
                        ) : (
                          <div className="space-y-4">
                            {section.videos.map((video, videoIdx) => (
                              <Card key={videoIdx} className="bg-accent/10">
                                <CardHeader className="pb-2">
                                  <div className="flex justify-between items-center">
                                    <CardTitle className="text-base">Video {videoIdx + 1}</CardTitle>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeVideoFromSection(sectionIdx, videoIdx)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor={`video-title-${sectionIdx}-${videoIdx}`}>Video Title</Label>
                                      <Input
                                        id={`video-title-${sectionIdx}-${videoIdx}`}
                                        value={video.title}
                                        onChange={(e) =>
                                          updateVideo(sectionIdx, videoIdx, "title", e.target.value)
                                        }
                                        placeholder="Enter video title"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor={`video-duration-${sectionIdx}-${videoIdx}`}>Duration (minutes)</Label>
                                      <Input
                                        id={`video-duration-${sectionIdx}-${videoIdx}`}
                                        type="number"
                                        min="1"
                                        value={video.duration}
                                        onChange={(e) =>
                                          updateVideo(sectionIdx, videoIdx, "duration", parseInt(e.target.value) || 0)
                                        }
                                        placeholder="Duration in minutes"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor={`video-desc-${sectionIdx}-${videoIdx}`}>Video Description</Label>
                                    <Textarea
                                      id={`video-desc-${sectionIdx}-${videoIdx}`}
                                      value={video.description}
                                      onChange={(e) =>
                                        updateVideo(sectionIdx, videoIdx, "description", e.target.value)
                                      }
                                      rows={2}
                                      placeholder="Enter video description"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`video-url-${sectionIdx}-${videoIdx}`}>Video URL</Label>
                                    <div className="flex">
                                      <Input
                                        id={`video-url-${sectionIdx}-${videoIdx}`}
                                        value={video.url}
                                        onChange={(e) =>
                                          updateVideo(sectionIdx, videoIdx, "url", e.target.value)
                                        }
                                        placeholder="Enter video URL"
                                        className="flex-1"
                                      />
                                      <Button 
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="ml-2"
                                        onClick={() => copyToClipboard(video.url)}
                                      >
                                        {copiedUrl === video.url ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                      </Button>
                                    </div>
                                    {video.url && (
                                      <div className="flex items-center mt-2 text-sm text-green-600">
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Video URL is set
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700" size="lg">
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? "Update Course" : "Create Course"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Video Upload Tab */}
        <TabsContent value="video-upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Video Files</CardTitle>
              <CardDescription>
                Upload videos and automatically add them to your course sections.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Section Selection */}
              <div className="mb-6">
                <Label htmlFor="video-section-select" className="block mb-2 font-medium">
                  Target Section
                </Label>
                <select
                  id="video-section-select"
                  className="w-full border rounded-md p-2"
                  value={videoUploadTargetSectionIndex !== null ? videoUploadTargetSectionIndex : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setVideoUploadTargetSectionIndex(value ? parseInt(value) : null);
                  }}
                >
                  <option value="">Select a section to add videos to</option>
                  {formSections.map((sec, index) => (
                    <option key={index} value={index}>
                      {sec.sectionTitle || `Section ${index + 1}`}
                    </option>
                  ))}
                </select>
                {videoUploadTargetSectionIndex !== null && (
                  <p className="text-sm text-green-600 mt-1">
                    Videos will be added to: {formSections[videoUploadTargetSectionIndex]?.sectionTitle || `Section ${videoUploadTargetSectionIndex + 1}`}
                  </p>
                )}
              </div>

              {/* File Selection */}
              <div className="mb-4">
                <Label htmlFor="video-files" className="block mb-2 font-medium">
                  Select Video Files
                </Label>
                <input
                  id="video-files"
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleFileSelect}
                  className="block w-full text-sm border rounded-md p-2"
                />
                              </div>

              {/* Selected Files Preview */}
              {selectedFiles.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Selected Files ({selectedFiles.length}):</h4>
                  <ScrollArea className="h-40 border rounded-md">
                    <div className="p-2 space-y-2">
                      {selectedFiles.map((f, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-muted p-2 rounded">
                          <span className="truncate mr-2">{f.file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSelectedFile(idx)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* Upload Actions */}
                <div className="flex gap-4">
                <Button
                  onClick={uploadVideos}
                  disabled={uploading || selectedFiles.length === 0}
                  size="lg"
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                >
                  {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                  ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Videos
                  </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("course-form")}
                >
                  Back to Course
                </Button>
              </div>

              {/* Uploaded Videos List */}
              {uploadedVideos.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Uploaded Videos</h3>
                  <div className="space-y-3">
                    {uploadedVideos.map((video, idx) => (
                      <Card key={idx} className="bg-accent/5">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{video.originalName}</h4>
                              <div className="flex items-center mt-1">
                                <div className="flex-1 relative group">
                                  <Input 
                                    value={video.url} 
                                    readOnly
                                    className="pr-10 text-sm text-muted-foreground bg-muted"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full"
                                    onClick={() => copyToClipboard(video.url)}
                                  >
                                    {copiedUrl === video.url ? (
                                      <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div className="flex mt-2 md:mt-0 md:ml-4 gap-2">
                              <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </a>
                              {videoUploadTargetSectionIndex !== null && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => addVideoToForm(video)}
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add to Section
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Select a target section where videos will be added</li>
                  <li>• Choose one or multiple video files</li>
                  <li>• Click "Upload Videos" to upload files to the server</li>
                  <li>• Videos will automatically be added to the selected section</li>
                  <li>• You can also manually add uploaded videos to different sections</li>
                  <li>• Copy the URL to use it elsewhere</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}