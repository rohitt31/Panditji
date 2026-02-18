import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SmoothScroll from "@/components/SmoothScroll";

// Public Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import BookPooja from "./pages/BookPooja";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import GangaAarti from "./pages/GangaAarti";

// Admin Layout & Pages
import AdminLayout from "./layouts/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Dashboard from "./pages/admin/Dashboard";
import ServicesManager from "./pages/admin/ServicesManager";
import TestimonialsManager from "./pages/admin/TestimonialsManager";
import GalleryManager from "./pages/admin/GalleryManager";
import DynamicCardsManager from "./pages/admin/DynamicCardsManager";
import BookingsManager from "./pages/admin/BookingsManager";
import MessagesManager from "./pages/admin/MessagesManager";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <SmoothScroll />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/book" element={<BookPooja />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ganga-aarti" element={<GangaAarti />} />

          {/* Admin Login (public) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Routes (Protected — requires JWT) */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="testimonials" element={<TestimonialsManager />} />
            <Route path="gallery" element={<GalleryManager />} />
            <Route path="cards" element={<DynamicCardsManager />} />
            <Route path="bookings" element={<BookingsManager />} />
            <Route path="messages" element={<MessagesManager />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>


          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
