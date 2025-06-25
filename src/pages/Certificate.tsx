// import { useState, useEffect } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { Toaster, toast } from "sonner";
// // import { useNavigate } from "react-router-dom";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Download,
//   FileText,
//   CheckCircle2,
//   XCircle,
//   Search,
//   RefreshCw,
//   FileCheck,
//   FileX2,
//   FileClock,
//   FileBarChart2,
//   FileKey,
//   FileQuestion,
//   FileOutput,
// } from "lucide-react";
// import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { format } from "date-fns";

// // API Base URL
// const baseUrl = import.meta.env.VITE_BACKEND_API;

// interface Certificate {
//   _id: string;
//   userId: string;
//   courseId: {
//     _id: string;
//     title: string;
//   };
//   issueDate: string;
//   verificationCode: string;
//   status: "issued" | "revoked";
//   revokedReason?: string;
//   revokedAt?: string;
//   certificateUrl: string;
// }

// interface Course {
//   _id: string;
//   title: string;
//   progress: number;
// }

// const CertificatePortal = () => {
//   const [certificates, setCertificates] = useState<Certificate[]>([]);
  
//   // Ensure certificates is always an array before rendering
//   const certificatesArray = Array.isArray(certificates) ? certificates : [];
//   const [eligibleCourses, setEligibleCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [verificationCode, setVerificationCode] = useState("");
//   const [verificationResult, setVerificationResult] = useState<{
//     valid: boolean;
//     message: string;
//     certificate?: Certificate;
//   } | null>(null);
//   const [verifying, setVerifying] = useState(false);
//   const [generating, setGenerating] = useState<Record<string, boolean>>({});
//   const [revoking, setRevoking] = useState<Record<string, boolean>>({});
//   // const navigate = useNavigate();

//   // Fetch user's certificates and eligible courses
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const token = Cookies.get("auth_token");
        
//         // Fetch user's certificates
//         const certResponse = await axios.get(`${baseUrl}/certificates/my-certificates`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setCertificates(certResponse.data);
        
//         // Fetch courses where user is eligible for certificate
//         const coursesResponse = await axios.get(`${baseUrl}/course/courses`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
        
//         // For each course, check eligibility
//         const eligible: Course[] = [];
//         for (const course of coursesResponse.data.courses || coursesResponse.data) {
//           try {
//             const eligibilityRes = await axios.get(
//               `${baseUrl}/certificates/eligibility/${course._id}`,
//               { headers: { Authorization: `Bearer ${token}` } }
//             );
            
//             if (eligibilityRes.data.eligible) {
//               eligible.push({
//                 _id: course._id,
//                 title: course.title,
//                 progress: eligibilityRes.data.progress || 0
//               });
//             }
//           } catch (error) {
//             console.error(`Error checking eligibility for course ${course._id}:`, error);
//           }
//         }
        
//         setEligibleCourses(eligible);
//       } catch (error) {
//         console.error("Error fetching certificate data:", error);
//         toast.error("Failed to load certificate information");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const generateCertificate = async (courseId: string) => {
//     setGenerating(prev => ({ ...prev, [courseId]: true }));
//     try {
//       const token = Cookies.get("auth_token");
//       const response = await axios.post(
//         `${baseUrl}/certificates/generate/${courseId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       // Add new certificate to list
//       setCertificates(prev => [...prev, response.data.certificate]);
      
//       // Remove from eligible courses
//       setEligibleCourses(prev => prev.filter(course => course._id !== courseId));
      
//       toast.success("Certificate generated successfully!");
//     } catch (error) {
//       console.error("Error generating certificate:", error);
//       toast.error("Failed to generate certificate");
//     } finally {
//       setGenerating(prev => ({ ...prev, [courseId]: false }));
//     }
//   };

//   const downloadCertificate = async (certificateId: string) => {
//     try {
//       const token = Cookies.get("auth_token");
//       const response = await axios.get(
//         `${baseUrl}/certificates/download/${certificateId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           responseType: "blob"
//         }
//       );
      
//       // Create a blob from the response
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
      
//       // Extract filename from content-disposition header
//       const contentDisposition = response.headers["content-disposition"];
//       let filename = "certificate.pdf";
//       if (contentDisposition) {
//         const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
//         if (filenameMatch && filenameMatch.length > 1) {
//           filename = filenameMatch[1];
//         }
//       }
      
