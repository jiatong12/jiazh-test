// @ts-check
// 不用 prettier https://antfu.me/posts/why-not-prettier
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: true,
    typescript: true,
    // 注意，这个开启后，需要在同级目录上有 uno.config.ts 文件，不然会导致 vue 文件无法自动格式化
    // unocss: false,
    formatters: true,
    ignores: [
      'node_modules',
      'public',
      'dist*',
      'src/assets',
      '**/*.md',
    ],
  },
  {
    /**
     * "off" 或 0    ==>  关闭规则
     * "warn" 或 1   ==>  打开的规则作为警告（不影响代码执行）
     * "error" 或 2  ==>  规则作为一个错误（代码不能执行，界面报错）
     */
    rules: {
      'eslint-comments/no-unlimited-disable': 'off',
      'curly': ['error', 'all'],
      'antfu/consistent-list-newline': 'off',
      'jsonc/sort-keys': 'off', // json 文件 key 自动排序，关闭，影响配置分组
      'no-console': 'off',
      'style/max-statements-per-line': 'off',
      'style/no-tabs': 'off',
      'ts/no-empty-object-type': 'off',
      // 未使用的变量，报警告
      'unused-imports/no-unused-vars': 'warn',

      // 'no-magic-numbers': ['error', { // 忽略魔法值
      //   ignore: [0, 1, 2], // 忽略魔法数字
      //   ignoreArrayIndexes: true, // 忽略数组索引的魔法值
      // }],
      // 'no-undefined': 'off',
      // 'vue/custom-event-name-casing': 'off',
      // 'vue/no-unused-refs': 'off',
      // 'perfectionist/sort-imports': 'off',
      // 'vue/component-definition-name-casing': 'off',
      // 'ts/no-unused-expressions': 'off',
      // 'vue/require-v-for-key': 'off',
      // 'array-callback-return': 'off',
    },
  },
  {
    files: ['**/*.vue', '**/*.tsx'],
    rules: {
      // 避免 defineProps 等宏上不能定义变量问题
      // 强制执行定义限制和定义弹出编译器宏的顺序
      // 'vue/define-macros-order': ['error', {
      //   order: ['defineOptions', 'defineModel', 'defineProps', 'defineEmits', 'defineSlots'],
      //   defineExposeLast: false,
      // }],
      'vue/define-macros-order': 'off',
      'vue/block-order': ['error', {
        // 标签顺序
        order: ['script', 'template', 'style'],
      }],
      // 强制大驼峰
      'vue/component-name-in-template-casing': [
        'warn',
        'PascalCase',
        {
          registeredComponentsOnly: false,
          ignores: ['/^icon-/', '/\\./'],
        },
      ],
    },
  },
)
