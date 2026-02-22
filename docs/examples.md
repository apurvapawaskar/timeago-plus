# Examples

## Basic

```ts
import { timeAgo } from "@apurvapawaskar/timeago-plus";

timeAgo(Date.now() - 30_000); // "30s ago"
timeAgo(Date.now() + 2 * 60_000); // "in 2m"
timeAgo(Date.now() - 1_000);  // "just now" (within default 2s threshold)
```

## Future Seconds

Future timestamps count down in seconds until `justNowThreshold` is reached:

```ts
timeAgo(Date.now() + 45_000); // "in 45s"
timeAgo(Date.now() + 5_000);  // "in 5s"
timeAgo(Date.now() + 1_000);  // "just now" (within 2s threshold)
```

## Long Mode

```ts
timeAgo(Date.now() - 2 * 60_000, { short: false }); // "2 minutes ago"
```

## `justNowThreshold`

Controls how many seconds back/forward still shows `"just now"`. Minimum is `2`, defaults to `2`.

```ts
timeAgo(Date.now() - 1_000);                           // "just now" (within 2s default)
timeAgo(Date.now() - 3_000);                           // "3s ago"
timeAgo(Date.now() - 5_000, { justNowThreshold: 10 }); // "just now"
timeAgo(Date.now() - 5_000, { justNowThreshold: 4 });  // "5s ago"
timeAgo(Date.now() - 2_000, { justNowThreshold: 0 });  // "just now" (minimum of 2 enforced)
```

## `futureDisabledLabel`

When `future: false`, future dates are clamped. By default they return `"just now"`. Pass a custom string to override:

```ts
timeAgo(Date.now() + 60_000, { future: false });                              // "just now"
timeAgo(Date.now() + 60_000, { future: false, futureDisabledLabel: "soon" }); // "soon"
timeAgo(Date.now() + 60_000, { future: false, futureDisabledLabel: "N/A" });  // "N/A"
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

