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

/**
 * Options for customizing the timeAgo output.
 */
export interface TimeAgoOptions {
  /**
   * Reference time to compare against. Defaults to current time.
   * Accepts Date or timestamp (ms or s).
   */
  now?: Date | number;
  /**
   * Use short unit labels (e.g. '4m' vs '4 minutes'). Defaults to true.
   */
  short?: boolean;
  /**
   * Allow future dates (e.g. 'in 4m'). Defaults to true.
   */
  future?: boolean;
  /**
   * Locale code for unit labels (e.g. 'en', 'fr'). Defaults to 'en'.
   */
  locale?: string;
  /**
   * Override unit labels (advanced customization).
   */
  labels?: Partial<TimeAgoLabels>;
  /**
   * Threshold in seconds for displaying 'just now'. Minimum is 2. Defaults to 2.
   */
  justNowThreshold?: number;
  /**
   * Custom string to return when future: false and the input date is in the future.
   * Defaults to the locale 'just now' label.
   */
  futureDisabledLabel?: string;
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
  const justNowThresholdSeconds = Math.max(2, options.justNowThreshold ?? 2);

  const labels = mergeLabels(getLocaleLabels(locale, short), options.labels);

  const diffMs = nowMs - date.getTime();
  const isFuture = diffMs < 0;
  const absMs = Math.abs(diffMs);
  const thresholdMs = justNowThresholdSeconds * 1_000;

  // Threshold always wins — show justNow when close enough (past or future)
  if (absMs <= thresholdMs) {
    return labels.justNow;
  }

  // Future date with future disabled: return futureDisabledLabel or justNow
  const wasClamped = isFuture && !allowFuture;
  if (wasClamped) {
    if (options.futureDisabledLabel != null) return options.futureDisabledLabel;
    return labels.justNow;
  }

  const secondMs = 1_000;
  const minuteMs = 60 * secondMs;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;
  const monthMs = 30 * dayMs;
  const yearMs = 365 * dayMs;

  let unit: "second" | "minute" | "hour" | "day" | "month" | "year";

  unit =
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

  let value: number;

  if (unit === "second") {
    value = Math.floor(absMs / secondMs);
  } else if (unit === "minute") {
    value = Math.round(absMs / minuteMs);
  } else if (unit === "hour") {
    value = Math.round(absMs / hourMs);
  } else if (unit === "day") {
    value = Math.round(absMs / dayMs);
  } else if (unit === "month") {
    value = Math.round(absMs / monthMs);
  } else {
    value = Math.round(absMs / yearMs);
  }

  if (value <= 0) value = 1;

  // Roll up if rounding pushed value past the unit boundary
  if (unit === "minute" && value >= 60) { unit = "hour"; value = Math.round(absMs / hourMs); }
  if (unit === "hour" && value >= 24) { unit = "day"; value = Math.round(absMs / dayMs); }
  if (unit === "day" && value >= 30) { unit = "month"; value = Math.round(absMs / monthMs); }
  if (unit === "month" && value >= 12) { unit = "year"; value = Math.round(absMs / yearMs); if (value <= 0) value = 1; }

  const unitLabel = pickUnitLabel(labels, unit, value);
  const core = short ? `${value}${unitLabel}` : `${value} ${unitLabel}`;

  if (isFuture && allowFuture) return `${labels.futurePrefix}${core}`;
  return `${core}${labels.pastSuffix}`;
}

