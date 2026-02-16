import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout, Mail, Lock, ArrowRight, ShieldCheck, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import loginSideImage from "@/assets/auth-side.png";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Welcome back!",
          description: "Successfully signed in.",
        });

        // Get user role from metadata
        const role = data.user.user_metadata?.role;

        // Redirect based on role
        if (role === "farmer") {
          navigate("/farmer");
        } else if (role === "buyer") {
          navigate("/buyer");
        } else if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Left Side: Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 relative z-10">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <Link to="/" className="flex items-center gap-2 mb-10">
              <div className="bg-primary p-1.5 rounded-lg">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <span className="font-heading text-2xl font-bold text-foreground">AgriLinkChain</span>
            </Link>
            <h2 className="font-heading text-4xl font-bold text-foreground mb-4 text-left">Welcome back</h2>
            <p className="text-muted-foreground text-lg">Enter your details to access your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold text-foreground ml-1">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 pl-12 bg-primary/5 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" title="password" className="text-sm font-bold text-foreground">Password</Label>
                <Link to="/reset-password" title="forgot password" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 pl-12 bg-primary/5 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-lg font-bold rounded-2xl shadow-glow gap-2" disabled={loading}>
              {loading ? "Signing in..." : "Sign in to Dashboard"}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-10 font-medium">
            New to AgriLinkChain?{" "}
            <Link to="/signup" className="text-primary font-bold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>

      {/* Right Side: Image & Branding */}
      <div className="hidden lg:block lg:w-[45%] relative">
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10" />
        <img
          src={loginSideImage}
          alt="Agriculture"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />

        <div className="absolute inset-x-0 bottom-0 p-16 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="space-y-8">
            <div className="flex gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-1 w-12 rounded-full bg-white/20 overflow-hidden">
                  <div className={`h-full bg-primary transition-all duration-1000 ${i === 1 ? 'w-full' : 'w-0'}`} />
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h3 className="font-heading text-3xl font-bold text-white leading-tight">
                "AgriLinkChain has helped me scale my farm operations by 40% in just six months."
              </h3>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 border border-white/20" />
                <div>
                  <p className="text-white font-bold">John Momoh</p>
                  <p className="text-white/60 text-sm">Industrial Maize Farmer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
