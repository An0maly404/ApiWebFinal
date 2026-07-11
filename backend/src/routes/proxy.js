const { Router } = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const router = Router();

// Proxy to Itinerary Service (service-a) on port 5001
router.use(
  '/itinerary',
  createProxyMiddleware({
    target: 'http://localhost:5001',
    changeOrigin: true,
    pathRewrite: { '^/api/proxy/itinerary': '' },
    on: {
      proxyReq: (proxyReq, req) => {
        if (req.user) {
          proxyReq.setHeader('X-User-Id', req.user.googleId);
          proxyReq.setHeader('X-User-Email', req.user.email);
        }
      },
      error: (_err, _req, res) => {
        if (res.writeHead) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Bad Gateway', message: 'Itinerary service is unreachable' }));
        }
      },
    },
  })
);

// Proxy to Weather Service (service-b) on port 5002
router.use(
  '/weather',
  createProxyMiddleware({
    target: 'http://localhost:5002',
    changeOrigin: true,
    pathRewrite: { '^/api/proxy/weather': '' },
    on: {
      proxyReq: (proxyReq, req) => {
        if (req.user) {
          proxyReq.setHeader('X-User-Id', req.user.googleId);
          proxyReq.setHeader('X-User-Email', req.user.email);
        }
      },
      error: (_err, _req, res) => {
        if (res.writeHead) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Bad Gateway', message: 'Weather service is unreachable' }));
        }
      },
    },
  })
);

module.exports = router;
