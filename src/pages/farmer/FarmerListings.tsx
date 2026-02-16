import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  LayoutDashboard, Wheat, ShoppingCart, Wallet, Star, UserCircle, Bell,
  Plus, Search, ImagePlus
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { farmerNavItems } from "./FarmerDashboard";

const FarmerListings = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <DashboardLayout role="farmer" navItems={farmerNavItems}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">My Listings</h1>
          <p className="text-muted-foreground mt-1">Manage your produce listings</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> New Listing</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading">Create New Listing</DialogTitle>
            </DialogHeader>
            <form className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input placeholder="e.g. Fresh Tomatoes" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Describe your produce..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (₦)</Label>
                  <Input type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>Quantity (kg)</Label>
                  <Input type="number" placeholder="0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input placeholder="e.g. Vegetables, Grains, Fruits" />
              </div>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/30 transition-colors">
                <ImagePlus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload product images</p>
                <p className="text-xs text-muted-foreground/70">PNG, JPG up to 5MB</p>
              </div>
              <Button type="button" className="w-full" onClick={() => setDialogOpen(false)}>
                Create Listing
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search listings..." className="pl-10" />
        </div>
      </div>

      <Card className="p-12 shadow-card">
        <div className="flex flex-col items-center justify-center text-center">
          <Wheat className="h-16 w-16 text-muted-foreground/20 mb-4" />
          <h3 className="font-heading text-xl font-semibold text-foreground mb-2">No listings yet</h3>
          <p className="text-muted-foreground max-w-sm">
            Start by creating your first listing. Add photos, set your price, and reach buyers directly.
          </p>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default FarmerListings;
