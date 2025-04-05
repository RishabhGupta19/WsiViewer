// module.exports = {
//     style: {
//       postcss: {
//         plugins: [
//           require('@tailwindcss/postcss'), // Use the Tailwind PostCSS plugin
//         ],
//       },
//     },
//   };
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      if (env === 'production') {
        // Remove React Refresh plugin
        webpackConfig.plugins = webpackConfig.plugins.filter(
          plugin => plugin.constructor.name !== 'ReactRefreshPlugin'
        );

        // Remove react-refresh from babel-loader
        webpackConfig.module.rules.forEach(rule => {
          if (rule.oneOf) {
            rule.oneOf.forEach(oneOfRule => {
              if (oneOfRule.use && oneOfRule.use.loader === 'babel-loader') {
                oneOfRule.use.options.plugins = oneOfRule.use.options.plugins?.filter(
                  plugin => !/react-refresh/.test(String(plugin))
                );
                // Ensure no development transforms
                oneOfRule.use.options.presets = oneOfRule.use.options.presets?.filter(
                  preset => !/react-refresh/.test(String(preset))
                );
              }
            });
          }
        });

        // Disable HMR and WebSocket configurations
        webpackConfig.entry = webpackConfig.entry.filter(
          entry => !entry.includes('webpack-hot-middleware') && !entry.includes('sockjs')
        );
        webpackConfig.plugins = webpackConfig.plugins.filter(
          plugin => plugin.constructor.name !== 'HotModuleReplacementPlugin'
        );
        webpackConfig.devServer = undefined; // Explicitly disable dev server

        // Optimize to avoid development runtime
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          runtimeChunk: false,
          splitChunks: {
            ...webpackConfig.optimization.splitChunks,
            cacheGroups: {
              ...webpackConfig.optimization.splitChunks.cacheGroups,
              default: false,
            },
          },
        };
      }

      // Tailwind CSS and resolve configuration
      return {
        ...webpackConfig,
        resolve: {
          ...webpackConfig.resolve,
          modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        },
      };
    },
  },
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
};
