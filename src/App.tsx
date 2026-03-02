import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LanguageSync from "./components/LanguageSync";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Calculator from "./pages/Calculator";
import Learn from "./pages/Learn";
import Book from "./pages/Book";
import Admin from "./pages/admin/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const LangRoute = ({ children }: { children: React.ReactNode }) => (
  <LanguageSync>{children}</LanguageSync>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/en" replace />} />
          <Route path="/:lang" element={<LangRoute><Home /></LangRoute>} />
          <Route path="/:lang/services" element={<LangRoute><Services /></LangRoute>} />
          <Route path="/:lang/calculator" element={<LangRoute><Calculator /></LangRoute>} />
          <Route path="/:lang/learn" element={<LangRoute><Learn /></LangRoute>} />
          <Route path="/:lang/book" element={<LangRoute><Book /></LangRoute>} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
