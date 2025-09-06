import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, TrendingDown } from "lucide-react";

import { adminLogin } from "../lib/api";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Remove any extra quotes or formatting from the email and password
      const email = emailOrUsername.trim();
      const passwordTrimmed = password.trim();
      
      console.log('Submitting login data:', { email, password: '********' });
      
      await adminLogin(email, passwordTrimmed);
      toast({
        title: "Welcome back!",
        description: `Successfully logged into Return Risk Analyzer.`,
      });
      navigate("/dashboard");

    } catch (err: any) {
      console.error("Login failed:", err);

      const errorMessage = err.message || "An unexpected error occurred."; 
      
      toast({
          title: "Authentication failed",
          description: errorMessage,
          variant: "destructive",
      });
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-xl shadow-glow mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Return Risk Analyzer</h1>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <TrendingDown className="w-4 h-4" />
            Professional E-commerce Analytics
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-elevated">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                {/* Updated label and input for emailOrUsername */}
                <Label htmlFor="emailOrUsername">Email Address or Username</Label>
                <Input
                  id="emailOrUsername"
                  type="text" 
                  placeholder="admin@ecommerce.com or username"
                  value={emailOrUsername} 
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-primary hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium text-muted-foreground mb-2">Demo Credentials:</p>
                <p className="text-xs text-muted-foreground">Email: admin@ecommerce.com</p>
                <p className="text-xs text-muted-foreground">Password: admin123</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;