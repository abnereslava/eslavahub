import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["node_modules/**", ".firebase/**"]
  },
  js.configs.recommended,
  {
    files: ["public/js/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser
      }
    },
    rules: {
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
    }
  }
];
