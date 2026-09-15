"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft,
  Mail,
  Building,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  
  const { toast } = useToast();
  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitted(true);
      toast({
        title: "Reset link sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-prms-primary rounded-lg flex items-center justify-center mb-4">
              <Building className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Check Your Email
            </h1>
            <p className="text-gray-400">
              We've sent password reset instructions to your email
            </p>
          </div>

          {/* Success Card */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    Reset Link Sent
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                  <p className="text-gray-500 text-xs">
                    Didn't receive the email? Check your spam folder or try again in a few minutes.
                  </p>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => router.push('/login')}
                    className="w-full bg-prms-primary hover:bg-prms-primary/90 text-white"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Sign In
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail("");
                    }}
                    className="w-full text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    Try Different Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-prms-primary rounded-lg flex items-center justify-center mb-4">
            <Building className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Reset Your Password
          </h1>
          <p className="text-gray-400">
            Enter your email address and we'll send you instructions to reset your password
          </p>
        </div>

        {/* Forgot Password Form */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-semibold text-white text-center">
              Forgot Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className={`pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 ${
                      error ? 'border-red-500 focus:border-red-500' : 'focus:border-prms-primary'
                    }`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    disabled={isLoading}
                  />
                  {error && (
                    <div className="flex items-center mt-1 text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {error}
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-prms-primary hover:bg-prms-primary/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Reset Link
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={() => router.push('/login')}
                disabled={isLoading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>© 2024 Ethiopian Institute of Science and Technology</p>
          <p className="mt-1">All rights reserved</p>
        </div>
      </div>
    </div>
  );
}