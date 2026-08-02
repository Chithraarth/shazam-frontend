import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Image as ImageIcon, MonitorPlay } from "lucide-react";
import { useIdentifyVideo } from "@/api-client";
import { useScanResult } from "@/lib/scan-context";
import { ScanButton } from "@/components/ui/scan-button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

const MAX_SIZE_BYTES = 7.5 * 1024 * 1024;

function compressBase64(base64: string, mimeType: string, quality = 0.92): Promise<{ data: string; mime: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      const maxDim = 1920;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve({ data: base64, mime: mimeType }); return; }
      ctx.drawImage(img, 0, 0, width, height);

      let q = quality;
      const tryCompress = () => {
        const dataUrl = canvas.toDataURL("image/jpeg", q);
        const b64 = dataUrl.split(",")[1];
        const bytes = Math.ceil(b64.length * 0.75);
        if (bytes > MAX_SIZE_BYTES && q > 0.5) {
          q -= 0.1;
          tryCompress();
        } else {
          resolve({ data: b64, mime: "image/jpeg" });
        }
      };
      tryCompress();
    };
    img.src = `data:${mimeType};base64,${base64}`;
  });
}

function extractVideoFrameAt(video: HTMLVideoElement, time: number): Promise<string> {
  return new Promise((resolve, reject) => {
    video.currentTime = time;
    const onSeeked = () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("No canvas context")); return; }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.95).split(",")[1]);
    };
    const onError = () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
      reject(new Error("Seek failed"));
    };
    video.addEventListener("seeked", onSeeked, { once: true });
    video.addEventListener("error", onError, { once: true });
  });
}

