export {};
// eslint-disable-next-line
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app: any) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8888',
      changeOrigin: true,
    }),
  );
};
