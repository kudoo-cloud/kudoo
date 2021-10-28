module.exports = {
  bracketSpacing: true,
  jsxBracketSameLine: false,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'all',
  overrides: [
    {
      files: 'src/screens/LoadableComponents.tsx',
      options: {
        printWidth: 400,
      },
    },
  ],
};
