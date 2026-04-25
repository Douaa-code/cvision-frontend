"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
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
import { Search, Shield, ShieldUser, User, Ban, Eye } from "lucide-react";
import { adminApi, AdminUser, AdminUsersSummary } from "@/lib/api/admin";

const roleBadgeColors: Record<string, string> = {
  admin: "bg-red-100 text-red-700 border-red-200",
  candidate: "bg-green-100 text-green-700 border-green-200",
  company: "bg-blue-100 text-blue-700 border-blue-200",
};

const statusColors: Record<string, string> = {
  Active: "bg-cvision-green-bg text-cvision-green",
  Pending: "bg-cvision-yellow-bg text-cvision-yellow",
  Suspended: "bg-cvision-red-bg text-cvision-red",
};

export default function UsersManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [summary, setSummary] = useState<AdminUsersSummary>({ total: 0, candidates: 0, companies: 0, admins: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [suspendDialog, setSuspendDialog] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    adminApi
      .getUsers()
      .then(({ data, summary: s }) => {
        setUsers(data);
        setSummary(s);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = useMemo(() =>
    users.filter((u) => {
      if (filterRole !== "all" && u.role !== filterRole) return false;
      if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }),
  [users, filterRole, search]);

  const suspendUser = users.find((u) => u.id === suspendDialog);

  const handleToggleSuspend = async () => {
    if (!suspendUser) return;
    setActionLoading(true);
    try {
      if (suspendUser.status === "Suspended") {
        await adminApi.reactivateUser(suspendUser.id);
      } else {
        await adminApi.suspendUser(suspendUser.id);
      }
      setSuspendDialog(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold mb-6">Users Management</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{loading ? "—" : summary.total}</p>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-cvision-green">{loading ? "—" : summary.candidates}</p>
            <p className="text-sm text-muted-foreground">Candidates</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-cvision-blue">{loading ? "—" : summary.companies}</p>
            <p className="text-sm text-muted-foreground">Companies</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-cvision-red">{loading ? "—" : summary.admins}</p>
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
          </div>
          <div className="flex justify-end mt-3">
            <span className="text-sm text-muted-foreground">{filtered.length} users</span>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-8">Loading…</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {user.role === "admin" ? (
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                              <ShieldUser className="w-4 h-4 text-red-600" />
                            </div>
                          ) : user.profilePhotoUrl ? (
                            <img src={user.profilePhotoUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-cvision-bar flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                              {user.name.charAt(0)}
                            </div>
                          )}
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
                        <span className={`text-xs font-medium px-2 py-1 rounded ${statusColors[user.status] ?? ""}`}>
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {user.role === "company" && (
                            <Link href={`/admin/companies`}>
                              <Button variant="ghost" size="sm" title="View companies">
                                <Eye className="w-4 h-4 text-muted-foreground" />
                              </Button>
                            </Link>
                          )}
                          {user.role === "candidate" && (
                            <Link href="/admin/candidates">
                              <Button variant="ghost" size="sm" title="View profile">
                                <Eye className="w-4 h-4 text-muted-foreground" />
                              </Button>
                            </Link>
                          )}
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
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suspend / Reactivate Dialog */}
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
            <Button variant="outline" onClick={() => setSuspendDialog(null)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              variant={suspendUser?.status === "Suspended" ? "default" : "destructive"}
              onClick={handleToggleSuspend}
              disabled={actionLoading}
            >
              {actionLoading ? "Processing…" : suspendUser?.status === "Suspended" ? "Reactivate" : "Suspend"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
