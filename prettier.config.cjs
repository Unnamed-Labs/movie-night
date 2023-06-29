/** @type {import("prettier").Config} */
const config = {
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 100,
  endOfLine: 'auto',
  singleAttributePerLine: true,
};

module.exports = config;
