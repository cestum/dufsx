#!/usr/bin/env node

/**
 * DUFSX Development Server
 * Simple development server for testing Tailwind CSS builds
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Configuration
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || 'localhost';
const DIST_DIR = path.join(__dirname, 'dist');
const WATCH_FILES = ['*.html', '*.css', '*.js'];

// MIME types
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  const timestamp = new Date().toTimeString().split(' ')[0];
  console.log(`${colors[color]}[${timestamp}] ${message}${colors.reset}`);
}

// Get MIME type for file
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

// Check if dist directory exists
function ensureDistDirectory() {
  if (!fs.existsSync(DIST_DIR)) {
    log('Dist directory not found. Creating...', 'yellow');
    fs.mkdirSync(DIST_DIR, { recursive: true });

    // Copy basic files if they don't exist
    const indexHtml = path.join(__dirname, 'index.html');
    const distIndexHtml = path.join(DIST_DIR, 'index.html');

    if (fs.existsSync(indexHtml) && !fs.existsSync(distIndexHtml)) {
      fs.copyFileSync(indexHtml, distIndexHtml);
      log('Copied index.html to dist/', 'green');
    }
  }
}

// Serve static files
function serveStatic(req, res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
        log(`404: ${req.url}`, 'red');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server error');
        log(`500: ${err.message}`, 'red');
      }
      return;
    }

    const mimeType = getMimeType(filePath);
    res.writeHead(200, {
      'Content-Type': mimeType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(data);
    log(`200: ${req.url} (${mimeType})`, 'green');
  });
}

// Handle live reload injection
function injectLiveReload(html) {
  const liveReloadScript = `
    <script>
      (function() {
        let ws;
        function connect() {
          ws = new WebSocket('ws://localhost:${PORT + 1}');
          ws.onmessage = function(event) {
            if (event.data === 'reload') {
              location.reload();
            }
          };
          ws.onclose = function() {
            setTimeout(connect, 1000);
          };
        }
        connect();
      })();
    </script>
  `;

  return html.replace('</body>', `${liveReloadScript}</body>`);
}

// Create HTTP server
function createServer() {
  const server = http.createServer((req, res) => {
    let url = req.url;

    // Remove query parameters
    url = url.split('?')[0];

    // Default to index.html for root
    if (url === '/') {
      url = '/index.html';
    }

    const filePath = path.join(DIST_DIR, url);
    const normalizedPath = path.normalize(filePath);

    // Security check: ensure path is within DIST_DIR
    if (!normalizedPath.startsWith(DIST_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Forbidden');
      log(`403: ${req.url} (path traversal attempt)`, 'red');
      return;
    }

    // Check if file exists
    fs.stat(normalizedPath, (err, stats) => {
      if (err) {
        // Try fallback to index.html for SPA routing
        const indexPath = path.join(DIST_DIR, 'index.html');
        fs.stat(indexPath, (indexErr) => {
          if (!indexErr) {
            serveStatic(req, res, indexPath);
          } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
            log(`404: ${req.url}`, 'red');
          }
        });
        return;
      }

      if (stats.isDirectory()) {
        // Try to serve index.html from directory
        const indexPath = path.join(normalizedPath, 'index.html');
        fs.stat(indexPath, (indexErr) => {
          if (!indexErr) {
            serveStatic(req, res, indexPath);
          } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Directory listing not allowed');
            log(`404: ${req.url} (directory)`, 'red');
          }
        });
        return;
      }

      // Inject live reload for HTML files
      if (path.extname(normalizedPath) === '.html') {
        fs.readFile(normalizedPath, 'utf8', (readErr, data) => {
          if (readErr) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Server error');
            return;
          }

          const injectedHtml = injectLiveReload(data);
          res.writeHead(200, {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(injectedHtml);
          log(`200: ${req.url} (HTML with live reload)`, 'green');
        });
        return;
      }

      serveStatic(req, res, normalizedPath);
    });
  });

  return server;
}

// Simple WebSocket server for live reload
function createWebSocketServer() {
  const WebSocket = require('ws');
  const wss = new WebSocket.Server({ port: PORT + 1 });

  wss.on('connection', (ws) => {
    log('Live reload client connected', 'cyan');

    ws.on('close', () => {
      log('Live reload client disconnected', 'cyan');
    });
  });

  return wss;
}

// Watch files for changes
function watchFiles(wss) {
  const chokidar = require('chokidar');

  const watcher = chokidar.watch([
    path.join(__dirname, '*.html'),
    path.join(__dirname, '*.css'),
    path.join(__dirname, '*.js'),
    path.join(DIST_DIR, '**/*')
  ], {
    ignored: /node_modules/,
    persistent: true
  });

  watcher.on('change', (filePath) => {
    log(`File changed: ${path.relative(__dirname, filePath)}`, 'yellow');

    // Broadcast reload to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === require('ws').OPEN) {
        client.send('reload');
      }
    });
  });

  return watcher;
}

// Build CSS on startup and changes
function buildCSS() {
  log('Building CSS...', 'blue');

  const tailwind = spawn('npx', [
    'tailwindcss',
    '-i', './input.css',
    '-o', './dist/index.css',
    '--watch'
  ], {
    stdio: 'pipe',
    cwd: __dirname
  });

  tailwind.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output) {
      log(`Tailwind: ${output}`, 'blue');
    }
  });

  tailwind.stderr.on('data', (data) => {
    const error = data.toString().trim();
    if (error && !error.includes('warn')) {
      log(`Tailwind Error: ${error}`, 'red');
    }
  });

  return tailwind;
}

// Main function
function main() {
  console.log(`
${colors.cyan}
╔══════════════════════════════════════╗
║           DUFSX Dev Server           ║
║      Tailwind CSS Development       ║
╚══════════════════════════════════════╝
${colors.reset}
  `);

  // Ensure dist directory exists
  ensureDistDirectory();

  // Create servers
  const server = createServer();
  let wss;

  try {
    wss = createWebSocketServer();
    log('Live reload WebSocket server created', 'cyan');
  } catch (err) {
    log('Live reload not available (install ws: npm install ws)', 'yellow');
  }

  // Start file watching if chokidar is available
  try {
    if (wss) {
      watchFiles(wss);
      log('File watching enabled', 'cyan');
    }
  } catch (err) {
    log('File watching not available (install chokidar: npm install chokidar)', 'yellow');
  }

  // Build CSS
  let tailwindProcess;
  try {
    tailwindProcess = buildCSS();
  } catch (err) {
    log('Tailwind CSS build failed. Make sure tailwindcss is installed.', 'red');
  }

  // Start HTTP server
  server.listen(PORT, HOST, () => {
    log(`Server running at http://${HOST}:${PORT}`, 'green');
    log('Press Ctrl+C to stop', 'yellow');

    // Open browser if possible
    const open = require('child_process').spawn;
    try {
      if (process.platform === 'darwin') {
        open('open', [`http://${HOST}:${PORT}`]);
      } else if (process.platform === 'win32') {
        open('start', [`http://${HOST}:${PORT}`], { shell: true });
      } else {
        open('xdg-open', [`http://${HOST}:${PORT}`]);
      }
    } catch (err) {
      // Ignore errors opening browser
    }
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    log('\nShutting down...', 'yellow');

    if (tailwindProcess) {
      tailwindProcess.kill();
    }

    if (wss) {
      wss.close();
    }

    server.close(() => {
      log('Server stopped', 'green');
      process.exit(0);
    });
  });
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  createServer,
  main
};
