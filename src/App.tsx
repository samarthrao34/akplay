import { useCallback, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Library } from "./pages/Library";
import { Admin } from "./pages/Admin";
import { Community } from "./pages/Community";
import { Account } from "./pages/Account";
import { Search } from "./pages/Search";
import { Subscription } from "./pages/Subscription";
import { IntroAnimation } from "./components/IntroAnimation";
import { ProfileSelector } from "./components/ProfileSelector";
import { SiteProvider } from "./context/SiteContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppContent() {
  const [introDone, setIntroDone] = useState(false);
  const handleIntroDone = useCallback(() => setIntroDone(true), []);
  const { showProfileSelector, isAuthenticated } = useAuth();

  return (
    <>
      {!introDone && <IntroAnimation onFinish={handleIntroDone} />}

      {/* Netflix-style profile selector */}
      {introDone && isAuthenticated && showProfileSelector && <ProfileSelector />}

      <div style={{ opacity: introDone ? 1 : 0, transition: "opacity 0.5s ease" }}>
        <SiteProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="library" element={<Library />} />
                <Route path="admin" element={<Admin />} />
                <Route path="community" element={<Community />} />
                <Route path="account" element={<Account />} />
                <Route path="search" element={<Search />} />
                <Route path="subscription" element={<Subscription />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </SiteProvider>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
