import { Play } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="flex items-baseline">
        <span
          className="text-[#E62429] font-black text-5xl italic tracking-tighter"
          style={{ transform: "skewX(-10deg)" }}
        >
          AK
        </span>
        <div
          className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-[#E62429] border-b-[8px] border-b-transparent ml-1"
          style={{ transform: "skewX(-10deg)" }}
        ></div>
      </div>
      <span className="text-white font-bold text-3xl tracking-[0.15em] mt-1">
        PLAY
      </span>
      <span className="text-gray-300 text-[10px] tracking-wider mt-1 font-light uppercase">
        Stream Your World
      </span>
    </div>
  );
}
