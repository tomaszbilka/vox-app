import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactNativePlugin from "eslint-plugin-react-native";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["dist", "build", "node_modules", "eslint.config.js", "app.config.js"],
  },
  {
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "react-native": reactNativePlugin,
      import: importPlugin,
      "simple-import-sort": simpleImportSort,
      prettier: prettierPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      /* 🧹 General cleanliness rules */
      "no-console": "warn",
      "no-debugger": "warn",
      "prettier/prettier": [
        "error",
        {
          tabWidth: 2,
          useTabs: false,
          endOfLine: "auto",
        },
      ],

      /* ⚛️ React & Hooks */
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/react-in-jsx-scope": "off", // Expo doesn't require React import

      /* 📱 React Native */
      "react-native/no-unused-styles": "warn",
      "react-native/no-inline-styles": "off",
      "react-native/no-color-literals": "off",

      /* 📦 Imports — sorting and grouping */
      "import/order": "off",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // 1️⃣ React & React Native (wszystkie react-* pakiety)
            ["^react", "^react-native", "^react-native-"],
            // 2️⃣ Expo packages
            ["^expo", "^expo-"],
            // 3️⃣ Third-party packages (npm / scoped packages)
            ["^@?\\w"],
            // 4️⃣ Project aliases
            ["^@/"],
            // 5️⃣ Relative imports
            ["^\\./", "^\\.\\./"],
            // 6️⃣ Side-effect imports (np. import "...")
            ["^\\u0000"],
            // 7️⃣ Style imports
            ["^.+\\.s?css$"]
          ],
        },
      ],
      "simple-import-sort/exports": "error",

      /* 🧠 TypeScript */
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" }
      ]
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        project: ["./tsconfig.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  prettierConfig
);
