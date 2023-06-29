/** @type {import("eslint").Linter.Config} */
module.exports = {
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    "next",
    "turbo",
    "prettier",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { prefer: "type-imports", fixStyle: "inline-type-imports" },
    ],
    "prettier/prettier": "warn",
  },
  ignorePatterns: ["**/*.config.*", "dist", "node_modules", ".next", ".turbo", "__tests__"],
  reportUnusedDisableDirectives: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: "latest",
    tsconfigRootDir: '.',
    project: [
      "./tsconfig.json",
      "./apps/*/tsconfig.json",
      "./packages/*/tsconfig.json",
    ],
  },
};
