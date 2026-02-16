import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboard, ShoppingCart, Store, CreditCard, Star, UserCircle, Bell,
  Search, SlidersHorizontal
} from "lucide-react";

import { buyerNavItems } from "./BuyerDashboard";

const BuyerMarketplace = () => (
  <DashboardLayout role="buyer" navItems={buyerNavItems}>
    <div className="mb-8">
      <h1 className="font-heading text-3xl font-bold text-foreground">Marketplace</h1>
      <p className="text-muted-foreground mt-1">Browse verified produce from trusted farmers</p>
    </div>

    <div className="flex gap-3 mb-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search produce, crops, farmers..." className="pl-10" />
      </div>
      <Button variant="outline" className="gap-2">
        <SlidersHorizontal className="h-4 w-4" /> Filters
      </Button>
    </div>

    <Card className="p-12 shadow-card">
      <div className="flex flex-col items-center justify-center text-center">
        <Store className="h-16 w-16 text-muted-foreground/20 mb-4" />
        <h3 className="font-heading text-xl font-semibold text-foreground mb-2">No listings available yet</h3>
        <p className="text-muted-foreground max-w-sm">
          Verified farmer listings will appear here. Check back soon for fresh produce!
        </p>
      </div>
    </Card>
  </DashboardLayout>
);

export default BuyerMarketplace;
