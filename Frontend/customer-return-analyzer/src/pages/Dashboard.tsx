import ThemeToggle from "@/components/ThemeToggle";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Filter,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "../lib/api";


interface Stat {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string; 
  color: string;
}

interface CustomerData {
  id: string;
  name: string;
  riskScore: number;
  returns: number;
  totalOrders: number;
}

interface RecentReturn {
  id: string;
  customer: string;
  product: string;
  reason: string;
  riskScore: number;
  time: string; // This will be a formatted string like "X hours ago"
}

interface RiskDistributionItem {
  label: string;
  count: string;
  percentage: string;
  color: string;
}

interface ActualDashboardPayload {
  stats: Stat[];
  highRiskCustomers: CustomerData[];
  recentReturns: RecentReturn[];
  riskDistribution: RiskDistributionItem[];
}

interface ApiResponseData {
  statusCode: number;
  data: ActualDashboardPayload; 
  message: string;
  success: boolean;
}

const iconMap: { [key: string]: React.ElementType } = {
  Users: Users,
  TrendingDown: TrendingDown,
  AlertTriangle: AlertTriangle,
  DollarSign: DollarSign,
};

const Dashboard = () => {
  const { data: apiResponse, isLoading, isError, error } = useQuery<ApiResponseData, Error>({
    queryKey: ['dashboardData'],
    queryFn: getDashboardData,
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
    retry: 1, 
  });

 

  const getRiskBadge = (score: number) => {
    if (score >= 70) return { variant: "destructive" as const, label: "High Risk" };
    if (score >= 40) return { variant: "secondary" as const, label: "Medium Risk" };
    return { variant: "default" as const, label: "Low Risk" };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-foreground">
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-red-500">
        <p>Error loading dashboard: {error?.message || "An unknown error occurred"}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  const { 
    stats = [], 
    highRiskCustomers = [], 
    recentReturns = [], 
    riskDistribution = [] 
  } = apiResponse?.data || {}; 

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = iconMap[stat.icon]; // Get the LucideIcon component
          if (!Icon) return null; // Handle cases where icon might not be mapped
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="flex items-center mt-1">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High Risk Customers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">High Risk Customers</CardTitle>
              <CardDescription>Customers with risk score above 70</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {highRiskCustomers.length > 0 ? (
                highRiskCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between p-3 bg-muted text-foreground rounded-lg border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium">{customer.name}</span>
                        <Badge {...getRiskBadge(customer.riskScore)}>
                          Score: {customer.riskScore}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Returns: {customer.returns}/{customer.totalOrders}</span>
                        <span>Rate: {customer.totalOrders > 0 ? Math.round((customer.returns / customer.totalOrders) * 100) : 0}%</span>
                      </div>
                      <Progress value={customer.riskScore} className="mt-2 h-2" />
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No high risk customers found.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Returns */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Recent Returns</CardTitle>
              <CardDescription>Latest return requests and their risk assessment</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReturns.length > 0 ? (
                recentReturns.map((return_item) => (
                  <div
                    key={return_item.id}
                    className="flex items-center justify-between p-3 bg-muted text-foreground rounded-lg border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium">{return_item.customer}</span>
                        <Badge {...getRiskBadge(return_item.riskScore)}>
                          {return_item.riskScore}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{return_item.product}</p>
                      <p className="text-xs text-muted-foreground">
                        Reason: {return_item.reason} • {return_item.time}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No recent returns found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Risk Score Distribution</CardTitle>
          <CardDescription>Customer distribution across risk categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {riskDistribution.map((item) => (
              <div key={item.label} className="text-center p-6 bg-muted text-foreground rounded-lg border">
                <div className="text-3xl font-bold mb-2">{item.count}</div>
                <div className={`text-sm font-medium ${item.color} mb-1`}>{item.label}</div>
                <div className={`text-xs ${item.color.replace('500', '400')}`}>{item.percentage}% of customers</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
