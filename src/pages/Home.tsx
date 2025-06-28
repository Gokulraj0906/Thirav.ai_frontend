// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Card, 
//   CardContent, 
//   CardDescription, 
//   CardFooter, 
//   CardHeader, 
//   CardTitle 
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { 
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious
// } from "@/components/ui/carousel";
// import { 
//   ChevronRight, 
//   BookOpen, 
//   Code, 
//   Camera, 
//   Briefcase, 
//   Star, 
//   ArrowRight,
//   Shield,
//   Brain,
//   LockKeyhole,
//   Users,
//   Award,
//   Zap
// } from "lucide-react";

// // Sample course data
// const featuredCourses = [
//   {
//     id: 1,
//     title: "Advanced Machine Learning",
//     description: "Master ML algorithms, neural networks, and practical implementations",
//     price: 89.99,
//     instructor: "Dr. Jane Smith",
//     rating: 4.8,
//     students: 3241,
//     image: "https://editor.analyticsvidhya.com/uploads/70332https___specials-images.forbesimg.com_dam_imageserve_966248982_960x0.jpg",
//     category: "AI & Data Science"
//   },
//   {
//     id: 2,
//     title: "Full-Stack Web Development",
//     description: "Build responsive, secure web applications from scratch",
//     price: 94.99,
//     instructor: "Michael Johnson",
//     rating: 4.7,
//     students: 2187,
//     image: "https://www.keycdn.com/img/support/full-stack-development.png",
//     category: "Development"
//   },
//   {
//     id: 3,
//     title: "UI/UX Design Masterclass",
//     description: "Create intuitive user experiences and beautiful interfaces",
//     price: 79.99,
//     instructor: "Sarah Williams",
//     rating: 4.9,
//     students: 1954,
//     image: "https://s3-alpha.figma.com/hub/file/2942566861/7e3aaade-4be8-47a8-aa6c-fe6f0c220316-cover.png",
//     category: "Design"
//   },
//   {
//     id: 4,
//     title: "Business Leadership & Management",
//     description: "Develop essential leadership skills for the modern workplace",
//     price: 69.99,
//     instructor: "Alex Rodriguez",
//     rating: 4.6,
//     students: 2788,
//     image: "https://www.alphaacademy.org/wp-content/uploads/2020/07/39-Business-Leadership-Management-Training-Masterclass.jpg",
//     category: "Business"
//   },
// ];

// // Testimonials data
// const testimonials = [
//   {
//     id: 1,
//     name: "Mark Thompson",
//     role: "Software Engineer",
//     image: "/images/testimonial1.jpg",
//     text: "The face verification feature is brilliant! It ensures I'm fully present during lessons and helps me stay focused. The AI-powered progress tracking has dramatically improved my learning habits."
//   },
//   {
//     id: 2,
//     name: "Sophia Lee",
//     role: "UX Designer",
//     image: "/images/testimonial2.jpg",
//     text: "As someone who values honest learning, I appreciate how Thirav.ai maintains academic integrity. The seamless UI and smart course recommendations have helped me discover courses I wouldn't have found otherwise."
//   },
//   {
//     id: 3,
//     name: "David Chen",
//     role: "Data Scientist",
//     image: "/images/testimonial3.jpg",
//     text: "The anti-cheating system creates a level playing field for all learners. I've completed three AI certifications through Thirav.ai, and potential employers appreciate knowing my credentials are legitimate."
//   }
// ];

// // Categories
// const categories = [
//   { name: "AI & Data Science", icon: <Brain className="h-5 w-5" /> },
//   { name: "Development", icon: <Code className="h-5 w-5" /> },
//   { name: "Design", icon: <Camera className="h-5 w-5" /> },
//   { name: "Business", icon: <Briefcase className="h-5 w-5" /> },
// ];

// // Featured instructors
// const instructors = [
//   {
//     id: 1,
//     name: "Dr. Elena Patel",
//     expertise: "AI & Machine Learning",
//     image: "/images/instructor1.jpg",
//     courses: 12,
//     students: 8750
//   },
//   {
//     id: 2,
//     name: "Prof. James Wilson",
//     expertise: "Data Science",
//     image: "/images/instructor2.jpg",
//     courses: 8,
//     students: 6420
//   },
//   {
//     id: 3,
//     name: "Maya Rodriguez",
//     expertise: "UX/UI Design",
//     image: "/images/instructor3.jpg",
//     courses: 10,
//     students: 5890
//   },
//   {
//     id: 4,
//     name: "Dr. Robert Chen",
//     expertise: "Business Leadership",
//     image: "/images/instructor4.jpg",
//     courses: 7,
//     students: 4320
//   }
// ];

// // FAQ items
// const faqItems = [
//   {
//     question: "How does the face verification system work?",
//     answer: "Our AI-powered face verification technology validates your identity at the beginning of each learning session and periodically checks for your presence during video lessons. This ensures only authorized users access course content and maintains academic integrity."
//   },
//   {
//     question: "Is my facial data secure?",
//     answer: "Absolutely. We use end-to-end encryption for all facial data, which is processed locally first and then securely stored. We never share your biometric data with third parties, and you can delete your data at any time."
//   },
//   {
//     question: "What happens if I need to step away during a lesson?",
//     answer: "The system understands brief absences. If you step away for a short time, you'll receive a notification. Only extended absences will pause your progress, which you can resume once you return."
//   },
//   {
//     question: "Can I access courses on multiple devices?",
//     answer: "Yes! Thirav.ai works on laptops, tablets, and smartphones. Your learning progress syncs across all your devices, and our face verification works on any device with a camera."
//   }
// ];

// // Platform statistics
// const platformStats = {
//   courses: 350,
//   students: 68500,
//   instructors: 124,
//   hoursWatched: 1250000
// };

// export default function HomePage() {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [currentLearners, setCurrentLearners] = useState(423);

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };
    
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Simulate real-time learners count
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const change = Math.floor(Math.random() * 11) - 5; // Random number between -5 and 5
//       setCurrentLearners(prev => Math.max(380, Math.min(520, prev + change)));
//     }, 8000);
    
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
//       {/* Navigation */}
//       <header className={`sticky top-0 z-50 transition-all duration-300 ${
//         isScrolled 
//           ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm" 
//           : "bg-transparent"
//       }`}>
//         <div className="container mx-auto px-4 py-3 flex items-center justify-between">
//           <div className="flex items-center">
//             <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Thirav.ai</h1>
//           </div>
          
