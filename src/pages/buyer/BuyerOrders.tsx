import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard, ShoppingCart, Store, CreditCard, Star, UserCircle, Bell
} from "lucide-react";

import { buyerNavItems } from "./BuyerDashboard";

const BuyerOrders = () => (
  <DashboardLayout role="buyer" navItems={buyerNavItems}>
    <div className="mb-8">
      <h1 className="font-heading text-3xl font-bold text-foreground">My Orders</h1>
      <p className="text-muted-foreground mt-1">Track your produce orders</p>
    </div>

    <Tabs defaultValue="active">
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
        <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
      </TabsList>
      {["active", "completed", "cancelled"].map((tab) => (
        <TabsContent key={tab} value={tab}>
          <Card className="p-12 shadow-card">
            <div className="flex flex-col items-center justify-center text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground/20 mb-4" />
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">No {tab} orders</h3>
              <p className="text-muted-foreground">Your orders will appear here once you start purchasing.</p>
            </div>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  </DashboardLayout>
);

export default BuyerOrders;
