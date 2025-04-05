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
              if (
                oneOfRule.use &&
                oneOfRule.use.loader === 'babel-loader'
              ) {
                oneOfRule.use.options.plugins =
                  oneOfRule.use.options.plugins?.filter(
                    plugin => !/react-refresh/.test(String(plugin))
                  );
                oneOfRule.use.options.presets =
                  oneOfRule.use.options.presets?.filter(
                    preset => !/react-refresh/.test(String(preset))
                  );
              }
            });
          }
        });

        // Safely handle various forms of webpackConfig.entry
        if (typeof webpackConfig.entry === 'string') {
          if (
            webpackConfig.entry.includes('webpack-hot-middleware') ||
            webpackConfig.entry.includes('sockjs')
          ) {
            webpackConfig.entry = undefined;
          }
        } else if (Array.isArray(webpackConfig.entry)) {
          webpackConfig.entry = webpackConfig.entry.filter(
            entry =>
              typeof entry === 'string' &&
              !entry.includes('webpack-hot-middleware') &&
              !entry.includes('sockjs')
          );
        } else if (typeof webpackConfig.entry === 'object') {
          for (const key in webpackConfig.entry) {
            const value = webpackConfig.entry[key];
            if (Array.isArray(value)) {
              webpackConfig.entry[key] = value.filter(
                entry =>
                  typeof entry === 'string' &&
                  !entry.includes('webpack-hot-middleware') &&
                  !entry.includes('sockjs')
              );
            }
          }
        }

        // Disable HMR plugin
        webpackConfig.plugins = webpackConfig.plugins.filter(
          plugin => plugin.constructor.name !== 'HotModuleReplacementPlugin'
        );

        // Disable dev server
        webpackConfig.devServer = undefined;

        // Optimize runtime and chunking (safely check for existing structure)
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          runtimeChunk: false,
          splitChunks: {
            ...(webpackConfig.optimization?.splitChunks || {}),
            cacheGroups: {
              ...(webpackConfig.optimization?.splitChunks?.cacheGroups || {}),
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
