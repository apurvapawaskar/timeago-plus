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

- Input: `Date | number | string` — invalid inputs never throw, return `"invalid date"`
- Numbers `< 1e12` are treated as epoch **seconds**; `>= 1e12` as epoch **milliseconds**

```ts
import { timeAgo } from "@apurvapawaskar/timeago-plus";

timeAgo(new Date(Date.now() - 30_000)); // "30s ago"
timeAgo(Date.now() - 2 * 60_000);      // "2m ago"
timeAgo(new Date(Date.now() + 2 * 60_000)); // "in 2m"
timeAgo(Date.now() - 1_000);           // "just now" (within 2s threshold)
```

## ⚙️ Options

```ts
timeAgo(input, {
  now?: Date | number,       // reference time, defaults to Date.now()
  short?: boolean,           // true = "2m ago", false = "2 minutes ago". Default: true
  future?: boolean,          // allow future output like "in 2m". Default: true
  locale?: string,           // "en" | "fr" | "es" (or subtag like "es-ES"). Default: "en"
  labels?: Partial<TimeAgoLabels>, // override any label string
  justNowThreshold?: number, // seconds within which to return "just now". Minimum 2, default: 2
  futureDisabledLabel?: string, // string to show when future: false and input is a future date. Default: "just now"
});
```

**Behaviour notes:**
- Seconds use `Math.floor`; all larger units use `Math.round`

## ⚛ React

Requires React 17–19. `react` is a peer dependency (not bundled).

```tsx
import { useTimeAgo } from "@apurvapawaskar/timeago-plus/react";

export function Example() {
  const text = useTimeAgo(Date.now() - 30_000);
  return <span>{text}</span>;
}
```

For optimal performance, memoize the options object with `useMemo` when passing dynamic options.

## 🅰 Angular

Requires Angular 14+. `TimeAgoPipe` is a **standalone** pipe — add it to `imports`, not `declarations`.

```ts
import { TimeAgoPipe } from "@apurvapawaskar/timeago-plus/angular";

@Component({
  standalone: true,
  imports: [TimeAgoPipe],
  template: `<span>{{ createdAt | timeAgo }}</span>`
})
export class ExampleComponent {}
```

With options:

```html
<span>{{ createdAt | timeAgo : { locale: 'fr', short: false } }}</span>
```

Using from an NgModule (Angular 14+):

```ts
import { NgModule } from "@angular/core";
import { TimeAgoPipe } from "@apurvapawaskar/timeago-plus/angular";

@NgModule({
  imports: [TimeAgoPipe],   // standalone pipes go in imports[], not declarations[]
  exports: [TimeAgoPipe]
})
export class SharedModule {}
```

## 🧪 Playground

Try the playground online:

- [Core](https://timeago-plus.apurvapawaskar.in/)
- [React](https://react.timeago-plus.apurvapawaskar.in/)
- [Angular](https://angular.timeago-plus.apurvapawaskar.in/)


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

