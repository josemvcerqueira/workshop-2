/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ALL_SERVICES_TESTNET_ACCESS_KEY: string;
  readonly VITE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
