import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sprout, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

interface DashboardLayoutProps {
  children: ReactNode;
  role: "farmer" | "buyer" | "admin" | "agent";
  navItems: NavItem[];
  userName?: string;
}

const DashboardLayout = ({ children, role, navItems, userName }: DashboardLayoutProps) => {
  const location = useLocation();
  const roleLabels = { farmer: "Farmer", buyer: "Buyer", admin: "Admin", agent: "Agent" };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col fixed inset-y-0 left-0 z-40">
        <div className="p-5 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-sidebar-primary" />
            <span className="font-heading text-lg font-bold text-sidebar-foreground">AgriLinkChain</span>
          </Link>
          <div className="mt-3 px-2 py-1 rounded-md bg-sidebar-accent inline-block">
            <span className="text-xs font-medium text-sidebar-accent-foreground">{roleLabels[role]} Portal</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full gradient-hero flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">
                {userName ? userName.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{userName || "User"}</p>
              <p className="text-xs text-sidebar-foreground/60">{roleLabels[role]}</p>
            </div>
          </div>
          <Link to="/">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
