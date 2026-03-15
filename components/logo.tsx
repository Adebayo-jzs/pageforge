"use client";
import { useRouter } from "next/navigation";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Logo({ className = "", size = "md" }: LogoProps) {
  const router = useRouter();

  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-6xl",
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-10 h-10",
    xl: "w-14 h-14",
  };

  return (
    <div
      onClick={() => router.push("/")}
      className={`flex items-center gap-2 cursor-pointer select-none group transition-all active:scale-95 ${className}`}
    >
      <div className={`${iconSizes[size]} flex items-center justify-center bg-[#e8ff47] rounded-lg shadow-[0_0_15px_rgba(232,255,71,0.2)] group-hover:shadow-[0_0_20px_rgba(232,255,71,0.4)] group-hover:rotate-3 transition-all duration-300`}>
        <div className="w-1/2 h-1/2 border-2 border-black rounded-sm rotate-45 group-hover:rotate-90 transition-transform duration-500" />
      </div>
      <span 
        className={`${sizeClasses[size]} font-bebas tracking-tight text-white leading-none`}
        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
      >
        Page<span className="text-[#e8ff47] group-hover:text-white transition-colors">Forge</span>
      </span>
    </div>
  );
}
