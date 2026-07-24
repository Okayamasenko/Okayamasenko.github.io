import { defineConfig } from 'astro/config';

// 仓库名用 Okayamasenko.github.io，站点在根路径，不需要设 base。
// 以后绑自定义域名也不用改。
export default defineConfig({
  site: 'https://okayamasenko.github.io',
  build: {
    inlineStylesheets: 'always',
  },
});
