import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Star, MessageSquare, Loader2 } from "lucide-react";
import { buyerNavItems } from "./BuyerDashboard";

const BuyerReviews = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState<any[]>([]);

    useEffect(() => {
        getReviewsData();
    }, []);

    const getReviewsData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await (supabase as any)
                .from("reviews")
                .select(`
          *,
          farmer:farmer_id (full_name, avatar_url)
        `)
                .eq("buyer_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setReviews(data || []);
        } catch (error: any) {
            toast({
                title: "Error fetching reviews",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="buyer" navItems={buyerNavItems}>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="font-heading text-3xl font-bold text-foreground">My Reviews</h1>
                    <p className="text-muted-foreground mt-1">Feedback you've given to farmers.</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <Card key={review.id} className="p-5 shadow-card">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                                                {review.farmer?.full_name?.charAt(0) || "F"}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">Farmer: {review.farmer?.full_name || "Unknown Farmer"}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star key={star} className={`h-4 w-4 ${star <= review.rating ? "text-secondary fill-secondary" : "text-muted"}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {review.comment || "No comment provided."}
                                    </p>
                                </Card>
                            ))
                        ) : (
                            <Card className="p-12 text-center flex flex-col items-center justify-center border-dashed">
                                <MessageSquare className="h-12 w-12 text-muted-foreground/20 mb-3" />
                                <p className="text-muted-foreground">No reviews yet</p>
                                <p className="text-sm text-muted-foreground/70">When you complete an order, you can leave feedback for the farmer.</p>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default BuyerReviews;
