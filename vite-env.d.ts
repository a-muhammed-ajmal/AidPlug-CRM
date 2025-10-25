// This reference was commented out to resolve a "Cannot find type definition file" error.
// The manual type definitions below serve as a sufficient workaround.
// /// <reference types="vite/client" />

// Manually define the ImportMetaEnv interface to provide types for Vite environment variables.
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly MODE: string;
  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
