import { Play, Info } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useSiteConfig } from "../context/SiteContext";

export function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { getText, videos } = useSiteConfig();
  const publishedVideo = videos.find((v) => v.status === "published");

  useEffect(() => {
    // Prevent right-click context menu on the entire page
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.protected-video')) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', handler);

    // Block common screenshot keyboard shortcuts
    const keyHandler = (e: KeyboardEvent) => {
      // PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
      }
      // Ctrl+Shift+S (snipping tool), Ctrl+P (print)
      if (e.ctrlKey && (e.key === 'p' || e.key === 'P' || (e.shiftKey && (e.key === 's' || e.key === 'S')))) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', keyHandler);

    return () => {
      document.removeEventListener('contextmenu', handler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, []);

  return (
    <div className="min-h-full bg-[#050505] text-white pb-20 flex flex-col items-center pt-16 md:pt-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 px-4"
      >
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold mb-3 md:mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500">
          {getText("Home", "Main Heading")}
        </h1>
        <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto font-light">
          {getText("Home", "Subheading")}
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-5xl px-4 md:px-8"
      >
        <div className="protected-video relative aspect-video rounded-3xl overflow-hidden glass-card bg-black group">
          <video
            ref={videoRef}
            autoPlay
            loop
            playsInline
            preload="auto"
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
            className="w-full h-full object-cover relative z-10"
            style={{ pointerEvents: "none" }}
          >
            <source src={publishedVideo?.file || "/videos/InShot_20260203_184738626.mp4"} type="video/mp4" />
          </video>
          {/* Clickable overlay to toggle play/pause */}
          <div
            className="absolute inset-0 z-20 cursor-pointer"
            onContextMenu={(e) => e.preventDefault()}
            onClick={() => {
              const v = videoRef.current;
              if (v) { v.paused ? v.play() : v.pause(); }
            }}
          />
          <div className="absolute top-0 left-0 w-full p-4 md:p-8 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-none transition-opacity duration-500 group-hover:opacity-0 z-30">
            <span className="text-[#E62429] font-bold tracking-widest text-[10px] md:text-xs uppercase mb-1 md:mb-2 block">{getText("Home", "Video Badge")}</span>
            <h2 className="text-xl sm:text-3xl md:text-5xl font-extrabold tracking-tight">{getText("Home", "Video Title")}</h2>
            <p className="text-gray-300 mt-1 md:mt-2 max-w-xl font-medium text-xs md:text-sm">{getText("Home", "Video Subtitle")}</p>
          </div>
        </div>
      </motion.div>

      {/* CSS to blur content during screen capture APIs and block selection/drag */}
      <style>{`
        .protected-video {
          -webkit-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
        }
        .protected-video video {
          -webkit-user-select: none;
          user-select: none;
          -webkit-user-drag: none;
        }
        @media (display-mode: picture-in-picture) {
          .protected-video video { display: none; }
        }
      `}</style>
    </div>
  );
}
