import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginPrettier from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginImport from "eslint-plugin-import";
import { defineConfig, globalIgnores } from "eslint/config";

// Общий шаблон файлов для всех конфигураций
const sharedFiles = ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"];

export default defineConfig([

  globalIgnores([ "dist/**",
      "node_modules/**",
      "*.config.{js,ts}",
      "**/*.d.ts",
      "build/**",]),
  // 1. Базовая конфигурация: язык, окружение, парсер, настройки
  {
    files: sharedFiles,
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      // react: {
      //   version: "19.2", // версия React
      // },
    },
    plugins: {
      "react-hooks": pluginReactHooks,
      import: pluginImport,
      prettier: pluginPrettier,
    },
  },

  // 2. Рекомендованные правила от ESLint (эквивалент eslint:recommended)
  
  js.configs.recommended,
  

  // 3. Рекомендованные правила для TypeScript
  ...tseslint.configs.recommended.map((conf) => ({
    ...conf,
    files: sharedFiles,
  })),

  // 4. Рекомендованные правила для React
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],

  // 5. Рекомендованные правила для React Hooks
  {
  ...pluginReactHooks.configs.recommended,
  plugins: {
    "react-hooks": pluginReactHooks,
  },
  files: sharedFiles,
 },
 
 {
    files: sharedFiles,
    rules: configPrettier.rules, // это отключит ненужные правила форматирования
  },

  // 7. Ваши кастомные правила (поверх всех рекомендованных)
  {
    files: sharedFiles,
    rules: {
      "prettier/prettier": "warn",
      // React-Compiler правила (eslint-plugin-react-hooks v7) слишком строгие
      // для классического стека без React Compiler: переводим в предупреждения.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/refs": "warn",
      // Отключаем правило, требующее импорт React в каждом файле (для React 17+)
      "react/react-in-jsx-scope": "off",
      // Отключаем проверку prop-types (используем TypeScript)
      "react/prop-types": "off",
      // Предупреждение о неиспользуемых переменных
      "@typescript-eslint/no-unused-vars": ["warn"],
      // Базовое правило даёт false-positive на типах функций — TS покрывает сам
      "no-unused-vars": "off",
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal"],
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "no-console": "warn",
      "no-debugger": "warn",
      eqeqeq: ["warn", "always"],
      semi: ["error", "always"],
    },
  },
]);
