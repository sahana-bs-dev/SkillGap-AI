import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import UploadPage from "./pages/UploadPage";
import ReportPage from "./pages/ReportPage";
import AppShell from "./components/layout/AppShell";
import AnalyzingPage from "./pages/AnalyzingPage";
import ComparePage from './pages/ComparePage';
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
  path="/"
  element={
    <GoogleOAuthProvider clientId="300780407407-7jjg4l0bf745obkfl8danar40pm6ldcj.apps.googleusercontent.com">
      <AuthPage />
    </GoogleOAuthProvider>
  }
/>

          {/* "Dashboard" in the blueprint is just the Upload screen's nav label —
              there's no separate dashboard view, so redirect straight to /upload. */}
          <Route path="/dashboard" element={<Navigate to="/upload" replace />} />

           {/* Everything inside the app (post-login) shares the sidebar layout,
               and now requires a valid session before it renders. */}
          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/compare" element={<ComparePage />} />
          </Route>
          <Route
            path="/analyzing"
            element={
              <ProtectedRoute>
                <AnalyzingPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}