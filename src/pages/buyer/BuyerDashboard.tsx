import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard, ShoppingCart, Store, CreditCard, Star, UserCircle, Bell,
  Package, DollarSign, Search, SlidersHorizontal, Loader2
} from "lucide-react";

export const buyerNavItems = [
  { label: "Overview", href: "/buyer", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Marketplace", href: "/buyer/marketplace", icon: <Store className="h-4 w-4" /> },
  { label: "My Orders", href: "/buyer/orders", icon: <ShoppingCart className="h-4 w-4" /> },
  { label: "Payments", href: "/buyer/payments", icon: <CreditCard className="h-4 w-4" /> },
  { label: "Reviews", href: "/buyer/reviews", icon: <Star className="h-4 w-4" /> },
  { label: "Profile", href: "/buyer/profile", icon: <UserCircle className="h-4 w-4" /> },
  { label: "Notifications", href: "/buyer/notifications", icon: <Bell className="h-4 w-4" /> },
];

const BuyerDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState([
    { label: "Active Orders", value: "0", icon: Package, color: "text-primary" },
    { label: "Completed Orders", value: "0", icon: ShoppingCart, color: "text-secondary" },
    { label: "Total Spend", value: "₦0", icon: DollarSign, color: "text-primary" },
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile
      const { data: profileData, error: profileError } = await (supabase as any)
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") throw profileError;
      setProfile(profileData);

      // Fetch orders stats
      const { data: orders, error: ordersError } = await (supabase as any)
        .from("orders")
        .select("*")
        .eq("buyer_id", user.id);

      if (ordersError) throw ordersError;

      const activeOrders = (orders as any[])?.filter(o => o.status === "pending").length || 0;
      const completedOrders = (orders as any[])?.filter(o => o.status === "completed").length || 0;
      const totalSpend = (orders as any[])?.filter(o => o.status === "completed").reduce((sum, o) => sum + Number(o.amount), 0) || 0;

      setStats([
        { label: "Active Orders", value: activeOrders.toString(), icon: Package, color: "text-primary" },
        { label: "Completed Orders", value: completedOrders.toString(), icon: ShoppingCart, color: "text-secondary" },
        { label: "Total Spend", value: `₦${totalSpend.toLocaleString()}`, icon: DollarSign, color: "text-primary" },
      ]);
    } catch (error: any) {
      toast({
        title: "Error fetching dashboard",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="buyer" navItems={buyerNavItems}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="buyer" navItems={buyerNavItems} userName={profile?.full_name}>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Buyer Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {profile?.full_name || "Buyer"}! Browse and order fresh produce.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="font-heading text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-semibold text-foreground">Browse Marketplace</h3>
          <Link to="/buyer/marketplace">
            <Button variant="outline" size="sm" className="gap-1">
              <Store className="h-4 w-4" /> View All
            </Button>
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Store className="h-12 w-12 text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">Explore the marketplace to find fresh produce</p>
          <Link to="/buyer/marketplace" className="mt-3">
            <Button size="sm">Browse Listings</Button>
          </Link>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default BuyerDashboard;
