import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout, Mail, Lock, ArrowRight, Wheat, Store, Check, ShieldCheck, PieChart, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import signupSideImage from "@/assets/auth-side.png";
import farmerMale from "@/assets/farmer-male.png";
import farmerFemale from "@/assets/farmer-female.png";

type Role = "farmer" | "buyer" | "agent";

const SignUp = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const initialRole = (searchParams.get("role") as Role) || null;
  const [role, setRole] = useState<Role | null>(initialRole);
  const [email, setEmail] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      toast({
        title: "Role required",
        description: "Please select whether you're a farmer or a buyer.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure your passwords are identical.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const authData: any = {
        role: role,
      };

      if (role === "agent") {
        authData.referral_code = generateReferralCode();
      } else if (role === "farmer" && referralCode) {
        authData.referred_by = referralCode;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: authData,
        },
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Account created!",
          description: "Welcome to AgriLinkChain. Please check your email for verification.",
        });
        // Redirect to login or dashboard depending on flow
        // For now, let's redirect to login
        navigate("/login");
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during sign up.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Left Side: Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 relative z-10 overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          <div className="mb-10">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="bg-primary p-1.5 rounded-lg">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <span className="font-heading text-2xl font-bold text-foreground">AgriLinkChain</span>
            </Link>
            <h2 className="font-heading text-4xl font-bold text-foreground mb-3">Create account</h2>
            <p className="text-muted-foreground text-lg">Choose your role and get started</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {([
              { value: "farmer" as Role, icon: Wheat, label: "Farmer", desc: "Sell" },
              { value: "buyer" as Role, icon: Store, label: "Buyer", desc: "Buy" },
              { value: "agent" as Role, icon: Users, label: "Agent", desc: "Refer" },
            ]).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRole(opt.value)}
                className={`relative rounded-xl border-2 p-4 text-left transition-all ${role === opt.value
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-primary/5 bg-white hover:border-primary/20"
                  }`}
              >
                {role === opt.value && (
                  <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-2 w-2 text-white" />
                  </div>
                )}
                <opt.icon className={`h-6 w-6 mb-2 ${role === opt.value ? "text-primary" : "text-muted-foreground"}`} />
                <p className="font-bold text-xs text-foreground uppercase tracking-wider">{opt.label}</p>
                <p className="text-[10px] text-muted-foreground font-medium">{opt.desc}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-bold text-foreground ml-1">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input id="email" type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-14 pl-12 bg-primary/5 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all" required />
                </div>
              </div>

              {role === "farmer" && (
                <div className="space-y-2">
                  <Label htmlFor="referral" className="text-sm font-bold text-foreground ml-1">Referral Code (Optional)</Label>
                  <div className="relative group">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input id="referral" type="text" placeholder="AGTXXXXX" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} className="h-14 pl-12 bg-primary/5 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all uppercase" />
                  </div>
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" title="password" className="text-sm font-bold text-foreground ml-1">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-14 pl-12 bg-primary/5 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" title="confirm password" className="text-sm font-bold text-foreground ml-1">Confirm</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-14 pl-12 bg-primary/5 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all" required />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-lg font-bold rounded-2xl shadow-glow gap-2" disabled={loading || !role}>
              {loading ? "Creating account..." : "Start your Journey"}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-10 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>

      {/* Right Side: Image & Branding */}
      <div className="hidden lg:block lg:w-[45%] relative">
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10" />
        <img
          src={signupSideImage}
          alt="Agriculture"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />

        <div className="absolute inset-x-0 bottom-0 p-16 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="space-y-8">
            <div className="flex gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-1 w-12 rounded-full bg-white/20 overflow-hidden">
                  <div className={`h-full bg-primary transition-all duration-1000 ${i === 2 ? 'w-full' : (i < 2 ? 'w-full opacity-50' : 'w-0')}`} />
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h3 className="font-heading text-3xl font-bold text-white leading-tight">
                "Finding verified buyers used to be a challenge. Now, it's as simple as tapping a screen."
              </h3>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 border border-white/20 overflow-hidden">
                  <img src={farmerFemale} alt="Testimonial" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-white font-bold">Aisha B.</p>
                  <p className="text-white/60 text-sm">Cocoa Export Specialist</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
