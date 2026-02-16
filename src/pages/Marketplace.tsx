import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Sprout, Search, SlidersHorizontal, MapPin, Wheat, ShoppingCart, ArrowRight, Star, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
            <Link to="/" className="flex items-center gap-2">
                <Sprout className="h-7 w-7 text-primary" />
                <span className="font-heading text-xl font-bold text-foreground">AgriLinkChain</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
                <Link to="/marketplace" className="text-sm font-medium text-foreground transition-colors">Marketplace</Link>
                <a href="/#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            </div>
            <div className="flex items-center gap-3">
                <Link to="/login">
                    <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link to="/signup">
                    <Button size="sm">Get Started</Button>
                </Link>
            </div>
        </div>
    </nav>
);

const Marketplace = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getListings();
    }, []);

    const getListings = async () => {
        try {
            const { data, error } = await supabase
                .from("listings")
                .select(`
                    *,
                    farmer:farmer_id (full_name, location)
                `)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setListings(data || []);
        } catch (error: any) {
            console.error("Error fetching listings:", error);
            // Fallback to static data if table doesn't exist or error occurs
            setListings([
                { id: 1, title: "Fresh Organic Tomatoes", price: 1200, unit: "kg", quantity: 50, category: "Vegetables", farmer: { full_name: "Musa Abubakar", location: "Kano" }, image_url: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?q=80&w=400&h=300&fit=crop" },
                { id: 2, title: "Premium White Yam", price: 4500, unit: "tuber", quantity: 20, category: "Roots", farmer: { full_name: "John Ojo", location: "Oyo" }, image_url: "https://images.unsplash.com/photo-1596450514735-31da6138663b?q=80&w=400&h=300&fit=crop" },
                { id: 3, title: "Sweet Yellow Corn", price: 800, unit: "5 cobs", quantity: 100, category: "Grains", farmer: { full_name: "Sarah Williams", location: "Benue" }, image_url: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=400&h=300&fit=crop" },
                { id: 4, title: "Red Chili Peppers", price: 1500, unit: "basket", quantity: 15, category: "Vegetables", farmer: { full_name: "Ibrahim K.", location: "Kaduna" }, image_url: "https://images.unsplash.com/photo-1590130005740-4824d7729377?q=80&w=400&h=300&fit=crop" },
                { id: 5, title: "Bell Peppers Mix", price: 2800, unit: "kg", quantity: 40, category: "Vegetables", farmer: { full_name: "Aisha Bello", location: "Osun" }, image_url: "https://pickleguys.com/cdn/shop/files/products-pepper-mixed-hot-top1-2.jpg?v=1726705952&width=1920" },
                { id: 6, title: "Fresh Ginger Roots", price: 3200, unit: "kg", quantity: 25, category: "Spices", farmer: { full_name: "Chidi Okafor", location: "Imo" }, image_url: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=400&h=300&fit=crop" },
                { id: 7, title: "Large Brown Onions", price: 2500, unit: "bag", quantity: 10, category: "Vegetables", farmer: { full_name: "Bala Mohammed", location: "Sokoto" }, image_url: "https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=400&h=300&fit=crop" },
                { id: 8, title: "Ugu Leaves (Fluted Pumpkin)", price: 500, unit: "bunch", quantity: 100, category: "Vegetables", farmer: { full_name: "Blessing Okoro", location: "Enugu" }, image_url: "https://images.unsplash.com/photo-1587334274328-64186a80aeee?q=80&w=400&h=300&fit=crop" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleBuy = async (listingId: string) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            toast({
                title: "Authentication Required",
                description: "Please sign up or log in to buy products.",
            });
            navigate("/signup?role=buyer");
            return;
        }
        // Proceed with order flow (to be implemented)
        toast({
            title: "Success",
            description: "Redirecting to checkout...",
        });
    };

    const filteredListings = listings.filter(l =>
        l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 pt-24 pb-20">
                <div className="mb-12">
                    <h1 className="font-heading text-4xl font-bold text-foreground mb-4">Farm Marketplace</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Directly source fresh produce from verified local farmers. Quality you can trust, delivered to your doorstep.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1 max-w-lg">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search produce, category, or location..."
                            className="pl-10 h-11"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="h-11 gap-2">
                        <SlidersHorizontal className="h-4 w-4" /> Filters
                    </Button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredListings.map((p) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group"
                            >
                                <Card className="overflow-hidden border-border shadow-card hover:shadow-elevated transition-all duration-300">
                                    <div className="aspect-[4/3] overflow-hidden relative">
                                        <img
                                            src={p.image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&h=300&fit=crop"}
                                            alt={p.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                                                {p.category}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-heading font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                            {p.title}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                                            <MapPin className="h-3 w-3 text-secondary" />
                                            <span>{p.farmer?.location || "Nigeria"}</span>
                                            <span className="mx-1">•</span>
                                            <span className="text-foreground/70 font-medium">{p.farmer?.full_name}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                                            <div>
                                                <span className="text-xl font-bold text-foreground">₦{p.price?.toLocaleString()}</span>
                                                <span className="text-xs text-muted-foreground ml-1">/ {p.unit}</span>
                                            </div>
                                            <Button size="sm" onClick={() => handleBuy(p.id)} className="gap-1 px-4">
                                                Buy Now
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}

                {filteredListings.length === 0 && !loading && (
                    <div className="text-center py-20">
                        <Wheat className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No matching listings found</h3>
                        <p className="text-muted-foreground">Try adjusting your search or filters.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Marketplace;