//           <nav className="hidden md:flex items-center space-x-8">
//             <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Home</a>
//             <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Courses</a>
//             <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Instructors</a>
//             <a href="#" className="text-sm font-medium hover:text-primary transition-colors">About</a>
//           </nav>
          
//           <div className="flex items-center space-x-4">
//            <a href="/auth"> <Button variant="outline" size="sm">Login</Button></a>
//             <a href="/auth"><Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">Sign up</Button></a>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10 dark:opacity-20"></div>
        
//         {/* Animated background elements (optional) */}
//         <div className="absolute inset-0 overflow-hidden">
//           <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-400 mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
//           <div className="absolute top-40 right-10 w-72 h-72 rounded-full bg-purple-400 mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
//           <div className="absolute -bottom-8 left-1/3 w-60 h-60 rounded-full bg-indigo-400 mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
//         </div>
        
//         <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
//           <div className="flex flex-col md:flex-row items-center">
//             <div className="md:w-1/2 mb-12 md:mb-0">
//               <Badge className="mb-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1">AI-Powered Learning</Badge>
//               <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
//                 Secure Learning with <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Face AI</span> Technology
//               </h1>
//               <p className="text-xl md:text-2xl mb-8 text-slate-600 dark:text-slate-300">
//                 The next generation learning platform with face verification and AI-powered progress tracking
//               </p>
              
//               <div className="flex flex-col sm:flex-row gap-4 mb-8">
//                 <Button size="lg" className="h-12 px-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
//                   <span>Get Started</span>
//                   <ChevronRight className="ml-2 h-4 w-4" />
//                 </Button>
//                 <Button size="lg" variant="outline" className="h-12 px-8 rounded-full">
//                   <span>See AI in Action</span>
//                 </Button>
//               </div>
              
//               <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
//                 <Shield className="h-4 w-4 mr-2" />
//                 <span>Secure. Private. Trusted by {platformStats.students.toLocaleString()}+ students</span>
//               </div>
//             </div>
            
//             <div className="md:w-1/2 flex justify-center">
//               <div className="relative w-full max-w-md">
//                 <img 
//                   src="https://i.pinimg.com/originals/60/0c/c2/600cc2360f66593bac3ade33e5040051.jpg" 
//                   alt="AI Face Verification" 
//                   className="rounded-xl shadow-2xl"
//                 />
//                 <div className="absolute -bottom-4 -right-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-3">
//                   <div className="flex items-center text-sm">
//                     <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
//                     <span className="font-medium">{currentLearners} learners online now</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Stats banner */}
//         <div className="bg-white dark:bg-slate-800 py-6 shadow-md relative z-10">
//           <div className="container mx-auto px-4">
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
//               <div>
//                 <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{platformStats.courses}+</p>
//                 <p className="text-sm text-slate-500 dark:text-slate-400">Courses</p>
//               </div>
//               <div>
//                 <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{platformStats.students.toLocaleString()}+</p>
//                 <p className="text-sm text-slate-500 dark:text-slate-400">Students</p>
//               </div>
//               <div>
//                 <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{platformStats.instructors}+</p>
//                 <p className="text-sm text-slate-500 dark:text-slate-400">Instructors</p>
//               </div>
//               <div>
//                 <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{Math.floor(platformStats.hoursWatched/1000)}k+</p>
//                 <p className="text-sm text-slate-500 dark:text-slate-400">Hours Watched</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* AI Features Section */}
//       <section className="py-20 bg-white dark:bg-slate-800">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-16">
//             <Badge className="mb-4">Revolutionary</Badge>
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered Learning Features</h2>
//             <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
//               Experience the future of online education with our advanced AI technologies
//             </p>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
//             <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
//               <CardHeader className="pb-0">
//                 <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
//                   <LockKeyhole className="h-6 w-6 text-blue-500 dark:text-blue-400" />
//                 </div>
//                 <CardTitle>Face Authentication</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-slate-500 dark:text-slate-400">
//                   Our advanced facial recognition technology ensures only authorized users access course content, 
//                   maintaining the integrity of your learning experience.
//                 </p>
//               </CardContent>
//               <CardFooter>
//                 <Button variant="ghost" className="text-blue-500 hover:text-blue-700 p-0">
//                   Learn more <ChevronRight className="h-4 w-4 ml-1" />
//                 </Button>
//               </CardFooter>
//             </Card>
            
//             <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
//               <CardHeader className="pb-0">
//                 <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
//                   <Brain className="h-6 w-6 text-purple-500 dark:text-purple-400" />
//                 </div>
//                 <CardTitle>Smart Progress Tracking</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-slate-500 dark:text-slate-400">
//                   AI monitors your learning patterns and validates your presence during video lessons, 
//                   ensuring genuine progress and knowledge retention.
//                 </p>
//               </CardContent>
//               <CardFooter>
//                 <Button variant="ghost" className="text-purple-500 hover:text-purple-700 p-0">
//                   Learn more <ChevronRight className="h-4 w-4 ml-1" />
//                 </Button>
//               </CardFooter>
//             </Card>
            
//             <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
//               <CardHeader className="pb-0">
//                 <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-4">
//                   <Shield className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
//                 </div>
//                 <CardTitle>Anti-Cheating System</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-slate-500 dark:text-slate-400">
//                   Our innovative system detects face mismatches and validates learner presence, 
//                   resetting progress when integrity is compromised.
//                 </p>
//               </CardContent>
//               <CardFooter>
//                 <Button variant="ghost" className="text-indigo-500 hover:text-indigo-700 p-0">
//                   Learn more <ChevronRight className="h-4 w-4 ml-1" />
//                 </Button>
//               </CardFooter>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* Face Authentication Preview */}
//       <section className="py-20 bg-slate-50 dark:bg-slate-900">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-col md:flex-row items-center gap-12">
//             <div className="md:w-1/2">
//               <Badge className="mb-4">Cutting-Edge</Badge>
//               <h2 className="text-3xl font-bold mb-6">Face Authentication Preview</h2>
//               <p className="text-slate-600 dark:text-slate-300 mb-6">
//                 Our proprietary face verification technology ensures that only you can access your courses and 
//                 tracks your presence during video lessons for genuine progress.
//               </p>
              
