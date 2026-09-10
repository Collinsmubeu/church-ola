"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  max?: number;
  min?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
}

export function Slider({
  value,
  onValueChange,
  max = 100,
  min = 0,
  step = 1,
  className,
  disabled,
}: SliderProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const percentage = ((value[0] - min) / (max - min)) * 100;

  const updateValue = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const newValue = min + ratio * (max - min);
    const clamped = Math.round(newValue / step) * step;
    onValueChange([Math.min(max, Math.max(min, clamped))]);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateValue(e.clientX);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updateValue(e.touches[0].clientX);
  };

  React.useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => updateValue(e.clientX);
    const onUp = () => setIsDragging(false);
    const onTouchMove = (e: TouchEvent) => updateValue(e.touches[0].clientX);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={trackRef}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value[0]}
      aria-disabled={disabled}
    >
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="absolute h-full bg-primary transition-[width]"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div
        className="absolute size-4 rounded-full bg-primary shadow ring-2 ring-background transition-[left]"
        style={{ left: `calc(${percentage}% - 0.75rem)` }}
      />
    </div>
  );
}