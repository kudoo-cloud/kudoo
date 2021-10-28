const bableConfig = require('./.babelrc.js');

module.exports = {
  sourceLocale: 'en_AU',
  localeDir: '<rootDir>/../../../kudoo-locale',
  srcPathDirs: ['<rootDir>/src'],
  srcPathIgnorePatterns: ['/node_modules/'],
  format: 'minimal',
  extractBabelOptions: bableConfig,
};
