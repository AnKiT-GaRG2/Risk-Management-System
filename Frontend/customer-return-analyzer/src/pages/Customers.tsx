import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar
} from "lucide-react";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const customers = [
    {
      id: "CUST001",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      riskScore: 92,
      totalOrders: 18,
      returns: 15,
      returnRate: 83.3,
      joinDate: "2023-01-15",
      lastOrder: "2024-01-10",
      category: "Electronics",
      totalSpent: 2850,
      avgReturnTime: 1.2,
      commonReasons: ["Defective", "Not as described"],
      flags: ["Multiple defective claims", "Quick returns"]
    },
    {
      id: "CUST045",
      name: "Mike Chen",
      email: "mike.chen@email.com",
      riskScore: 87,
      totalOrders: 16,
      returns: 12,
      returnRate: 75.0,
      joinDate: "2023-03-22",
      lastOrder: "2024-01-08",
      category: "Fashion",
      totalSpent: 1920,
      avgReturnTime: 0.8,
      commonReasons: ["Size issue", "Color mismatch"],
      flags: ["Frequent size returns", "Same-day returns"]
    },
    {
      id: "CUST123",
      name: "Emma Davis",
      email: "emma.davis@email.com",
      riskScore: 84,
      totalOrders: 28,
      returns: 23,
      returnRate: 82.1,
      joinDate: "2022-11-08",
      lastOrder: "2024-01-12",
      category: "Beauty",
      totalSpent: 3420,
      avgReturnTime: 2.1,
      commonReasons: ["Not suitable", "Allergic reaction"],
      flags: ["High return volume", "Vague reasons"]
    },
    {
      id: "CUST089",
      name: "Robert Wilson",
      email: "robert.w@email.com",
      riskScore: 45,
      totalOrders: 25,
      returns: 8,
      returnRate: 32.0,
      joinDate: "2023-05-14",
      lastOrder: "2024-01-09",
      category: "Electronics",
      totalSpent: 4560,
      avgReturnTime: 5.4,
      commonReasons: ["Defective", "Wrong item"],
      flags: []
    },
    {
      id: "CUST234",
      name: "Lisa Brown",
      email: "lisa.brown@email.com",
      riskScore: 28,
      totalOrders: 19,
      returns: 3,
      returnRate: 15.8,
      joinDate: "2023-07-30",
      lastOrder: "2024-01-11",
      category: "Home",
      totalSpent: 2180,
      avgReturnTime: 7.2,
      commonReasons: ["Size issue"],
      flags: []
    }
  ];

  const getRiskBadge = (score: number) => {
    if (score >= 70) return { variant: "destructive" as const, label: "High Risk", color: "text-red-600" };
    if (score >= 40) return { variant: "secondary" as const, label: "Medium Risk", color: "text-yellow-600" };
    return { variant: "default" as const, label: "Low Risk", color: "text-green-600" };
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRisk = riskFilter === "all" ||
                       (riskFilter === "high" && customer.riskScore >= 70) ||
                       (riskFilter === "medium" && customer.riskScore >= 40 && customer.riskScore < 70) ||
                       (riskFilter === "low" && customer.riskScore < 40);
    
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk Levels</SelectItem>
              <SelectItem value="high">High Risk (70+)</SelectItem>
              <SelectItem value="medium">Medium Risk (40-69)</SelectItem>
              <SelectItem value="low">Low Risk (0-39)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Customer Risk Analysis
            <Badge variant="secondary">{filteredCustomers.length} customers</Badge>
          </CardTitle>
          <CardDescription>
            Monitor customer return patterns and risk scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Return Rate</TableHead>
                  <TableHead>Orders/Returns</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => {
                  const riskBadge = getRiskBadge(customer.riskScore);
                  return (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">{customer.email}</div>
                          <div className="text-xs text-muted-foreground">{customer.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge {...riskBadge}>{customer.riskScore}</Badge>
                          {customer.flags.length > 0 && (
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={riskBadge.color}>{customer.returnRate.toFixed(1)}%</span>
                          {customer.returnRate > 50 ? (
                            <TrendingUp className="h-4 w-4 text-red-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {customer.totalOrders} orders / {customer.returns} returns
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">${customer.totalSpent.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedCustomer(customer)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Customer Profile: {customer.name}</DialogTitle>
                            </DialogHeader>
                            
                            {selectedCustomer && (
                              <div className="space-y-6">
                                {/* Risk Score */}
                                <div className="grid grid-cols-2 gap-4">
                                  <Card>
                                    <CardContent className="pt-6">
                                      <div className="text-center">
                                        <div className="text-3xl font-bold mb-2">{selectedCustomer.riskScore}</div>
                                        <Badge {...getRiskBadge(selectedCustomer.riskScore)}>
                                          {getRiskBadge(selectedCustomer.riskScore).label}
                                        </Badge>
                                        <Progress value={selectedCustomer.riskScore} className="mt-3" />
                                      </div>
                                    </CardContent>
                                  </Card>
                                  
                                  <div className="space-y-3">
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Customer ID:</span>
                                      <span className="text-sm font-medium">{selectedCustomer.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Email:</span>
                                      <span className="text-sm">{selectedCustomer.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Join Date:</span>
                                      <span className="text-sm">{selectedCustomer.joinDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Last Order:</span>
                                      <span className="text-sm">{selectedCustomer.lastOrder}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4">
                                  <Card>
                                    <CardContent className="pt-4 text-center">
                                      <div className="text-2xl font-bold">{selectedCustomer.returns}</div>
                                      <div className="text-sm text-muted-foreground">Total Returns</div>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardContent className="pt-4 text-center">
                                      <div className="text-2xl font-bold">{selectedCustomer.returnRate.toFixed(1)}%</div>
                                      <div className="text-sm text-muted-foreground">Return Rate</div>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardContent className="pt-4 text-center">
                                      <div className="text-2xl font-bold">{selectedCustomer.avgReturnTime}</div>
                                      <div className="text-sm text-muted-foreground">Avg Return Days</div>
                                    </CardContent>
                                  </Card>
                                </div>

                                {/* Flags & Reasons */}
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Risk Flags</h4>
                                    {selectedCustomer.flags.length > 0 ? (
                                      <div className="flex flex-wrap gap-2">
                                        {selectedCustomer.flags.map((flag: string, index: number) => (
                                          <Badge key={index} variant="destructive" className="text-xs">
                                            {flag}
                                          </Badge>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-muted-foreground">No risk flags</p>
                                    )}
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium mb-2">Common Return Reasons</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedCustomer.commonReasons.map((reason: string, index: number) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {reason}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;