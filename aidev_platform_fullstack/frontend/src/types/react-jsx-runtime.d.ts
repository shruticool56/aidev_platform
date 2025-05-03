declare module 'react/jsx-runtime' {
  export namespace JSX {
    interface Element {
      props: any;
    }
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
  export function jsx(type: any, props: any, key?: string): any;
  export function jsxs(type: any, props: any, key?: string): any;
} 