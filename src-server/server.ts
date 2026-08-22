import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import path from 'path';
import fs from 'fs';
import { getAvailablePort, ENV } from './config/env';
import { stateStore } from './services/state-store';
import { configRoute } from './routes/config.route';
import { websocketRoute } from './routes/websocket.route';

function findDir(candidates: string[]): string | null {
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.svg': return 'image/svg+xml';
    case '.ico': return 'image/x-icon';
    case '.woff2': return 'font/woff2';
    case '.woff': return 'font/woff';
    case '.ttf': return 'font/ttf';
    default: return 'application/octet-stream';
  }
}

/**
 * Security: Path Traversal Prevention
 * Validates that requested file path resides strictly inside target base directory.
 */
function isSafePath(baseDir: string, targetPath: string): boolean {
  const resolvedBase = path.resolve(baseDir);
  const resolvedTarget = path.resolve(targetPath);
  return resolvedTarget.startsWith(resolvedBase);
}

async function bootstrap() {
  const activePort = await getAvailablePort(ENV.PORT);
  stateStore.setActivePort(activePort);

  const cwd = process.cwd();
  const exeDir = path.dirname(process.execPath);

  // Write active_port.txt so desktop launcher always knows exact port
  try {
    fs.writeFileSync(path.join(cwd, 'active_port.txt'), String(activePort));
    fs.writeFileSync(path.join(exeDir, 'active_port.txt'), String(activePort));
  } catch (err) {}

  const uiCandidates = [
    path.resolve(cwd, 'ui'),
    path.resolve(cwd, 'dist/ui'),
    path.resolve(exeDir, 'ui'),
    path.resolve(exeDir, 'dist/ui'),
    path.resolve(__dirname, 'ui'),
    path.resolve(__dirname, '../dist/ui'),
  ];
  const publicCandidates = [
    path.resolve(cwd, 'public'),
    path.resolve(cwd, 'dist/public'),
    path.resolve(cwd, 'src-server/public'),
    path.resolve(exeDir, 'public'),
    path.resolve(exeDir, 'dist/public'),
    path.resolve(__dirname, 'public'),
    path.resolve(__dirname, '../src-server/public'),
  ];

  const resolvedUiDir = findDir(uiCandidates) || path.resolve(cwd, 'dist/ui');
  const resolvedPublicDir = findDir(publicCandidates) || path.resolve(cwd, 'dist/public');

  const app = new Elysia()
    .use(cors({
      origin: ['http://localhost:' + activePort, 'http://127.0.0.1:' + activePort, 'null', '*'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }))

    // Health ping endpoint for launcher socket probe
    .get('/ping', () => ({ status: 'ok', port: activePort, time: Date.now() }))

    // Static OBS overlay endpoint
    .get('/overlay', () => {
      const overlayCandidates = [
        path.join(resolvedPublicDir, 'overlay.html'),
        path.resolve(cwd, 'public/overlay.html'),
        path.resolve(cwd, 'dist/public/overlay.html'),
        path.resolve(cwd, 'src-server/public/overlay.html'),
        path.resolve(exeDir, 'public/overlay.html'),
      ];
      for (const p of overlayCandidates) {
        if (fs.existsSync(p)) {
          return new Response(fs.readFileSync(p), {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          });
        }
      }
      return new Response('Overlay template not found', { status: 404 });
    })

    // Securely Serve UI assets (/assets/*) with Path Traversal Check
    .get('/assets/*', ({ params }) => {
      const assetSubPath = (params as any)['*'];
      const assetPath = path.join(resolvedUiDir, 'assets', assetSubPath);

      if (!isSafePath(path.join(resolvedUiDir, 'assets'), assetPath)) {
        return new Response('Forbidden', { status: 403 });
      }

      if (fs.existsSync(assetPath)) {
        return new Response(fs.readFileSync(assetPath), {
          headers: { 'Content-Type': getContentType(assetPath) },
        });
      }
      return new Response('Asset not found', { status: 404 });
    })

    // Serve app-icon.png
    .get('/app-icon.png', () => {
      const iconCandidates = [
        path.join(resolvedUiDir, 'app-icon.png'),
        path.join(resolvedPublicDir, 'app-icon.png'),
        path.resolve(cwd, 'public/app-icon.png'),
        path.resolve(exeDir, 'public/app-icon.png'),
      ];
      for (const p of iconCandidates) {
        if (fs.existsSync(p)) {
          return new Response(fs.readFileSync(p), {
            headers: { 'Content-Type': 'image/png' },
          });
        }
      }
      return new Response('Icon not found', { status: 404 });
    })

    // Mount REST & WebSocket Routes
    .use(configRoute)
    .use(websocketRoute)

    // Secure SPA Fallback routing
    .get('*', ({ request }) => {
      const url = new URL(request.url);
      if (url.pathname.startsWith('/api') || url.pathname.startsWith('/ws')) {
        return;
      }

      const directFilePath = path.join(resolvedUiDir, url.pathname);
      if (isSafePath(resolvedUiDir, directFilePath) && fs.existsSync(directFilePath) && !fs.statSync(directFilePath).isDirectory()) {
        return new Response(fs.readFileSync(directFilePath), {
          headers: { 'Content-Type': getContentType(directFilePath) },
        });
      }

      const uiIndexPath = path.join(resolvedUiDir, 'index.html');
      if (fs.existsSync(uiIndexPath)) {
        return new Response(fs.readFileSync(uiIndexPath), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      return new Response('VTuber AI Subtitle Server Active', { status: 200 });
    });

  // Strict Local Loopback Binding (Secured against remote LAN exploitation)
  app.listen({
    port: activePort,
    hostname: '127.0.0.1',
  });

  console.log(`
  🖤 ======================================================= 🖤
     VTUBER REAL-TIME OBS AI SUBTITLE STUDIO PRO (SECURED)
     Simultaneous Support: Thai (TH) ✦ Japanese (JP) ✦ English (EN)
  🖤 ======================================================= 🖤
  🚀 Desktop App GUI:    http://127.0.0.1:${activePort}
  📺 OBS Overlay URL:    http://127.0.0.1:${activePort}/overlay
  ⚡ WebSocket Endpoint: ws://127.0.0.1:${activePort}/ws
  ⚙️  Config REST API:    http://127.0.0.1:${activePort}/api/config
  🖤 ======================================================= 🖤
  `);

  return app;
}

bootstrap().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
