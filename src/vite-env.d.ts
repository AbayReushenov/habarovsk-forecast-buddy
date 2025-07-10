/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    readonly SUPABASE_SERVICE_KEY: string
    // другие переменные окружения...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
