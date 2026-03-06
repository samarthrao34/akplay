import { useEffect, useRef, useState } from "react";

/** Synthesise a Netflix-style "ta-dum" hit using the Web Audio API. */
function playTaDum() {
  try {
    const ctx = new AudioContext();

    // --- First hit (lower) ---
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(130, ctx.currentTime);           // deep tone
    osc1.frequency.exponentialRampToValueAtTime(65, ctx.currentTime + 0.6);
    gain1.gain.setValueAtTime(0.6, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc1.connect(gain1).connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.8);

    // sub-bass layer
    const sub1 = ctx.createOscillator();
    const subGain1 = ctx.createGain();
    sub1.type = "sine";
    sub1.frequency.setValueAtTime(65, ctx.currentTime);
    subGain1.gain.setValueAtTime(0.4, ctx.currentTime);
    subGain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);
    sub1.connect(subGain1).connect(ctx.destination);
    sub1.start(ctx.currentTime);
    sub1.stop(ctx.currentTime + 1.0);

    // --- Second hit (higher, the "dum") at +0.45s ---
    const hitTime = ctx.currentTime + 0.45;
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(260, hitTime);
    osc2.frequency.exponentialRampToValueAtTime(90, hitTime + 1.2);
    gain2.gain.setValueAtTime(0.7, hitTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, hitTime + 1.5);
    osc2.connect(gain2).connect(ctx.destination);
    osc2.start(hitTime);
    osc2.stop(hitTime + 1.5);

    // sub layer for second hit
    const sub2 = ctx.createOscillator();
    const subGain2 = ctx.createGain();
    sub2.type = "sine";
    sub2.frequency.setValueAtTime(90, hitTime);
    subGain2.gain.setValueAtTime(0.5, hitTime);
    subGain2.gain.exponentialRampToValueAtTime(0.001, hitTime + 1.8);
    sub2.connect(subGain2).connect(ctx.destination);
    sub2.start(hitTime);
    sub2.stop(hitTime + 1.8);

    // Close context after everything is done
    setTimeout(() => ctx.close(), 3000);
  } catch {
    // Audio not available – silently continue
  }
}

/**
 * Netflix-style intro animation using the AKPLAY logo.
 * Phases: zoom-in reveal → hold → zoom-out fade → done.
 */
export function IntroAnimation({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");
  const soundPlayed = useRef(false);

  useEffect(() => {
    // enter (zoom-in + fade-in): 1.2s
    const t1 = setTimeout(() => setPhase("hold"), 1200);
    // hold (logo visible with glow pulse): until 3s mark
    const t2 = setTimeout(() => setPhase("exit"), 3000);
    // exit (zoom-out + fade-out): 0.8s, then notify parent
    const t3 = setTimeout(() => onFinish(), 3800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
      {/* Radial glow behind the logo */}
      <div
        className="absolute rounded-full"
        style={{
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(230,36,41,0.25) 0%, rgba(230,36,41,0.08) 40%, transparent 70%)",
          opacity: phase === "hold" ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      />

      {/* Logo image */}
      <img
        src="/akplay-logo.jpeg"
        alt="AKPLAY"
        draggable={false}
        style={{
          width: 280,
          height: 280,
          objectFit: "contain",
          borderRadius: 24,
          transform:
            phase === "enter"
              ? "scale(0.4)"
              : phase === "hold"
              ? "scale(1)"
              : "scale(1.15)",
          opacity: phase === "exit" ? 0 : phase === "enter" ? 0 : 1,
          transition:
            phase === "enter"
              ? "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s ease"
              : phase === "exit"
              ? "transform 0.8s ease-in, opacity 0.7s ease-in"
              : "none",
          filter:
            phase === "hold"
              ? "drop-shadow(0 0 40px rgba(230,36,41,0.5))"
              : "none",
        }}
        onLoad={(e) => {
          // Trigger the enter animation after the image is loaded
          requestAnimationFrame(() => {
            const el = e.currentTarget;
            el.style.transform = "scale(1)";
            el.style.opacity = "1";
          });
          // Play ta-dum sound once when logo appears
          if (!soundPlayed.current) {
            soundPlayed.current = true;
            playTaDum();
          }
        }}
      />

      {/* Horizontal light sweep across the logo */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 320,
          height: 320,
          overflow: "hidden",
          borderRadius: 24,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "60%",
            height: "100%",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
            animation: phase === "hold" ? "sweepLight 1.2s ease-in-out" : "none",
          }}
        />
      </div>

      <style>{`
        @keyframes sweepLight {
          0%   { left: -100%; }
          100% { left: 200%; }
        }
      `}</style>
    </div>
  );
}
