import { type OnDestroy, ChangeDetectorRef, NgZone, Pipe, type PipeTransform } from "@angular/core";
import { timeAgo, type TimeAgoInput, type TimeAgoOptions } from "./core";

function normalizeTimestamp(input: number): number {
  if (!Number.isFinite(input)) return NaN;
  if (Math.abs(input) < 1e12) return input * 1000;
  return input;
}

function toTimeMs(value: unknown): number {
  if (value == null) return NaN;
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return normalizeTimestamp(value);
  if (typeof value === "string") return new Date(value).getTime();
  return NaN;
}

function getRefreshIntervalMs(value: unknown, options: TimeAgoOptions | undefined): number | null {
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

@Pipe({ name: "timeAgo", pure: false, standalone: true })
export class TimeAgoPipe implements PipeTransform, OnDestroy {
  private lastValue: TimeAgoInput | null | undefined;
  private lastOptions: TimeAgoOptions | undefined;
  private lastText = "";
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly zone: NgZone,
  ) {}

  transform(value: TimeAgoInput | null | undefined, options?: TimeAgoOptions): string {
    const needsRecalc = value !== this.lastValue || !shallowEqualOptions(options, this.lastOptions);
    if (needsRecalc) {
      this.lastValue = value;
      this.lastOptions = options;
      this.lastText = timeAgo(value, options);
      this.setupTimer();
    }
    return this.lastText;
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  private setupTimer(): void {
    this.clearTimer();

    const schedule = () => {
      const delay = getRefreshIntervalMs(this.lastValue, this.lastOptions);
      if (!delay) {
        this.clearTimer();
        return;
      };

      this.timer = setTimeout(() => {
        const next = timeAgo(this.lastValue, this.lastOptions);
        if (next !== this.lastText) {
          this.lastText = next;
          this.zone.run(() => this.cdr.markForCheck());
        }
        schedule();
      }, delay);
    };

    this.zone.runOutsideAngular(() => {
      schedule();
    });
  }

  private clearTimer(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
  }
}

function shallowEqualOptions(a: TimeAgoOptions | undefined, b: TimeAgoOptions | undefined): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.now === b.now &&
    a.short === b.short &&
    a.future === b.future &&
    a.locale === b.locale &&
    a.labels === b.labels &&
    a.justNowThreshold === b.justNowThreshold &&
    a.futureDisabledLabel === b.futureDisabledLabel
  );
}

export const timeAgoPipe = TimeAgoPipe;

