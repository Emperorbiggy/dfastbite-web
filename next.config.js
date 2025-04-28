module.exports = {
    reactStrictMode: true,
    images: {
      domains: ['stackfood.6am.one'],
      staticPageGenerationTimeout: 1500, // Increase timeout to 5 minutes
    },
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.watchOptions = {
          aggregateTimeout: 300, // Delay the rebuild after changes
          poll: 1000, // Check for changes every second
        };
      }
      return config;
    },
  }
  