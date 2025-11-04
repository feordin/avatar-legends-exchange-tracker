/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AZURE_DATA_API_ENDPOINT: string;
  readonly VITE_AZURE_DATA_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
