declare module "@angular/core" {
  export interface PipeTransform {
    transform(value: unknown, ...args: unknown[]): unknown;
  }

  export abstract class ChangeDetectorRef {
    abstract markForCheck(): void;
  }

  export class NgZone {
    run<T>(fn: () => T): T;
    runOutsideAngular<T>(fn: () => T): T;
  }

  export function Pipe(metadata: { name: string; pure?: boolean }): (target: any) => any;
}

