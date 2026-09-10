"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import type { SermonWithMeta } from "@/types/sermon";

interface SermonPlayerProps {
  sermon: SermonWithMeta;
}

export function SermonPlayer({ sermon }: SermonPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    currentSermon,
    isPlaying,
    currentTime,
    duration,
    volume,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setVolume,
    play,
  } = useAudioPlayer();

  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (currentSermon?.id === sermon.id) {
      if (videoRef.current) {
        if (isPlaying) videoRef.current.play().catch(() => {});
        else videoRef.current.pause();
      }
      if (audioRef.current) {
        if (isPlaying) audioRef.current.play().catch(() => {});
        else audioRef.current.pause();
      }
    }
  }, [currentSermon, isPlaying, sermon.id]);

  const handlePlay = () => {
    play(sermon);
  };

  const togglePlay = () => {
    if (currentSermon?.id === sermon.id) {
      setIsPlaying(!isPlaying);
    } else {
      play(sermon);
    }
  };

  const formatTime = (sec: number) => {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-lg overflow-hidden bg-black/5 dark:bg-black/40 border border-border">
      {sermon.videoUrl && (
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            src={sermon.videoUrl}
            controls
            className="w-full h-full"
            onTimeUpdate={(e) => {
              const t = e.currentTarget.currentTime;
              setCurrentTime(t);
              setDuration(e.currentTarget.duration || 0);
            }}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
            onVolumeChange={(e) => {
              setVolume(e.currentTarget.volume);
              setMuted(e.currentTarget.muted);
            }}
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Button size="icon" onClick={togglePlay} aria-label="Play or pause">
            {currentSermon?.id === sermon.id && isPlaying ? (
              <Pause className="size-5" />
            ) : (
              <Play className="size-5" />
            )}
          </Button>
          <div className="flex-1">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={([v]) => {
                setCurrentTime(v);
                if (videoRef.current) videoRef.current.currentTime = v;
                if (audioRef.current) audioRef.current.currentTime = v;
              }}
              className="w-full"
            />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              const newVol = muted ? 1 : 0;
              setMuted(!muted);
              setVolume(newVol);
              if (videoRef.current) {
                videoRef.current.muted = !muted;
                videoRef.current.volume = newVol;
              }
              if (audioRef.current) {
                audioRef.current.muted = !muted;
                audioRef.current.volume = newVol;
              }
            }}
            aria-label="Toggle mute"
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </Button>
          <Slider
            value={[muted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={([v]) => {
              setVolume(v);
              setMuted(v === 0);
              if (videoRef.current) {
                videoRef.current.volume = v;
                videoRef.current.muted = v === 0;
              }
              if (audioRef.current) {
                audioRef.current.volume = v;
                audioRef.current.muted = v === 0;
              }
            }}
            className="w-24"
          />
          <Button size="icon" variant="ghost" aria-label="Next">
            <SkipForward className="size-4" />
          </Button>
          <Button size="icon" variant="ghost" aria-label="Fullscreen">
            <Maximize className="size-4" />
          </Button>
        </div>
        {sermon.audioUrl && (
          <audio ref={audioRef} src={sermon.audioUrl} preload="metadata" />
        )}
      </div>
    </div>
  );
}