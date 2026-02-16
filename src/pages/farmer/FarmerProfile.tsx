import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserCircle, Mail, Phone, MapPin, Save, Loader2 } from "lucide-react";

import { farmerNavItems } from "./FarmerDashboard";

const FarmerProfile = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        full_name: "",
        phone: "",
        location: "",
        bio: "",
        email: "",
    });

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            setProfile(prev => ({ ...prev, email: user.email || "" }));

            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (error && error.code !== "PGRST116") throw error;
            if (data) {
                setProfile({
                    full_name: data.full_name || "",
                    phone: data.phone || "",
                    location: data.location || "",
                    bio: data.bio || "",
                    email: user.email || "",
                });
            }
        } catch (error: any) {
            toast({
                title: "Error fetching profile",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No user found");

            const updates = {
                id: user.id,
                ...profile,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase.from("profiles").upsert(updates);
            if (error) throw error;

            toast({
                title: "Profile updated!",
                description: "Your information has been saved successfully.",
            });
        } catch (error: any) {
            toast({
                title: "Update failed",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setSaving(false);
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
        <DashboardLayout role="farmer" navItems={farmerNavItems} userName={profile.full_name}>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="font-heading text-3xl font-bold text-foreground">My Profile</h1>
                    <p className="text-muted-foreground mt-1">Manage your personal information and farm details.</p>
                </div>

                <form onSubmit={updateProfile} className="space-y-6">
                    <Card className="p-6 shadow-card">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="full_name">Full Name</Label>
                                <div className="relative">
                                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="full_name"
                                        value={profile.full_name}
                                        onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                                        className="pl-10"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        value={profile.email}
                                        className="pl-10 bg-muted cursor-not-allowed"
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        value={profile.phone}
                                        onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                        className="pl-10"
                                        placeholder="08012345678"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="location"
                                        value={profile.location}
                                        onChange={e => setProfile({ ...profile, location: e.target.value })}
                                        className="pl-10"
                                        placeholder="Lagos, Nigeria"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-2">
                            <Label htmlFor="bio">About your farm</Label>
                            <Textarea
                                id="bio"
                                value={profile.bio}
                                onChange={e => setProfile({ ...profile, bio: e.target.value })}
                                placeholder="Tell us about your crops, farming methods, and experience..."
                                className="min-h-[120px]"
                            />
                        </div>

                        <div className="mt-8 flex justify-end">
                            <Button type="submit" className="gap-2" disabled={saving}>
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Save Changes
                            </Button>
                        </div>
                    </Card>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default FarmerProfile;
