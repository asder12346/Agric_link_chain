import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Wallet, TrendingUp, ArrowUpRight, Loader2, Calendar } from "lucide-react";
import { farmerNavItems } from "./FarmerDashboard";

const FarmerEarnings = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total_earnings: 0,
        active_orders_value: 0,
        completed_sales: 0,
        pending_payout: 0,
    });
    const [transactions, setTransactions] = useState<any[]>([]);

    useEffect(() => {
        getEarningsData();
    }, []);

    const getEarningsData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch profile for total earnings
            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("total_earnings")
                .eq("id", user.id)
                .single();

            if (profileError) throw profileError;

            // Fetch completed and pending orders
            const { data: orders, error: ordersError } = await supabase
                .from("orders")
                .select("*")
                .eq("farmer_id", user.id)
                .order("created_at", { ascending: false });

            if (ordersError) throw ordersError;

            const completedOrders = orders?.filter(o => o.status === "completed") || [];
            const pendingOrders = orders?.filter(o => o.status === "pending") || [];

            setStats({
                total_earnings: profile?.total_earnings || 0,
                active_orders_value: pendingOrders.reduce((sum, o) => sum + Number(o.amount), 0),
                completed_sales: completedOrders.length,
                pending_payout: pendingOrders.reduce((sum, o) => sum + Number(o.amount), 0),
            });

            setTransactions(orders || []);
        } catch (error: any) {
            toast({
                title: "Error fetching earnings",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: "Total Earnings", value: `₦${stats.total_earnings.toLocaleString()}`, icon: DollarSign, color: "text-primary" },
        { label: "Pending Payout", value: `₦${stats.pending_payout.toLocaleString()}`, icon: Wallet, color: "text-secondary" },
        { label: "Active Orders Value", value: `₦${stats.active_orders_value.toLocaleString()}`, icon: TrendingUp, color: "text-primary" },
        { label: "Completed Sales", value: stats.completed_sales.toString(), icon: ArrowUpRight, color: "text-secondary" },
    ];

    return (
        <DashboardLayout role="farmer" navItems={farmerNavItems}>
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="font-heading text-3xl font-bold text-foreground">Earnings</h1>
                    <p className="text-muted-foreground mt-1">Track your revenue and manage your financial growth.</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {statCards.map((stat) => (
                                <Card key={stat.label} className="p-5 shadow-card hover:shadow-elevated transition-shadow">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`p-2 rounded-lg bg-accent ${stat.color}`}>
                                            <stat.icon className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <p className="font-heading text-2xl font-bold text-foreground">{stat.value}</p>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                </Card>
                            ))}
                        </div>

                        <Card className="p-6 shadow-card">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-heading text-lg font-semibold text-foreground">Recent Transactions</h3>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Calendar className="h-4 w-4" /> Filter by date
                                </Button>
                            </div>

                            {transactions.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-border">
                                                <th className="pb-3 font-semibold text-sm">Product</th>
                                                <th className="pb-3 font-semibold text-sm">Date</th>
                                                <th className="pb-3 font-semibold text-sm">Amount</th>
                                                <th className="pb-3 font-semibold text-sm">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {transactions.map((tr) => (
                                                <tr key={tr.id} className="hover:bg-accent/20 transition-colors">
                                                    <td className="py-4 text-sm font-medium">{tr.product_name}</td>
                                                    <td className="py-4 text-sm text-muted-foreground">{new Date(tr.created_at).toLocaleDateString()}</td>
                                                    <td className="py-4 text-sm font-bold text-foreground">₦{Number(tr.amount).toLocaleString()}</td>
                                                    <td className="py-4 text-sm">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${tr.status === "completed" ? "bg-green-100 text-green-700" :
                                                            tr.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                                                "bg-red-100 text-red-700"
                                                            }`}>
                                                            {tr.status.charAt(0).toUpperCase() + tr.status.slice(1)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                    <Wallet className="h-12 w-12 opacity-20 mb-3" />
                                    <p>No transactions found</p>
                                    <p className="text-sm">Start selling to see your earnings here</p>
                                </div>
                            )}
                        </Card>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default FarmerEarnings;
