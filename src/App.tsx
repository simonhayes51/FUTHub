import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import FeedPage from "./pages/FeedPage";
import MarketIntelligencePage from "./pages/MarketIntelligencePage";
import DashboardPage from "./pages/DashboardPage";
import SbcCentrePage from "./pages/SbcCentrePage";
import PackCentrePage from "./pages/PackCentrePage";
import EvolutionsPage from "./pages/EvolutionsPage";
import ObjectivesPage from "./pages/ObjectivesPage";
import SquadBuilderPage from "./pages/SquadBuilderPage";
import CoachPage from "./pages/CoachPage";
import NewsPage from "./pages/NewsPage";
import NotFound from "./pages/NotFound";
import HelpPage from "./pages/HelpPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/market" element={<MarketIntelligencePage />} />
            <Route path="/market/:id" element={<MarketIntelligencePage />} />
            <Route path="/sbc" element={<SbcCentrePage />} />
            <Route path="/packs" element={<PackCentrePage />} />
            <Route path="/evolutions" element={<EvolutionsPage />} />
            <Route path="/objectives" element={<ObjectivesPage />} />
            <Route path="/squads" element={<SquadBuilderPage />} />
            <Route path="/coach" element={<CoachPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
