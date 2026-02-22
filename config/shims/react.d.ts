declare module "react" {
  export type DependencyList = readonly unknown[];

  export function useEffect(effect: () => void | (() => void), deps?: DependencyList): void;
  export function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T;
  export function useRef<T>(initialValue: T): { current: T };
  export function useState<S>(initialState: S | (() => S)): [S, (value: S) => void];
}