export default function Home() {
  const [mode, setMode] = useState<"camera" | "upload" | "screen">("camera");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanningLabel, setScanningLabel] = useState("Scanning");
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();
  const { setLastResult } = useScanResult();

  const identifyMutation = useIdentifyVideo();

  const startCamera = useCallback(async () => {
    try {
      if (stream) return;
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to scan your screen.",
        variant: "destructive",
      });
      setMode("upload");
    }
  }, [stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    if (mode === "camera") startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [mode]);

  const captureFrame = (): string | null => {
    const vid = videoRef.current;
    if (!vid || vid.videoWidth === 0) return null;
    const canvas = document.createElement("canvas");
    canvas.width = vid.videoWidth;
    canvas.height = vid.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(vid, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.95).split(",")[1];
  };

  const runIdentify = async (imageData: string, mimeType: string) => {
    const { data: compressedData, mime } = await compressBase64(imageData, mimeType, 0.92);
    identifyMutation.mutate(
      {
        data: {
          imageData: compressedData,
          mimeType: mime,
        },
      },
      {
        onSuccess: (data) => {
          setLastResult(data);
          setLocation("/result");
        },
        onError: () => {
          toast({
            title: "Identification Failed",
            description: "Couldn't identify this clip. Try a clearer frame.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const scanScreen = async () => {
    let displayStream: MediaStream | null = null;
    try {
      displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
    } catch {
      toast({
        title: "Screen access cancelled",
        description: "Pick the screen, window, or tab playing the video to identify it.",
      });
      return;
    }

    try {
      setScanningLabel("Reading screen");
      const video = document.createElement("video");
      video.srcObject = displayStream;
      video.muted = true;
      await video.play();
      // Give the stream a moment to render a real frame
      await new Promise((r) => setTimeout(r, 600));

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx || canvas.width === 0) throw new Error("capture-failed");
      ctx.drawImage(video, 0, 0);
      const frame = canvas.toDataURL("image/jpeg", 0.95).split(",")[1];

      setScanningLabel("Analysing screen");
      await runIdentify(frame, "image/jpeg");
    } catch {
      toast({
        title: "Couldn't read the screen",
        description: "Please try again and make sure the video is visible.",
        variant: "destructive",
      });
    } finally {
      // Privacy: stop capture immediately — nothing is stored or shown
      displayStream.getTracks().forEach((t) => t.stop());
    }
  };

  const handleScan = async () => {
    if (mode === "screen") {
      await scanScreen();
    } else if (mode === "camera") {
      const frame = captureFrame();
      if (!frame) {
        toast({ title: "Error", description: "Failed to capture frame. Make sure camera is active.", variant: "destructive" });
        return;
      }
      setScanningLabel("Analysing frame");
      await runIdentify(frame, "image/jpeg");
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    if (file.type.startsWith("image/")) {
      setScanningLabel("Analysing image");
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const result = ev.target?.result as string;
        const base64 = result.split(",")[1];
        await runIdentify(base64, file.type);
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith("video/")) {
      setScanningLabel("Extracting frames");
      const video = document.createElement("video");
      video.src = URL.createObjectURL(file);
      video.muted = true;
      video.preload = "metadata";

      video.onloadedmetadata = async () => {
        const dur = video.duration;
        const sampleTimes = [
          Math.min(1, dur * 0.05),
          dur * 0.25,
          dur * 0.5,
          dur * 0.75,
          Math.max(0, dur - 2),
        ].filter((t, i, a) => a.indexOf(t) === i && t >= 0 && t <= dur);

        setScanningLabel("Deep scanning video");
        for (const t of sampleTimes) {
          try {
            const frame = await extractVideoFrameAt(video, t);
            const { data: compressed, mime } = await compressBase64(frame, "image/jpeg", 0.92);
            await new Promise<void>((resolve, reject) => {
              identifyMutation.mutate(
                { data: { imageData: compressed, mimeType: mime } },
                {
                  onSuccess: (data) => {
                    if (data.found && data.confidence > 40) {
                      URL.revokeObjectURL(video.src);
                      setLastResult(data);
                      setLocation("/result");
                    }
                    resolve();
                  },
                  onError: () => resolve(),
                }
              );
            });
            if (!identifyMutation.isPending) break;
          } catch {
            continue;
          }
        }
        URL.revokeObjectURL(video.src);
        if (!identifyMutation.isSuccess) {
          toast({
            title: "No match found",
            description: "Couldn't identify this video. Try a clearer clip.",
            variant: "destructive",
          });
        }
      };
    } else {
      toast({ title: "Unsupported file", description: "Please upload an image or video file.", variant: "destructive" });
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {mode === "camera" ? (
          <motion.div
            key="camera-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0 overflow-hidden"
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover opacity-30 blur-sm"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </motion.div>
        ) : (
          <motion.div
            key="upload-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0 bg-gradient-to-b from-primary/10 to-background"
          />
        )}
      </AnimatePresence>

      <div className="z-10 w-full max-w-md flex-1 flex flex-col items-center justify-center gap-12">
        <div className="text-center space-y-2">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
          >
            Videofy
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            {mode === "camera"
              ? "Point your camera at any screen."
              : mode === "screen"
                ? "Identify what's playing on this screen."
                : "Upload a screenshot or video clip."}
          </motion.p>
        </div>

        <Tabs
          value={mode}
          onValueChange={(v) => setMode(v as "camera" | "upload" | "screen")}
          className="w-full max-w-[340px]"
        >
          <TabsList className="grid w-full grid-cols-3 bg-background/50 backdrop-blur border border-border/50">
            <TabsTrigger value="camera" className="data-[state=active]:bg-primary">
              <Camera className="h-4 w-4 mr-1.5" />
              Camera
            </TabsTrigger>
            <TabsTrigger value="screen" className="data-[state=active]:bg-primary">
              <MonitorPlay className="h-4 w-4 mr-1.5" />
              Screen
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-primary">
              <ImageIcon className="h-4 w-4 mr-1.5" />
              Upload
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex flex-col items-center gap-4"
          >
            <ScanButton
              isScanning={identifyMutation.isPending}
              onClick={handleScan}
              mode={mode}
            />
            {identifyMutation.isPending && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-primary font-medium tracking-widest uppercase animate-pulse"
              >
                {scanningLabel}...
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>

        {mode === "upload" && !identifyMutation.isPending && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-muted-foreground text-center max-w-[240px]"
          >
            Supports images and videos. For videos, multiple frames are analysed automatically.
          </motion.p>
        )}

        {mode === "screen" && !identifyMutation.isPending && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-muted-foreground text-center max-w-[280px]"
          >
            One frame is read from your screen, only to identify the video. No recording is kept or shown back.
          </motion.p>
        )}

        <input
          type="file"
          accept="image/*,video/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
      </div>
    </div>
  );
}
