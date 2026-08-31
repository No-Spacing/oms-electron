import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
    base: './', // <--- Critical for Electron file loading in production
    root: resolve(import.meta.dirname, 'src'),
    plugins:[ vue(), tailwindcss() ],
    build: {
        outDir: resolve(import.meta.dirname, 'dist'),
        emptyOutDir: true,
    },
})