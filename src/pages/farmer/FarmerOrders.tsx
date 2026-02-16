import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard, Wheat, ShoppingCart, Wallet, Star, UserCircle, Bell
} from "lucide-react";

import { farmerNavItems } from "./FarmerDashboard";

const FarmerOrders = () => (
  <DashboardLayout role="farmer" navItems={farmerNavItems}>
    <div className="mb-8">
      <h1 className="font-heading text-3xl font-bold text-foreground">My Orders</h1>
      <p className="text-muted-foreground mt-1">Manage orders for your products</p>
    </div>

    <Tabs defaultValue="pending">
      <TabsList>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
        <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
      </TabsList>
      {["pending", "active", "completed", "cancelled"].map((tab) => (
        <TabsContent key={tab} value={tab}>
          <Card className="p-12 shadow-card">
            <div className="flex flex-col items-center justify-center text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground/20 mb-4" />
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">No {tab} orders</h3>
              <p className="text-muted-foreground">Orders will appear here when buyers purchase your products.</p>
            </div>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  </DashboardLayout>
);

export default FarmerOrders;
