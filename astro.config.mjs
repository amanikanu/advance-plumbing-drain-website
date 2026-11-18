import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';
import { serveRequest } from './api/request.mjs';
export default defineConfig({
  site: 'https://advancedplumbingsf.com', output: 'static', trailingSlash: 'always',
  devToolbar: {enabled: false}, server: {host: '0.0.0.0', port: 4321},
  vite: { build:{assetsInlineLimit:0}, plugins: [tailwind(), {name:'local-request-endpoint',configureServer(server){server.middlewares.use('/api/request',serveRequest)}}], server: {allowedHosts:true}},
  build: {inlineStylesheets: 'never'}
});
