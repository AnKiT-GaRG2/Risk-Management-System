import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

import {
  LayoutDashboard,
  Users,
  TrendingDown,
  BarChart3,
  Settings,
  FileText,
  LogOut,
  Menu,
  Shield,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { refreshAccessToken, logout } from "../lib/api"; 

const AdminLayout = () => {
  // State to control sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [adminUser, setAdminUser] = useState<{ name: string; role: string } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await refreshAccessToken();
        
        const { admin } = res.data; 

        if (admin && admin.username && admin.role) {
            setAdminUser({ name: admin.username, role: admin.role });
        } else {
            console.error("Authentication check failed: Admin data missing from refresh response.");
            throw new Error("Admin data not found. Please log in again.");
        }

      } catch (err: any) {
        console.error("Authentication check failed:", err.message); 
        
        toast({
            title: "Authentication required",
            description: err.message || "Please log in to continue.",
            variant: "destructive",
        });
        
        setAdminUser(null);
        navigate("/login");
      }
    };

    checkAuth();

  }, [navigate, toast]);

  const handleLogout = async () => {
    try {
      await logout();
      setAdminUser(null); 
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of the system.",
      });
      navigate("/login");
    } catch (err: any) {
      console.error("Logout failed:", err.message);
      toast({
        title: "Logout failed",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Returns", href: "/returns", icon: TrendingDown },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  if (!adminUser) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
        <p>Loading admin panel...</p>
      </div>
    );
  }

  // Main layout rendering
  return (
    <div className="min-h-screen bg-background font-inter"> {/* Added font-inter for consistent typography */}
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-card shadow-elevated transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-16"
        } rounded-r-lg`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && "justify-center"}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md"> {/* Enhanced gradient and shadow for the logo */}
              <Shield className="w-5 h-5 text-white" />
            </div>
            {isSidebarOpen && <span className="font-semibold text-lg text-foreground">Risk Analyzer</span>} {/* Increased font size for title */}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="h-8 w-8 p-0 rounded-full hover:bg-muted"
          >
            <Menu className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground shadow-md" // Stronger shadow for active link
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span className="font-medium">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card rounded-br-lg"> {/* Added bg-card and rounded-br-lg for consistency */}
          {isSidebarOpen && (
            <div className="mb-3">
              <p className="text-sm font-medium text-foreground">{adminUser.name}</p>
              <p className="text-xs text-muted-foreground">{adminUser.role}</p>
            </div>
          )}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={`w-full justify-start gap-3 text-muted-foreground hover:text-red-500 hover:bg-red-50 ${ // Highlight logout on hover
              !isSidebarOpen && "justify-center px-0"
            } rounded-lg`}
          >
            <LogOut className="w-4 h-4" />
            {isSidebarOpen && "Logout"}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        {/* Header (Top Bar) */}
        <header className="bg-card shadow-sm border-b border-border p-4 rounded-bl-lg"> {/* Added rounded-bl-lg */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {navigationItems.find((item) => isActive(item.href))?.name || "Dashboard"}
              </h1>
              <p className="text-sm text-muted-foreground">
                Monitor and manage customer return risks
              </p>
            </div>
            <div className="flex items-center gap-4">
  <div className="text-right">
    <p className="text-sm text-muted-foreground">Welcome back,</p>
    <p className="font-medium text-foreground">{adminUser.name}</p>
  </div>
  <ThemeToggle />
</div>

          </div>
        </header>

        {/* Page Specific Content (rendered by React Router's Outlet) */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;