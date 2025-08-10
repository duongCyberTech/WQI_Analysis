const express = require('express');
const router = express.Router();
const { createProxyMiddleware } = require('http-proxy-middleware');

// Proxy tới data-service
router.use('/admin', createProxyMiddleware({
  target: 'http://data-service:3002',
  changeOrigin: true
}));

router.use('/devices', createProxyMiddleware({
    target: 'http://data-service:3001',
    changeOrigin: true
}));

router.use('/monitor', createProxyMiddleware({
    target: 'http://data-service:3001',
    changeOrigin: true
}));

router.use('/alerts', createProxyMiddleware({
    target: 'http://data-service:3001',
    changeOrigin: true
}));

module.exports = router;
