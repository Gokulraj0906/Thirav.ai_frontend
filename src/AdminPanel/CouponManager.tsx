import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, parseISO, isAfter } from 'date-fns';
import Cookies from 'js-cookie';
import { Toaster, toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Plus, 
  Ticket, 
  Calendar, 
  Percent, 
  Hash, 
  Copy, 
  Trash2, 
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  AlarmClock,
  ClipboardCheck
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// API Base URL
const baseUrl = import.meta.env.VITE_BACKEND_API;

// Form Schema
const formSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').max(20, 'Code must be less than 20 characters'),
  discountPercentage: z.number().min(1, 'Discount must be at least 1%').max(100, 'Discount cannot exceed 100%'),
  expiresAt: z.string().min(1, 'Expiration date is required'),
  maxUses: z.number().min(1, 'Max uses must be at least 1'),
});

type FormData = z.infer<typeof formSchema>;

interface Coupon {
  code: string;
  discountPercentage: number;
  expiresAt: string;
  totalUses: number;
  maxUses: number;
  remainingUses: number;
  isActive?: boolean;
}

// Status filter options
type StatusFilter = 'all' | 'active' | 'expired' | 'exhausted';

const CouponManager = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('code');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      discountPercentage: 10,
      expiresAt: '',
      maxUses: 1,
    },
  });

  useEffect(() => {
    fetchCoupons();
  }, [refreshKey]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('auth_token');
      const response = await axios.get(`${baseUrl}/admin/coupons`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Add isActive property to each coupon
      const couponsWithActive = response.data.map((coupon: Coupon) => ({
        ...coupon,
        isActive: isActive(coupon)
      }));
      setCoupons(couponsWithActive);
    } catch (error: any) {
      console.error('Error fetching coupons:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const refreshCoupons = () => {
    setRefreshKey(prev => prev + 1);
  };

  const createCoupon = async (data: FormData) => {
    setIsCreating(true);
    try {
      const token = Cookies.get('auth_token');
      const couponData = {
        code: data.code.toUpperCase(),
        discountPercentage: data.discountPercentage,
        expiresAt: new Date(data.expiresAt).toISOString(),
        maxUses: data.maxUses,
      };

      await axios.post(`${baseUrl}/admin/create-coupon`, couponData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      toast.success('Coupon created successfully!');
      form.reset();
      setDialogOpen(false);
      refreshCoupons();
    } catch (error: any) {
      console.error('Error creating coupon:', error);
      toast.error(error.response?.data?.message || 'Failed to create coupon');
    } finally {
      setIsCreating(false);
    }
  };

  const deleteCoupon = async (code: string) => {
    setIsDeleting(true);
    try {
      const token = Cookies.get('auth_token');
      await axios.delete(`${baseUrl}/admin/delete-coupon/${code}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      toast.success(`Coupon ${code} deleted successfully!`);
      refreshCoupons();
    } catch (error: any) {
      console.error('Error deleting coupon:', error);
      toast.error(error.response?.data?.message || 'Failed to delete coupon');
    } finally {
      setIsDeleting(false);
      setCouponToDelete(null);
    }
  };

  const isActive = (coupon: Coupon): boolean => {
    const now = new Date();
    const expiryDate = new Date(coupon.expiresAt);
    return isAfter(expiryDate, now) && coupon.remainingUses > 0;
  };

  const getStatusBadge = (coupon: Coupon) => {
    const now = new Date();
    const expiryDate = new Date(coupon.expiresAt);
    
    if (!isAfter(expiryDate, now)) {
      return <Badge variant="destructive">Expired</Badge>;
    } else if (coupon.remainingUses === 0) {
      return <Badge variant="secondary">Exhausted</Badge>;
    } else {
      return <Badge variant="default">Active</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied ${code} to clipboard!`);
    
    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  // Filter and sort coupons
  const filteredCoupons = useMemo(() => {
    return coupons
      .filter(coupon => {
        // Apply search filter
        if (searchQuery && !coupon.code.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        
        // Apply status filter
        if (statusFilter === 'active' && !coupon.isActive) {
          return false;
        }
        if (statusFilter === 'expired' && isAfter(new Date(coupon.expiresAt), new Date())) {
          return false;
        }
        if (statusFilter === 'exhausted' && coupon.remainingUses > 0) {
          return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        // Handle different sort fields
        if (sortField === 'code') {
          return sortDirection === 'asc' 
            ? a.code.localeCompare(b.code)
            : b.code.localeCompare(a.code);
        }
        if (sortField === 'discount') {
          return sortDirection === 'asc'
            ? a.discountPercentage - b.discountPercentage
            : b.discountPercentage - a.discountPercentage;
        }
        if (sortField === 'expiry') {
          return sortDirection === 'asc'
            ? new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
            : new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime();
        }
        if (sortField === 'uses') {
          return sortDirection === 'asc'
            ? a.totalUses - b.totalUses
            : b.totalUses - a.totalUses;
        }
        return 0;
      });
  }, [coupons, searchQuery, statusFilter, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Calculate stats
  const stats = useMemo(() => {
    const active = coupons.filter(c => c.isActive).length;
    const expired = coupons.filter(c => !isAfter(new Date(c.expiresAt), new Date())).length;
    const exhausted = coupons.filter(c => c.remainingUses === 0 && isAfter(new Date(c.expiresAt), new Date())).length;
    
    return {
      total: coupons.length,
      active,
      expired,
      exhausted
    };
  }, [coupons]);

  // Calculate time until expiry
  const getTimeUntilExpiry = (expiryDate: string): string => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    
    if (!isAfter(expiry, now)) {
      return 'Expired';
    }
    
    const diffMs = expiry.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays > 30) {
      return `${Math.floor(diffDays / 30)} months`;
    }
    if (diffDays > 0) {
      return `${diffDays} days`;
    }
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours > 0) {
      return `${diffHours} hours`;
    }
    
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return `${diffMins} minutes`;
  };

  return (
    <div className="container mx-auto p-6">
      <Toaster position="top-right" richColors />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Coupon Manager
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create and manage discount coupons for your courses
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Coupons</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Ticket className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Expired</p>
                <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
              </div>
              <AlarmClock className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Exhausted</p>
                <p className="text-2xl font-bold text-gray-600">{stats.exhausted}</p>
              </div>
              <XCircle className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {/* Create Coupon Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Coupon Management</CardTitle>
                <CardDescription>
                  Create and manage discount codes for your customers
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={refreshCoupons}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Refresh coupons</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Coupon
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create New Coupon</DialogTitle>
                      <DialogDescription>
                        Fill in the details to create a new discount coupon
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(createCoupon)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Coupon Code</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="SUMMER50" 
                                  {...field} 
                                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                />
                              </FormControl>
                              <FormDescription>
                                Unique code for the coupon (will be converted to uppercase)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="discountPercentage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Discount Percentage</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="50" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>
                                Percentage discount (1-100)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="expiresAt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiration Date</FormLabel>
                              <FormControl>
                                <Input 
                                  type="datetime-local" 
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                When the coupon expires
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="maxUses"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Maximum Uses</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="10" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>
                                How many times this coupon can be used
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter>
                          <Button type="submit" className="w-full" disabled={isCreating}>
                            {isCreating ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                              </>
                            ) : (
                              'Create Coupon'
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Coupons List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>Current Coupons</CardTitle>
                <CardDescription>
                  Manage your active and expired coupons
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search coupons..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as StatusFilter)}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Coupons</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="exhausted">Exhausted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredCoupons.length === 0 ? (
              <div className="text-center py-8">
                <Ticket className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'No coupons match your search criteria'
                    : 'No coupons created yet'}
                </p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('code')}>
                          <div className="flex items-center">
                            Code
                            {sortField === 'code' && (
                              <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('discount')}>
                          <div className="flex items-center">
                            Discount
                            {sortField === 'discount' && (
                              <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('expiry')}>
                          <div className="flex items-center">
                            Expires
                            {sortField === 'expiry' && (
                              <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('uses')}>
                          <div className="flex items-center">
                            Usage
                            {sortField === 'uses' && (
                              <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCoupons.map((coupon) => (
                        <TableRow key={coupon.code}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <Ticket className="mr-2 h-4 w-4 text-gray-500" />
                              <span>{coupon.code}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Percent className="mr-1 h-3 w-3 text-gray-500" />
                              {coupon.discountPercentage}%
                            </div>
                          </TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center">
                                    <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                                    {formatDate(coupon.expiresAt)}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{getTimeUntilExpiry(coupon.expiresAt)} {isAfter(new Date(coupon.expiresAt), new Date()) ? 'remaining' : 'ago'}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Hash className="mr-1 h-3 w-3 text-gray-500" />
                              {coupon.totalUses} / {coupon.maxUses}
                              <span className="ml-2 text-sm text-gray-500">
                                ({coupon.remainingUses} left)
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(coupon)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleCopyCode(coupon.code)}
                                    >
                                      {copiedCode === coupon.code ? (
                                        <ClipboardCheck className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <Copy className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{copiedCode === coupon.code ? 'Copied!' : 'Copy code'}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => setCouponToDelete(coupon.code)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete the coupon <span className="font-bold">{couponToDelete}</span>? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-600 hover:bg-red-700"
                                      onClick={() => couponToDelete && deleteCoupon(couponToDelete)}
                                      disabled={isDeleting}
                                    >
                                      {isDeleting ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Deleting...
                                        </>
                                      ) : (
                                        'Delete'
                                      )}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CouponManager;