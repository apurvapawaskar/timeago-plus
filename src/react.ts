import { useEffect, useMemo, useRef, useState } from "react";
import { timeAgo, type TimeAgoInput, type TimeAgoLabels, type TimeAgoOptions } from "./core";

function labelsKey(labels: Partial<TimeAgoLabels> | undefined): string {
  if (!labels) return "";
  const keys = Object.keys(labels).sort();
  let out = "";
  for (const k of keys) out += `${k}:${String((labels as Record<string, unknown>)[k])};`;
  return out;
}

function normalizeTimestamp(input: number): number {
  if (!Number.isFinite(input)) return NaN;
  if (Math.abs(input) < 1e12) return input * 1000;
  return input;
}

function toTimeMs(value: TimeAgoInput | null | undefined): number {
  if (value == null) return NaN;
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return normalizeTimestamp(value);
  if (typeof value === "string") return new Date(value).getTime();
  return NaN;
}

function getRefreshIntervalMs(value: TimeAgoInput | null | undefined, options: TimeAgoOptions | undefined): number | null {
  if (options?.now != null) return null;
  const t = toTimeMs(value);
  if (!Number.isFinite(t)) return 30_000;

  const now = Date.now();
  const rawDiff = now - t;
  const isFuture = rawDiff < 0;
  const absMs = Math.abs(rawDiff);

  const secondMs = 1_000;
  const minuteMs = 60_000;
  const hourMs = 3_600_000;
  const dayMs = 86_400_000;

  // Seconds (floor): fire at next whole-second boundary
  if (absMs < minuteMs) return secondMs - (absMs % secondMs) + 1;

  // Minutes (round): fire when rounded value crosses its half-minute threshold
  if (absMs < hourMs) {
    const cur = Math.round(absMs / minuteMs);
    const next = isFuture ? (cur - 0.5) * minuteMs : (cur + 0.5) * minuteMs;
    return Math.abs(next - absMs) + 50;
  }

  // Hours (round): fire when rounded value crosses its half-hour threshold
  if (absMs < dayMs) {
    const cur = Math.round(absMs / hourMs);
    const next = isFuture ? (cur - 0.5) * hourMs : (cur + 0.5) * hourMs;
    return Math.abs(next - absMs) + 50;
  }

  // Days+ (round): same principle, floor at 1 min to avoid over-sleeping on edge cases
  const cur = Math.round(absMs / dayMs);
  const next = isFuture ? (cur - 0.5) * dayMs : (cur + 0.5) * dayMs;
  return Math.max(Math.abs(next - absMs) + 50, 60_000);
}

export function useTimeAgo(value: TimeAgoInput | null | undefined, options?: TimeAgoOptions): string {
  const labelsDep = useMemo(() => labelsKey(options?.labels), [options?.labels]);
  const [text, setText] = useState(() => timeAgo(value, options));
  const latest = useRef({ value, options });
  const textRef = useRef(text);

  latest.current = { value, options };
  textRef.current = text;

  useEffect(() => {
    const initial = timeAgo(value, options);
    if (textRef.current !== initial) {
      setText(initial);
    }

    let timer: ReturnType<typeof setTimeout> | null = null;

    const schedule = () => {
      const delay = getRefreshIntervalMs(
        latest.current.value,
        latest.current.options
      );

      if (!delay) return;

      timer = setTimeout(() => {
        const next = timeAgo(latest.current.value, latest.current.options);

        if (textRef.current !== next) {
          setText(next);
        }

        schedule();
      }, delay);
    };

    schedule();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [
    value,
    options?.now,
    options?.short,
    options?.future,
    options?.locale,
    options?.justNowThreshold,
    options?.futureDisabledLabel,
    labelsDep,
  ]);

  return text;
}

