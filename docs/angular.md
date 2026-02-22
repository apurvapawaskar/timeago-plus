# Angular

Angular support is provided via a `TimeAgoPipe` entry-point that is distributed as an **Ivy-compatible, partially-compiled** library. It works with any Angular application built with Angular CLI 14 or later — no extra configuration is needed.

`@angular/core` is a peer dependency (not bundled). Angular 14–22 is supported.

---

## `TimeAgoPipe`

`TimeAgoPipe` is a **standalone** pipe. Use it in `imports[]`, never in `declarations[]`.

### Standalone component (Angular 14+) — recommended

```ts
import { TimeAgoPipe } from "@apurvapawaskar/timeago-plus/angular";

@Component({
  standalone: true,
  imports: [TimeAgoPipe],
  template: `
    <span>{{ createdAt | timeAgo }}</span>
    <span>{{ createdAt | timeAgo : { locale: 'fr', short: false } }}</span>
  `
})
export class ExampleComponent {
  createdAt = new Date(Date.now() - 90_000);
}
```

### NgModule (Angular 14+)

Standalone pipes must go in `imports[]`, not `declarations[]`:

```ts
import { NgModule } from "@angular/core";
import { TimeAgoPipe } from "@apurvapawaskar/timeago-plus/angular";

@NgModule({
  imports: [TimeAgoPipe],   // ✅ imports[], not declarations[]
  exports: [TimeAgoPipe]
})
export class SharedModule {}
```

Then use in module-based component templates as normal:

```html
<span>{{ createdAt | timeAgo }}</span>
<span>{{ createdAt | timeAgo : { locale: 'fr', short: false } }}</span>
```

---

## Behaviour

- Uses the same core formatting as `timeAgo()`.
- Marked `pure: false` and schedules smart refresh intervals so the displayed value stays live:
  - Within a minute: refreshes on the next whole-second boundary.
  - Within an hour: refreshes when the rounded minute count changes.
  - Beyond an hour: refreshes when the rounded hour/day count changes.
- If you pass `options.now`, the pipe returns a stable value and stops refreshing.
- Runs the timer outside Angular's Zone and calls `ChangeDetectorRef.markForCheck()` only when the displayed text actually changes — safe for `OnPush` components.

---

## Compatibility

| Angular version | Supported |
|---|---|
| 14 – 22 | ✅ |
| < 14 | ❌ (standalone APIs required) |

The library is distributed as an **Ivy partial compilation** (`ɵɵngDeclarePipe`). Angular CLI's linker processes it at application build time, so it remains forward-compatible with future Angular versions without needing a library rebuild.

---

See [api.md](./api.md) for all options.

