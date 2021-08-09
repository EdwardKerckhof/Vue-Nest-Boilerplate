import Vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
import Banner from 'vite-plugin-banner'
import Icons from 'vite-plugin-icons'
import Pages from 'vite-plugin-pages'

import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue(),
    Banner(
      `/**\n * name: ${pkg.name}\n * version: v${pkg.version}\n * description: ${pkg.description}\n * author: ${pkg.author}\n */`
    ),
    Icons(),
    Pages({
      extendRoute(route) {
        return {
          ...route,
          meta: { title: route.name }
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000/api',
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/api/, '')
      }
    }
  }
})
