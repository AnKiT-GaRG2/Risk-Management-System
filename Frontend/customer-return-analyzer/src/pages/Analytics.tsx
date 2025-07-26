import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { TrendingUp, TrendingDown, Calendar, Download } from "lucide-react";

const Analytics = () => {
  const monthlyData = [
    { month: "Jan", returns: 145, riskScore: 23.5, revenue: 48200 },
    { month: "Feb", returns: 132, riskScore: 21.8, revenue: 52100 },
    { month: "Mar", returns: 178, riskScore: 28.2, revenue: 45800 },
    { month: "Apr", returns: 156, riskScore: 25.1, revenue: 49300 },
    { month: "May", returns: 189, riskScore: 31.4, revenue: 43700 },
    { month: "Jun", returns: 142, riskScore: 22.7, revenue: 51900 },
    { month: "Jul", returns: 167, riskScore: 26.8, revenue: 47600 },
    { month: "Aug", returns: 153, riskScore: 24.9, revenue: 50200 },
    { month: "Sep", returns: 171, riskScore: 27.3, revenue: 46800 },
    { month: "Oct", returns: 184, riskScore: 29.6, revenue: 44500 },
    { month: "Nov", returns: 176, riskScore: 28.1, revenue: 45900 },
    { month: "Dec", returns: 198, riskScore: 32.7, revenue: 42100 }
  ];

  const categoryData = [
    { category: "Electronics", returns: 234, riskScore: 45.2, color: "#3B82F6" },
    { category: "Fashion", returns: 189, riskScore: 52.8, color: "#EF4444" },
    { category: "Beauty", returns: 156, riskScore: 38.7, color: "#10B981" },
    { category: "Home", returns: 123, riskScore: 28.4, color: "#F59E0B" },
    { category: "Sports", returns: 98, riskScore: 31.6, color: "#8B5CF6" },
    { category: "Books", returns: 45, riskScore: 18.3, color: "#06B6D4" }
  ];

  const riskDistribution = [
    { name: "Low Risk", value: 8543, color: "#10B981", percentage: 66.5 },
    { name: "Medium Risk", value: 4020, color: "#F59E0B", percentage: 31.3 },
    { name: "High Risk", value: 284, color: "#EF4444", percentage: 2.2 }
  ];

  const topReasons = [
    { reason: "Size/Fit Issues", count: 412, percentage: 28.5 },
    { reason: "Defective/Damaged", count: 356, percentage: 24.7 },
    { reason: "Not as Described", count: 298, percentage: 20.6 },
    { reason: "Wrong Item", count: 187, percentage: 13.0 },
    { reason: "Color Mismatch", count: 142, percentage: 9.8 },
    { reason: "Other", count: 49, percentage: 3.4 }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Deep insights into return patterns and risk trends</p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="12months">
            <SelectTrigger className="w-48">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12months">Last 12 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="1month">Last Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Risk Score</p>
                <p className="text-2xl font-bold">27.3</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">-2.1% vs last period</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Return Rate</p>
                <p className="text-2xl font-bold">18.3%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-red-600 mr-1" />
                  <span className="text-sm text-red-600">+0.8% vs last period</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Risk %</p>
                <p className="text-2xl font-bold">2.2%</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">-0.3% vs last period</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue Impact</p>
                <p className="text-2xl font-bold">$542K</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-red-600 mr-1" />
                  <span className="text-sm text-red-600">+5.2% vs last period</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Return Trends</CardTitle>
            <CardDescription>Returns volume and average risk score over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="returns" fill="#3B82F6" name="Returns" />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="riskScore" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  name="Avg Risk Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Risk Distribution</CardTitle>
            <CardDescription>Breakdown of customers by risk level</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="w-full" style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                      if (percent < 0.05) return null; // Only show label for sections > 5%
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                      const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                      return (
                        <text 
                          x={x} 
                          y={y} 
                          fill="#fff" 
                          textAnchor="middle" 
                          dominantBaseline="central"
                          fontSize={12}
                          fontWeight="bold"
                        >
                          {`${(percent * 100).toFixed(1)}%`}
                        </text>
                      );
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${props.payload.percentage}%`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-4 gap-6">
              {riskDistribution.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center">
                  <div style={{ 
                    width: 12, 
                    height: 12, 
                    backgroundColor: entry.color,
                    marginRight: 8,
                    borderRadius: 3 
                  }} />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{entry.name}</span>
                    <span className="text-xs text-muted-foreground">{entry.percentage}% ({entry.value.toLocaleString()})</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Returns by Category</CardTitle>
            <CardDescription>Category-wise return analysis with risk scores</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="returns" fill="#3B82F6" name="Returns" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Return Reasons */}
        <Card>
          <CardHeader>
            <CardTitle>Top Return Reasons</CardTitle>
            <CardDescription>Most common reasons for returns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topReasons.map((reason, index) => (
                <div key={reason.reason} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <span className="font-medium">{reason.reason}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{reason.count}</Badge>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {reason.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Risk Table */}
      <Card>
        <CardHeader>
          <CardTitle>Category Risk Analysis</CardTitle>
          <CardDescription>Detailed breakdown of return risks by product category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Category</th>
                  <th className="text-left py-3 px-4 font-medium">Total Returns</th>
                  <th className="text-left py-3 px-4 font-medium">Avg Risk Score</th>
                  <th className="text-left py-3 px-4 font-medium">Risk Level</th>
                  <th className="text-left py-3 px-4 font-medium">Trend</th>
                </tr>
              </thead>
              <tbody>
                {categoryData.map((category) => {
                  const getRiskLevel = (score: number) => {
                    if (score >= 50) return { label: "High", variant: "destructive" as const };
                    if (score >= 30) return { label: "Medium", variant: "secondary" as const };
                    return { label: "Low", variant: "default" as const };
                  };
                  
                  const riskLevel = getRiskLevel(category.riskScore);
                  
                  return (
                    <tr key={category.category} className="border-b">
                      <td className="py-3 px-4 font-medium">{category.category}</td>
                      <td className="py-3 px-4">{category.returns}</td>
                      <td className="py-3 px-4">{category.riskScore.toFixed(1)}</td>
                      <td className="py-3 px-4">
                        <Badge variant={riskLevel.variant}>{riskLevel.label}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        {category.riskScore > 40 ? (
                          <TrendingUp className="h-4 w-4 text-red-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-green-500" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;