import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users, UserCheck, UserPlus, Copy, Check,
    BarChart3, LayoutDashboard, Settings
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const navItems = [
    { label: "Overview", href: "/agent", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "Farmers", href: "/agent/farmers", icon: <Users className="h-4 w-4" /> },
    { label: "Performance", href: "/agent/performance", icon: <BarChart3 className="h-4 w-4" /> },
    { label: "Settings", href: "/agent/settings", icon: <Settings className="h-4 w-4" /> },
];

const AgentDashboard = () => {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [onboardedFarmers, setOnboardedFarmers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAgentData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserData(user.user_metadata);

                // In a real app, we'd fetch from the profiles/users table
                // For now, let's simulate fetching referred farmers
                const { data: farmers, error } = await (supabase as any)
                    .from('profiles')
                    .select('*')
                    .eq('referred_by', user.user_metadata.referral_code);

                if (!error && farmers) {
                    setOnboardedFarmers(farmers);
                }
            }
            setLoading(false);
        };

        fetchAgentData();
    }, []);

    const copyReferralCode = () => {
        if (userData?.referral_code) {
            navigator.clipboard.writeText(userData.referral_code);
            setCopied(true);
            toast({
                title: "Copied!",
                description: "Referral code copied to clipboard.",
            });
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const stats = [
        { label: "Total Onboarded", value: onboardedFarmers.length, icon: UserPlus, color: "text-primary" },
        { label: "Verified Farmers", value: onboardedFarmers.filter(f => f.verified).length, icon: UserCheck, color: "text-green-500" },
        { label: "Pending Verification", value: onboardedFarmers.filter(f => !f.verified).length, icon: Users, color: "text-amber-500" },
    ];

    return (
        <DashboardLayout role="agent" navItems={navItems} userName={userData?.full_name || "Agent"}>
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-3xl font-bold text-foreground">Agent Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage your referrals and track performance</p>
                </div>

                <Card className="p-4 bg-primary/5 border-primary/20 flex items-center gap-4">
                    <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Your Referral Code</p>
                        <p className="text-xl font-mono font-bold text-foreground tracking-tight">{userData?.referral_code || "-------"}</p>
                    </div>
                    <Button size="icon" onClick={copyReferralCode} className="h-10 w-10 shrink-0">
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </Card>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 mb-8">
                {stats.map((stat) => (
                    <Card key={stat.label} className="p-6 shadow-card hover:shadow-md transition-shadow">
                        <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                    </Card>
                ))}
            </div>

            <Card className="shadow-card overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <h3 className="font-heading text-lg font-bold text-foreground">Recently Onboarded Farmers</h3>
                    <Button variant="outline" size="sm" className="text-xs font-bold rounded-xl">View All</Button>
                </div>

                <div className="overflow-x-auto">
                    {onboardedFarmers.length > 0 ? (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-muted/30">
                                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Farmer Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Date Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {onboardedFarmers.map((farmer, i) => (
                                    <tr key={i} className="hover:bg-muted/10 transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold text-foreground">{farmer.full_name}</td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">{farmer.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${farmer.verified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                                }`}>
                                                {farmer.verified ? "Verified" : "Pending"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(farmer.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-20 text-center">
                            <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                                <Users className="h-8 w-8 text-muted-foreground/30" />
                            </div>
                            <h4 className="font-heading text-lg font-bold text-foreground mb-1">No farmers onboarded yet</h4>
                            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                                Share your referral code to start onboarding farmers and earning commissions.
                            </p>
                            <Button onClick={copyReferralCode} className="mt-6 rounded-xl font-bold px-8">
                                Copy Referral Code
                            </Button>
                        </div>
                    )}
                </div>
            </Card>
        </DashboardLayout>
    );
};

export default AgentDashboard;