//       link.setAttribute("download", filename);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       console.error("Error downloading certificate:", error);
//       toast.error("Failed to download certificate");
//     }
//   };

//   const verifyCertificate = async () => {
//     if (!verificationCode) {
//       toast.error("Please enter a verification code");
//       return;
//     }
    
//     setVerifying(true);
//     try {
//       const token = Cookies.get("auth_token");
//       const response = await axios.get(
//         `${baseUrl}/certificates/verify/${verificationCode}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       setVerificationResult({
//         valid: true,
//         message: "Certificate is valid and verified",
//         certificate: response.data.certificate
//       });
//       toast.success("Certificate verified successfully!");
//     } catch (error: any) {
//       console.error("Error verifying certificate:", error);
//       setVerificationResult({
//         valid: false,
//         message: error.response?.data?.message || "Invalid or revoked certificate"
//       });
//     } finally {
//       setVerifying(false);
//     }
//   };

//   const revokeCertificate = async (certificateId: string, reason: string) => {
//     if (!reason) {
//       toast.error("Please provide a reason for revocation");
//       return;
//     }
    
//     setRevoking(prev => ({ ...prev, [certificateId]: true }));
//     try {
//       const token = Cookies.get("auth_token");
//       await axios.patch(
//         `${baseUrl}/certificates/revoke/${certificateId}`,
//         { reason },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       // Update certificate status
//       setCertificates(prev => 
//         prev.map(cert => 
//           cert._id === certificateId 
//             ? { 
//                 ...cert, 
//                 status: "revoked", 
//                 revokedReason: reason,
//                 revokedAt: new Date().toISOString()
//               } 
//             : cert
//         )
//       );
      
//       toast.success("Certificate revoked successfully");
//     } catch (error) {
//       console.error("Error revoking certificate:", error);
//       toast.error("Failed to revoke certificate");
//     } finally {
//       setRevoking(prev => ({ ...prev, [certificateId]: false }));
//     }
//   };

//   const refreshData = async () => {
//     setLoading(true);
//     try {
//       const token = Cookies.get("auth_token");
      
//       // Refresh certificates
//       const certResponse = await axios.get(`${baseUrl}/certificates/my-certificates`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setCertificates(certResponse.data);
      
//       toast.success("Data refreshed successfully");
//     } catch (error) {
//       console.error("Error refreshing data:", error);
//       toast.error("Failed to refresh data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "issued":
//         return <Badge className="bg-green-500">Issued</Badge>;
//       case "revoked":
//         return <Badge className="bg-red-500">Revoked</Badge>;
//       default:
//         return <Badge variant="outline">Unknown</Badge>;
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return format(new Date(dateString), "MMM dd, yyyy");
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <Toaster position="top-right" richColors />
      
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Certificate Portal</h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-2">
//             Manage and verify your course completion certificates
//           </p>
//         </div>
//         <Button 
//           onClick={refreshData} 
//           variant="outline" 
//           className="mt-4 md:mt-0"
//           disabled={loading}
//         >
//           <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
//           Refresh Data
//         </Button>
//       </div>

