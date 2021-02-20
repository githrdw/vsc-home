export {};

declare global {
  interface __webpack_init_sharing__ {
    (): any;
  }
  interface __webpack_share_scopes__ {
    default: object;
  }
  interface Window {
    acquireVsCodeApi(): {
      postMessage(data: object): void;
    };
  }
}
