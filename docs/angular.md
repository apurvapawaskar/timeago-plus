# Angular

Angular support is provided as a small pipe entrypoint.

Angular itself is a peer dependency (not bundled).

## `TimeAgoPipe`

Import and declare/export the pipe:

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
<span>{{ createdAt | timeAgo }}</span>
<span>{{ createdAt | timeAgo : { locale: "fr", short: true } }}</span>
```

### Notes

- Uses the same core formatting as `timeAgo()`.
- Marked as `pure: false` and refreshes periodically so the display stays up to date.
- If you pass `now` in options, the output stays stable (no periodic refresh needed).

See [docs/api.md](./api.md) for all options.

