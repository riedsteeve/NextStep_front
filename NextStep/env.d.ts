/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_URL_REGISTER_API: string;
  readonly VITE_CONNEXION_API: string;
  readonly VITE_APPLICATION_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}