# React

React support is provided via a `useTimeAgo` hook entry-point.

`react` is a peer dependency (not bundled). React 17–19 is supported.

---

## `useTimeAgo(value, options?)`

```tsx
import { useTimeAgo } from "@apurvapawaskar/timeago-plus/react";

export function MessageTime({ createdAt }: { createdAt: string }) {
  const text = useTimeAgo(createdAt, { short: true, locale: "en" });
  return <span>{text}</span>;
}
```

---

## Behaviour

- Uses the same core formatting as `timeAgo()`.
- Auto-refreshes on an adaptive interval so the displayed value stays live:
  - Within a minute: refreshes on the next whole-second boundary.
  - Within an hour: refreshes when the rounded minute count changes.
  - Beyond an hour: refreshes when the rounded hour/day count changes.
- If you pass `options.now`, the hook returns a stable value and does not schedule any refresh.
- For optimal performance, memoize the options object with `useMemo` when passing dynamic options:

```tsx
const options = useMemo(() => ({ locale, short }), [locale, short]);
const text = useTimeAgo(date, options);
```

---

See [api.md](./api.md) for all options.

