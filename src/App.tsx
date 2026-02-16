import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import FarmerListings from "./pages/farmer/FarmerListings";
import FarmerOrders from "./pages/farmer/FarmerOrders";
import FarmerProfile from "./pages/farmer/FarmerProfile";
import FarmerNotifications from "./pages/farmer/FarmerNotifications";
import FarmerEarnings from "./pages/farmer/FarmerEarnings";
import FarmerReviews from "./pages/farmer/FarmerReviews";

import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import BuyerMarketplace from "./pages/buyer/BuyerMarketplace";
import BuyerOrders from "./pages/buyer/BuyerOrders";
import BuyerProfile from "./pages/buyer/BuyerProfile";
import BuyerNotifications from "./pages/buyer/BuyerNotifications";
import BuyerReviews from "./pages/buyer/BuyerReviews";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AgentDashboard from "./pages/agent/AgentDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {/* Farmer routes */}
          <Route path="/farmer" element={<FarmerDashboard />} />
          <Route path="/farmer/listings" element={<FarmerListings />} />
          <Route path="/farmer/orders" element={<FarmerOrders />} />
          <Route path="/farmer/profile" element={<FarmerProfile />} />
          <Route path="/farmer/notifications" element={<FarmerNotifications />} />
          <Route path="/farmer/earnings" element={<FarmerEarnings />} />
          <Route path="/farmer/reviews" element={<FarmerReviews />} />
          {/* Buyer routes */}
          <Route path="/buyer" element={<BuyerDashboard />} />
          <Route path="/buyer/marketplace" element={<BuyerMarketplace />} />
          <Route path="/buyer/orders" element={<BuyerOrders />} />
          <Route path="/buyer/profile" element={<BuyerProfile />} />
          <Route path="/buyer/notifications" element={<BuyerNotifications />} />
          <Route path="/buyer/reviews" element={<BuyerReviews />} />
          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          {/* Agent routes */}
          <Route path="/agent" element={<AgentDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
