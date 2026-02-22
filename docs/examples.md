# Examples

## Basic

```ts
import { timeAgo } from "@apurvapawaskar/timeago-plus";

timeAgo(Date.now() - 30_000); // "30s ago"
timeAgo(Date.now() + 2 * 60_000); // "in 2m"
```

## Long Mode

```ts
timeAgo(Date.now() - 2 * 60_000, { short: false }); // "2 minutes ago"
```

## Rounding

```ts
const now = new Date("2020-01-01T00:00:59.600Z");
const input = new Date("2020-01-01T00:00:00.000Z");

timeAgo(input, { now, rounding: "floor" }); // "59s ago"
timeAgo(input, { now, rounding: "round" }); // "1m ago"
```

## `justNowThreshold`

```ts
const now = new Date("2020-01-01T00:00:11.000Z");
const input = new Date("2020-01-01T00:00:00.500Z");

timeAgo(input, { now, justNowThreshold: 12 }); // "just now"
timeAgo(input, { now, justNowThreshold: 10 }); // "10s ago"
```

## Numeric Input (Seconds vs Milliseconds)

```ts
const epochSeconds = 1_600_000_000; // < 1e12 => seconds
const epochMs = 1_600_000_000_000; // >= 1e12 => milliseconds

timeAgo(epochSeconds, { now: epochMs }); // "just now"
```

## i18n

```ts
timeAgo(Date.now() - 2 * 60_000, { locale: "fr" }); // "2min plus tôt"
```

