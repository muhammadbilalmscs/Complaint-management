const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;
const root = __dirname;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

function send(res, status, type, body) {
  res.writeHead(status, { 'Content-Type': type });
  res.end(body);
}

const server = http.createServer((request, response) => {
  const requestPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const requested = path.normalize(path.join(root, requestPath));

  if (!requested.startsWith(root)) {
    send(response, 403, 'text/plain; charset=utf-8', 'Forbidden');
    return;
  }

  fs.stat(requested, (statError, stat) => {
    const filePath = !statError && stat.isDirectory() ? path.join(requested, 'index.html') : requested;
    fs.readFile(filePath, (readError, body) => {
      if (!readError) {
        const type = types[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
        send(response, 200, type, body);
        return;
      }

      fs.readFile(path.join(root, 'index.html'), (indexError, indexBody) => {
        if (indexError) {
          send(response, 404, 'text/plain; charset=utf-8', 'Not found');
          return;
        }
        send(response, 200, types['.html'], indexBody);
      });
    });
  });
});

server.listen(port, () => {
  console.log(`CivicConnect static site listening on ${port}`);
});
