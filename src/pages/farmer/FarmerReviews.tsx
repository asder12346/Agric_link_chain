import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Star, MessageSquare, ShieldCheck, Loader2, TrendingUp, Trophy } from "lucide-react";

import { farmerNavItems } from "./FarmerDashboard";

const FarmerReviews = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [creditScore, setCreditScore] = useState(0);
    const [reviews, setReviews] = useState<any[]>([]);

    useEffect(() => {
        getReviewsData();
    }, []);

    const getReviewsData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch credit score from profile
            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("credit_score")
                .eq("id", user.id)
                .single();

            if (profileError) throw profileError;
            setCreditScore(profile?.credit_score || 0);

            // Fetch reviews
            const { data, error } = await supabase
                .from("reviews")
                .select(`
          *,
          buyer:buyer_id (full_name, avatar_url)
        `)
                .eq("farmer_id", user.id)
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

    const getAverageRating = () => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    return (
        <DashboardLayout role="farmer" navItems={farmerNavItems}>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="font-heading text-3xl font-bold text-foreground">Reviews & Reputation</h1>
                    <p className="text-muted-foreground mt-1">Monitor your performance and build trust with buyers.</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Credit Score Card */}
                            <Card className="p-6 shadow-card bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                                        <ShieldCheck className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-heading text-lg font-bold text-foreground">Credit Score</h3>
                                        <p className="text-sm text-muted-foreground">Based on your reliability and reviews</p>
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-bold text-primary">{creditScore}</span>
                                    <span className="text-muted-foreground">/ 1000</span>
                                </div>
                                <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${(creditScore / 1000) * 100}%` }} />
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-sm text-primary font-medium">
                                    <TrendingUp className="h-4 w-4" />
                                    <span>Excellent standing</span>
                                </div>
                            </Card>

                            {/* Rating Summary Card */}
                            <Card className="p-6 shadow-card">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center">
                                        <Trophy className="h-6 w-6 text-secondary" />
                                    </div>
                                    <div>
                                        <h3 className="font-heading text-lg font-bold text-foreground">Average Rating</h3>
                                        <p className="text-sm text-muted-foreground">Feedback from your buyers</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-5xl font-bold text-foreground">{getAverageRating()}</span>
                                    <div className="flex flex-col">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star key={star} className={`h-5 w-5 ${star <= Number(getAverageRating()) ? "text-secondary fill-secondary" : "text-muted border-muted"}`} />
                                            ))}
                                        </div>
                                        <span className="text-sm text-muted-foreground">{reviews.length} reviews</span>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Reviews List */}
                        <div className="space-y-4">
                            <h2 className="font-heading text-xl font-bold text-foreground">Buyer Feedback</h2>
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <Card key={review.id} className="p-5 shadow-card">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                                                    {review.buyer?.full_name?.charAt(0) || "B"}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm">{review.buyer?.full_name || "Anonymous Buyer"}</p>
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
                                    <p className="text-sm text-muted-foreground/70">Completed orders will appear here when buyers leave feedback.</p>
                                </Card>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default FarmerReviews;
