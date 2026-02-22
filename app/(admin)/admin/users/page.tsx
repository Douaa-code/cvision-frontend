"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Shield, Ban } from "lucide-react";
import { mockAdminUsers } from "@/lib/mock-data/admin";

const roleBadgeColors: Record<string, string> = {
  admin: "bg-cvision-blue/10 text-cvision-blue border-cvision-blue/30",
  candidate: "bg-cvision-green-bg text-cvision-green border-cvision-green/30",
  company: "bg-cvision-yellow-bg text-cvision-yellow border-cvision-yellow/30",
};

const statusColors: Record<string, string> = {
  Active: "bg-cvision-green-bg text-cvision-green",
  Pending: "bg-cvision-yellow-bg text-cvision-yellow",
  Suspended: "bg-cvision-red-bg text-cvision-red",
};

export default function UsersManagementPage() {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [users, setUsers] = useState(mockAdminUsers);
  const [suspendDialog, setSuspendDialog] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    if (filterRole !== "all" && u.role !== filterRole) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleToggleSuspend = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "Suspended" ? ("Active" as const) : ("Suspended" as const) }
          : u
      )
    );
    setSuspendDialog(null);
  };

  const suspendUser = users.find((u) => u.id === suspendDialog);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold mb-6">Users Management</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{users.length}</p>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-cvision-green">
              {users.filter((u) => u.role === "candidate").length}
            </p>
            <p className="text-sm text-muted-foreground">Candidates</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-cvision-yellow">
              {users.filter((u) => u.role === "company").length}
            </p>
            <p className="text-sm text-muted-foreground">Companies</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-cvision-blue">
              {users.filter((u) => u.role === "admin").length}
            </p>
            <p className="text-sm text-muted-foreground">Admins</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-4">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="pl-10" />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="candidate">Candidate</SelectItem>
                <SelectItem value="company">Company</SelectItem>
              </SelectContent>
            </Select>
            {(search !== "" || filterRole !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSearch(""); setFilterRole("all"); }}
                className="text-cvision-green bg-cvision-green/10 hover:bg-cvision-green hover:text-white rounded-lg px-4 shadow-sm hover:shadow-md transition-all duration-200"
              >
                Reset
              </Button>
            )}
            <span className="text-sm text-muted-foreground">{filtered.length} users</span>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cvision-bar flex items-center justify-center text-xs font-bold text-muted-foreground">
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={roleBadgeColors[user.role]}>
                        {user.role === "admin" && <Shield className="w-3 h-3 mr-1" />}
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${statusColors[user.status]}`}>
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {user.role !== "admin" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSuspendDialog(user.id)}
                          title={user.status === "Suspended" ? "Reactivate" : "Suspend"}
                        >
                          <Ban className={`w-4 h-4 ${user.status === "Suspended" ? "text-cvision-green" : "text-cvision-red"}`} />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Suspend Dialog */}
      <Dialog open={!!suspendDialog} onOpenChange={() => setSuspendDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {suspendUser?.status === "Suspended" ? "Reactivate" : "Suspend"} User
            </DialogTitle>
            <DialogDescription>
              {suspendUser?.status === "Suspended"
                ? `Reactivate ${suspendUser.name}'s account? They will regain access to the platform.`
                : `Suspend ${suspendUser?.name}'s account? They will lose access to the platform.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendDialog(null)}>Cancel</Button>
            <Button
              variant={suspendUser?.status === "Suspended" ? "default" : "destructive"}
              onClick={() => suspendDialog && handleToggleSuspend(suspendDialog)}
            >
              {suspendUser?.status === "Suspended" ? "Reactivate" : "Suspend"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
