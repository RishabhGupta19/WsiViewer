// module.exports = {
//     style: {
//       postcss: {
//         plugins: [
//           require('@tailwindcss/postcss'), // Use the Tailwind PostCSS plugin
//         ],
//       },
//     },
//   };
module.exports = {
  webpack: {
    configure: (webpackConfig, { env }) => {
      if (env === 'production') {
        // Remove React Refresh plugin
        webpackConfig.plugins = webpackConfig.plugins.filter(
          plugin => plugin.constructor.name !== 'ReactRefreshPlugin'
        );
        // Ensure no refresh runtime is included
        webpackConfig.module.rules.forEach(rule => {
          if (rule.oneOf) {
            rule.oneOf.forEach(oneOfRule => {
              if (oneOfRule.use && oneOfRule.use.loader === 'babel-loader') {
                oneOfRule.use.options.plugins = oneOfRule.use.options.plugins?.filter(
                  plugin => !plugin?.includes('react-refresh')
                );
              }
            });
          }
        });
      }
      return webpackConfig;
    },
  },
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
};
