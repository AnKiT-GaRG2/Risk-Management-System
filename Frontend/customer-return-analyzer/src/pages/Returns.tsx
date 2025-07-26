import { useEffect, useState } from "react";
// @ts-ignore
import { getReturns, updateReturnStatus } from "../api/api";

import {
  Card, CardContent, CardHeader, CardTitle, Badge, Button,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Textarea
} from "../components/ui";

import { Eye, CheckCircle, XCircle } from "lucide-react";

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

  const handleStatusUpdate = async (_id: string, newStatus: string) => {
    try {
      await updateReturnStatus(_id, newStatus);
      setReturns(prev =>
        prev.map(ret => (ret._id === _id ? { ...ret, status: newStatus } : ret))
      );
      setSelectedReturn(null); // Close modal
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
            <TableHead>Return ID</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {returns.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.returnId}</TableCell>
              <TableCell>{item.customerName ?? "N/A"}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={
                    item.status === "approved"
                      ? "bg-green-500 text-white"
                      : item.status === "rejected"
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-black"
                  }
                >
                  {item.status ?? "pending"}
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
                      <div className="space-y-3">
                        <p><strong>Customer:</strong> {selectedReturn.customerName}</p>
                        <p><strong>Customer ID:</strong> {selectedReturn.customerId}</p>
                        <p><strong>Product:</strong> {selectedReturn.product}</p>
                        <p><strong>Reason:</strong> {selectedReturn.reason}</p>
                        <p><strong>Return Date:</strong> {new Date(selectedReturn.returnDate).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> {selectedReturn.status ?? "pending"}</p>

                        <Textarea placeholder="Add a note (optional)" className="w-full" />
                        <div className="flex gap-2 pt-2">
                          <Button
                            className="flex-1"
                            onClick={() => handleStatusUpdate(selectedReturn._id, "approved")}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            className="flex-1"
                            onClick={() => handleStatusUpdate(selectedReturn._id, "rejected")}
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
