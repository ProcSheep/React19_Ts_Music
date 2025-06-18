import js from '@eslint/js'; // ESLint 官方推荐规则
import prettier from 'eslint-plugin-prettier'; // 引入prettier
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'; // eslint-config-prettier
import reactHooks from 'eslint-plugin-react-hooks'; // React Hooks 检查插件
import reactRefresh from 'eslint-plugin-react-refresh'; // React Refresh 插件
import globals from 'globals'; // 预定义全局变量（如浏览器环境）
import tseslint from 'typescript-eslint'; // TypeScript 支持

export default tseslint.config(
  { ignores: ['dist', '**/*.md'] },  // 排除 dist 目录, .md文件
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended, eslintPluginPrettierRecommended], // 继承的规则集
    files: ['**/*.{ts,tsx}'], // 应用此配置的文件类型
    languageOptions: {  // 语言选项（如 ES 版本、全局变量）
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {  // 注册的插件
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier, // 注册 Prettier 插件
    },
    rules: {  // 自定义规则
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'prettier/prettier': 'error', // 将 Prettier 错误视为 ESLint 错误
    },
  },
)
