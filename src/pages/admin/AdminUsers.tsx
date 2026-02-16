import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard, Users, Wheat, ShoppingCart, CreditCard, BarChart3, FileText,
  Search, UserCheck, UserX, CheckCircle2, XCircle, ShieldCheck
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { label: "Overview", href: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Users", href: "/admin/users", icon: <Users className="h-4 w-4" /> },
  { label: "Listings", href: "/admin/listings", icon: <Wheat className="h-4 w-4" /> },
  { label: "Orders", href: "/admin/orders", icon: <ShoppingCart className="h-4 w-4" /> },
  { label: "Transactions", href: "/admin/transactions", icon: <CreditCard className="h-4 w-4" /> },
  { label: "Analytics", href: "/admin/analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Audit Logs", href: "/admin/audit", icon: <FileText className="h-4 w-4" /> },
];

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    // In a real app, we'd fetch from profiles or a custom RPC
    const { data, error } = await (supabase as any)
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setUsers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleVerification = async (userId: string, currentStatus: boolean) => {
    const { error } = await (supabase as any)
      .from('profiles')
      .update({ verified: !currentStatus })
      .eq('id', userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update verification status.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `User ${!currentStatus ? 'verified' : 'unverified'} successfully.`,
      });
      fetchUsers();
    }
  };

  const filteredUsers = (role: string) => {
    return users.filter(u => {
      const matchesRole = role === 'pending' ? !u.verified : u.role === role;
      const matchesSearch = u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());
      return matchesRole && matchesSearch;
    });
  };

  return (
    <DashboardLayout role="admin" navItems={navItems}>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage farmers, buyers, agents and verifications</p>
        </div>
        <Button onClick={fetchUsers} variant="outline" size="sm" className="gap-2">
          Refresh Data
        </Button>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            className="pl-10 h-11 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="farmers">
        <TabsList className="bg-muted/50 p-1 rounded-xl mb-6">
          <TabsTrigger value="farmers" className="rounded-lg px-6">Farmers</TabsTrigger>
          <TabsTrigger value="buyers" className="rounded-lg px-6">Buyers</TabsTrigger>
          <TabsTrigger value="agents" className="rounded-lg px-6">Agents</TabsTrigger>
          <TabsTrigger value="pending" className="rounded-lg px-6">Pending Verification</TabsTrigger>
        </TabsList>

        {["farmers", "buyers", "agents", "pending"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <Card className="shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border">
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">User Details</th>
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Referral Info</th>
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredUsers(tab.slice(0, -1)).length > 0 ? (
                      filteredUsers(tab.slice(0, -1)).map((user, i) => (
                        <tr key={i} className="hover:bg-muted/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                {user.full_name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-foreground">{user.full_name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {user.verified ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-amber-500" />
                              )}
                              <span className={`text-[10px] font-bold uppercase ${user.verified ? "text-green-600" : "text-amber-600"
                                }`}>
                                {user.verified ? "Verified" : "Pending"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {user.role === 'agent' ? (
                              <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground font-bold uppercase">Code</p>
                                <p className="text-xs font-mono font-bold">{user.referral_code}</p>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground font-bold uppercase">Referred By</p>
                                <p className="text-xs font-medium">{user.referred_by || "Organic"}</p>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-xs text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleVerification(user.id, user.verified)}
                              className={`h-8 rounded-lg gap-1.5 font-bold text-[10px] uppercase ${user.verified ? "hover:text-red-600 hover:bg-red-50" : "hover:text-green-600 hover:bg-green-50"
                                }`}
                            >
                              {user.verified ? (
                                <><UserX className="h-3 w-3" /> Unverify</>
                              ) : (
                                <><UserCheck className="h-3 w-3" /> Verify User</>
                              )}
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-20 text-center">
                          <Users className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                          <p className="text-muted-foreground font-medium">No users found for this category</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </DashboardLayout>
  );
};

export default AdminUsers;
