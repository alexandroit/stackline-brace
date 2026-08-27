import js from '@eslint/js';

export default [
  {
    ignores: [
      'dist/**',
      'ext/**',
      'index.js',
      'keybinding/**',
      'mode/**',
      'node_modules/**',
      'site-dist/**',
      'snippets/**',
      'test/.tmp/**',
      'test/browser/bundle.js',
      'theme/**',
      'vendor/**',
      'worker/*.js'
    ]
  },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        Blob: 'readonly',
        Buffer: 'readonly',
        CustomEvent: 'readonly',
        URL: 'readonly',
        __dirname: 'readonly',
        console: 'readonly',
        document: 'readonly',
        global: 'writable',
        globalThis: 'readonly',
        module: 'readonly',
        navigator: 'readonly',
        process: 'readonly',
        require: 'readonly',
        setTimeout: 'readonly',
        window: 'readonly'
      },
      sourceType: 'module'
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs'
    }
  }
];
