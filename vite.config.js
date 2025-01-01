import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
    plugins: [vue(), vueJsx()],
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
            },
        },
    },
    server: {
        port: 3005,
        host: '0.0.0.0',
        proxy: {
            '/v1': {
                target: 'https://api.hunyuan.cloud.tencent.com',
                changeOrigin: true,
            },
        },
    },
    test: {
        globals: true,
        environment: 'happy-dom',
        setupFiles: ['vitest.setup.js'],
    },
})
