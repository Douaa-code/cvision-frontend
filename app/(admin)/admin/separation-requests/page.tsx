'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  Check,
  X,
  Loader2
} from 'lucide-react';
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations/variants";

interface SeparationRequest {
  id: number;
  candidate_id: number;
  application_id: number;
  document_path: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_note?: string;
  comment?: string;
  created_at: string;
  candidate_name?: string;
  candidate_email?: string;
  job_title?: string;
  company_name?: string;

  // ✅ نفس applications
  candidateProfilePhotoUrl?: string;

  candidate?: { user?: { id: number; name: string; email: string } };
  application?: {
    jobOffer?: {
      id: number;
      title: string;
      company?: { id: number; company_name: string };
    };
  };
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export default function SeparationRequestsPage() {
  const [requests, setRequests] = useState<SeparationRequest[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    page: 1,
  });
  const [selectedRequest, setSelectedRequest] = useState<SeparationRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionMode, setActionMode] = useState<'view' | 'reject'>('view');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionNote, setActionNote] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';
  const token = typeof window !== 'undefined'
    ? (localStorage.getItem('token') ?? sessionStorage.getItem('token'))
    : null;

  useEffect(() => {
    fetchStats();
    fetchRequests();
  }, [filters]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/separation-requests/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setStats(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(filters.page),
        per_page: '15',
        ...(filters.search && { search: filters.search }),
        ...(filters.status !== 'all' && { status: filters.status }),
      });

      const response = await fetch(`${API_URL}/admin/separation-requests?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) setRequests(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setActionNote('');
  };

  const handleApprove = async (req: SeparationRequest) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/separation-requests/${req.id}/approve`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        fetchRequests();
        fetchStats();
      }
    } catch (error) {
      console.error('Approve error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || !actionNote.trim()) return;
    setActionLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/separation-requests/${selectedRequest.id}/reject`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ admin_note: actionNote }),
      });
      const data = await response.json();
      if (data.success) {
        closeModal();
        fetchRequests();
        fetchStats();
      }
    } catch (error) {
      console.error('Reject error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      if (filters.status !== 'all' && req.status !== filters.status) return false;
      if (filters.search) {
        const term = filters.search.toLowerCase();
        return req.candidate_name?.toLowerCase().includes(term) ||
               req.job_title?.toLowerCase().includes(term) ||
               req.company_name?.toLowerCase().includes(term);
      }
      return true;
    });
  }, [requests, filters]);

  const statCards = [
    { label: "Total", value: stats?.total ?? 0, icon: ClipboardList, color: "text-cvision-blue" },
    { label: "Pending", value: stats?.pending ?? 0, icon: Clock, color: "text-cvision-yellow" },
    { label: "Approved", value: stats?.approved ?? 0, icon: CheckCircle2, color: "text-cvision-green" },
    { label: "Rejected", value: stats?.rejected ?? 0, icon: XCircle, color: "text-cvision-red" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold mb-6">Separation Requests</h1>

      {/* Stats */}
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={staggerItemVariants}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                    <div>
                      <p className="text-2xl font-bold">{loading ? "—" : stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                placeholder="Search by candidate, job, or company..."
                className="pl-10"
              />
            </div>

            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value, page: 1 })}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
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
                    <TableHead>Candidate</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium text-sm">
                        {req.candidate_name ?? req.candidate?.user?.name ?? 'Unknown'}
                      </TableCell>

                      <TableCell className="text-sm">
                        {req.job_title ?? req.application?.jobOffer?.title ?? 'Unknown'}
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground">
                        {req.company_name ?? req.application?.jobOffer?.company?.company_name ?? 'Unknown'}
                      </TableCell>

                      <TableCell className="text-sm">
                        {new Date(req.created_at).toLocaleDateString()}
                      </TableCell>

                      <TableCell>
                        <StatusBadge
                          status={
                            req.status === "pending"
                              ? "Pending"
                              : req.status === "approved"
                              ? "Approved"
                              : "Rejected"
                          }
                        />
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex gap-2 justify-center">
                          <Button size="sm" variant="ghost" onClick={() => {
                            setSelectedRequest(req);
                            setActionMode('view');
                            setShowModal(true);
                          }}>
                            <Eye className="w-4 h-4" />
                          </Button>

                          {req.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-cvision-green"
                                disabled={actionLoading}
                                onClick={() => handleApprove(req)}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-cvision-red"
                                onClick={() => {
                                  setSelectedRequest(req);
                                  setActionMode('reject');
                                  setShowModal(true);
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {filteredRequests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No separation requests found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      {/* View / Reject Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {actionMode === 'view' ? 'Separation Request Details' : 'Reject Request'}
                </h2>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {actionMode === 'view' && (
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <span className="text-muted-foreground">Candidate</span>
                    <span className="font-medium">{selectedRequest.candidate_name ?? 'N/A'}</span>
                    <span className="text-muted-foreground">Email</span>
                    <span>{selectedRequest.candidate_email ?? 'N/A'}</span>
                    <span className="text-muted-foreground">Job Title</span>
                    <span>{selectedRequest.job_title ?? 'N/A'}</span>
                    <span className="text-muted-foreground">Company</span>
                    <span>{selectedRequest.company_name ?? 'N/A'}</span>
                    <span className="text-muted-foreground">Submitted</span>
                    <span>{new Date(selectedRequest.created_at).toLocaleDateString()}</span>
                    <span className="text-muted-foreground">Status</span>
                    <span>
                      <StatusBadge
                        status={
                          selectedRequest.status === 'pending'
                            ? 'Pending'
                            : selectedRequest.status === 'approved'
                            ? 'Approved'
                            : 'Rejected'
                        }
                      />
                    </span>
                  </div>

                  {selectedRequest.comment && (
                    <div>
                      <p className="text-muted-foreground mb-1">Candidate Comment</p>
                      <p className="bg-gray-50 rounded p-2">{selectedRequest.comment}</p>
                    </div>
                  )}

                  {selectedRequest.admin_note && (
                    <div>
                      <p className="text-muted-foreground mb-1">Admin Note</p>
                      <p className="bg-gray-50 rounded p-2">{selectedRequest.admin_note}</p>
                    </div>
                  )}

                  {selectedRequest.document_path && (
                    <div>
                      <p className="text-muted-foreground mb-1">Proof Document</p>
                      <a
                        href={`http://127.0.0.1:8000/storage/${selectedRequest.document_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Document ↗
                      </a>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <Button variant="outline" onClick={closeModal}>Close</Button>
                  </div>
                </div>
              )}

              {actionMode === 'reject' && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Rejecting request for <strong>{selectedRequest.candidate_name}</strong>.
                  </p>
                  <div>
                    <label className="text-sm font-medium block mb-1">Reason for rejection *</label>
                    <textarea
                      value={actionNote}
                      onChange={(e) => setActionNote(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                      rows={3}
                      placeholder="Provide a reason for rejection..."
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={closeModal} disabled={actionLoading}>
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleReject}
                      disabled={actionLoading || !actionNote.trim()}
                    >
                      {actionLoading
                        ? <Loader2 className="w-4 h-4 animate-spin mr-1" />
                        : null}
                      Confirm Reject
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}