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
        // Debug entry structure
        console.log('webpackConfig.entry:', webpackConfig.entry);

        // Handle entry as an object (CRA default)
        if (typeof webpackConfig.entry === 'object' && !Array.isArray(webpackConfig.entry)) {
          const entryValues = Object.values(webpackConfig.entry);
          webpackConfig.entry = entryValues.flat().filter(
            entry => !entry.includes('webpack-hot-middleware') && !entry.includes('sockjs')
          );
        } else if (Array.isArray(webpackConfig.entry)) {
          webpackConfig.entry = webpackConfig.entry.filter(
            entry => !entry.includes('webpack-hot-middleware') && !entry.includes('sockjs')
          );
        }

        // Remove React Refresh plugin
        webpackConfig.plugins = webpackConfig.plugins.filter(
          plugin => plugin.constructor.name !== 'ReactRefreshPlugin'
        );

        // Remove react-refresh and HMR from babel-loader
        webpackConfig.module.rules.forEach(rule => {
          if (rule.oneOf) {
            rule.oneOf.forEach(oneOfRule => {
              if (oneOfRule.use && oneOfRule.use.loader === 'babel-loader') {
                oneOfRule.use.options.plugins = oneOfRule.use.options.plugins?.filter(
                  plugin => !/react-refresh|hot/.test(String(plugin))
                );
                oneOfRule.use.options.presets = oneOfRule.use.options.presets?.filter(
                  preset => !/react-refresh|hot/.test(String(preset))
                );
              }
            });
          }
        });

        // Disable HMR and WebSocket configurations
        webpackConfig.plugins = webpackConfig.plugins.filter(
          plugin => plugin.constructor.name !== 'HotModuleReplacementPlugin'
        );
        delete webpackConfig.devServer; // Explicitly remove dev server config

        // Optimize to avoid development runtime with safeguards
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          runtimeChunk: false,
          splitChunks: {
            ...(webpackConfig.optimization?.splitChunks || {}), // Default to empty object if undefined
            cacheGroups: {
              ...(webpackConfig.optimization?.splitChunks?.cacheGroups || {}), // Default to empty object if undefined
              default: false,
            },
          },
        };

        // Ensure no development client is included
        webpackConfig.output = {
          ...webpackConfig.output,
          devtoolModuleFilenameTemplate: '[resource-path]',
          devtoolFallbackModuleFilenameTemplate: '[resource-path]?[hash]',
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
