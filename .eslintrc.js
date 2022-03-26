module.exports = {
    env: {
      es6: true,
      node: true,
      "jest": true,
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'sonarjs'],
    extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended', 'plugin:sonarjs/recommended','plugin:prettier/recommended'],
    globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
    },
    rules: {
      "import/no-unresolved":"off",
      "sonarjs/no-small-switch": "off",
      "@typescript-eslint/camelcase": "off",
      "@typescript-eslint/explicit-member-accessibility": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/adjacent-overload-signatures": "off",
      "@typescript-eslint/interface-name-prefix": "off",
      "import/prefer-default-export": "off",
      "no-console": "off",
      "quotes": [2, "single", { "avoidEscape": true }],
      "eol-last": ["error", "always"],
      "no-multiple-empty-lines" : ["error", { "max": 2, "maxBOF": 1 }],
      "no-await-in-loop": "off",
      "no-restricted-syntax": ["error", "LabeledStatement", "WithStatement"],
      "no-throw-literal": "off",
      "max-len": ["error", { "code": 120 }],
      "no-return-await": "off",
      "class-methods-use-this": "off",
      "no-param-reassign": "off",
      "@typescript-eslint/indent": "off",
      "no-useless-escape": "off",
      "sonarjs/cognitive-complexity": ["error", 35],
      "import/no-extraneous-dependencies": "off",
      "no-plusplus":"off",
      "import/extensions": [
           "error",
           "ignorePackages",
           {
             "js": "never",
             "jsx": "never",
             "ts": "never",
             "tsx": "never"
           }
        ]
    },
    settings: {
      "import/resolver": {
        "node": {
          "extensions": [".js", ".jsx", ".ts", ".tsx", ".d.ts"],
          "paths": ["src"]
        },
      }
    },
  };
  