//       <Tabs defaultValue="my-certificates" className="w-full">
//         <TabsList className="grid grid-cols-2 md:grid-cols-3 w-full max-w-2xl">
//           <TabsTrigger value="my-certificates">
//             <FileText className="h-4 w-4 mr-2" />
//             My Certificates
//           </TabsTrigger>
//           <TabsTrigger value="generate">
//             <FileOutput className="h-4 w-4 mr-2" />
//             Generate
//           </TabsTrigger>
//           <TabsTrigger value="verify">
//             <FileCheck className="h-4 w-4 mr-2" />
//             Verify
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="my-certificates">
//           <Card>
//             <CardHeader>
//               <CardTitle>My Certificates</CardTitle>
//               <CardDescription>
//                 Your issued course completion certificates
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               {loading ? (
//                 <div className="flex justify-center items-center h-64">
//                   <RefreshCw className="h-8 w-8 animate-spin" />
//                 </div>
//               ) : certificates.length === 0 ? (
//                 <div className="text-center py-12">
//                   <FileQuestion className="mx-auto h-12 w-12 text-gray-400" />
//                   <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
//                     No certificates yet
//                   </h3>
//                   <p className="mt-2 text-gray-500 dark:text-gray-400">
//                     You haven't generated any certificates yet. Complete a course to get started.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="rounded-md border">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>Course</TableHead>
//                         <TableHead>Status</TableHead>
//                         <TableHead>Issued On</TableHead>
//                         <TableHead>Verification Code</TableHead>
//                         <TableHead>Actions</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {certificatesArray.map((certificate) => (
//                         <TableRow key={certificate._id}>
//                           <TableCell className="font-medium">
//                             {certificate.courseId.title}
//                           </TableCell>
//                           <TableCell>
//                             {getStatusBadge(certificate.status)}
//                           </TableCell>
//                           <TableCell>
//                             {formatDate(certificate.issueDate)}
//                           </TableCell>
//                           <TableCell className="font-mono">
//                             {certificate.verificationCode}
//                           </TableCell>
//                           <TableCell className="flex space-x-2">
//                             <Button
//                               size="sm"
//                               onClick={() => downloadCertificate(certificate._id)}
//                               disabled={certificate.status === "revoked"}
//                             >
//                               <Download className="h-4 w-4 mr-1" />
//                               Download
//                             </Button>
//                             {certificate.status === "issued" && (
//                               <Button
//                                 size="sm"
//                                 variant="destructive"
//                                 onClick={() => {
//                                   const reason = prompt("Enter reason for revocation:");
//                                   if (reason) {
//                                     revokeCertificate(certificate._id, reason);
//                                   }
//                                 }}
//                                 disabled={revoking[certificate._id]}
//                               >
//                                 {revoking[certificate._id] ? (
//                                   <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
//                                 ) : (
//                                   <FileX2 className="h-4 w-4 mr-1" />
//                                 )}
//                                 Revoke
//                               </Button>
//                             )}
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="generate">
//           <Card>
//             <CardHeader>
//               <CardTitle>Generate Certificate</CardTitle>
//               <CardDescription>
//                 Create certificates for courses you've completed
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               {loading ? (
//                 <div className="flex justify-center items-center h-64">
//                   <RefreshCw className="h-8 w-8 animate-spin" />
//                 </div>
//               ) : eligibleCourses.length === 0 ? (
//                 <div className="text-center py-12">
//                   <FileClock className="mx-auto h-12 w-12 text-gray-400" />
//                   <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
//                     No eligible courses
//                   </h3>
//                   <p className="mt-2 text-gray-500 dark:text-gray-400">
//                     You don't have any completed courses eligible for certification yet.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {eligibleCourses.map((course) => (
//                     <div 
//                       key={course._id} 
//                       className="flex items-center justify-between p-4 border rounded-lg"
//                     >
//                       <div>
//                         <h3 className="font-medium">{course.title}</h3>
//                         <div className="flex items-center mt-1">
//                           <Progress 
//                             value={course.progress} 
//                             className="w-40 mr-4" 
//                           />
//                           <span className="text-sm text-gray-500">
//                             {Math.round(course.progress)}% complete
//                           </span>
//                         </div>
//                       </div>
//                       <Button
//                         onClick={() => generateCertificate(course._id)}
//                         disabled={generating[course._id]}
//                       >
//                         {generating[course._id] ? (
//                           <>
//                             <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                             Generating...
//                           </>
//                         ) : (
//                           <>
//                             <FileBarChart2 className="h-4 w-4 mr-2" />
//                             Generate Certificate
//                           </>
//                         )}
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="verify">
//           <Card>
//             <CardHeader>
//               <CardTitle>Verify Certificate</CardTitle>
//               <CardDescription>
//                 Check the validity of a certificate using its verification code
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-6">
//                 <div className="flex items-center space-x-4">
//                   <div className="relative flex-1">
//                     <FileKey className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                     <Input
//                       placeholder="Enter verification code"
//                       className="pl-10"
//                       value={verificationCode}
//                       onChange={(e) => setVerificationCode(e.target.value)}
//                     />
//                   </div>
//                   <Button
//                     onClick={verifyCertificate}
//                     disabled={verifying || !verificationCode}
//                   >
//                     {verifying ? (
//                       <>
//                         <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                         Verifying...
//                       </>
//                     ) : (
//                       <>
//                         <Search className="h-4 w-4 mr-2" />
//                         Verify
//                       </>
//                     )}
//                   </Button>
//                 </div>

//                 {verificationResult && (
//                   <Alert className={verificationResult.valid ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300" : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300"}>
//                     {verificationResult.valid ? (
//                       <CheckCircle2 className="h-4 w-4" />
//                     ) : (
//                       <XCircle className="h-4 w-4" />
//                     )}
//                     <AlertTitle>
//                       {verificationResult.valid ? "Valid Certificate" : "Invalid Certificate"}
//                     </AlertTitle>
//                     <AlertDescription>
//                       {verificationResult.message}
//                     </AlertDescription>
//                   </Alert>
//                 )}

//                 {verificationResult?.valid && verificationResult.certificate && (
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Certificate Details</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <p className="text-sm text-gray-500">Course</p>
//                           <p className="font-medium">{verificationResult.certificate.courseId.title}</p>
//                         </div>
//                         <div>
//                           <p className="text-sm text-gray-500">Issued On</p>
//                           <p className="font-medium">
//                             {formatDate(verificationResult.certificate.issueDate)}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-sm text-gray-500">Status</p>
//                           <p className="font-medium">
//                             {getStatusBadge(verificationResult.certificate.status)}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-sm text-gray-500">Verification Code</p>
//                           <p className="font-mono font-medium">
//                             {verificationResult.certificate.verificationCode}
//                           </p>
//                         </div>
//                       </div>
//                     </CardContent>
//                     <CardFooter>
//                       <Button
//                         onClick={() => downloadCertificate(verificationResult.certificate!._id)}
//                         disabled={verificationResult.certificate.status === "revoked"}
//                       >
//                         <Download className="h-4 w-4 mr-2" />
//                         Download Certificate
//                       </Button>
//                     </CardFooter>
//                   </Card>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default CertificatePortal;
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Toaster, toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import {
  Download,
  FileText,
  CheckCircle2,
  XCircle,
  Search, // Using Search for general verification input field icon
  RefreshCw,
  FileCheck,
  FileX2,
  FileClock,
  FileBarChart2,
  FileKey,
  FileQuestion,
  FileOutput,
} from "lucide-react";

// API Base URL
const baseUrl = import.meta.env.VITE_BACKEND_API;

interface Certificate {
  _id: string;
  userId: string;
  courseId: {
    _id: string;
    title: string;
  };
  issueDate: string;
  verificationCode: string;
  status: "issued" | "revoked";
  revokedReason?: string;
  revokedAt?: string;
  certificateUrl: string;
}

interface Course {
  _id: string;
  title: string;
  description: string; // Add description if your course object includes it
  progress: number;
}

const CertificatePortal = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [eligibleCourses, setEligibleCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    message: string;
    certificate?: Certificate;
  } | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [generating, setGenerating] = useState<Record<string, boolean>>({});
  const [revoking, setRevoking] = useState<Record<string, boolean>>({});
  const [revokeReason, setRevokeReason] = useState<Record<string, string>>({});
  const certificatesArray = Array.isArray(certificates) ? certificates : [];


  // Fetch user's certificates and eligible courses
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("auth_token");
        
        // --- Fetch User's Certificates ---
        const certResponse = await axios.get(`${baseUrl}/certificates/my-certificates`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCertificates(certResponse.data || []);
        
        // --- Determine Eligible Courses for Certificate Generation ---
        // Fetch ALL courses (or courses the user is enrolled in, if you have such an endpoint)
        // I am using `/course/courses` as a generic endpoint to get all courses.
        // If you have `GET /api/enrollment/my-courses` use that instead.
        const allCoursesResponse = await axios.get(`${baseUrl}/course/courses`, { 
            headers: { Authorization: `Bearer ${token}` } 
        });
        const allCourses = allCoursesResponse.data.courses || allCoursesResponse.data; // Adjust based on your API response structure

        const eligible: Course[] = [];
        for (const course of allCourses) {
          try {
            // Check eligibility for each course
            const eligibilityRes = await axios.get(
              `${baseUrl}/certificates/eligibility/${course._id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (eligibilityRes.data.eligible) {
              // Add course with its current progress and eligibility status
              eligible.push({
                _id: course._id,
                title: course.title,
                description: course.description, // Include description if available from /course/courses endpoint
                progress: eligibilityRes.data.progress || 0 // Progress from eligibility endpoint
              });
            }
          } catch (error) {
            // Log error but don't stop the whole process
            console.error(`Error checking eligibility for course ${course._id}:`, error);
          }
        }
        
        setEligibleCourses(eligible);
      } catch (error) {
        console.error("Error fetching certificate data:", error);
        toast.error("Failed to load certificate information");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  const generateCertificate = async (courseId: string) => {
    setGenerating(prev => ({ ...prev, [courseId]: true }));
    try {
      const token = Cookies.get("auth_token");
      const response = await axios.post(
        `${baseUrl}/certificates/generate/${courseId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Add new certificate to list
      setCertificates(prev => [...prev, response.data.certificate]);
      
      // Remove from eligible courses
      setEligibleCourses(prev => prev.filter(course => course._id !== courseId));
      
      toast.success("Certificate generated successfully!");
    } catch (error: any) {
      console.error("Error generating certificate:", error);
      toast.error(error.response?.data?.message || "Failed to generate certificate");
    } finally {
      setGenerating(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const downloadCertificate = async (certificateId: string) => {
    try {
      const token = Cookies.get("auth_token");
      const response = await axios.get(
        `${baseUrl}/certificates/download/${certificateId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob"
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      
      const contentDisposition = response.headers["content-disposition"];
      let filename = "certificate.pdf";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast.error("Failed to download certificate");
    }
  };

  const verifyCertificate = async () => {
    if (!verificationCode) {
      toast.error("Please enter a verification code");
      return;
    }
    
    setVerifying(true);
    try {
      // No auth token for public verification endpoint if implemented that way, but keeping for consistency
      const token = Cookies.get("auth_token");
      const response = await axios.get(
        `${baseUrl}/certificates/verify/${verificationCode}`,
        { headers: { Authorization: `Bearer ${token}` } } // Only if endpoint requires auth
      );
      
      setVerificationResult({
        valid: true,
        message: "Certificate is valid and verified",
        certificate: response.data.certificate
      });
      toast.success("Certificate verified successfully!");
    } catch (error: any) {
      console.error("Error verifying certificate:", error);
      setVerificationResult({
        valid: false,
        message: error.response?.data?.message || "Invalid or revoked certificate"
      });
    } finally {
      setVerifying(false);
    }
  };

  const revokeCertificate = async (certificateId: string) => {
    const reason = revokeReason[certificateId];
    if (!reason) {
      toast.error("Please provide a reason for revocation");
      return;
    }
    
    setRevoking(prev => ({ ...prev, [certificateId]: true }));
    try {
      const token = Cookies.get("auth_token");
      await axios.patch(
        `${baseUrl}/certificates/revoke/${certificateId}`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update certificate status locally
      setCertificates(prev => 
        prev.map(cert => 
          cert._id === certificateId 
            ? { 
                ...cert, 
                status: "revoked", 
                revokedReason: reason,
                revokedAt: new Date().toISOString()
              } 
            : cert
        )
      );
      
      // Clear the reason input
      setRevokeReason(prev => {
        const newReasons = { ...prev };
        delete newReasons[certificateId];
        return newReasons;
      });
      
      toast.success("Certificate revoked successfully");
    } catch (error) {
      console.error("Error revoking certificate:", error);
      toast.error("Failed to revoke certificate");
    } finally {
      setRevoking(prev => ({ ...prev, [certificateId]: false }));
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("auth_token");
      
      // Refresh certificates
      const certResponse = await axios.get(`${baseUrl}/certificates/my-certificates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCertificates(certResponse.data || []);
      
      // Refresh eligible courses - re-run the full eligibility check
      const allCoursesResponse = await axios.get(`${baseUrl}/course/courses`, { // Or /api/enrollment/my-courses
          headers: { Authorization: `Bearer ${token}` } 
      });
      const allCourses = allCoursesResponse.data.courses || allCoursesResponse.data;

      const eligible: Course[] = [];
      for (const course of allCourses) {
        try {
          const eligibilityRes = await axios.get(
            `${baseUrl}/certificates/eligibility/${course._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          if (eligibilityRes.data.eligible) {
            eligible.push({
              _id: course._id,
              title: course.title,
              description: course.description,
              progress: eligibilityRes.data.progress || 0
            });
          }
        } catch (error) {
          console.error(`Error checking eligibility for course ${course._id}:`, error);
        }
      }
      setEligibleCourses(eligible);
      
      toast.success("Data refreshed successfully");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "issued":
        return <Badge className="bg-green-500">Issued</Badge>;
      case "revoked":
        return <Badge className="bg-red-500">Revoked</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  return (
    <div className="container mx-auto p-6">
      <Toaster position="top-right" richColors />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Certificate Portal</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and verify your course completion certificates
          </p>
        </div>
        <Button 
          onClick={refreshData} 
          variant="outline" 
          className="mt-4 md:mt-0"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      <Tabs defaultValue="my-certificates" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 w-full max-w-2xl">
          <TabsTrigger value="my-certificates">
            <FileText className="h-4 w-4 mr-2" />
            My Certificates
          </TabsTrigger>
          <TabsTrigger value="generate">
            <FileOutput className="h-4 w-4 mr-2" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="verify">
            <FileCheck className="h-4 w-4 mr-2" />
            Verify
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-certificates">
          <Card>
            <CardHeader>
              <CardTitle>My Certificates</CardTitle>
              <CardDescription>
                Your issued course completion certificates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <RefreshCw className="h-8 w-8 animate-spin" />
                </div>
              ) : certificates.length === 0 ? (
                <div className="text-center py-12">
                  <FileQuestion className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                    No certificates yet
                  </h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    You haven't generated any certificates yet. Complete a course to get started.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Issued On</TableHead>
                        <TableHead>Verification Code</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                        {certificatesArray.map((certificate) => (
                        <TableRow key={certificate._id}>
                          <TableCell className="font-medium">
                          {certificate.courseId.title}
                          </TableCell>
                          <TableCell>
                          {getStatusBadge(certificate.status)}
                          </TableCell>
                          <TableCell>
                          {formatDate(certificate.issueDate)}
                          </TableCell>
                          <TableCell className="font-mono">
                          {certificate.verificationCode}
                          </TableCell>
                          <TableCell className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => downloadCertificate(certificate._id)}
                            disabled={certificate.status === "revoked"}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          {certificate.status === "issued" && (
                            <div className="flex items-center space-x-2">
                            <Input
                              placeholder="Revocation reason"
                              value={revokeReason[certificate._id] || ""}
                              onChange={(e) => setRevokeReason(prev => ({
                              ...prev,
                              [certificate._id]: e.target.value
                              }))}
                              className="w-40"
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => revokeCertificate(certificate._id)}
                              disabled={revoking[certificate._id] || !revokeReason[certificate._id]}
                            >
                              {revoking[certificate._id] ? (
                              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                              ) : (
                              <FileX2 className="h-4 w-4 mr-1" />
                              )}
                              Revoke
                            </Button>
                            </div>
                          )}
                          </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Generate Certificate</CardTitle>
              <CardDescription>
                Create certificates for courses you've completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <RefreshCw className="h-8 w-8 animate-spin" />
                </div>
              ) : eligibleCourses.length === 0 ? (
                <div className="text-center py-12">
                  <FileClock className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                    No eligible courses
                  </h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    You don't have any completed courses eligible for certification yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {eligibleCourses.map((course) => (
                    <div 
                      key={course._id} 
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{course.title}</h3>
                        <div className="flex items-center mt-1">
                          <Progress 
                            value={course.progress} 
                            className="w-40 mr-4" 
                          />
                          <span className="text-sm text-gray-500">
                            {Math.round(course.progress)}% complete
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => generateCertificate(course._id)}
                        disabled={generating[course._id]}
                      >
                        {generating[course._id] ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <FileBarChart2 className="h-4 w-4 mr-2" />
                            Generate Certificate
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verify">
          <Card>
            <CardHeader>
              <CardTitle>Verify Certificate</CardTitle>
              <CardDescription>
                Check the validity of a certificate using its verification code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <FileKey className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Enter verification code"
                      className="pl-10"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={verifyCertificate}
                    disabled={verifying || !verificationCode}
                  >
                    {verifying ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Verify
                      </>
                    )}
                  </Button>
                </div>

                {verificationResult && (
                  <Alert className={verificationResult.valid ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300" : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300"}>
                    {verificationResult.valid ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    <AlertTitle>
                      {verificationResult.valid ? "Valid Certificate" : "Invalid Certificate"}
                    </AlertTitle>
                    <AlertDescription>
                      {verificationResult.message}
                    </AlertDescription>
                  </Alert>
                )}

                {verificationResult?.valid && verificationResult.certificate && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Certificate Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Course</p>
                          <p className="font-medium">{verificationResult.certificate.courseId.title}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Issued On</p>
                          <p className="font-medium">
                            {formatDate(verificationResult.certificate.issueDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <p className="font-medium">
                            {getStatusBadge(verificationResult.certificate.status)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Verification Code</p>
                          <p className="font-mono font-medium">
                            {verificationResult.certificate.verificationCode}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={() => downloadCertificate(verificationResult.certificate!._id)}
                        disabled={verificationResult.certificate.status === "revoked"}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Certificate
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CertificatePortal;