import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, MonitorPlay, Film, Tv, Users, Globe, Music, Info, RefreshCw, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useScanResult } from "@/lib/scan-context";
import { ConfidenceRing } from "@/components/ui/confidence-ring";

const platformColors: Record<string, string> = {
  Netflix: "bg-red-600 text-white",
  HBO: "bg-purple-700 text-white",
  "HBO Max": "bg-purple-700 text-white",
  "Amazon Prime": "bg-sky-500 text-white",
  "Jio Cinema": "bg-blue-700 text-white",
  Jio: "bg-blue-700 text-white",
  YouTube: "bg-red-500 text-white",
  "Disney+": "bg-blue-600 text-white",
  Hotstar: "bg-blue-600 text-white",
  Hulu: "bg-green-500 text-white",
  "Apple TV+": "bg-zinc-700 text-white",
  SonyLIV: "bg-orange-500 text-white",
  Zee5: "bg-purple-500 text-white",
  "MX Player": "bg-yellow-500 text-black",
  Voot: "bg-orange-400 text-white",
  Instagram: "bg-pink-600 text-white",
  Facebook: "bg-blue-600 text-white",
  TikTok: "bg-zinc-900 text-white",
  "YouTube Shorts": "bg-red-500 text-white",
};

function getRecognitionStage(confidence: number): {
  label: string;
  className: string;
} {
  if (confidence >= 80)
    return { label: "Highly Recognized", className: "bg-green-500/15 text-green-400 border-green-500/40" };
  if (confidence >= 50)
    return { label: "Moderately Recognized", className: "bg-yellow-500/15 text-yellow-400 border-yellow-500/40" };
  return { label: "Low Recognition", className: "bg-red-500/15 text-red-400 border-red-500/40" };
}

const typeLabels: Record<string, string> = {
  movie: "Movie",
  tv_show: "TV Show",
  music_video: "Music Video",
  documentary: "Documentary",
  youtube_video: "YouTube Video",
  reel: "Reel",
  short: "Short",
  viral_clip: "Viral Clip",
  short_film: "Short Film",
};

