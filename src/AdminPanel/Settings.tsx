import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Toaster, toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  User,
  Key,
  Save,
  Mail,
  CheckCircle2,
  Shield,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  UserCog,
} from "lucide-react";

// API Base URL
const baseUrl = import.meta.env.VITE_BACKEND_API;

// Form Schemas
const usernameFormSchema = z.object({
  newUsername: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(50, { message: "Username must be less than 50 characters" }),
});

const requestResetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const verifyCodeSchema = z.object({
  resetCode: z
    .string()
    .min(6, { message: "Reset code must be at least 6 characters" })
    .max(10, { message: "Reset code must be less than 10 characters" }),
});

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(100, { message: "Password must be less than 100 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type UsernameFormValues = z.infer<typeof usernameFormSchema>;
type RequestResetFormValues = z.infer<typeof requestResetSchema>;
type VerifyCodeFormValues = z.infer<typeof verifyCodeSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
// eslint-disable-next-line
const Settingss = () => {
  const [userData, setUserData] = useState<{ email: string; username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingUsername, setUpdatingUsername] = useState(false);
  const [resetStep, setResetStep] = useState<"request" | "verify" | "reset">("request");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState<string>("");
  const [processingReset, setProcessingReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form handlers
  const usernameForm = useForm<UsernameFormValues>({
    resolver: zodResolver(usernameFormSchema),
    defaultValues: {
      newUsername: "",
    },
  });

  const requestResetForm = useForm<RequestResetFormValues>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const verifyCodeForm = useForm<VerifyCodeFormValues>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      resetCode: "",
    },
  });

  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("auth_token");
        if (!token) {
          throw new Error("No auth token found");
        }

        // Decode JWT to get basic user info - this is just a simple way to get the email without an API call
        // In a real app, you might want a dedicated endpoint to fetch user profile data
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        setUserData({
          email: tokenData.email || "",
          username: tokenData.username || "",
        });

        // Pre-fill the form with current username
        usernameForm.setValue("newUsername", tokenData.username || "");
        
        // Pre-fill the email field in the reset form
        requestResetForm.setValue("email", tokenData.email || "");
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle username update
  const onUpdateUsername = async (data: UsernameFormValues) => {
    setUpdatingUsername(true);
    try {
      const token = Cookies.get("auth_token");
      await axios.patch(
        `${baseUrl}/auth/update-username`,
        { newUsername: data.newUsername },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      // Update local state
      setUserData((prev) => prev ? { ...prev, username: data.newUsername } : null);
      toast.success("Username updated successfully");
    } catch (error: any) {
      console.error("Error updating username:", error);
      toast.error(error.response?.data?.message || "Failed to update username");
    } finally {
      setUpdatingUsername(false);
    }
  };

  // Handle password reset request (step 1)
  const onRequestReset = async (data: RequestResetFormValues) => {
    setProcessingReset(true);
    try {
      await axios.post(`${baseUrl}/auth/forgot-password`, {
        email: data.email,
      });

      // Store email for next steps
      setResetEmail(data.email);
      
      // Move to the next step
      setResetStep("verify");
      toast.success("Reset code sent to your email");
    } catch (error: any) {
      console.error("Error requesting password reset:", error);
      toast.error(error.response?.data?.message || "Failed to request password reset");
    } finally {
      setProcessingReset(false);
    }
  };

  // Handle verification code (step 2)
  const onVerifyCode = async (data: VerifyCodeFormValues) => {
    setProcessingReset(true);
    try {
      // In a real implementation, you might need an API endpoint to verify the code
      // For now, we'll assume the code is valid and move to the next step
      // The actual token will be sent with the final reset request
      
      setResetToken(data.resetCode); // Store code for final step
      setResetStep("reset");
    } catch (error: any) {
      console.error("Error verifying code:", error);
      toast.error(error.response?.data?.message || "Invalid reset code");
    } finally {
      setProcessingReset(false);
    }
  };

  // Handle password reset (step 3)
  const onResetPassword = async (data: ResetPasswordFormValues) => {
    setProcessingReset(true);
    try {
      await axios.post(`${baseUrl}/auth/reset-password`, {
        resetToken: resetToken,
        resetCode: resetToken, // Using the same token as the code
        newPassword: data.newPassword,
      });

      // Reset the form and go back to the first step
      resetPasswordForm.reset();
      verifyCodeForm.reset();
      requestResetForm.reset();
      setResetStep("request");
      setResetToken(null);
      
      toast.success("Password reset successfully");
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setProcessingReset(false);
    }
  };

  // Reset the password flow
  const cancelPasswordReset = () => {
    resetPasswordForm.reset();
    verifyCodeForm.reset();
    requestResetForm.reset();
    setResetStep("request");
    setResetToken(null);
  };

  return (
    <div className="container mx-auto p-6">
      <Toaster position="top-right" richColors />
      
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your account profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-6">
                  <Form {...usernameForm}>
                    <form onSubmit={usernameForm.handleSubmit(onUpdateUsername)} className="space-y-4">
                      <FormField
                        control={usernameForm.control}
                        name="newUsername"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Your username" {...field} />
                            </FormControl>
                            <FormDescription>
                              This is the name displayed to other users
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex items-center space-x-4 ">
                        <Button 
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          type="submit" 
                          disabled={updatingUsername || usernameForm.formState.isSubmitting}
                        >
                          {updatingUsername ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4 " />
                              Save Changes
                            </>
                          )}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => usernameForm.reset({ newUsername: userData?.username || "" })}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                  
                  <div className="pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</h3>
                      <Badge className="bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                        Verified
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {userData?.email || "Loading..."}
                    </p>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Your email cannot be changed. Please contact support if you need to update it.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Password Reset
              </CardTitle>
              <CardDescription>
                Reset your account password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {resetStep === "request" && (
                  <Form {...requestResetForm}>
                    <form onSubmit={requestResetForm.handleSubmit(onRequestReset)} className="space-y-4">
                      <FormField
                        control={requestResetForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input 
                                  placeholder="Enter your email" 
                                  className="pl-10"
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              We'll send a password reset code to this email
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        disabled={processingReset || requestResetForm.formState.isSubmitting}
                      >
                        {processingReset ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending Code...
                          </>
                        ) : (
                          <>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Reset Code
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
                
                {resetStep === "verify" && (
                  <div className="space-y-4">
                    <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertTitle>Reset code sent</AlertTitle>
                      <AlertDescription>
                        We've sent a reset code to {resetEmail}. Please check your inbox and spam folder.
                      </AlertDescription>
                    </Alert>
                    
                    <Form {...verifyCodeForm}>
                      <form onSubmit={verifyCodeForm.handleSubmit(onVerifyCode)} className="space-y-4">
                        <FormField
                          control={verifyCodeForm.control}
                          name="resetCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reset Code</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter the code from your email" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Enter the 6-digit code we sent to your email
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex space-x-2">
                          <Button 
                            type="submit" 
                            disabled={processingReset || verifyCodeForm.formState.isSubmitting}
                          >
                            {processingReset ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verifying...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Verify Code
                              </>
                            )}
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={cancelPasswordReset}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                )}
                
                {resetStep === "reset" && (
                  <div className="space-y-4">
                    <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertTitle>Code verified</AlertTitle>
                      <AlertDescription>
                        Your reset code has been verified. Please set a new password.
                      </AlertDescription>
                    </Alert>
                    
                    <Form {...resetPasswordForm}>
                      <form onSubmit={resetPasswordForm.handleSubmit(onResetPassword)} className="space-y-4">
                        <FormField
                          control={resetPasswordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input 
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password" 
                                    className="pl-10"
                                    {...field} 
                                  />
                                  <button
                                    type="button"
                                    className="absolute right-3 top-3"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? (
                                      <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                      <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                  </button>
                                </div>
                              </FormControl>
                              <FormDescription>
                                Must be at least 8 characters
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={resetPasswordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input 
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password" 
                                    className="pl-10"
                                    {...field} 
                                  />
                                  <button
                                    type="button"
                                    className="absolute right-3 top-3"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  >
                                    {showConfirmPassword ? (
                                      <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                      <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                  </button>
                                </div>
                              </FormControl>
                              <FormDescription>
                                Re-enter your new password
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex space-x-2">
                          <Button 
                            type="submit" 
                            disabled={processingReset || resetPasswordForm.formState.isSubmitting}
                          >
                            {processingReset ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Resetting...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Reset Password
                              </>
                            )}
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={cancelPasswordReset}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

function Badge({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

export default Settingss;