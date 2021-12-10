let enableAnalyze = process.env.ANALYZE === 'true';
let nextConfig = {};

const withCSS = require('@zeit/next-css');
nextConfig = withCSS({
  webpack(config, options) {
    const webpack = require('webpack');
    config.plugins.push(
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /es|zh-cn/)
    );

    if (!enableAnalyze) {
      return config;
    }

    return config;
  },
});

if (enableAnalyze) {
  const withBundleAnalyze = require('@next/bundle-analyzer')({
    enabled: enableAnalyze,
  });
  nextConfig = withBundleAnalyze(nextConfig);
}

module.exports = {
  ...nextConfig,
  devIndicators: {
    autoPrerender: false,
  },
};
