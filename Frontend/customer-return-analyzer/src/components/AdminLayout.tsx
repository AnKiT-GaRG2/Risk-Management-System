import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  TrendingDown, 
  BarChart3, 
  Settings, 
  FileText, 
  LogOut,
  Menu,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userCollapsedSidebar, setUserCollapsedSidebar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { // md breakpoint
        setIsSidebarOpen(false);
      } else {
        // Only auto-open if user hasn't manually collapsed it
        if (!userCollapsedSidebar) {
          setIsSidebarOpen(true);
        }
      }
    };

    // Set initial state based on screen size
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [userCollapsedSidebar]);

  // Custom toggle function that tracks user preference
  const handleSidebarToggle = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    
    // Track if user manually collapsed on large screen
    if (window.innerWidth >= 768) {
      setUserCollapsedSidebar(!newState);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("adminUser");
    toast({
      title: "Logged out successfully",
      description: "You have been signed out of the system.",
    });
    navigate("/login");
  };

  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Returns", href: "/returns", icon: TrendingDown },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-card shadow-elevated transition-all duration-300 ${
        isSidebarOpen ? "w-64" : "w-16"
      }`}>
        {/* Sidebar Header */}
        <div className={`p-4 border-b border-border ${!isSidebarOpen ? "flex justify-center" : "flex items-center justify-between"}`}>
          <div 
            className={`flex items-center gap-3 transition-colors ${
              !isSidebarOpen 
                ? "justify-center cursor-pointer hover:bg-secondary rounded-lg p-3" 
                : ""
            }`}
            onClick={!isSidebarOpen ? handleSidebarToggle : undefined}
            title={!isSidebarOpen ? "Expand sidebar" : undefined}
          >
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {isSidebarOpen && (
              <span className="font-semibold text-foreground">Risk Analyzer</span>
            )}
          </div>
          {isSidebarOpen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSidebarToggle}
              className="h-8 w-8 p-0"
            >
              <Menu className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                } ${!isSidebarOpen && "justify-center px-0"}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && (
                  <span className="font-medium">{item.name}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          {isSidebarOpen && (
            <div className="mb-3">
              <p className="text-sm font-medium text-foreground">{adminUser.name}</p>
              <p className="text-xs text-muted-foreground">{adminUser.role}</p>
            </div>
          )}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={`w-full justify-start gap-3 text-muted-foreground hover:text-foreground ${
              !isSidebarOpen && "justify-center px-0"
            }`}
          >
            <LogOut className="w-4 h-4" />
            {isSidebarOpen && "Logout"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        isSidebarOpen ? "ml-64" : "ml-16"
      }`}>
        {/* Header */}
        <header className="bg-card shadow-sm border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {navigationItems.find(item => isActive(item.href))?.name || "Dashboard"}
              </h1>
              <p className="text-sm text-muted-foreground">
                Monitor and manage customer return risks
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <p className="font-medium text-foreground">{adminUser.name}</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;