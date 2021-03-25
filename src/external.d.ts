declare module 'daf-renderer' {
  // const noTypesYet: any;
  type divElement = string | HTMLElement | null;
  interface dafRenderer {
    render(main: string, inner: string, outer: string, amud: "a" | "b", lineBreak: string): void;
  }
  const factory : (div: divElement, options: object) => dafRenderer;
  export default factory;
  export type { dafRenderer };
}
