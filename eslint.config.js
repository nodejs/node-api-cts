import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";

export default defineConfig([
  globalIgnores(["node"]),
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      // Only allow ECMAScript built-ins and CTS harness globals.
      // This causes no-undef to flag any runtime-specific API (setTimeout, process, Buffer, etc.).
      globals: {
        ...globals.es2025,
        // CTS harness globals
        assert: "readonly",
        loadAddon: "readonly",
        mustCall: "readonly",
        mustNotCall: "readonly",
        gcUntil: "readonly",
        experimentalFeatures: "readonly",
      },
    },
    rules: {
      "no-undef": "error",
      "no-restricted-imports": ["error", {
        patterns: ["*"],
      }],
      "no-restricted-syntax": ["error",
        { selector: "MemberExpression[object.name='globalThis']", message: "Avoid globalThis access in test files — use CTS harness globals instead" },
        { selector: "MemberExpression[object.name='global']", message: "Avoid global access in test files — use CTS harness globals instead" }
      ],
    },
  },
]);