//               <div className="space-y-4">
//                 <div className="flex items-start">
//                   <div className="mt-1 mr-4 flex-shrink-0 h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
//                     <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                     </svg>
//                   </div>
//                   <div>
//                     <h3 className="font-medium">Secure Verification</h3>
//                     <p className="text-sm text-slate-500 dark:text-slate-400">
//                       Fast, encrypted biometric matching with privacy protection
//                     </p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-start">
//                   <div className="mt-1 mr-4 flex-shrink-0 h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
//                     <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                     </svg>
//                   </div>
//                   <div>
//                     <h3 className="font-medium">Presence Validation</h3>
//                     <p className="text-sm text-slate-500 dark:text-slate-400">
//                       Ensures you're present and engaged during critical learning segments
//                     </p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-start">
//                   <div className="mt-1 mr-4 flex-shrink-0 h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
//                     <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                     </svg>
//                   </div>
//                   <div>
//                     <h3 className="font-medium">Credential Integrity</h3>
//                     <p className="text-sm text-slate-500 dark:text-slate-400">
//                       Validates that certificates are earned by the registered student
//                     </p>
//                   </div>
//                 </div>
//               </div>
              
//               <Button className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
//                 See AI in Action
//               </Button>
//             </div>
            
//             <div className="md:w-1/2 relative">
//               <img 
//                 src="https://www.algoface.ai/wp-content/uploads/2022/07/ML-techniques-2.jpg" 
//                 alt="Face Authentication Demo" 
//                 className="rounded-xl shadow-2xl w-full"
//               />
//               <div className="absolute -bottom-5 -left-5 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 animate-pulse">
//                 <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
//                   Verification Successful
//                 </Badge>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Categories Section */}
//       <section className="py-16 bg-white dark:bg-slate-800">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold mb-4">Explore Categories</h2>
//             <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
//               Discover courses in various fields taught by industry experts
//             </p>
//           </div>
          
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {categories.map((category) => (
//               <Card key={category.name} className="group cursor-pointer hover:shadow-md transition-all border-none">
//                 <CardContent className="flex flex-col items-center justify-center p-6">
//                   <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
//                     {category.icon}
//                   </div>
//                   <h3 className="font-semibold text-lg">{category.name}</h3>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Featured Courses */}
//       <section className="py-16 bg-slate-50 dark:bg-slate-900" id="courses">
//         <div className="container mx-auto px-4">
//           <div className="flex justify-between items-center mb-12">
//             <div>
//               <Badge className="mb-2">Top Rated</Badge>
//               <h2 className="text-3xl font-bold mb-2">Featured Courses</h2>
//               <p className="text-slate-500 dark:text-slate-400">
//                 Popular courses with AI-verified completion certificates
//               </p>
//             </div>
            
//             <Button variant="outline" className="hidden md:flex">
//               View All Courses <ArrowRight className="ml-2 h-4 w-4" />
//             </Button>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {featuredCourses.map((course) => (
//               <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-all border-none">
//                 <div className="aspect-video relative overflow-hidden">
//                   <img 
//                     src={course.image} 
//                     alt={course.title}
//                     className="object-cover w-full h-full transition-transform hover:scale-105"
//                   />
//                   <Badge className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
//                     {course.category}
//                   </Badge>
//                   <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center">
//                     <Shield className="h-3 w-3 mr-1" />
//                     <span>AI Verified</span>
//                   </div>
//                 </div>
//                 <CardHeader className="p-4 pb-2">
//                   <CardTitle className="text-lg">{course.title}</CardTitle>
//                   <CardDescription className="line-clamp-2">
//                     {course.description}
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="p-4 pt-0">
//                   <div className="flex items-center mb-3">
//                     <Avatar className="h-6 w-6 mr-2">
//                       <AvatarFallback>{course.instructor.charAt(0)}</AvatarFallback>
//                     </Avatar>
//                     <span className="text-sm text-slate-500 dark:text-slate-400">
//                       {course.instructor}
//                     </span>
//                   </div>
//                   <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
//                     <div className="flex items-center mr-4">
//                       <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
//                       <span>{course.rating}</span>
//                     </div>
//                     <div>{course.students.toLocaleString()} students</div>
//                   </div>
//                 </CardContent>
//                 <CardFooter className="p-4 pt-0 flex justify-between items-center">
//                   <span className="font-bold text-lg">₹{course.price}</span>
//                   <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
//                     Enroll Now
//                   </Button>
//                 </CardFooter>
//               </Card>
//             ))}
//           </div>
          
//           <div className="mt-8 text-center md:hidden">
//             <Button variant="outline">View All Courses</Button>
//           </div>
//         </div>
//       </section>

//       {/* Smart Learning Progress Tracker */}
//       <section className="py-20 bg-white dark:bg-slate-800">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-col md:flex-row-reverse items-center gap-12">
//             <div className="md:w-1/2">
//               <Badge className="mb-4">Intelligent</Badge>
//               <h2 className="text-3xl font-bold mb-6">Smart Learning Progress Tracker</h2>
//               <p className="text-slate-600 dark:text-slate-300 mb-6">
//                 Our AI-powered progress tracking system ensures genuine learning by monitoring your 
//                 presence and engagement during video lessons.
//               </p>
              
//               <div className="space-y-4">
//                 <div className="flex items-start">
//                   <div className="mt-1 mr-4 flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
//                     <Zap className="h-4 w-4 text-purple-500" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium">Real-time Monitoring</h3>
//                     <p className="text-sm text-slate-500 dark:text-slate-400">
//                       Tracks your learning in real-time with facial presence validation
//                     </p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-start">
//                   <div className="mt-1 mr-4 flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
//                     <Zap className="h-4 w-4 text-purple-500" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium">Adaptive Learning</h3>
//                     <p className="text-sm text-slate-500 dark:text-slate-400">
//                       Adjusts content difficulty based on your engagement and mastery
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <div className="mt-1 mr-4 flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
//                     <Zap className="h-4 w-4 text-purple-500" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium">Intelligent Recommendations</h3>
//                     <p className="text-sm text-slate-500 dark:text-slate-400">
//                       AI suggests personalized courses based on your learning history and goals
//                     </p>
//                   </div>
//                 </div>
//               </div>
              
//               <Button className="mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
//                 View Progress Analytics
//               </Button>
//             </div>
            
//             <div className="md:w-1/2 relative">
//               <img 
//                 src="https://static.vecteezy.com/system/resources/thumbnails/021/030/038/original/4k-project-tracking-or-goal-tracker-animation-businessman-project-manager-holding-big-pencil-to-check-completed-tasks-in-project-management-timeline-free-video.jpg" 
//                 alt="AI Progress Tracking" 
//                 className="rounded-xl shadow-2xl w-full"
//               />
//               <div className="absolute -top-5 -right-5 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-purple-600">87%</div>
//                   <div className="text-xs text-slate-500 dark:text-slate-400">Course Progress</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Featured Instructors */}
//       <section className="py-16 bg-slate-50 dark:bg-slate-900">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <Badge className="mb-4">Expert Faculty</Badge>
//             <h2 className="text-3xl font-bold mb-4">Learn from Industry Leaders</h2>
//             <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
//               World-class instructors with verified credentials and proven track records
//             </p>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {instructors.map((instructor) => (
//               <Card key={instructor.id} className="border-none shadow-md hover:shadow-lg transition-all">
//                 <CardContent className="p-6 text-center">
//                   <Avatar className="h-20 w-20 mx-auto mb-4">
//                     <AvatarImage src={instructor.image} alt={instructor.name} />
//                     <AvatarFallback>{instructor.name.charAt(0)}</AvatarFallback>
//                   </Avatar>
//                   <h3 className="font-semibold text-lg mb-1">{instructor.name}</h3>
//                   <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{instructor.expertise}</p>
//                   <div className="flex justify-center gap-4 text-sm">
//                     <div className="text-center">
//                       <div className="font-semibold">{instructor.courses}</div>
//                       <div className="text-slate-500 dark:text-slate-400">Courses</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="font-semibold">{instructor.students.toLocaleString()}</div>
//                       <div className="text-slate-500 dark:text-slate-400">Students</div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Testimonials Section */}
//       <section className="py-20 bg-white dark:bg-slate-800">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-16">
//             <Badge className="mb-4">Success Stories</Badge>
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Students Say</h2>
//             <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
//               Real feedback from learners who've experienced the power of AI-verified education
//             </p>
//           </div>
          
//           <Carousel className="max-w-4xl mx-auto">
//             <CarouselContent>
//               {testimonials.map((testimonial) => (
//                 <CarouselItem key={testimonial.id}>
//                   <Card className="border-none shadow-lg">
//                     <CardContent className="p-8 text-center">
//                       <div className="mb-6">
//                         <div className="flex justify-center mb-4">
//                           {[...Array(5)].map((_, i) => (
//                             <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
//                           ))}
//                         </div>
//                         <blockquote className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
//                           "{testimonial.text}"
//                         </blockquote>
//                       </div>
//                       <div className="flex items-center justify-center">
//                         <Avatar className="h-12 w-12 mr-4">
//                           <AvatarImage src={testimonial.image} alt={testimonial.name} />
//                           <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
//                         </Avatar>
//                         <div className="text-left">
//                           <div className="font-semibold">{testimonial.name}</div>
//                           <div className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </CarouselItem>
//               ))}
//             </CarouselContent>
//             <CarouselPrevious />
//             <CarouselNext />
//           </Carousel>
//         </div>
//       </section>

//       {/* FAQ Section */}
//     <section className="py-20 bg-slate-50 dark:bg-slate-900">
//     <div className="container mx-auto px-4">
//         <div className="text-center mb-16">
//         <Badge className="mb-4">Common Questions</Badge>
//         <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
//         <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
//             Everything you need to know about our AI-powered learning platform
//         </p>
//         </div>
        
//         <div className="max-w-3xl mx-auto">
//         {faqItems.map((item, index) => (
//             <div key={index} className="mb-4">
//             <details className="group bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
//                 <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
//                 <h3 className="font-medium text-lg">{item.question}</h3>
//                 <div className="ml-4 flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full p-1 group-open:rotate-180 transition-transform duration-300">
//                     <ChevronRight className="h-5 w-5" />
//                 </div>
//                 </summary>
//                 <div className="px-6 pb-6 pt-2 text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-700">
//                 <p>{item.answer}</p>
                
//                 {index === 0 && ( // Add a visualization for the first FAQ about face verification
//                     <div className="mt-4 flex items-center justify-center">
//                     <div className="w-full max-w-md bg-slate-100 dark:bg-slate-700 p-3 rounded-lg flex items-center gap-4">
//                         <div className="relative h-16 w-16 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-600 flex-shrink-0">
//                         <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Face Authentication Demo" className="h-full w-full object-cover" />
//                         <div className="absolute inset-0 border-2 border-green-500 rounded-full animate-pulse opacity-60"></div>
//                         </div>
//                         <div className="flex-1">
//                         <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-2 w-3/4"></div>
//                         <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded-full mb-2"></div>
//                         <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded-full mb-2 w-2/3"></div>
//                         <div className="flex gap-2">
//                             <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Verified</Badge>
//                             <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Secure</Badge>
//                         </div>
//                         </div>
//                     </div>
//                     </div>
//                 )}
                
//                 {index === 1 && ( // Add a visualization for the data security FAQ
//                     <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
//                     <div className="flex items-center gap-2 mb-2">
//                         <Shield className="h-5 w-5 text-blue-500" />
//                         <span className="font-medium text-blue-700 dark:text-blue-300">Data Protection Features</span>
//                     </div>
//                     <ul className="grid grid-cols-2 gap-2 text-sm">
//                         <li className="flex items-center gap-1">
//                         <div className="h-2 w-2 rounded-full bg-blue-500"></div>
//                         <span>End-to-end encryption</span>
//                         </li>
//                         <li className="flex items-center gap-1">
//                         <div className="h-2 w-2 rounded-full bg-blue-500"></div>
//                         <span>Local processing</span>
//                         </li>
//                         <li className="flex items-center gap-1">
//                         <div className="h-2 w-2 rounded-full bg-blue-500"></div>
//                         <span>Zero data sharing</span>
//                         </li>
//                         <li className="flex items-center gap-1">
//                         <div className="h-2 w-2 rounded-full bg-blue-500"></div>
//                         <span>Data deletion options</span>
//                         </li>
//                     </ul>
//                     </div>
//                 )}
                
//                 {index === 2 && ( // Add a visualization for the absence detection FAQ
//                     <div className="mt-4 flex justify-center">
//                     <div className="flex flex-col items-center max-w-xs">
//                         <div className="relative">
//                         <div className="h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center mb-2 border-2 border-dashed border-orange-400 animate-pulse">
//                             <svg className="h-8 w-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                             </svg>
//                         </div>
//                         <div className="absolute -right-1 top-0 h-3 w-3 rounded-full bg-orange-500"></div>
//                         </div>
//                         <div className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-md text-orange-800 dark:text-orange-200 text-xs mb-2">
//                         Brief absence detected
//                         </div>
//                         <div className="flex gap-2">
//                         <div className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs">
//                             Pause
//                         </div>
//                         <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs">
//                             Continue
//                         </div>
//                         </div>
//                     </div>
//                     </div>
//                 )}
                
//                 {index === 3 && ( // Add a visualization for cross-device compatibility
//                     <div className="mt-4 flex justify-center">
//                     <div className="grid grid-cols-3 gap-4 text-center">
//                         <div className="flex flex-col items-center">
//                         <div className="h-12 w-12 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-2">
//                             <svg className="h-8 w-8 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                             </svg>
//                         </div>
//                         <div className="text-xs">Laptop</div>
//                         </div>
//                         <div className="flex flex-col items-center">
//                         <div className="h-12 w-12 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-2">
//                             <svg className="h-8 w-8 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
//                             </svg>
//                         </div>
//                         <div className="text-xs">Tablet</div>
//                         </div>
//                         <div className="flex flex-col items-center">
//                         <div className="h-12 w-12 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-2">
//                             <svg className="h-8 w-8 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
//                             </svg>
//                         </div>
//                         <div className="text-xs">Mobile</div>
//                         </div>
//                     </div>
//                     </div>
//                 )}
//                 </div>
//             </details>
//             </div>
//         ))}
//         </div>
    
//         <div className="mt-12 text-center">
//         <p className="text-slate-500 dark:text-slate-400 mb-4">Still have questions? We're here to help.</p>
//         <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
//             Contact Support
//         </Button>
//         </div>
//     </div>
//     </section>

//       {/* CTA Section */}
//       <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
//         <div className="container mx-auto px-4 text-center">
//           <div className="max-w-3xl mx-auto">
//             <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
//               Ready to Experience AI-Powered Learning?
//             </h2>
//             <p className="text-xl text-blue-100 mb-8">
//               Join thousands of students who trust Thirav.ai for secure, verified online education
//             </p>
            
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Button size="lg" className="h-12 px-8 rounded-full bg-white text-blue-600 hover:bg-blue-50">
//                 Start Learning Today
//               </Button>
//               <Button size="lg" variant="outline" className="h-12 px-8 rounded-full border-white text-blue-500 hover:bg-white hover:text-blue-600">
//                 Try Face Verification Demo
//               </Button>
//             </div>
            
//             <div className="mt-8 flex items-center justify-center text-blue-100 text-sm">
//               <Shield className="h-4 w-4 mr-2" />
//               <span>30-day money-back guarantee • No credit card required</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-slate-900 text-white py-16">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             <div className="md:col-span-2">
//               <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
//                 Thirav.ai
//               </h3>
//               <p className="text-slate-300 mb-6 max-w-md">
//                 The next generation learning platform with face verification technology, 
//                 ensuring secure and authentic online education.
//               </p>
//               <div className="flex space-x-4">
//                 <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
//                   <Users className="h-4 w-4" />
//                 </Button>
//                 <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
//                   <BookOpen className="h-4 w-4" />
//                 </Button>
//                 <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
//                   <Award className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
            
//             <div>
//               <h4 className="font-semibold mb-4">Platform</h4>
//               <ul className="space-y-2 text-slate-300">
//                 <li><a href="#" className="hover:text-white transition-colors">Browse Courses</a></li>
//                 <li><a href="#" className="hover:text-white transition-colors">AI Features</a></li>
//                 <li><a href="#" className="hover:text-white transition-colors">Instructors</a></li>
//                 <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
//               </ul>
//             </div>
            
//             <div>
//               <h4 className="font-semibold mb-4">Support</h4>
//               <ul className="space-y-2 text-slate-300">
//                 <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
//                 <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
//                 <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
//                 <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
//               </ul>
//             </div>
//           </div>
          
//           <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400">
//             <p>&copy; {new Date().getFullYear()} Thirav.ai By Aurelion Future Forge. All rights reserved. Secured by AI face verification technology.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );

// }
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { 
  ChevronRight, 
  BookOpen, 
  Code, 
  Camera, 
  Briefcase, 
  Star, 
  ArrowRight,
  Shield,
  Brain,
  LockKeyhole,
  Users,
  Award,
  Zap
} from "lucide-react";

// Sample course data
const featuredCourses = [
  {
    id: 1,
    title: "Advanced Machine Learning",
    description: "Master ML algorithms, neural networks, and practical implementations",
    price: 89.99,
    instructor: "Dr. Jane Smith",
    rating: 4.8,
    students: 3241,
    image: "https://editor.analyticsvidhya.com/uploads/70332https___specials-images.forbesimg.com_dam_imageserve_966248982_960x0.jpg",
    category: "AI & Data Science"
  },
  {
    id: 2,
    title: "Full-Stack Web Development",
    description: "Build responsive, secure web applications from scratch",
    price: 94.99,
    instructor: "Michael Johnson",
    rating: 4.7,
    students: 2187,
    image: "https://www.keycdn.com/img/support/full-stack-development.png",
    category: "Development"
  },
  {
    id: 3,
    title: "UI/UX Design Masterclass",
    description: "Create intuitive user experiences and beautiful interfaces",
    price: 79.99,
    instructor: "Sarah Williams",
    rating: 4.9,
    students: 1954,
    image: "https://s3-alpha.figma.com/hub/file/2942566861/7e3aaade-4be8-47a8-aa6c-fe6f0c220316-cover.png",
    category: "Design"
  },
  {
    id: 4,
    title: "Business Leadership & Management",
    description: "Develop essential leadership skills for the modern workplace",
    price: 69.99,
    instructor: "Alex Rodriguez",
    rating: 4.6,
    students: 2788,
    image: "https://www.alphaacademy.org/wp-content/uploads/2020/07/39-Business-Leadership-Management-Training-Masterclass.jpg",
    category: "Business"
  },
];

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: "Mark Thompson",
    role: "Software Engineer",
    image: "/images/testimonial1.jpg",
    text: "The face verification feature is brilliant! It ensures I'm fully present during lessons and helps me stay focused. The AI-powered progress tracking has dramatically improved my learning habits."
  },
  {
    id: 2,
    name: "Sophia Lee",
    role: "UX Designer",
    image: "/images/testimonial2.jpg",
    text: "As someone who values honest learning, I appreciate how Thirav.ai maintains academic integrity. The seamless UI and smart course recommendations have helped me discover courses I wouldn't have found otherwise."
  },
  {
    id: 3,
    name: "David Chen",
    role: "Data Scientist",
    image: "/images/testimonial3.jpg",
    text: "The anti-cheating system creates a level playing field for all learners. I've completed three AI certifications through Thirav.ai, and potential employers appreciate knowing my credentials are legitimate."
  }
];

// Categories
const categories = [
  { name: "AI & Data Science", icon: <Brain className="h-5 w-5" /> },
  { name: "Development", icon: <Code className="h-5 w-5" /> },
  { name: "Design", icon: <Camera className="h-5 w-5" /> },
  { name: "Business", icon: <Briefcase className="h-5 w-5" /> },
];

// Featured instructors
const instructors = [
  {
    id: 1,
    name: "Dr. Elena Patel",
    expertise: "AI & Machine Learning",
    image: "/images/instructor1.jpg",
    courses: 12,
    students: 8750
  },
  {
    id: 2,
    name: "Prof. James Wilson",
    expertise: "Data Science",
    image: "/images/instructor2.jpg",
    courses: 8,
    students: 6420
  },
  {
    id: 3,
    name: "Maya Rodriguez",
    expertise: "UX/UI Design",
    image: "/images/instructor3.jpg",
    courses: 10,
    students: 5890
  },
  {
    id: 4,
    name: "Dr. Robert Chen",
    expertise: "Business Leadership",
    image: "/images/instructor4.jpg",
    courses: 7,
    students: 4320
  }
];

// FAQ items
const faqItems = [
  {
    question: "How does the face verification system work?",
    answer: "Our AI-powered face verification technology validates your identity at the beginning of each learning session and periodically checks for your presence during video lessons. This ensures only authorized users access course content and maintains academic integrity."
  },
  {
    question: "Is my facial data secure?",
    answer: "Absolutely. We use end-to-end encryption for all facial data, which is processed locally first and then securely stored. We never share your biometric data with third parties, and you can delete your data at any time."
  },
  {
    question: "What happens if I need to step away during a lesson?",
    answer: "The system understands brief absences. If you step away for a short time, you'll receive a notification. Only extended absences will pause your progress, which you can resume once you return."
  },
  {
    question: "Can I access courses on multiple devices?",
    answer: "Yes! Thirav.ai works on laptops, tablets, and smartphones. Your learning progress syncs across all your devices, and our face verification works on any device with a camera."
  }
];

// Platform statistics
const platformStats = {
  courses: 350,
  students: 68500,
  instructors: 124,
  hoursWatched: 1250000
};

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentLearners, setCurrentLearners] = useState(423);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Simulate real-time learners count
  useEffect(() => {
    const interval = setInterval(() => {
      const change = Math.floor(Math.random() * 11) - 5; // Random number between -5 and 5
      setCurrentLearners(prev => Math.max(380, Math.min(520, prev + change)));
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-900 dark:to-blue-800">
      {/* Navigation */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/90 dark:bg-blue-900/90 backdrop-blur-sm shadow-sm" 
          : "bg-transparent"
      }`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex flex-col items-start">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-black to-black bg-clip-text text-transparent">Thirav.<span className="text-blue-500">ai</span></h1>
            <span className="text-blue-500 text-sm mt-1">by Aurelion Future Forge</span>
            </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-sm font-medium hover:text-blue-600 transition-colors">Home</a>
            <a href="#courses" className="text-sm font-medium hover:text-blue-600 transition-colors">Courses</a>
            <a href="#instructors" className="text-sm font-medium hover:text-blue-600 transition-colors">Instructors</a>
            <a href="#about" className="text-sm font-medium hover:text-blue-600 transition-colors">About</a>
          </nav>
          
          <div className="flex items-center space-x-4">
           <a href="/auth"> <Button variant="outline" size="sm">Login</Button></a>
            <a href="/auth"><Button size="sm" className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800">Sign up</Button></a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 opacity-10 dark:opacity-20"></div>
        
        {/* Animated background elements (optional) */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-400 mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 rounded-full bg-blue-300 mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-60 h-60 rounded-full bg-blue-400 mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <Badge className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1">AI-Powered Learning</Badge>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Secure Learning with <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">Face AI</span> Technology
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-slate-600 dark:text-slate-300">
                The next generation learning platform with face verification and AI-powered progress tracking
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="h-12 px-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800">
                  <span>Get Started</span>
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 rounded-full">
                  <span>See AI in Action</span>
                </Button>
              </div>
              
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                <Shield className="h-4 w-4 mr-2" />
                <span>Secure. Private. Trusted by {platformStats.students.toLocaleString()}+ students</span>
              </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <img 
                  src="https://i.pinimg.com/originals/60/0c/c2/600cc2360f66593bac3ade33e5040051.jpg" 
                  alt="AI Face Verification" 
                  className="rounded-xl shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-white dark:bg-blue-800 rounded-lg shadow-lg p-3">
                  <div className="flex items-center text-sm">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="font-medium">{currentLearners} learners online now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats banner */}
        <div className="bg-white dark:bg-blue-800 py-6 shadow-md relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">{platformStats.courses}+</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Courses</p>
              </div>
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">{platformStats.students.toLocaleString()}+</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Students</p>
              </div>
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">{platformStats.instructors}+</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Instructors</p>
              </div>
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">{Math.floor(platformStats.hoursWatched/1000)}k+</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Hours Watched</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-20 bg-white dark:bg-blue-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Revolutionary</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered Learning Features</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Experience the future of online education with our advanced AI technologies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-0">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                  <LockKeyhole className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Face Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500 dark:text-slate-400">
                  Our advanced facial recognition technology ensures only authorized users access course content, 
                  maintaining the integrity of your learning experience.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="text-blue-600 hover:text-blue-800 p-0">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-0">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Smart Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500 dark:text-slate-400">
                  AI monitors your learning patterns and validates your presence during video lessons, 
                  ensuring genuine progress and knowledge retention.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="text-blue-600 hover:text-blue-800 p-0">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-0">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Anti-Cheating System</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500 dark:text-slate-400">
                  Our innovative system detects face mismatches and validates learner presence, 
                  resetting progress when integrity is compromised.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="text-blue-600 hover:text-blue-800 p-0">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Face Authentication Preview */}
      <section className="py-20 bg-blue-50 dark:bg-blue-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <Badge className="mb-4">Cutting-Edge</Badge>
              <h2 className="text-3xl font-bold mb-6">Face Authentication Preview</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Our proprietary face verification technology ensures that only you can access your courses and 
                tracks your presence during video lessons for genuine progress.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mt-1 mr-4 flex-shrink-0 h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Secure Verification</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Fast, encrypted biometric matching with privacy protection
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 mr-4 flex-shrink-0 h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Presence Validation</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Ensures you're present and engaged during critical learning segments
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 mr-4 flex-shrink-0 h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Credential Integrity</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Validates that certificates are earned by the registered student
                    </p>
                  </div>
                </div>
              </div>
              
              <Button className="mt-8 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800">
                See AI in Action
              </Button>
            </div>
            
            <div className="md:w-1/2 relative">
              <img 
                src="https://www.algoface.ai/wp-content/uploads/2022/07/ML-techniques-2.jpg" 
                alt="Face Authentication Demo" 
                className="rounded-xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-5 -left-5 bg-white dark:bg-blue-800 rounded-lg shadow-lg p-4 animate-pulse">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Verification Successful
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white dark:bg-blue-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explore Categories</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Discover courses in various fields taught by industry experts
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card key={category.name} className="group cursor-pointer hover:shadow-md transition-all border-none">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-blue-50 dark:bg-blue-900" id="courses">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <Badge className="mb-2">Top Rated</Badge>
              <h2 className="text-3xl font-bold mb-2">Featured Courses</h2>
              <p className="text-slate-500 dark:text-slate-400">
                Popular courses with AI-verified completion certificates
              </p>
            </div>
            
            <Button variant="outline" className="hidden md:flex">
              View All Courses <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-all border-none">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="object-cover w-full h-full transition-transform hover:scale-105"
                  />
                  <Badge className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
                    {course.category}
                  </Badge>
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center">
                    <Shield className="h-3 w-3 mr-1" />
                    <span>AI Verified</span>
                  </div>
                </div>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center mb-3">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback>{course.instructor.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {course.instructor}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center mr-4">
                      <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                    <div>{course.students.toLocaleString()} students</div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <span className="font-bold text-lg">₹{course.price}</span>
                  <Button size="sm" className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800">
                    Enroll Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Button variant="outline">View All Courses</Button>
          </div>
        </div>
      </section>

      {/* Smart Learning Progress Tracker */}
      <section className="py-20 bg-white dark:bg-blue-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="md:w-1/2">
              <Badge className="mb-4">Intelligent</Badge>
              <h2 className="text-3xl font-bold mb-6">Smart Learning Progress Tracker</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Our AI-powered progress tracking system ensures genuine learning by monitoring your 
                presence and engagement during video lessons.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mt-1 mr-4 flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Real-time Monitoring</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Tracks your learning in real-time with facial presence validation
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 mr-4 flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Adaptive Learning</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Adjusts content difficulty based on your engagement and mastery
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mt-1 mr-4 flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Intelligent Recommendations</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      AI suggests personalized courses based on your learning history and goals
                    </p>
                  </div>
                </div>
              </div>
              
              <Button className="mt-8 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800">
                View Progress Analytics
              </Button>
            </div>
            
            <div className="md:w-1/2 relative">
              <img 
                src="https://static.vecteezy.com/system/resources/thumbnails/021/030/038/original/4k-project-tracking-or-goal-tracker-animation-businessman-project-manager-holding-big-pencil-to-check-completed-tasks-in-project-management-timeline-free-video.jpg" 
                alt="AI Progress Tracking" 
                className="rounded-xl shadow-2xl w-full"
              />
              <div className="absolute -top-5 -right-5 bg-white dark:bg-blue-800 rounded-lg shadow-lg p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">87%</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Course Progress</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Instructors */}
      <section className="py-16 bg-blue-50 dark:bg-blue-900" id="instructors">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Expert Faculty</Badge>
            <h2 className="text-3xl font-bold mb-4">Learn from Industry Leaders</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              World-class instructors with verified credentials and proven track records
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructors.map((instructor) => (
              <Card key={instructor.id} className="border-none shadow-md hover:shadow-lg transition-all">
                <CardContent className="p-6 text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage src={instructor.image} alt={instructor.name} />
                    <AvatarFallback>{instructor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg mb-1">{instructor.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{instructor.expertise}</p>
                  <div className="flex justify-center gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold">{instructor.courses}</div>
                      <div className="text-slate-500 dark:text-slate-400">Courses</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{instructor.students.toLocaleString()}</div>
                      <div className="text-slate-500 dark:text-slate-400">Students</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-blue-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Success Stories</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Students Say</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Real feedback from learners who've experienced the power of AI-verified education
            </p>
          </div>
          
          <Carousel className="max-w-4xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id}>
                  <Card className="border-none shadow-lg">
                    <CardContent className="p-8 text-center">
                      <div className="mb-6">
                        <div className="flex justify-center mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                        <blockquote className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                          "{testimonial.text}"
                        </blockquote>
                      </div>
                      <div className="flex items-center justify-center">
                        <Avatar className="h-12 w-12 mr-4">
                          <AvatarImage src={testimonial.image} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <div className="font-semibold">{testimonial.name}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-blue-50 dark:bg-blue-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Common Questions</Badge>
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to know about our AI-powered learning platform
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {faqItems.map((item, index) => (
              <div key={index} className="mb-4">
                <details className="group bg-white dark:bg-blue-800 rounded-lg shadow-md overflow-hidden">
                  <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                    <h3 className="font-medium text-lg">{item.question}</h3>
                    <div className="ml-4 flex-shrink-0 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full p-1 group-open:rotate-180 transition-transform duration-300">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </summary>
                  <div className="px-6 pb-6 pt-2 text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-blue-700">
                    <p>{item.answer}</p>
                  
                    {index === 0 && (
                      <div className="mt-4 flex items-center justify-center">
                        <div className="w-full max-w-md bg-slate-100 dark:bg-blue-700 p-3 rounded-lg flex items-center gap-4">
                          <div className="relative h-16 w-16 rounded-full overflow-hidden bg-slate-200 dark:bg-blue-600 flex-shrink-0">
                            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Face Authentication Demo" className="h-full w-full object-cover" />
                            <div className="absolute inset-0 border-2 border-green-500 rounded-full animate-pulse opacity-60"></div>
                          </div>
                          <div className="flex-1">
                            <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-2 w-3/4"></div>
                            <div className="h-2 bg-slate-200 dark:bg-blue-600 rounded-full mb-2"></div>
                            <div className="h-2 bg-slate-200 dark:bg-blue-600 rounded-full mb-2 w-2/3"></div>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Verified</Badge>
                              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Secure</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  
                    {index === 1 && (
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-5 w-5 text-blue-500" />
                          <span className="font-medium text-blue-700 dark:text-blue-300">Data Protection Features</span>
                        </div>
                        <ul className="grid grid-cols-2 gap-2 text-sm">
                          <li className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            <span>End-to-end encryption</span>
                          </li>
                          <li className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            <span>Local processing</span>
                          </li>
                          <li className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            <span>Zero data sharing</span>
                          </li>
                          <li className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            <span>Data deletion options</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  
                    {index === 2 && (
                      <div className="mt-4 flex justify-center">
                        <div className="flex flex-col items-center max-w-xs">
                          <div className="relative">
                            <div className="h-16 w-16 rounded-full bg-slate-200 dark:bg-blue-600 flex items-center justify-center mb-2 border-2 border-dashed border-orange-400 animate-pulse">
                              <svg className="h-8 w-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            </div>
                            <div className="absolute -right-1 top-0 h-3 w-3 rounded-full bg-orange-500"></div>
                          </div>
                          <div className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-md text-orange-800 dark:text-orange-200 text-xs mb-2">
                            Brief absence detected
                          </div>
                          <div className="flex gap-2">
                            <div className="px-2 py-1 bg-slate-100 dark:bg-blue-700 rounded text-xs">
                              Pause
                            </div>
                            <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs">
                              Continue
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  
                    {index === 3 && (
                      <div className="mt-4 flex justify-center">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="flex flex-col items-center">
                            <div className="h-12 w-12 rounded-lg border border-slate-200 dark:border-blue-700 flex items-center justify-center mb-2">
                              <svg className="h-8 w-8 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="text-xs">Laptop</div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-12 w-12 rounded-lg border border-slate-200 dark:border-blue-700 flex items-center justify-center mb-2">
                              <svg className="h-8 w-8 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="text-xs">Tablet</div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-12 w-12 rounded-lg border border-slate-200 dark:border-blue-700 flex items-center justify-center mb-2">
                              <svg className="h-8 w-8 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="text-xs">Mobile</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            ))}
          </div>
      
          <div className="mt-12 text-center">
            <p className="text-slate-500 dark:text-slate-400 mb-4">Still have questions? We're here to help.</p>
            <Button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800">
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-blue-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Experience AI-Powered Learning?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students who trust Thirav.ai for secure, verified online education
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-12 px-8 rounded-full bg-white text-blue-600 hover:bg-blue-50">
                Start Learning Today
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 rounded-full border-white text-white hover:bg-white hover:text-blue-600">
                Try Face Verification Demo
              </Button>
            </div>
            
            <div className="mt-8 flex items-center justify-center text-blue-100 text-sm">
              <Shield className="h-4 w-4 mr-2" />
              <span>30-day money-back guarantee • No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-16" id="about">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent mb-4">
                Thirav.ai <br /> <span className="text-blue-250 text-sm">by Aurelion Future Forge.</span>
                </h3>
              <p className="text-blue-200 mb-6 max-w-md">
                The next generation learning platform with face verification technology, 
                ensuring secure and authentic online education.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-blue-300 hover:text-white">
                  <Users className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-blue-300 hover:text-white">
                  <BookOpen className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-blue-300 hover:text-white">
                  <Award className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">Browse Courses</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instructors</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-blue-800 mt-12 pt-8 text-center text-blue-300">
            <p>&copy; {new Date().getFullYear()} Thirav.ai By Aurelion Future Forge. All rights reserved. Secured by AI face verification technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}