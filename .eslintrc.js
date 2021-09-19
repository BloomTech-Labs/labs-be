module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  plugins: ["import", "@typescript-eslint"],
  rules: {
    "no-console": 1,
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
      },
    ],
    "no-shadow": "off",
    "no-unsafe-assignment": "off",
    "@typescript-eslint/no-shadow": ["error"],
    "max-len": ["warn", { code: 89, "ignoreTemplateLiterals": true }],
    "import/prefer-default-export": "off",
    quotes: [2, "double", { avoidEscape: true }],
  },
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
};
