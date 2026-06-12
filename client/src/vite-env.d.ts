/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  // define VITE_ environment variables here if needed
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv
}
