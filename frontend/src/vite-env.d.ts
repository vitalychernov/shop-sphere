/// <reference types="vite/client" />

// Type declarations for CSS Modules — tells TypeScript that .module.css
// files export an object mapping class names to their generated strings
declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}
