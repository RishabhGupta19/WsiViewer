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
      console.log('Environment:', env); // Debug env
      if (env === 'production' || process.env.NODE_ENV === 'production') {
        console.log('webpackConfig.entry:', webpackConfig.entry);
        console.log('webpackConfig.optimization:', webpackConfig.optimization);

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

        webpackConfig.plugins = webpackConfig.plugins.filter(
          plugin => plugin.constructor.name !== 'ReactRefreshPlugin' && plugin.constructor.name !== 'HotModuleReplacementPlugin'
        );

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

        delete webpackConfig.devServer;

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

        webpackConfig.output = {
          ...webpackConfig.output,
          devtoolModuleFilenameTemplate: '[resource-path]',
          devtoolFallbackModuleFilenameTemplate: '[resource-path]?[hash]',
        };
      }

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
