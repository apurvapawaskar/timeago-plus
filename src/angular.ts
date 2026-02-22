import { ChangeDetectorRef, NgZone, Pipe, type PipeTransform } from "@angular/core";
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
  const diff = Math.abs(now - t);
  if (diff < 60_000) return 1_000;
  if (diff < 60 * 60_000) return 30_000;
  if (diff < 24 * 60 * 60_000) return 5 * 60_000;
  return 60 * 60_000;
}

@Pipe({ name: "timeAgo", pure: false })
export class TimeAgoPipe implements PipeTransform {
  private lastValue: TimeAgoInput | null | undefined;
  private lastOptions: TimeAgoOptions | undefined;
  private lastText = "";
  private timer: ReturnType<typeof setInterval> | null = null;

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
      this.setupTimer(value, options);
    }
    return this.lastText;
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  private setupTimer(value: unknown, options: TimeAgoOptions | undefined): void {
    this.clearTimer();
    const intervalMs = getRefreshIntervalMs(value, options);
    if (!intervalMs) return;

    this.zone.runOutsideAngular(() => {
      this.timer = setInterval(() => {
        const next = timeAgo(this.lastValue, this.lastOptions);
        if (next !== this.lastText) {
          this.lastText = next;
          this.zone.run(() => this.cdr.markForCheck());
        }
      }, intervalMs);
    });
  }

  private clearTimer(): void {
    if (this.timer) clearInterval(this.timer);
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
    a.rounding === b.rounding &&
    a.justNowThreshold === b.justNowThreshold
  );
}

export const timeAgoPipe = TimeAgoPipe;

