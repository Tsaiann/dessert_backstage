module.exports = {
  extends: [
    'plugin:vue/essential', // 使用 essential 規範
    'eslint:recommended', // 使用 ESLint 推薦規範
    '@vue/prettier' //使用 prettier
  ],
  rules: {
    'multi-word-component-names': 'off',
    'no-undef': 'off',
    'no-var': 'error',
    'no-unused-vars': 'off',
    'no-prototype-builtins': 'off',
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'vue/no-v-html': 'off',
    'prettier/prettier': [
      'error',
      {
        printWidth: 160,
        endOfLine: 'auto'
      }
    ]
  }
}
