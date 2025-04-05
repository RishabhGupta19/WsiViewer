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
    configure: (webpackConfig) => {
      // 🚫 Remove ReactRefreshWebpackPlugin in production
      if (process.env.NODE_ENV === 'production') {
        webpackConfig.plugins = webpackConfig.plugins.filter(
          (plugin) => plugin.constructor.name !== 'ReactRefreshWebpackPlugin'
        );
      }
      return webpackConfig;
    },
  },
  style: {
    postcss: {
      plugins: [
        require('@tailwindcss/postcss'), // ✅ TailwindCSS still configured
      ],
    },
  },
};
