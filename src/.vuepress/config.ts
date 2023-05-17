import { defineUserConfig } from "vuepress";
import { searchProPlugin } from "vuepress-plugin-search-pro";
import theme from "./theme.js";

export default defineUserConfig({
  dest: "./dist",

  base: '/./',

  title: "程序员H",

  locales: {
    "/": {
      lang: "zh-CN",
    }
  },

  theme,

  plugins: [searchProPlugin({ indexContent: true })],

  pagePatterns: ["**/*.md", "!**/*.snippet.md", "!.vuepress", "!node_modules"],
  
  shouldPrefetch: false,
});
