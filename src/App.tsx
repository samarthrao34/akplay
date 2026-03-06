import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Library } from "./pages/Library";
import { Dashboard } from "./pages/Dashboard";
import { Community } from "./pages/Community";
import { Account } from "./pages/Account";
import { Search } from "./pages/Search";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <video 
          // TODO: Replace this URL with your actual loading video URL
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" 
          autoPlay 
          muted 
          playsInline
          onEnded={() => setIsLoading(false)}
          className="w-full h-full object-contain"
        />
        <button 
          onClick={() => setIsLoading(false)}
          className="absolute bottom-8 right-8 text-white/50 hover:text-white text-sm font-medium tracking-wider uppercase transition-colors"
        >
          Skip Intro
        </button>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="library" element={<Library />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="community" element={<Community />} />
          <Route path="account" element={<Account />} />
          <Route path="search" element={<Search />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


