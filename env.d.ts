/// <reference types="vite/client" />
/// <reference types="unocss/vite" />

interface ImportMetaEnv {
  readonly VITE_API_SECRET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
