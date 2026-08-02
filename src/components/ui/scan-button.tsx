import { motion } from "framer-motion";
import { Search, Loader2, Video, MonitorPlay } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScanButtonProps {
  isScanning: boolean;
  onClick: () => void;
  className?: string;
  mode?: "camera" | "upload" | "screen";
}

export function ScanButton({ isScanning, onClick, className, mode = "camera" }: ScanButtonProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Ripple effects when scanning */}
      {isScanning && (
        <>
          <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-ripple" style={{ animationDelay: "0s" }} />
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ripple" style={{ animationDelay: "0.5s" }} />
          <div className="absolute inset-0 rounded-full border-2 border-primary/10 animate-ripple" style={{ animationDelay: "1s" }} />
        </>
      )}

      {/* Main Button */}
      <motion.button
        onClick={onClick}
        disabled={isScanning}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "relative z-10 flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-600 shadow-2xl transition-all duration-300",
          isScanning ? "animate-pulse-glow" : "hover:shadow-[0_0_40px_rgba(124,58,237,0.5)]"
        )}
      >
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/80 to-violet-800/80 backdrop-blur-sm" />
        <div className="relative z-20 flex flex-col items-center justify-center gap-2 text-white">
          {isScanning ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-white" />
              <span className="text-xs font-bold tracking-widest uppercase">Scanning</span>
            </>
          ) : (
            <>
              {mode === "camera" ? (
                <Search className="h-12 w-12" />
              ) : mode === "screen" ? (
                <MonitorPlay className="h-12 w-12" />
              ) : (
                <Video className="h-12 w-12" />
              )}
              <span className="text-xs font-bold tracking-widest uppercase">
                {mode === "camera" ? "Tap to Scan" : mode === "screen" ? "Scan Screen" : "Upload"}
              </span>
            </>
          )}
        </div>
      </motion.button>
    </div>
  );
}
