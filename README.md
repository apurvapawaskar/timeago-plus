# @apurvapawaskar/timeago-plus

![npm](https://img.shields.io/npm/v/@apurvapawaskar/timeago-plus)
![bundle size](https://img.shields.io/bundlephobia/minzip/@apurvapawaskar/timeago-plus)
![downloads](https://img.shields.io/npm/dm/@apurvapawaskar/timeago-plus)
![license](https://img.shields.io/npm/l/@apurvapawaskar/timeago-plus)
![TypeScript ready](https://img.shields.io/badge/TypeScript-ready-blue)

**Tiny, dependency-free relative time formatter with i18n, React hooks & Angular pipes.**

- No runtime dependencies
- ESM + CommonJS support
- Tree-shakeable (`sideEffects: false`)
- Extremely small footprint

## 📦 Install

```bash
npm i @apurvapawaskar/timeago-plus
```

## ⚡ Basic Usage

- Input: Date | number | string
- Invalid inputs return "invalid date"

```ts
import { timeAgo } from "@apurvapawaskar/timeago-plus";

timeAgo(new Date(Date.now() - 30_000)); // "30s ago"
timeAgo(Date.now() - 2 * 60_000); // "2m ago"
timeAgo(new Date(Date.now() + 2 * 60_000)); // "in 2m"
```

## ⚛ React

```tsx
import { useTimeAgo } from "@apurvapawaskar/timeago-plus/react";

export function Example() {
  const text = useTimeAgo(Date.now() - 30_000);
  return <span>{text}</span>;
}
```

For optimal performance, memoize the options object when passing dynamic options.

## 🅰 Angular

```ts
import { NgModule } from "@angular/core";
import { TimeAgoPipe } from "@apurvapawaskar/timeago-plus/angular";

@NgModule({
  declarations: [TimeAgoPipe],
  exports: [TimeAgoPipe]
})
export class SharedModule {}
```

Template usage:

```html
<span>{{ date | timeAgo }}</span>
<span>{{ date | timeAgo : { locale: "fr", short: true } }}</span>
```

## 🧪 Playground

Try the playground online:

- [Playground](https://timeago-playground.apurvapawaskar.in)


## 📚 Docs

- [API](./docs/api.md)
- [i18n](./docs/i18n.md)
- [React](./docs/react.md)
- [Angular](./docs/angular.md)
- [Examples](./docs/examples.md)

## 🛠 Development

```bash
npm test
npm run build
```

