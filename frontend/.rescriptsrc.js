const path = require('path');

module.exports = (config) => {
  config = {
    ...config,
    resolve: {
      ...(config.resolve || {}),
      alias: {
        ...((config.resolve || {}).alias || {}),
        // Needed when library is linked via `npm link` to app, in case of @kudoo/component development
        react: path.resolve('./node_modules/react'),
        'react-dom': path.resolve('./node_modules/react-dom'),
        'react-router-dom': path.resolve('./node_modules/react-router-dom'),
        'react-router': path.resolve('./node_modules/react-router'),
      },
    },
  };

  return config;
};
