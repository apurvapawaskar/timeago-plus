# API

## `timeAgo(input, options?)`

```ts
import { timeAgo } from "@apurvapawaskar/timeago-plus";

timeAgo(input, options?);
```

### Parameters

#### `input: Date | number | string`

- `Date`: used directly
- `number`: epoch time with explicit heuristic:
  - `< 1e12` → treated as seconds and converted to milliseconds
  - `>= 1e12` → treated as milliseconds
- `string`: parsed via `new Date(input)` (ISO recommended)

Invalid values (`null`, `undefined`, invalid date string, `NaN`) never throw and return `"invalid date"`.

#### `options?: TimeAgoOptions`

```ts
export interface TimeAgoOptions {
  now?: Date | number;
  short?: boolean;
  future?: boolean;
  locale?: string;
  labels?: Partial<TimeAgoLabels>;
  justNowThreshold?: number;
  futureDisabledLabel?: string;
}
```

- `now`: reference time. Defaults to `Date.now()`.
  - Accepts `Date` or `number` (same numeric heuristic as `input`).
- `short`: defaults to `true`.
  - `true` → `2m ago`
  - `false` → `2 minutes ago`
- `future`: defaults to `true`.
  - `true` → future dates format as `in 2m`
  - `false` → future dates return `futureDisabledLabel` (if set) or the locale `"just now"`
- `locale`: defaults to `"en"`. Built-in locales include: `"en"`, `"fr"`, `"es"`.
  - Locale tags like `"es-ES"` fall back to base tag (`"es"`).
- `labels`: overrides any locale label string (merged over the selected locale).
- `justNowThreshold`: seconds within which to return `"just now"`. Minimum `2`, defaults to `2`.
- `futureDisabledLabel`: custom string returned when `future: false` and the input is a future date.
  - If omitted, falls back to the locale `justNow` label.

### Output

Outputs are compact by default (`short: true`):

- `≤ justNowThreshold` seconds (default 2s) → `"just now"`
- seconds → `"30s ago"` / `"in 30s"`
- minutes → `"2m ago"`
- hours → `"3h ago"`
- days → `"5d ago"`
- months → `"2mo ago"` (30d approximation)
- years → `"1y ago"` (365d approximation)
- future → `"in 2m"`

## Types

```ts
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
```

