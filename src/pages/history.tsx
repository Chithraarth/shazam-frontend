import { useGetHistory, getGetHistoryQueryKey, useDeleteHistory, useGetStats, getGetStatsQueryKey } from "@/api-client";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Film, Tv, Music, BarChart3, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export default function History() {
  const queryClient = useQueryClient();
  const { data: history, isLoading: isLoadingHistory } = useGetHistory({
    query: { queryKey: getGetHistoryQueryKey() },
  });
  const { data: stats, isLoading: isLoadingStats } = useGetStats({
    query: { queryKey: getGetStatsQueryKey() },
  });

  const deleteMutation = useDeleteHistory();

  const handleDelete = (id: number) => {
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetHistoryQueryKey() });
          toast({ title: "Deleted", description: "History entry removed." });
        },
      }
    );
  };

  const getIcon = (type?: string | null) => {
    if (type === "tv_show") return <Tv className="h-4 w-4" />;
    if (type === "music_video") return <Music className="h-4 w-4" />;
    return <Film className="h-4 w-4" />;
  };

  return (
    <div className="min-h-[100dvh] pb-24 px-4 sm:px-6 pt-12 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Your Scans</h1>
        <p className="text-muted-foreground mt-1">Review your previously identified clips</p>
      </div>

      {/* Stats Section */}
      {!isLoadingStats && stats && stats.totalSearches > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4"
        >
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" /> Total Scans
              </span>
              <span className="text-3xl font-bold text-white">{stats.totalSearches}</span>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" /> Success Rate
              </span>
              <span className="text-3xl font-bold text-white">{Math.round(stats.successRate)}%</span>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* History List */}
      <div className="space-y-4">
        {isLoadingHistory ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))
        ) : history && history.length > 0 ? (
          <AnimatePresence>
            {history.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="overflow-hidden border-border/50 bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-stretch">
                    {/* Thumbnail placeholder or real thumb */}
                    <div className="w-24 bg-muted flex items-center justify-center border-r border-border/50 shrink-0 relative">
                      {item.thumbnailData ? (
                        <img 
                          src={`data:image/jpeg;base64,${item.thumbnailData}`} 
                          alt={item.title || "Thumbnail"} 
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        getIcon(item.type)
                      )}
                    </div>
                    
                    <div className="p-4 flex-1 flex items-center justify-between min-w-0">
                      <div className="space-y-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
                            {item.found ? item.title : "Unidentified Clip"}
                          </h3>
                          {item.found && item.platform && (
                            <Badge variant="outline" className="text-[10px] h-5 py-0 px-1.5 shrink-0">
                              {item.platform}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{format(new Date(item.createdAt), "MMM d, yyyy")}</span>
                          {item.found && (
                            <span className="flex items-center gap-1">
                              <span className={item.confidence >= 80 ? "text-green-500" : "text-yellow-500"}>
                                {item.confidence}% Match
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteMutation.isPending}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-20 px-6 border border-dashed border-border rounded-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <Film className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No scans yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Your history is empty. Go back and scan a video clip to see the magic happen.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
