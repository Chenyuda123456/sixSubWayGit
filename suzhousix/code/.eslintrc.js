module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'eslint-config-prettier',
    'eslint:recommended', // 使用推荐的eslint
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended', // 使用插件支持vue3
    'plugin:vue/vue3-essential',
    //1.继承.prettierrc.js文件规则  2.开启rules的 "prettier/prettier": "error"  3.eslint fix的同时执行prettier格式化
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    //在rules中添加自定义规则
    //关闭组件命名规则
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-types': 'off'
  }
};
