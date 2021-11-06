import path from 'path';

export default {
  extends: '@vuepress/theme-default',
  clientAppEnhanceFiles: path.resolve(__dirname, './clientAppEnhance.ts'),
  layouts: {
    Guide: path.resolve(__dirname, 'layouts/Guide.vue'),
  },
};
