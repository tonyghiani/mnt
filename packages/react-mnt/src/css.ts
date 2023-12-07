declare module 'csstype' {
  // eslint-disable-next-line no-unused-vars
  interface Properties {
    // Allow any CSS Custom Properties
    [index: `--${string}`]: any;
  }
}
