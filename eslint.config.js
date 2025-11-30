import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["node"]),
  {
    files: ["tests/**/*.js"],
    rules: {
      // Test files are expected to be self-contained
      "no-restricted-imports": ["error", {
        patterns: ["*"],
      }],
      "no-restricted-globals": ["error",
        { name: "require", message: "Test files are expected to be self-contained" }
      ]
    },
  },
]);