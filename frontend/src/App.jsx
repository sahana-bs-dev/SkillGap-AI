import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import UploadPage from "./pages/UploadPage";
import ReportPage from "./pages/ReportPage";
import AppShell from "./components/layout/AppShell";
import AnalyzingPage from "./pages/AnalyzingPage"; 
import ComparePage from './pages/ComparePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />

        {/* "Dashboard" in the blueprint is just the Upload screen's nav label —
            there's no separate dashboard view, so redirect straight to /upload. */}
        <Route path="/dashboard" element={<Navigate to="/upload" replace />} />

        {/* Everything inside the app (post-login) shares the sidebar layout */}
        <Route element={<AppShell />}>
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/report" element={<ReportPage />} />
          {/* <Route path="/compare" element={<ComparePage />} /> -- Phase 4 */}
        </Route>
        <Route path="/analyzing" element={<AnalyzingPage />} />
        <Route path="/compare" element={<ComparePage />} />
      </Routes>
    </BrowserRouter>
  );
}