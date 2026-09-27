'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

const port = Number(process.env.PORT) || 8080;
const root = path.resolve(__dirname);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

function isInsideRoot(candidate) {
  const relative = path.relative(root, candidate);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function send(response, status, type, body) {
  response.writeHead(status, { 'Content-Type': type });
  response.end(body);
}

function sendFile(response, filePath) {
  const type = types[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
  fs.readFile(filePath, (error, body) => {
    if (error) {
      send(response, 404, 'text/plain; charset=utf-8', 'Not found');
      return;
    }
    send(response, 200, type, body);
  });
}

const server = http.createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
  } catch {
    send(response, 400, 'text/plain; charset=utf-8', 'Bad request');
    return;
  }

  const candidate = path.resolve(root, `.${pathname}`);
  if (!isInsideRoot(candidate)) {
    send(response, 403, 'text/plain; charset=utf-8', 'Forbidden');
    return;
  }

  fs.stat(candidate, (statError, stat) => {
    if (!statError && stat.isFile()) {
      sendFile(response, candidate);
      return;
    }

    if (!statError && stat.isDirectory()) {
      sendFile(response, path.join(candidate, 'index.html'));
      return;
    }

    if (path.extname(pathname)) {
      send(response, 404, 'text/plain; charset=utf-8', 'Not found');
      return;
    }

    sendFile(response, path.join(root, 'index.html'));
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`CivicConnect listening on port ${port}`);
});
