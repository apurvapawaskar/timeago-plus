# React

## Install

```bash
npm i @apurvapawaskar/timeago-plus
```

React itself is a peer dependency (not bundled).

## `useTimeAgo(value, options?)`

```tsx
import { useTimeAgo } from "@apurvapawaskar/timeago-plus/react";

export function MessageTime({ createdAt }: { createdAt: string }) {
  const text = useTimeAgo(createdAt, { short: true, locale: "en" });
  return <span>{text}</span>;
}
```

### Notes

- Uses the same core formatting as `timeAgo()`.
- Auto-refreshes on an adaptive interval for live updates.
- If you pass `options.now`, the hook returns a stable value and does not auto-refresh.

See [docs/api.md](./api.md) for all options.

