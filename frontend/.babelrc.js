let presets = [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
    '@lingui/babel-preset-react',
  ];
  let plugins = [
    '@lingui/babel-plugin-transform-react',
    '@lingui/babel-plugin-transform-js',
  ];
  
  module.exports = { presets, plugins };