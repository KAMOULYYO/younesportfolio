import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import type { IncomingMessage, ServerResponse } from 'http'
import vercel from './vercel.json'

// Mêmes en-têtes de sécurité que Vercel pour `npm run preview` (test local de la CSP)
const securityHeaders = Object.fromEntries(
  vercel.headers[0].headers.map(h => [h.key, h.value]),
)

// En local, sert les fonctions de /api (comme Vercel en production)
function apiDevServer(): Plugin {
  const handle = (server: ViteDevServer) => async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const url = req.url ?? ''
    if (!url.startsWith('/api/')) return next()
    const name = url.slice(5).split('?')[0].replace(/[^a-z0-9-]/gi, '')
    try {
      const mod = await server.ssrLoadModule(`/api/${name}.ts`)
      const handler = mod[req.method ?? 'GET']
      if (typeof handler !== 'function') { res.statusCode = 405; return res.end() }
      const chunks: Buffer[] = []
      for await (const c of req) chunks.push(c as Buffer)
      const request = new Request(`http://localhost${url}`, {
        method: req.method,
        headers: req.headers as Record<string, string>,
        body: chunks.length ? Buffer.concat(chunks) : undefined,
      })
      const response: Response = await handler(request)
      res.statusCode = response.status
      response.headers.forEach((v, k) => res.setHeader(k, v))
      res.end(Buffer.from(await response.arrayBuffer()))
    } catch (err) {
      console.error('[api]', err)
      res.statusCode = 500
      res.end('{"error":"server"}')
    }
  }
  return {
    name: 'api-dev-server',
    configureServer(server) { server.middlewares.use(handle(server)) },
    // `npm run preview` sert le build statique : l'assistant y est simplement désactivé
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next()
        res.setHeader('Content-Type', 'application/json')
        res.end(req.method === 'GET' ? '{"enabled":false}' : '{"error":"disabled"}')
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // Rend ANTHROPIC_API_KEY (.env.local, jamais commité) disponible pour /api en local
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    plugins: [react(), tailwindcss(), apiDevServer()],
    base: process.env.GITHUB_ACTIONS ? '/younesportfolio/' : '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    preview: {
      headers: securityHeaders,
    },
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (/node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react';
            if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion-')) return 'motion';
            if (id.includes('node_modules/react-router')) return 'router';
            if (id.includes('node_modules/lucide-react')) return 'icons';
            if (id.includes('node_modules/@radix-ui')) return 'radix';
          },
        },
      },
    },
  }
})
