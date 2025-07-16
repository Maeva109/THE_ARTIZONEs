import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Catalogue from "./pages/Catalogue";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Tutorials from "./pages/Tutorials";
import Contact from "./pages/Contact";
import QuiSommesNous from "./pages/QuiSommesNous";
import FAQ from "./pages/FAQ";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";
import AdminOrders from "./pages/AdminOrders";
import AdminPayments from "./pages/AdminPayments";
import AdminDisputes from "./pages/AdminDisputes";
import AdminTutorials from "./pages/AdminTutorials";
import CreateArtisanShop from "./pages/CreateArtisanShop";
import ArtisanConfirmation from "./pages/ArtisanConfirmation";
import ArtisanProfileCompletion from "./pages/ArtisanProfileCompletion";
import ArtisanProfile from "./pages/ArtisanProfile";
import ProposeTutorial from "./pages/ProposeTutorial";
import NotFound from "./pages/NotFound";
import Artisans from "./pages/Artisans";
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from './context/AuthContext';
import AdminArtisans from "./pages/AdminArtisans";

const queryClient = new QueryClient();

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // You can log error info here if needed
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: 32, fontSize: 18 }}>
          <h2>Une erreur est survenue dans l'application :</h2>
          <pre>{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CartProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/catalogue" element={<Catalogue />} />
              <Route path="/panier" element={<Cart />} />
              <Route path="/produit/:id" element={<ProductDetail />} />
              <Route path="/tutoriels" element={<Tutorials />} />
              <Route path="/tutoriel/:id" element={<ProductDetail />} />
              <Route path="/proposer-tutoriel" element={<ProposeTutorial />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/qui-sommes-nous" element={<QuiSommesNous />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/payments" element={<AdminPayments />} />
              <Route path="/admin/disputes" element={<AdminDisputes />} />
              <Route path="/admin/tutorials" element={<AdminTutorials />} />
                  <Route path="/admin/artisans" element={<AdminArtisans />} />
              <Route path="/artisans" element={<Artisans />} />
              {/* Artisan routes */}
              <Route path="/artisan/create" element={<CreateArtisanShop />} />
              <Route path="/artisan/confirmation" element={<ArtisanConfirmation />} />
              <Route path="/artisan/profile-completion" element={<ArtisanProfileCompletion />} />
                  {/* Redirect /artisan/ to artisans page */}
                  <Route path="/artisan" element={<Artisans />} />
              <Route path="/artisan/:shopName" element={<ArtisanProfile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
    </ErrorBoundary>
);
}

export default App;
