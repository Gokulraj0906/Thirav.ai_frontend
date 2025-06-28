import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Cookies from "js-cookie";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  
  // Password reset states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [resetTimer, setResetTimer] = useState(0);

  // Combined form data for login, signup, OTP, and password reset
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    rememberMe: false,
    resetCode: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Error messages for each field
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    resetCode: "",
    newPassword: "",
    confirmNewPassword: "",
    general: "",
  });

  const navigate = useNavigate();

  // Replace this URL with your actual backend endpoint
  const baseUrl = "https://thirav-ai.onrender.com";

  // Handle input changes for text, checkbox, etc.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    
    // Clear any previous error on this field
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name as keyof typeof errors]: "",
      });
    }
  };

  // Start OTP or reset timer
  const startTimer = (timerType: 'otp' | 'reset') => {
    const setTimerFunction = timerType === 'otp' ? setOtpTimer : setResetTimer;
    
    setTimerFunction(60);
    const timer = setInterval(() => {
      setTimerFunction((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Basic validations for login, signup, OTP, and password reset
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Reset old errors
    Object.keys(newErrors).forEach((key) => {
      newErrors[key as keyof typeof newErrors] = "";
    });

    if (showForgotPassword) {
      if (!showResetForm) {
        // Validate email for password reset request
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
          newErrors.email = "Please enter a valid email address";
          isValid = false;
        }
      } else {
        // Validate reset code and new password
        if (!formData.resetCode || formData.resetCode.length !== 6) {
          newErrors.resetCode = "Please enter a valid 6-digit reset code";
          isValid = false;
        }
        if (!formData.newPassword || formData.newPassword.length < 6) {
          newErrors.newPassword = "New password must be at least 6 characters";
          isValid = false;
        }
        if (formData.newPassword !== formData.confirmNewPassword) {
          newErrors.confirmNewPassword = "Passwords do not match";
          isValid = false;
        }
      }
    } else if (showOtpForm) {
      // OTP validation
      if (!formData.otp || formData.otp.length !== 6) {
        newErrors.otp = "Please enter a valid 6-digit OTP";
        isValid = false;
      }
      if (!formData.username.trim()) {
        newErrors.username = "Username is required";
        isValid = false;
      }
      if (!formData.password || formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
        isValid = false;
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
    } else {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email || !emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
        isValid = false;
      }

      if (isLogin) {
        // Login password validation
        if (!formData.password || formData.password.length < 6) {
          newErrors.password = "Password must be at least 6 characters";
          isValid = false;
        }
      } else {
        // Signup validations (for requesting OTP)
        if (!formData.username.trim()) {
          newErrors.username = "Username is required";
          isValid = false;
        }
        if (!formData.password || formData.password.length < 6) {
          newErrors.password = "Password must be at least 6 characters";
          isValid = false;
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission for login, signup OTP request, OTP verification, and password reset
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      let response;
      
      // Password reset flow
      if (showForgotPassword) {
        if (!showResetForm) {
          // Request password reset
          response = await axios.post(`${baseUrl}/auth/forgot-password`, {
            email: formData.email,
          });

          // Store token from response if available
          if (response.data.resetToken) {
            setResetToken(response.data.resetToken);
          }

          toast.success("Reset code sent to your email! Please check your inbox.");
          setShowResetForm(true);
          startTimer('reset');
        } else {
          // Reset password with code
          response = await axios.post(`${baseUrl}/auth/reset-password`, {
            resetToken: resetToken,
            resetCode: formData.resetCode,
            newPassword: formData.newPassword,
          });

          toast.success("Password reset successful! You can now log in with your new password.");
          
          // Clear form data and return to login
          setFormData({
            ...formData,
            resetCode: "",
            newPassword: "",
            confirmNewPassword: "",
            password: "", // Clear login password too
          });
          setShowForgotPassword(false);
          setShowResetForm(false);
          setIsLogin(true);
        }
      } else if (isLogin) {
        // LOGIN
        response = await axios.post(`${baseUrl}/auth/login`, {
          email: formData.email,
          password: formData.password,
        });

        const { token, user } = response.data;

        // Save JWT token in cookie
        const expiryDays = formData.rememberMe ? 30 : 1;
        Cookies.set("auth_token", token, { expires: expiryDays, path: "/" });
        
        // Save user info in localStorage (using variables instead in this environment)
        const userData = {
          id: user.id,
          name: user.name || user.username,
          email: user.email,
        };
        
        toast.success("Login Successful - Welcome back to Thirav.ai! " + userData.name);
        navigate("/dashboard");

      } else if (!showOtpForm) {
        // REQUEST OTP FOR SIGNUP
        response = await axios.post(`${baseUrl}/auth/request-otp`, {
          email: formData.email,
        });

        toast.success("OTP sent to your email! Please check your inbox.");
        setShowOtpForm(true);
        startTimer('otp');

      } else {
        // VERIFY OTP & COMPLETE SIGNUP
        response = await axios.post(`${baseUrl}/auth/verify-otp`, {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          otp: formData.otp,
        });

        const { token, user } = response.data;

        // Save JWT token in cookie
        const expiryDays = formData.rememberMe ? 30 : 1;
        Cookies.set("auth_token", token, { expires: expiryDays, path: "/" });
        
        // Save user info
        const userData = {
          id: user.id,
          name: user.name || user.username,
          email: user.email,
        };

        toast.success(`Account Created Successfully - Welcome to Thirav.ai! ${userData.name}`);
        navigate("/dashboard");
      }
      
    } catch (error: any) {
      console.error("Auth error:", error);
      let errorMsg = "An error occurred. Please try again.";
      
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (showForgotPassword && !showResetForm) {
        errorMsg = "Failed to send reset code. Please try again.";
      } else if (showForgotPassword && showResetForm) {
        errorMsg = "Password reset failed. Invalid code or expired token.";
      } else if (isLogin) {
        errorMsg = "Login failed. Please check your credentials.";
      } else if (!showOtpForm) {
        errorMsg = "Failed to send OTP. Please try again.";
      } else {
        errorMsg = "Invalid OTP or signup failed. Please try again.";
      }
      
      setErrors((prev) => ({ ...prev, general: errorMsg }));
      toast.error(errorMsg);

    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (otpTimer > 0) return;
    
    setIsLoading(true);
    try {
      await axios.post(`${baseUrl}/auth/resend-otp`, {
        email: formData.email,
      });
      
      toast.success("OTP resent successfully!");
      startTimer('otp');
      
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Resend reset code
  const handleResendResetCode = async () => {
    if (resetTimer > 0) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/auth/forgot-password`, {
        email: formData.email,
      });
      
      // Store token from response if available
      if (response.data.resetToken) {
        setResetToken(response.data.resetToken);
      }
      
      toast.success("Reset code resent successfully!");
      startTimer('reset');
      
    } catch (error: any) {
      console.error("Resend reset code error:", error);
      toast.error("Failed to resend reset code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Social auth (Google, GitHub)
  const handleSocialAuth = async (provider: string) => {
    setIsLoading(true);
    try {
      // Redirect to your backend's OAuth endpoint
      window.location.href = `${baseUrl}/auth/${provider}`;

    } catch (error) {
      console.error(`${provider} auth error:`, error);
      toast.error(`Failed to authenticate with ${provider}. Please try again.`);
      setIsLoading(false);
    }
  };

  // Go back from OTP form to signup form
  const handleBackToSignup = () => {
    setShowOtpForm(false);
    setFormData(prev => ({ ...prev, otp: "" }));
    setErrors(prev => ({ ...prev, otp: "", general: "" }));
  };
  
  // Handle forgot password click
  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setIsLogin(false);
    setShowOtpForm(false);
    setErrors(prev => ({ ...prev, general: "" }));
  };
  
  // Go back from forgot password form to login form
  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setShowResetForm(false);
    setIsLogin(true);
    setFormData(prev => ({ 
      ...prev, 
      resetCode: "", 
      newPassword: "", 
      confirmNewPassword: "" 
    }));
    setErrors(prev => ({ ...prev, general: "" }));
  };

  // Slide variants for different forms
  const slideVariants = {
    login: { x: 0 },
    signup: { x: "-100%" },
    otp: { x: "-200%" },
    forgotPassword: { x: "-300%" },
    resetPassword: { x: "-400%" },
  };

  let currentVariant = "login";
  if (!isLogin) {
    if (showForgotPassword) {
      currentVariant = showResetForm ? "resetPassword" : "forgotPassword";
    } else {
      currentVariant = showOtpForm ? "otp" : "signup";
    }
  }

  return (
    <>
    <Toaster position="top-right" richColors/>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="relative w-full max-w-md">
        
        {/* Decorative background blobs */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <Card className="w-full border-none shadow-xl overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
          
          <CardHeader className="text-center relative">
            <div className="absolute top-0 right-0 p-4">
            </div>
            <CardTitle className="text-3xl font-extrabold">
              <span className="text-black">Thirav.</span>
              <span className="text-blue-600">Ai</span>
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? "Sign in to continue learning" 
                : showOtpForm 
                ? "Enter the OTP sent to your email"
                : showForgotPassword
                ? (showResetForm 
                  ? "Enter the reset code and new password" 
                  : "Reset your password")
                : "Create your account"
              }
            </CardDescription>
          </CardHeader>
          
          <div className="relative overflow-hidden">
            <motion.div
              className="flex"
              animate={currentVariant}
              variants={slideVariants}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* LOGIN FORM */}
              <CardContent className="min-w-full pt-4">
                <form onSubmit={handleSubmit}>
                  {errors.general && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm rounded-md">
                      {errors.general}
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={errors.email ? "border-red-500" : ""}
                        required
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>
                    
                    {/* Password */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password">Password</Label>
                        <Button 
                          variant="link" 
                          className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                          onClick={(e) => {
                            e.preventDefault();
                            handleForgotPassword();
                          }}
                        >
                          Forgot password?
                        </Button>
                      </div>
                      <Input
                        id="login-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={errors.password ? "border-red-500" : ""}
                        required
                      />
                      {errors.password && (
                        <p className="text-sm text-red-500">{errors.password}</p>
                      )}
                    </div>
                    
                    {/* Remember Me */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember-me"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, rememberMe: !!checked })
                        }
                      />
                      <label
                        htmlFor="remember-me"
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me for 30 days
                      </label>
                    </div>
                    
                    {/* Submit */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                      <div className="flex items-center justify-center">
                      <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 
                         0 5.373 0 12h4zm2 5.291A7.962 7.962 
                         0 014 12H0c0 3.042 1.135 5.824 
                         3 7.938l3-2.647z"
                      ></path>
                      </svg>
                      Signing in...
                      </div>
                      ) : (
                      "Sign in"
                      )}
                    </Button>
                  </div>
                </form>

                {/* Social Auth */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white dark:bg-slate-800 px-2 text-slate-500">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-center">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => handleSocialAuth("google")}
                      disabled={isLoading}
                      className="w-full max-w-xs border-slate-300 dark:border-slate-600"
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92
                         c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28
                         -4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c
                         -.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93
                         -6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s
                         .13-1.43.35-2.09V7.07H2.18C1.43 8.55 1
                         10.22 1 12s.43 3.45 1.18 4.93l2.85
                         -2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15
                         -3.15C17.45 2.09 14.97 1 12 1 7.7
                         1 3.99 3.47 2.18 7.07l3.66 2.84c
                         .87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                      </svg>
                      Google
                    </Button>
                    </div>
                </div>

                <div className="mt-6 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => setIsLogin(false)}
                  >
                    Sign up
                  </button>
                </div>
              </CardContent>
              
              {/* SIGNUP FORM */}
              <CardContent className="min-w-full pt-4">
                <form onSubmit={handleSubmit}>
                  {errors.general && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm rounded-md">
                      {errors.general}
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {/* Username */}
                    <div className="space-y-2">
                      <Label htmlFor="signup-username">Username</Label>
                      <Input
                        id="signup-username"
                        name="username"
                        type="text"
                        placeholder="johndoe"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={errors.username ? "border-red-500" : ""}
                        required
                      />
                      {errors.username && (
                        <p className="text-sm text-red-500">{errors.username}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={errors.email ? "border-red-500" : ""}
                        required
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={errors.password ? "border-red-500" : ""}
                        required
                      />
                      {errors.password && (
                        <p className="text-sm text-red-500">{errors.password}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                      <Input
                        id="signup-confirm-password"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={errors.confirmPassword ? "border-red-500" : ""}
                        required
                      />
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                      )}
                    </div>

                    {/* Terms */}
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" required />
                      <label
                        htmlFor="terms"
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the{" "}
                        <a
                          href="#"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>

                    {/* Submit (Request OTP) */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 
                                 0 0 5.373 0 12h4zm2 5.291A7.962 
                                 7.962 0 014 12H0c0 3.042 1.135 
                                 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending OTP...
                        </div>
                      ) : (
                        "Send OTP"
                      )}
                    </Button>
                  </div>
                </form>

                {/* Social Auth */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white dark:bg-slate-800 px-2 text-slate-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                    <div className="mt-4 flex justify-center">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => handleSocialAuth("google")}
                      disabled={isLoading}
                      className="w-full max-w-xs border-slate-300 dark:border-slate-600"
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92
                         c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28
                         -4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c
                         -.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93
                         -6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s
                         .13-1.43.35-2.09V7.07H2.18C1.43 8.55 1
                         10.22 1 12s.43 3.45 1.18 4.93l2.85
                         -2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15
                         -3.15C17.45 2.09 14.97 1 12 1 7.7
                         1 3.99 3.47 2.18 7.07l3.66 2.84c
                         .87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                      </svg>
                      Google
                    </Button>
                    </div>
                </div>

                <div className="mt-6 text-center text-sm">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => setIsLogin(true)}
                  >
                    Sign in
                  </button>
                </div>
              </CardContent>

              {/* OTP VERIFICATION FORM */}
              <CardContent className="min-w-full pt-4">
                <form onSubmit={handleSubmit}>
                  {errors.general && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm rounded-md">
                      {errors.general}
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp">Verification Code (OTP)</Label>
                      <Input
                        id="otp"
                        name="otp"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        placeholder="123456"
                        value={formData.otp}
                        onChange={handleInputChange}
                        className={`text-center text-lg ${errors.otp ? "border-red-500" : ""}`}
                        required
                      />
                      {errors.otp && (
                        <p className="text-sm text-red-500">{errors.otp}</p>
                      )}
                    </div>
                    
                    <div className="text-center text-sm">
                      <p>We've sent a 6-digit verification code to</p>
                      <p className="font-medium">{formData.email}</p>
                      
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          className="text-sm"
                          onClick={handleResendOtp}
                          disabled={otpTimer > 0 || isLoading}
                        >
                          {otpTimer > 0 
                            ? `Resend code in ${otpTimer}s` 
                            : "Resend code"}
                        </Button>
                      </div>
                    </div>

                    {/* Submit (Verify OTP) */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 
                                 0 5.373 0 12h4zm2 5.291A7.962 
                                 7.962 0 014 12H0c0 3.042 1.135 
                                 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Verifying...
                        </div>
                      ) : (
                        "Verify & Create Account"
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleBackToSignup}
                      disabled={isLoading}
                    >
                      Back to signup
                    </Button>
                  </div>
                </form>
              </CardContent>
              
              {/* FORGOT PASSWORD FORM (Email) */}
              <CardContent className="min-w-full pt-4">
                <form onSubmit={handleSubmit}>
                  {errors.general && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm rounded-md">
                      {errors.general}
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email">Email</Label>
                      <Input
                        id="forgot-email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={errors.email ? "border-red-500" : ""}
                        required
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>
                    
                    <div className="text-center text-sm">
                      <p>Enter your email address and we'll send you a code to reset your password.</p>
                    </div>

                    {/* Submit (Request Reset Code) */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 
                                 0 5.373 0 12h4zm2 5.291A7.962 
                                 7.962 0 014 12H0c0 3.042 1.135 
                                 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending Reset Code...
                        </div>
                      ) : (
                        "Send Reset Code"
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleBackToLogin}
                      disabled={isLoading}
                    >
                      Back to Login
                    </Button>
                  </div>
                </form>
              </CardContent>
              
              {/* RESET PASSWORD FORM */}
              <CardContent className="min-w-full pt-4">
                <form onSubmit={handleSubmit}>
                  {errors.general && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm rounded-md">
                      {errors.general}
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {/* Reset Code */}
                    <div className="space-y-2">
                      <Label htmlFor="reset-code">Reset Code</Label>
                      <Input
                        id="reset-code"
                        name="resetCode"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        placeholder="123456"
                        value={formData.resetCode}
                        onChange={handleInputChange}
                        className={`text-center text-lg ${errors.resetCode ? "border-red-500" : ""}`}
                        required
                      />
                      {errors.resetCode && (
                        <p className="text-sm text-red-500">{errors.resetCode}</p>
                      )}
                    </div>
                    
                    {/* New Password */}
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        name="newPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className={errors.newPassword ? "border-red-500" : ""}
                        required
                      />
                      {errors.newPassword && (
                        <p className="text-sm text-red-500">{errors.newPassword}</p>
                      )}
                    </div>
                    
                    {/* Confirm New Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                      <Input
                        id="confirm-new-password"
                        name="confirmNewPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmNewPassword}
                        onChange={handleInputChange}
                        className={errors.confirmNewPassword ? "border-red-500" : ""}
                        required
                      />
                      {errors.confirmNewPassword && (
                        <p className="text-sm text-red-500">{errors.confirmNewPassword}</p>
                      )}
                    </div>
                    
                    <div className="text-center text-sm">
                      <p>We've sent a 6-digit reset code to</p>
                      <p className="font-medium">{formData.email}</p>
                      
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          className="text-sm"
                          onClick={handleResendResetCode}
                          disabled={resetTimer > 0 || isLoading}
                        >
                          {resetTimer > 0 
                            ? `Resend code in ${resetTimer}s` 
                            : "Resend code"}
                        </Button>
                      </div>
                    </div>

                    {/* Submit (Reset Password) */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 
                                 0 5.373 0 12h4zm2 5.291A7.962 
                                 7.962 0 014 12H0c0 3.042 1.135 
                                 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Resetting Password...
                        </div>
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setShowResetForm(false);
                        setFormData(prev => ({ ...prev, resetCode: "" }));
                      }}
                      disabled={isLoading}
                    >
                      Back to Previous Step
                    </Button>
                  </div>
                </form>
              </CardContent>
            </motion.div>
          </div>
          
          <CardFooter className="pb-6 pt-4 flex justify-center">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} Thirav.ai. All rights reserved.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
    </>
  );
}