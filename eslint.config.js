import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
  globalIgnores(['**/CMakeFiles/**', 'build/**']),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  // Formatting rules mirrored from nodejs/node's eslint.config.mjs.
  // nodejs/node uses the JS-only @stylistic/eslint-plugin-js; this repo has
  // TypeScript, so we use the unified @stylistic/eslint-plugin (same rules,
  // JS + TS aware). Keep this block in sync with upstream when it changes.
  {
    files: ['**/*.{js,mjs,ts}'],
    plugins: { '@stylistic': stylistic },
    rules: {
      '@stylistic/arrow-parens': 'error',
      '@stylistic/arrow-spacing': 'error',
      '@stylistic/block-spacing': 'error',
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/comma-spacing': 'error',
      '@stylistic/comma-style': 'error',
      '@stylistic/computed-property-spacing': 'error',
      '@stylistic/dot-location': ['error', 'property'],
      '@stylistic/eol-last': 'error',
      '@stylistic/function-call-spacing': 'error',
      '@stylistic/indent': ['error', 2, {
        ArrayExpression: 'first',
        CallExpression: { arguments: 'first' },
        FunctionDeclaration: { parameters: 'first' },
        FunctionExpression: { parameters: 'first' },
        MemberExpression: 'off',
        ObjectExpression: 'first',
        SwitchCase: 1,
        assignmentOperator: 'off',
      }],
      '@stylistic/key-spacing': 'error',
      '@stylistic/keyword-spacing': 'error',
      '@stylistic/linebreak-style': 'error',
      '@stylistic/max-len': ['error', {
        code: 120,
        ignorePattern: '^// Flags:',
        ignoreRegExpLiterals: true,
        ignoreTemplateLiterals: true,
        ignoreUrls: true,
        tabWidth: 2,
      }],
      '@stylistic/new-parens': 'error',
      '@stylistic/no-confusing-arrow': 'error',
      '@stylistic/no-extra-parens': ['error', 'functions'],
      '@stylistic/no-multi-spaces': ['error', { ignoreEOLComments: true }],
      '@stylistic/no-multiple-empty-lines': ['error', { max: 2, maxEOF: 0, maxBOF: 0 }],
      '@stylistic/no-tabs': 'error',
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/no-whitespace-before-property': 'error',
      '@stylistic/object-curly-newline': 'error',
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/one-var-declaration-per-line': 'error',
      '@stylistic/operator-linebreak': ['error', 'after'],
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'function', next: 'function' },
      ],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: 'always' }],
      '@stylistic/quote-props': ['error', 'consistent'],
      '@stylistic/rest-spread-spacing': 'error',
      '@stylistic/semi': 'error',
      '@stylistic/semi-spacing': 'error',
      '@stylistic/space-before-blocks': ['error', 'always'],
      '@stylistic/space-before-function-paren': ['error', {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always',
      }],
      '@stylistic/space-in-parens': 'error',
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/space-unary-ops': 'error',
      '@stylistic/spaced-comment': ['error', 'always', {
        block: { balanced: true },
        exceptions: ['-'],
      }],
      '@stylistic/template-curly-spacing': 'error',
    },
  },
  {
    files: [
      'tests/**/*.js',
    ],
    languageOptions: {
      // Only allow ECMAScript built-ins and CTS harness globals.
      // This causes no-undef to flag any runtime-specific API (setTimeout, process, Buffer, etc.).
      globals: {
        ...globals.es2025,
        // CTS harness globals
        assert: 'readonly',
        loadAddon: 'readonly',
        mustCall: 'readonly',
        mustNotCall: 'readonly',
        gc: 'readonly',
        gcUntil: 'readonly',
        experimentalFeatures: 'readonly',
        runtimeFeatures: 'readonly',
        onUncaughtException: 'readonly',
        napiVersion: 'readonly',
        skipTest: 'readonly',
      },
    },
    rules: {
      'no-undef': 'error',
      'no-restricted-imports': ['error', {
        patterns: ['*'],
      }],
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[object.name='globalThis']",
          message: 'Avoid globalThis access in test files — use CTS harness globals instead',
        },
        {
          selector: "MemberExpression[object.name='global']",
          message: 'Avoid global access in test files — use CTS harness globals instead',
        },
      ],
    },
  },
  {
    files: [
      'implementors/**/*.{js,ts}',
      'scripts/**/*.{js,mjs}',
    ],
    languageOptions: {
      globals: {
        ...globals.es2025,
        ...globals.node,
      },
    },
  },
]);
