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
  const diff = Math.abs(now - t);
  if (diff < 60_000) return 1_000;
  if (diff < 60 * 60_000) return 30_000;
  if (diff < 24 * 60 * 60_000) return 5 * 60_000;
  return 60 * 60_000;
}

export function useTimeAgo(value: TimeAgoInput | null | undefined, options?: TimeAgoOptions): string {
  const labelsDep = useMemo(() => labelsKey(options?.labels), [options?.labels]);
  const [text, setText] = useState(() => timeAgo(value, options));
  const latest = useRef({ value, options });

  latest.current = { value, options };

  useEffect(() => {
    setText(timeAgo(value, options));

    const intervalMs = getRefreshIntervalMs(value, options);
    if (!intervalMs) return;

    const id = setInterval(() => {
      setText(timeAgo(latest.current.value, latest.current.options));
    }, intervalMs);

    return () => clearInterval(id);
  }, [
    value,
    options?.now,
    options?.short,
    options?.future,
    options?.locale,
    options?.rounding,
    options?.justNowThreshold,
    labelsDep,
  ]);

  return text;
}

