import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LanguageSync from "./components/LanguageSync";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Calculator from "./pages/Calculator";
import Learn from "./pages/Learn";
import Book from "./pages/Book";
import Admin from "./pages/admin/Admin";
import AdminAuthGate from './components/AdminAuthGate';
import GuidePage from "./pages/GuidePage";
import Contact from "./pages/Contact";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import ScrollToTop from "@/components/ScrollToTop";
import OdiaLanguageToast from "@/components/OdiaLanguageToast";

const queryClient = new QueryClient();

const PageWrap = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25 }}
  >
    {children}
  </motion.div>
);

const LangRoute = ({ children }: { children: React.ReactNode }) => (
  <LanguageSync>
    <PageWrap>{children}</PageWrap>
    <OdiaLanguageToast />
  </LanguageSync>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Navigate to="/en" replace />} />
            <Route path="/:lang" element={<LangRoute><Home /></LangRoute>} />
            <Route path="/:lang/services" element={<LangRoute><Services /></LangRoute>} />
            <Route path="/:lang/calculator" element={<LangRoute><Calculator /></LangRoute>} />
            <Route path="/:lang/learn" element={<LangRoute><Learn /></LangRoute>} />
            <Route path="/:lang/learn/:slug" element={<LangRoute><Learn /></LangRoute>} />
            <Route path="/:lang/book" element={<LangRoute><Book /></LangRoute>} />
            <Route path="/:lang/contact" element={<LangRoute><Contact /></LangRoute>} />
            <Route path="/:lang/about" element={<LangRoute><About /></LangRoute>} />
            <Route path="/admin" element={<AdminAuthGate><Admin /></AdminAuthGate>} />
            <Route path="/en/:slug" element={<PageWrap><GuidePage /></PageWrap>} />
            <Route path="/or/:slug" element={<PageWrap><GuidePage /></PageWrap>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
        <OdiaLanguageToast />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
