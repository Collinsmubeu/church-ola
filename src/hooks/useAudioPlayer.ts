import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Sermon } from "@prisma/client";

interface AudioPlayerState {
  currentSermon: Sermon | null;
  isOpen: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  setSermon: (sermon: Sermon | null) => void;
  setOpen: (open: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  toggle: () => void;
  play: (sermon: Sermon) => void;
}

export const useAudioPlayer = create<AudioPlayerState>()(
  persist(
    (set, get) => ({
      currentSermon: null,
      isOpen: false,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.8,
      setSermon: (sermon) => set({ currentSermon: sermon }),
      setOpen: (open) => set({ isOpen: open }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setCurrentTime: (time) => set({ currentTime: time }),
      setDuration: (duration) => set({ duration }),
      setVolume: (volume) => set({ volume }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      play: (sermon) => {
        const { currentSermon } = get();
        if (currentSermon?.id === sermon.id) {
          set((s) => ({ isPlaying: !s.isPlaying }));
        } else {
          set({ currentSermon: sermon, isOpen: true, isPlaying: true, currentTime: 0 });
        }
      },
    }),
    {
      name: "church-ola-audio-player",
      partialize: (state) => ({
        currentSermon: state.currentSermon,
        volume: state.volume,
      }),
    }
  )
);