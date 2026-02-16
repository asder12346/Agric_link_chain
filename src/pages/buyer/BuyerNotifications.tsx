import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Bell, BellOff, CheckCircle2, Loader2, MessageSquare, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { buyerNavItems } from "./BuyerDashboard";

const BuyerNotifications = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        getNotifications();
    }, []);

    const getNotifications = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await (supabase as any)
                .from("notifications")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setNotifications(data || []);
        } catch (error: any) {
            toast({
                title: "Error fetching notifications",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            const { error } = await (supabase as any)
                .from("notifications")
                .update({ read: true })
                .eq("id", id);

            if (error) throw error;
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error: any) {
            toast({
                title: "Error updating notification",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "order": return <Package className="h-5 w-5 text-primary" />;
            case "review": return <MessageSquare className="h-5 w-5 text-secondary" />;
            default: return <Bell className="h-5 w-5 text-muted-foreground" />;
        }
    };

    return (
        <DashboardLayout role="buyer" navItems={buyerNavItems}>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="font-heading text-3xl font-bold text-foreground">Notifications</h1>
                        <p className="text-muted-foreground mt-1">Stay updated with your latest activities.</p>
                    </div>
                    {notifications.some(n => !n.read) && (
                        <Button variant="outline" size="sm" onClick={() => notifications.filter(n => !n.read).forEach(n => markAsRead(n.id))}>
                            Mark all as read
                        </Button>
                    )}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center min-h-[300px]">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="space-y-4">
                        {notifications.map((n) => (
                            <Card key={n.id} className={cn("p-4 transition-all border-l-4", n.read ? "border-l-transparent" : "border-l-primary bg-accent/30")}>
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center border border-border flex-shrink-0">
                                        {getIcon(n.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className={cn("font-semibold", n.read ? "text-foreground/70" : "text-foreground")}>{n.title}</p>
                                            <span className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">{n.message}</p>
                                        {!n.read && (
                                            <Button variant="ghost" size="sm" onClick={() => markAsRead(n.id)} className="h-8 text-xs gap-1 py-0 px-2 h-auto">
                                                <CheckCircle2 className="h-3 w-3" /> Mark as read
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="p-12 text-center flex flex-col items-center justify-center border-dashed">
                        <BellOff className="h-12 w-12 text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-1">No notifications yet</h3>
                        <p className="text-muted-foreground max-w-xs">We'll notify you when your orders are processed or when you receive responses.</p>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
};

export default BuyerNotifications;
