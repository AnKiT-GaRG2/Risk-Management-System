import { useEffect, useState } from "react";
// @ts-ignore
import { getReturns, updateReturnStatus } from "../api/api";
// adjust path as needed

import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  Badge, Button, Input, Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue, Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow, Dialog, DialogContent,
  DialogHeader, DialogTitle, DialogTrigger, Textarea,
} from "../components/ui";



import {
  Search, Filter, Download, Eye, CheckCircle, XCircle,
  Clock, AlertTriangle, Package, MessageSquare,
} from "lucide-react";

const Returns = () => {
  const [returns, setReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReturn, setSelectedReturn] = useState<any | null>(null);

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const data = await getReturns();
        setReturns(data);
      } catch (err) {
        setError("Failed to fetch return requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateReturnStatus(id, newStatus);
      setReturns(prev =>
        prev.map(ret => (ret.id === id ? { ...ret, status: newStatus } : ret))
      );
      setSelectedReturn(null); // close dialog
    } catch (err) {
      alert("Failed to update return status.");
    }
  };

  if (loading) return <p>Loading return requests...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Return Requests</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
  {returns.map((item) => (
    <TableRow key={item.id}>
      <TableCell>{item.orderId}</TableCell>
      <TableCell>{item.customer?.name || "N/A"}</TableCell>
      <TableCell>
        <Badge
          variant={item.status === "rejected" ? "destructive" : "secondary"}
          className={item.status === "approved" ? "bg-green-500 text-white" : ""}
        >
          {item.status}
        </Badge>
      </TableCell>
      <TableCell>{item.reason}</TableCell>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedReturn(item)} size="sm" variant="outline">
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Return Details</DialogTitle>
            </DialogHeader>
            {selectedReturn && (
              <div className="space-y-4">
                <p><strong>Customer:</strong> {selectedReturn.customer?.name || "N/A"}</p>
                <p><strong>Order ID:</strong> {selectedReturn.orderId}</p>
                <p><strong>Reason:</strong> {selectedReturn.reason}</p>
                <Textarea
                  placeholder="Add a note (optional)"
                  className="w-full"
                />
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleStatusUpdate(selectedReturn.id, "approved")}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleStatusUpdate(selectedReturn.id, "rejected")}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  ))}
</TableBody>
      </Table>
    </div>
  );
};

export default Returns;
