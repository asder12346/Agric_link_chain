import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Users, Wheat, ShoppingCart, CreditCard, BarChart3, FileText,
  UserCheck, UserX, Package, DollarSign, TrendingUp, UserPlus
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { label: "Overview", href: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Users", href: "/admin/users", icon: <Users className="h-4 w-4" /> },
  { label: "Listings", href: "/admin/listings", icon: <Wheat className="h-4 w-4" /> },
  { label: "Orders", href: "/admin/orders", icon: <ShoppingCart className="h-4 w-4" /> },
  { label: "Transactions", href: "/admin/transactions", icon: <CreditCard className="h-4 w-4" /> },
  { label: "Analytics", href: "/admin/analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Audit Logs", href: "/admin/audit", icon: <FileText className="h-4 w-4" /> },
];

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    farmers: 0,
    buyers: 0,
    agents: 0,
    orders: 0,
    revenue: 0,
    pending: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      // Use any cast to bypass strict generated types for custom schema additions
      const { data: users } = await (supabase as any).from('profiles').select('role, verified');

      if (users) {
        setMetrics({
          farmers: (users as any[]).filter(u => u.role === 'farmer').length,
          buyers: (users as any[]).filter(u => u.role === 'buyer').length,
          agents: (users as any[]).filter(u => u.role === 'agent').length,
          pending: (users as any[]).filter(u => !u.verified).length,
          orders: 0,
          revenue: 0
        });
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: "Total Farmers", value: metrics.farmers, icon: UserCheck, color: "text-primary" },
    { label: "Total Buyers", value: metrics.buyers, icon: Users, color: "text-secondary" },
    { label: "Total Agents", value: metrics.agents, icon: UserPlus, color: "text-primary" },
    { label: "Total Orders", value: metrics.orders, icon: Package, color: "text-secondary" },
  ];

  return (
    <DashboardLayout role="admin" navItems={navItems}>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview and management</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5 shadow-card border-none bg-white">
            <div className="flex items-center justify-between mb-3 text-sm font-bold text-muted-foreground uppercase tracking-wider">
              {stat.label}
              <stat.icon className={`h-5 w-5 ${stat.color} opacity-40`} />
            </div>
            <p className="font-heading text-3xl font-bold text-foreground">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 shadow-card border-none bg-white lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-lg font-bold text-foreground">Referral Growth</h3>
            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase">Real-time</span>
          </div>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground/10 mb-3" />
            <p className="text-muted-foreground font-medium">Growth analytics will appear here</p>
          </div>
        </Card>

        <Card className="p-6 shadow-card border-none bg-white">
          <h3 className="font-heading text-lg font-bold text-foreground mb-6 text-amber-600">Action Required</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-amber-900">{metrics.pending} Farmers</p>
                <p className="text-xs text-amber-700">Awaiting verification</p>
              </div>
              <UserCheck className="h-5 w-5 text-amber-400" />
            </div>
            <Button variant="ghost" className="w-full text-xs font-bold uppercase tracking-wider text-muted-foreground">View all tasks</Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
