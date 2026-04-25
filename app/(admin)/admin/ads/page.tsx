'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  LayoutGrid,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  staggerContainerVariants,
  staggerItemVariants,
} from '@/lib/animations/variants';

interface Ad {
  id: number;
  company_id: number;
  image_url: string;
  link_url: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_note?: string;
  created_at: string;
  company_name?: string;
  email?: string;
  domain?: string;
  wilaya?: string;
  company?: { company_name?: string; domain?: string; wilaya?: string; user?: { email?: string } };
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export default function AdsManagementPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionNote, setActionNote] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';
  const token = typeof window !== 'undefined'
    ? (localStorage.getItem('token') ?? sessionStorage.getItem('token'))
    : null;

  useEffect(() => {
    fetchAds();
    fetchStats();
  }, [search, filterStatus]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/ads/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setStats(data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchAds = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filterStatus && filterStatus !== 'all') params.append('status', filterStatus);

      const response = await fetch(`${API_URL}/admin/ads?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setAds(data.data);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (ad: Ad) => {
    setSelectedAd(ad);
    setActionNote(ad.admin_note || '');
    setShowModal(true);
  };

  const handleReject = async (ad: Ad) => {
    setSelectedAd(ad);
    setActionNote('');
    setShowModal(true);
  };

  const submitAction = async (action: 'approve' | 'reject') => {
    if (!selectedAd) return;
    setActionLoading(true);

    try {
      const response = await fetch(`${API_URL}/admin/ads/${selectedAd.id}/${action}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ admin_note: actionNote }),
      });

      const data = await response.json();
      if (data.success) {
        setShowModal(false);
        fetchAds();
        fetchStats();
      }
    } catch (error) {
      console.error(`Error ${action}ing ad:`, error);
    } finally {
      setActionLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Requests', value: stats?.total ?? 0, icon: LayoutGrid, color: 'text-cvision-blue', bg: 'bg-cvision-container' },
    { label: 'Pending', value: stats?.pending ?? 0, icon: Clock, color: 'text-cvision-yellow', bg: 'bg-cvision-yellow-bg' },
    { label: 'Approved', value: stats?.approved ?? 0, icon: CheckCircle2, color: 'text-cvision-green', bg: 'bg-cvision-green-bg' },
    { label: 'Rejected', value: stats?.rejected ?? 0, icon: XCircle, color: 'text-cvision-red', bg: 'bg-cvision-red-bg' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold mb-6">Ads Management</h1>

      {/* Stats Cards */}
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
                      <p className="text-2xl font-bold">{loading ? '—' : stat.value}</p>
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
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-4">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by company name..."
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
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
            {(search !== '' || filterStatus !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSearch(''); setFilterStatus('all'); }}
                className="text-cvision-green bg-cvision-green/10 hover:bg-cvision-green hover:text-white rounded-lg px-4 shadow-sm hover:shadow-md transition-all duration-200"
              >
                Reset
              </Button>
            )}
          </div>
          <div className="flex justify-end mt-3">
            <span className="text-sm text-muted-foreground">{ads.length} ads</span>
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
                    <TableHead>Company</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ads.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell className="text-sm font-medium">{ad.company_name ?? ad.company?.company_name ?? 'Unknown'}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{ad.email ?? ad.company?.user?.email ?? '-'}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{ad.domain ?? ad.company?.domain ?? '-'}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{ad.wilaya ?? ad.company?.wilaya ?? '-'}</TableCell>
                      <TableCell className="text-sm">{new Date(ad.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <StatusBadge status={ad.status === 'approved' ? 'Approved' : ad.status === 'rejected' ? 'Rejected' : 'Pending'} />
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedAd(ad);
                              setShowModal(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {ad.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-cvision-green hover:text-white hover:bg-cvision-green"
                                onClick={() => handleApprove(ad)}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-cvision-red hover:text-white hover:bg-cvision-red"
                                onClick={() => handleReject(ad)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {ads.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No ads found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      {showModal && selectedAd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Ad Details</h2>
              <p className="text-sm text-muted-foreground">{selectedAd.company_name ?? selectedAd.company?.company_name ?? 'Unknown'}</p>
            </div>

            <img
              src={`${process.env.NEXT_PUBLIC_STORAGE_URL ?? 'http://127.0.0.1:8000/storage'}/${selectedAd.image_url}`}
              alt="Ad"
              className="w-full aspect-[4/1] object-cover rounded"
            />

            <div>
              <p className="text-sm font-semibold text-muted-foreground">Link URL</p>
              <a
                href={selectedAd.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cvision-blue hover:underline break-all"
              >
                {selectedAd.link_url}
              </a>
            </div>

            {selectedAd.status === 'pending' && (
              <div className="space-y-4">
                <textarea
                  placeholder="Admin note (required for rejection)..."
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  className="w-full p-2 border border-border rounded text-sm"
                  rows={3}
                />
                <div className="flex gap-3">
                  <Button
                    onClick={() => submitAction('approve')}
                    disabled={actionLoading}
                    className="flex-1 bg-cvision-green hover:bg-cvision-green/90"
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                    Approve
                  </Button>
                  <Button
                    onClick={() => submitAction('reject')}
                    disabled={actionLoading || !actionNote.trim()}
                    className="flex-1 bg-cvision-red hover:bg-cvision-red/90"
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <X className="w-4 h-4 mr-2" />}
                    Reject
                  </Button>
                </div>
              </div>
            )}

            <Button onClick={() => setShowModal(false)} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}