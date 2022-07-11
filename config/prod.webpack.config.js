const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const ExtensionsPlugin = require('@redhat-cloud-services/frontend-components-config-utilities/extensions-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  ...(process.env.BETA && { deployment: 'beta/apps' }),
  routes: {
    '/api/sources': { host: "http://127.0.0.1:8000" }
   }
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')({
    root: resolve(__dirname, '../'),
    exposes: {
      './RootApp': resolve(__dirname, '../src/AppEntry'),
      './RecommendedServices': resolve(__dirname, '../src/marketplace/RecommendedServices.js'),
    },
  }),
  new ExtensionsPlugin(
    {
      extensions: [
        {
          type: 'console.page/route',
          properties: {
            path: '/marketplace',
            component: {
              $codeRef: 'RecommendedServices',
            },
          },
        },
      ],
    },
    {
      exposes: {
        RecommendedServices: resolve(__dirname, '../src/marketplace/RecommendedServices.js'),
      },
    }
  )
);

module.exports = function (env) {
  if (env && env.analyze === 'true') {
    plugins.push(new BundleAnalyzerPlugin());
  }

  return {
    ...webpackConfig,
    plugins,
  };
};
