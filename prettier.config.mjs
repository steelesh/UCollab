/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],
  semi: true,
  singleQuote: true,
  bracketSpacing: true,
  bracketSameLine: true,
  printWidth: 120,
  tabWidth: 4,
};

export default config;
