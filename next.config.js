module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['stackfood.6am.one'],
    staticPageGenerationTimeout: 600, // Moderate timeout for static page generation (10 minutes)
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = {
        aggregateTimeout: 300, // Delay the rebuild after changes
        poll: process.env.NODE_ENV === 'development' ? 1000 : false, // Only poll in development
      };
    }
    return config;
  },
}
