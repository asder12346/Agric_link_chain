import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard, Wheat, ShoppingCart, Wallet, Star, UserCircle, Bell,
  Package, DollarSign, TrendingUp, Plus, Loader2
} from "lucide-react";

export const farmerNavItems = [
  { label: "Overview", href: "/farmer", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "My Listings", href: "/farmer/listings", icon: <Wheat className="h-4 w-4" /> },
  { label: "My Orders", href: "/farmer/orders", icon: <ShoppingCart className="h-4 w-4" /> },
  { label: "Earnings", href: "/farmer/earnings", icon: <Wallet className="h-4 w-4" /> },
  { label: "Reviews", href: "/farmer/reviews", icon: <Star className="h-4 w-4" /> },
  { label: "Profile", href: "/farmer/profile", icon: <UserCircle className="h-4 w-4" /> },
  { label: "Notifications", href: "/farmer/notifications", icon: <Bell className="h-4 w-4" /> },
];

const FarmerDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState([
    { label: "Total Listings", value: "0", icon: Package, color: "text-primary" },
    { label: "Active Orders", value: "0", icon: ShoppingCart, color: "text-secondary" },
    { label: "Completed Sales", value: "0", icon: TrendingUp, color: "text-primary" },
    { label: "Total Earnings", value: "₦0", icon: DollarSign, color: "text-secondary" },
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") throw profileError;
      setProfile(profileData);

      // Fetch listings count
      const { count: listingsCount, error: listingsError } = await supabase
        .from("orders") // This should be from a listings table, but using orders as proxy for now if listings doesn't exist
        .select("*", { count: 'exact', head: true })
        .eq("farmer_id", user.id);

      // Fetch orders stats
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("farmer_id", user.id);

      if (ordersError) throw ordersError;

      const activeOrders = orders?.filter(o => o.status === "pending").length || 0;
      const completedSales = orders?.filter(o => o.status === "completed").length || 0;
      const totalEarnings = profileData?.total_earnings || 0;

      setStats([
        { label: "Total Listings", value: "0", icon: Package, color: "text-primary" }, // TODO: Add listings table
        { label: "Active Orders", value: activeOrders.toString(), icon: ShoppingCart, color: "text-secondary" },
        { label: "Completed Sales", value: completedSales.toString(), icon: TrendingUp, color: "text-primary" },
        { label: "Total Earnings", value: `₦${totalEarnings.toLocaleString()}`, icon: DollarSign, color: "text-secondary" },
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
      <DashboardLayout role="farmer" navItems={farmerNavItems}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="farmer" navItems={farmerNavItems} userName={profile?.full_name}>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Farmer Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {profile?.full_name || "Farmer"}! Here's your farm overview.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-semibold text-foreground">Recent Listings</h3>
            <Link to="/farmer/listings">
              <Button size="sm" className="gap-1"><Plus className="h-4 w-4" /> Add Listing</Button>
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Wheat className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">No listings yet</p>
            <p className="text-sm text-muted-foreground/70">Create your first listing to start selling</p>
          </div>
        </Card>

        <Card className="p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-semibold text-foreground">Recent Orders</h3>
            <Link to="/farmer/orders">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">No orders yet</p>
            <p className="text-sm text-muted-foreground/70">Orders will appear here when buyers purchase your products</p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FarmerDashboard;
