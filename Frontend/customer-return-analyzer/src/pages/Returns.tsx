import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Package,
  MessageSquare
} from "lucide-react";

const Returns = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReturn, setSelectedReturn] = useState<any>(null);

  const returns = [
    {
      id: "RET001",
      orderId: "ORD12845",
      customer: {
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        id: "CUST001"
      },
      product: {
        name: "iPhone 15 Pro Max",
        sku: "APL-IP15PM-256-TI",
        category: "Electronics",
        price: 1199
      },
      reason: "Screen flickering issue",
      status: "pending",
      riskScore: 92,
      requestDate: "2024-01-15",
      responseTime: "2 days",
      images: ["defect1.jpg", "defect2.jpg"],
      adminNotes: "Customer reported screen flickering. Awaiting technical review.",
      flags: ["High risk customer", "Multiple defective claims"]
    },
    {
      id: "RET002",
      orderId: "ORD12834",
      customer: {
        name: "Mike Chen",
        email: "mike.chen@email.com",
        id: "CUST045"
      },
      product: {
        name: "Nike Air Max 270",
        sku: "NIK-AM270-43-BLK",
        category: "Fashion",
        price: 150
      },
      reason: "Wrong size received",
      status: "approved",
      riskScore: 34,
      requestDate: "2024-01-14",
      responseTime: "1 day",
      images: [],
      adminNotes: "Size mismatch confirmed. Return approved.",
      flags: []
    },
    {
      id: "RET003",
      orderId: "ORD12823",
      customer: {
        name: "Emma Davis",
        email: "emma.davis@email.com",
        id: "CUST123"
      },
      product: {
        name: "Chanel No.5 Perfume",
        sku: "CHA-N5-50ML",
        category: "Beauty",
        price: 120
      },
      reason: "Allergic reaction",
      status: "rejected",
      riskScore: 78,
      requestDate: "2024-01-13",
      responseTime: "3 days",
      images: [],
      adminNotes: "No medical documentation provided. Return denied.",
      flags: ["Vague medical claim", "High return rate"]
    },
    {
      id: "RET004",
      orderId: "ORD12812",
      customer: {
        name: "Robert Wilson",
        email: "robert.w@email.com",
        id: "CUST089"
      },
      product: {
        name: "Samsung 65\" QLED TV",
        sku: "SAM-Q65-QLED",
        category: "Electronics",
        price: 1299
      },
      reason: "Dead pixels on screen",
      status: "approved",
      riskScore: 23,
      requestDate: "2024-01-12",
      responseTime: "1 day",
      images: ["pixel_defect.jpg"],
      adminNotes: "Manufacturing defect confirmed. Fast-track replacement approved.",
      flags: []
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return { variant: "default" as const, label: "Approved", icon: CheckCircle, color: "text-green-600" };
      case "rejected":
        return { variant: "destructive" as const, label: "Rejected", icon: XCircle, color: "text-red-600" };
      case "pending":
        return { variant: "secondary" as const, label: "Pending", icon: Clock, color: "text-yellow-600" };
      default:
        return { variant: "outline" as const, label: "Unknown", icon: Clock, color: "text-gray-600" };
    }
  };

  const getRiskBadge = (score: number) => {
    if (score >= 70) return { variant: "destructive" as const, label: "High Risk" };
    if (score >= 40) return { variant: "secondary" as const, label: "Medium Risk" };
    return { variant: "default" as const, label: "Low Risk" };
  };

  const filteredReturns = returns.filter(returnItem => {
    const matchesSearch = returnItem.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         returnItem.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         returnItem.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || returnItem.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search returns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-xl font-bold">156</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-xl font-bold">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">High Risk</p>
                <p className="text-xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Returns Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Return Requests
            <Badge variant="secondary">{filteredReturns.length} requests</Badge>
          </CardTitle>
          <CardDescription>
            Manage and review customer return requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Return ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReturns.map((returnItem) => {
                  const statusBadge = getStatusBadge(returnItem.status);
                  const riskBadge = getRiskBadge(returnItem.riskScore);
                  const StatusIcon = statusBadge.icon;
                  
                  return (
                    <TableRow key={returnItem.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{returnItem.id}</div>
                          <div className="text-sm text-muted-foreground">{returnItem.orderId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{returnItem.customer.name}</div>
                          <div className="text-sm text-muted-foreground">{returnItem.customer.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{returnItem.product.name}</div>
                          <div className="text-sm text-muted-foreground">${returnItem.product.price}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm truncate">{returnItem.reason}</p>
                          {returnItem.flags.length > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <AlertTriangle className="h-3 w-3 text-amber-500" />
                              <span className="text-xs text-amber-600">{returnItem.flags.length} flag(s)</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`h-4 w-4 ${statusBadge.color}`} />
                          <Badge {...statusBadge}>{statusBadge.label}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge {...riskBadge}>{returnItem.riskScore}</Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedReturn(returnItem)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Return Request Details: {returnItem.id}</DialogTitle>
                            </DialogHeader>
                            
                            {selectedReturn && (
                              <div className="space-y-6">
                                {/* Header Info */}
                                <div className="grid grid-cols-2 gap-6">
                                  <Card>
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-base">Customer Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Name:</span>
                                        <span className="text-sm font-medium">{selectedReturn.customer.name}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Email:</span>
                                        <span className="text-sm">{selectedReturn.customer.email}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Customer ID:</span>
                                        <span className="text-sm">{selectedReturn.customer.id}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Risk Score:</span>
                                        <Badge {...getRiskBadge(selectedReturn.riskScore)}>
                                          {selectedReturn.riskScore}
                                        </Badge>
                                      </div>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card>
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-base">Product Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Product:</span>
                                        <span className="text-sm font-medium">{selectedReturn.product.name}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">SKU:</span>
                                        <span className="text-sm">{selectedReturn.product.sku}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Category:</span>
                                        <span className="text-sm">{selectedReturn.product.category}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Price:</span>
                                        <span className="text-sm font-medium">${selectedReturn.product.price}</span>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>

                                {/* Return Details */}
                                <Card>
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                      <Package className="h-4 w-4" />
                                      Return Details
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Request Date</label>
                                        <p className="text-sm">{selectedReturn.requestDate}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Response Time</label>
                                        <p className="text-sm">{selectedReturn.responseTime}</p>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Return Reason</label>
                                      <p className="text-sm mt-1">{selectedReturn.reason}</p>
                                    </div>
                                    
                                    {selectedReturn.flags.length > 0 && (
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Risk Flags</label>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                          {selectedReturn.flags.map((flag: string, index: number) => (
                                            <Badge key={index} variant="destructive" className="text-xs">
                                              {flag}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>

                                {/* Admin Notes */}
                                <Card>
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                      <MessageSquare className="h-4 w-4" />
                                      Admin Notes & Decision
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Current Status</label>
                                      <div className="mt-1">
                                        <Badge {...getStatusBadge(selectedReturn.status)}>
                                          {getStatusBadge(selectedReturn.status).label}
                                        </Badge>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Admin Notes</label>
                                      <Textarea 
                                        value={selectedReturn.adminNotes}
                                        readOnly
                                        className="mt-1"
                                        rows={3}
                                      />
                                    </div>

                                    {selectedReturn.status === "pending" && (
                                      <div className="flex gap-3 pt-4">
                                        <Button className="flex-1">
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Approve Return
                                        </Button>
                                        <Button variant="destructive" className="flex-1">
                                          <XCircle className="h-4 w-4 mr-2" />
                                          Reject Return
                                        </Button>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
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

export default Returns;