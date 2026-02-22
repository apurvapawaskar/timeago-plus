export type TimeAgoInput = Date | number | string;

export interface TimeAgoLabels {
  justNow: string;
  second?: string;
  seconds: string;
  minute?: string;
  minutes: string;
  hour?: string;
  hours: string;
  day?: string;
  days: string;
  month?: string;
  months: string;
  year?: string;
  years: string;
  futurePrefix: string;
  pastSuffix: string;
}

export interface TimeAgoOptions {
  now?: Date | number;
  short?: boolean;
  future?: boolean;
  locale?: string;
  labels?: Partial<TimeAgoLabels>;
  rounding?: "floor" | "round";
  justNowThreshold?: number;
}

import { getLocaleLabels } from "./locales";

export const INVALID_DATE = "invalid date";

function normalizeTimestamp(input: number): number {
  if (!Number.isFinite(input)) return NaN;
  if (Math.abs(input) < 1e12) return input * 1000;
  return input;
}

function toDate(input: TimeAgoInput | null | undefined): Date | null {
  if (input == null) return null;
  if (input instanceof Date) return input;
  if (typeof input === "number") return new Date(normalizeTimestamp(input));
  if (typeof input === "string") return new Date(input);
  return null;
}

function toNowMs(now: Date | number | undefined): number {
  if (now == null) return Date.now();
  if (now instanceof Date) return now.getTime();
  return normalizeTimestamp(now);
}

function mergeLabels(base: TimeAgoLabels, overrides?: Partial<TimeAgoLabels>): TimeAgoLabels {
  if (!overrides) return base;
  return { ...base, ...overrides };
}

function pickUnitLabel(labels: TimeAgoLabels, unit: string, value: number): string {
  const isSingular = value === 1;
  switch (unit) {
    case "second":
      return (isSingular ? labels.second : undefined) ?? labels.seconds;
    case "minute":
      return (isSingular ? labels.minute : undefined) ?? labels.minutes;
    case "hour":
      return (isSingular ? labels.hour : undefined) ?? labels.hours;
    case "day":
      return (isSingular ? labels.day : undefined) ?? labels.days;
    case "month":
      return (isSingular ? labels.month : undefined) ?? labels.months;
    case "year":
      return (isSingular ? labels.year : undefined) ?? labels.years;
    default:
      return unit;
  }
}

export function timeAgo(input: TimeAgoInput | null | undefined, options: TimeAgoOptions = {}): string {
  const date = toDate(input);
  if (!date || Number.isNaN(date.getTime())) return INVALID_DATE;

  const nowMs = toNowMs(options.now);
  if (Number.isNaN(nowMs)) return INVALID_DATE;

  const short = options.short ?? true;
  const allowFuture = options.future ?? true;
  const locale = options.locale ?? "en";
  const rounding: "floor" | "round" = options.rounding ?? "floor";
  const justNowThresholdSeconds = options.justNowThreshold ?? 10;

  const labels = mergeLabels(getLocaleLabels(locale, short), options.labels);

  let diffMs = nowMs - date.getTime();
  const isFuture = diffMs < 0;
  if (isFuture && !allowFuture) diffMs = 0;

  const absMs = Math.abs(diffMs);
  const thresholdMs = Math.max(0, justNowThresholdSeconds) * 1000;
  if (absMs < thresholdMs) return labels.justNow;

  const secondMs = 1_000;
  const minuteMs = 60 * secondMs;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;
  const monthMs = 30 * dayMs;
  const yearMs = 365 * dayMs;

  const roundFn = rounding === "round" ? Math.round : Math.floor;

  let unit: "second" | "minute" | "hour" | "day" | "month" | "year" =
    absMs < minuteMs
      ? "second"
      : absMs < hourMs
        ? "minute"
        : absMs < dayMs
          ? "hour"
          : absMs < monthMs
            ? "day"
            : absMs < yearMs
              ? "month"
              : "year";

  let value =
    unit === "second"
      ? roundFn(absMs / secondMs)
      : unit === "minute"
        ? roundFn(absMs / minuteMs)
        : unit === "hour"
          ? roundFn(absMs / hourMs)
          : unit === "day"
            ? roundFn(absMs / dayMs)
            : unit === "month"
              ? roundFn(absMs / monthMs)
              : roundFn(absMs / yearMs);

  if (value <= 0) value = 1;

  if (rounding === "round") {
    if (unit === "second" && value >= 60) {
      unit = "minute";
      value = roundFn(absMs / minuteMs);
    }
    if (unit === "minute" && value >= 60) {
      unit = "hour";
      value = roundFn(absMs / hourMs);
    }
    if (unit === "hour" && value >= 24) {
      unit = "day";
      value = roundFn(absMs / dayMs);
    }
    if (unit === "day" && value >= 30) {
      unit = "month";
      value = roundFn(absMs / monthMs);
    }
    if (unit === "month" && value >= 12) {
      unit = "year";
      value = roundFn(absMs / yearMs);
      if (value <= 0) value = 1;
    }
  }

  const unitLabel = pickUnitLabel(labels, unit, value);
  const core = short ? `${value}${unitLabel}` : `${value} ${unitLabel}`;

  if (isFuture && allowFuture) return `${labels.futurePrefix}${core}`;
  return `${core}${labels.pastSuffix}`;
}