export default function Result() {
  const [, setLocation] = useLocation();
  const { lastResult, clearResult } = useScanResult();

  useEffect(() => {
    if (!lastResult) setLocation("/");
  }, [lastResult, setLocation]);

  if (!lastResult) return null;

  const handleTryAgain = () => {
    clearResult();
    setLocation("/");
  };

  const {
    found,
    confidence,
    title,
    type,
    year,
    platform,
    genre,
    language,
    country,
    episode,
    cast,
    director,
    choreographer,
    producer,
    musicDirector,
    creator,
    creatorHandle,
    synopsis,
    alternativeTitles,
    identificationClues,
  } = lastResult as typeof lastResult & {
    country?: string | null;
    producer?: string | null;
    musicDirector?: string | null;
    creator?: string | null;
    creatorHandle?: string | null;
    identificationClues?: string | null;
  };

  if ((lastResult as { locked?: boolean }).locked && found) {
    const stage = getRecognitionStage(confidence);
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full space-y-6"
        >
          <div className="flex justify-center">
            <ConfidenceRing confidence={confidence} />
          </div>
          <Badge variant="outline" className={stage.className}>
            {stage.label}
          </Badge>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              We Found Your Match!
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Our AI identified this video with {confidence}% confidence.
            </p>
          </div>

          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2 select-none" aria-hidden>
                <div className="mx-auto h-7 w-3/4 rounded bg-white/10 blur-[6px]" />
                <div className="mx-auto h-4 w-1/2 rounded bg-white/10 blur-[6px]" />
                <div className="mx-auto h-3 w-2/3 rounded bg-white/5 blur-[6px]" />
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4 text-primary" />
                Title, cast, platform &amp; details are hidden
              </div>
              <Button
                className="w-full font-semibold"
                size="lg"
                onClick={() => setLocation("/purchase")}
              >
                Unlock the Answer — ₹799/year
              </Button>
              <p className="text-xs text-muted-foreground">
                Unlimited reveals while subscribed. Cancel anytime.
              </p>
            </CardContent>
          </Card>

          <Button variant="ghost" onClick={handleTryAgain} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Scan Something Else
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!found) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md space-y-6"
        >
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-destructive/20 text-destructive">
            <MonitorPlay className="h-12 w-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">No Match Found</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We couldn't identify this clip. Try pointing at a scene with faces or text visible, or upload a clearer screenshot.
            </p>
          </div>
          {identificationClues && (
            <p className="text-xs text-muted-foreground/70 bg-muted/30 rounded-lg p-3 text-left">
              {identificationClues}
            </p>
          )}
          <Button onClick={handleTryAgain} size="lg" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  const platformClass = platform
    ? (platformColors[platform] ?? "bg-primary text-primary-foreground")
    : "bg-primary text-primary-foreground";

  const typeLabel = type ? (typeLabels[type] ?? type.replace("_", " ")) : null;

  return (
    <div className="min-h-[100dvh] pb-28">
      {/* Hero */}
      <div className="relative h-64 w-full overflow-hidden bg-muted">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/30 via-background to-background" />
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-4 z-10 rounded-full bg-background/20 backdrop-blur hover:bg-background/40"
          onClick={handleTryAgain}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-background to-transparent p-6 pt-20">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-end justify-between gap-4"
          >
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex flex-wrap gap-2">
                {typeLabel && (
                  <Badge variant="outline" className="border-primary/50 text-primary uppercase tracking-wider text-[10px]">
                    {typeLabel}
                  </Badge>
                )}
                {platform && (
                  <Badge className={platformClass}>{platform}</Badge>
                )}
                {language && (
                  <Badge variant="outline" className="border-border/50 text-muted-foreground text-[10px]">
                    {language}
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold leading-tight sm:text-3xl text-white truncate">
                {title}{" "}
                {year && <span className="text-muted-foreground font-normal text-xl">({year})</span>}
              </h1>
              {genre && <p className="text-sm text-muted-foreground">{genre}</p>}
            </div>

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="shrink-0 flex flex-col items-center gap-2"
            >
              <ConfidenceRing confidence={confidence} size={72} strokeWidth={6} />
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${getRecognitionStage(confidence).className}`}
              >
                {getRecognitionStage(confidence).label}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="p-5 space-y-6 max-w-2xl mx-auto">
        {/* Episode Info */}
        {episode && (episode.season || episode.episode) && (
          <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4 flex items-center gap-4">
                <Tv className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <p className="font-semibold text-white">
                    Season {episode.season} • Episode {episode.episode}
                  </p>
                  {episode.episodeTitle && (
                    <p className="text-sm text-muted-foreground">"{episode.episodeTitle}"</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Synopsis */}
        {synopsis && (
          <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-2">
            <h3 className="text-base font-semibold flex items-center gap-2 text-white">
              <Film className="h-4 w-4 text-primary" /> Synopsis
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{synopsis}</p>
          </motion.div>
        )}

        {/* Cast & Crew */}
        {(creator || creatorHandle || director || choreographer || producer || musicDirector || (cast && cast.length > 0)) && (
          <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="space-y-3">
            <h3 className="text-base font-semibold flex items-center gap-2 text-white">
              <Users className="h-4 w-4 text-primary" /> Cast & Crew
            </h3>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {(creator || creatorHandle) && (
                <div>
                  <span className="text-muted-foreground text-xs uppercase tracking-wide">Creator</span>
                  <p className="font-medium text-white">
                    {[creator, creatorHandle].filter(Boolean).join(" · ")}
                  </p>
                </div>
              )}
              {director && (
                <div>
                  <span className="text-muted-foreground text-xs uppercase tracking-wide">Director</span>
                  <p className="font-medium text-white">{director}</p>
                </div>
              )}
              {choreographer && (
                <div>
                  <span className="text-muted-foreground text-xs uppercase tracking-wide">Choreographer</span>
                  <p className="font-medium text-white">{choreographer}</p>
                </div>
              )}
              {producer && (
                <div>
                  <span className="text-muted-foreground text-xs uppercase tracking-wide">Producer</span>
                  <p className="font-medium text-white">{producer}</p>
                </div>
              )}
              {musicDirector && (
                <div>
                  <span className="text-muted-foreground text-xs uppercase tracking-wide">Music</span>
                  <p className="font-medium text-white">{musicDirector}</p>
                </div>
              )}
            </div>

            {cast && cast.length > 0 && (
              <div className="grid gap-2 sm:grid-cols-2">
                {cast.map((actor, i) => (
                  <div key={i} className="flex flex-col rounded-lg bg-card p-3 border border-border/40">
                    <span className="font-medium text-white text-sm">{actor.name}</span>
                    {(actor.character || actor.role) && (
                      <span className="text-xs text-muted-foreground">
                        {actor.character ? `as ${actor.character}` : actor.role}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Extra Details */}
        {(country || (alternativeTitles && alternativeTitles.length > 0)) && (
          <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-3">
            <h3 className="text-base font-semibold flex items-center gap-2 text-white">
              <Globe className="h-4 w-4 text-primary" /> More Details
            </h3>
            <div className="flex flex-col gap-2 text-sm">
              {country && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Country</span>
                  <span className="text-white font-medium">{country}</span>
                </div>
              )}
              {alternativeTitles && alternativeTitles.length > 0 && (
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Also known as</span>
                  <div className="flex flex-wrap gap-1">
                    {alternativeTitles.map((t, i) => (
                      <Badge key={i} variant="outline" className="text-xs border-border/40 text-muted-foreground">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Music Director standalone section */}
        {musicDirector && !director && !choreographer && !producer && (
          <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-2">
            <h3 className="text-base font-semibold flex items-center gap-2 text-white">
              <Music className="h-4 w-4 text-primary" /> Music
            </h3>
            <p className="text-sm text-white">{musicDirector}</p>
          </motion.div>
        )}

        {/* AI Clues */}
        {identificationClues && (
          <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
            <Card className="border-border/30 bg-muted/20">
              <CardContent className="p-4 flex gap-3">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">{identificationClues}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="pt-2">
          <Button onClick={handleTryAgain} size="lg" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Scan Another Clip
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
