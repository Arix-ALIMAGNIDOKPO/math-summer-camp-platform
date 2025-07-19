
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "./pages/Index";
import Inscription from "./pages/Inscription";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import { LanguageProvider } from "./context/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </LanguageProvider>
  );
}

export default App;
