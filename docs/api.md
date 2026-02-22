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
  rounding?: "floor" | "round";
  justNowThreshold?: number;
}
```

- `now`: reference time. Defaults to `Date.now()`.
  - Accepts `Date` or `number` (same numeric heuristic as `input`).
- `short`: defaults to `true`.
  - `true` → `2m ago`
  - `false` → `2 minutes ago`
- `future`: defaults to `true`.
  - `true` → future dates format as `in 2m`
  - `false` → future dates clamp to `"just now"`
- `locale`: defaults to `"en"`. Built-ins: `"en"`, `"fr"`, `"es"`.
  - Locale tags like `"es-ES"` fall back to base tag (`"es"`).
- `labels`: overrides any locale label string (merged over the selected locale).
- `rounding`: defaults to `"floor"`.
  - `"floor"` truncates (e.g. 59.9s → `59s`)
  - `"round"` rounds (e.g. 59.6s → `1m`)
- `justNowThreshold`: defaults to `10` (seconds).
  - Values below threshold return locale `justNow`.

### Output

Outputs are compact by default (`short: true`):

- `< justNowThreshold` seconds → `"just now"`
- seconds → `"30s ago"`
- minutes → `"2m ago"`
- hours → `"3h ago"`
- days → `"5d ago"`
- months → `"2mo ago"` (30d approximation)
- years → `"1y ago"` (365d approximation)
- future dates → `"in 2m"`

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

