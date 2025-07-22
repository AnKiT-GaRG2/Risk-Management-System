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

const Dashboard = () => {
  const stats = [
    {
      title: "Total Customers",
      value: "12,847",
      change: "+2.5%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Return Rate",
      value: "18.3%",
      change: "-1.2%",
      trend: "down",
      icon: TrendingDown,
      color: "text-green-600",
    },
    {
      title: "High Risk Customers",
      value: "284",
      change: "+5.1%",
      trend: "up",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      title: "Revenue Impact",
      value: "$45,280",
      change: "-3.8%",
      trend: "down",
      icon: DollarSign,
      color: "text-purple-600",
    },
  ];

  const highRiskCustomers = [
    { id: "CUST001", name: "Sarah Johnson", riskScore: 92, returns: 15, totalOrders: 18 },
    { id: "CUST045", name: "Mike Chen", riskScore: 87, returns: 12, totalOrders: 16 },
    { id: "CUST123", name: "Emma Davis", riskScore: 84, returns: 23, totalOrders: 28 },
    { id: "CUST089", name: "Robert Wilson", riskScore: 81, returns: 19, totalOrders: 25 },
    { id: "CUST234", name: "Lisa Brown", riskScore: 78, returns: 14, totalOrders: 19 },
  ];

  const recentReturns = [
    { id: "RET001", customer: "John Doe", product: "iPhone 15 Pro", reason: "Defective screen", riskScore: 45, time: "2 hours ago" },
    { id: "RET002", customer: "Alice Smith", product: "Nike Air Max", reason: "Wrong size", riskScore: 23, time: "4 hours ago" },
    { id: "RET003", customer: "Bob Johnson", product: "MacBook Pro", reason: "Performance issues", riskScore: 78, time: "6 hours ago" },
    { id: "RET004", customer: "Carol White", product: "Samsung TV", reason: "Not as described", riskScore: 34, time: "8 hours ago" },
  ];

  const getRiskBadge = (score: number) => {
    if (score >= 70) return { variant: "destructive" as const, label: "High Risk" };
    if (score >= 40) return { variant: "secondary" as const, label: "Medium Risk" };
    return { variant: "default" as const, label: "Low Risk" };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
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
              {highRiskCustomers.map((customer) => (
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
                      <span>Rate: {Math.round((customer.returns / customer.totalOrders) * 100)}%</span>
                    </div>
                    <Progress value={customer.riskScore} className="mt-2 h-2" />
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
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
              {recentReturns.map((return_item) => (
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
              ))}
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
            <div className="text-center p-6 bg-muted text-foreground rounded-lg border">
              <div className="text-3xl font-bold mb-2">8,543</div>
              <div className="text-sm font-medium text-green-500 mb-1">Low Risk (0-39)</div>
              <div className="text-xs text-green-400">66.5% of customers</div>
            </div>
            <div className="text-center p-6 bg-muted text-foreground rounded-lg border">
              <div className="text-3xl font-bold mb-2">4,020</div>
              <div className="text-sm font-medium text-yellow-500 mb-1">Medium Risk (40-69)</div>
              <div className="text-xs text-yellow-400">31.3% of customers</div>
            </div>
            <div className="text-center p-6 bg-muted text-foreground rounded-lg border">
              <div className="text-3xl font-bold mb-2">284</div>
              <div className="text-sm font-medium text-red-500 mb-1">High Risk (70-100)</div>
              <div className="text-xs text-red-400">2.2% of customers</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
