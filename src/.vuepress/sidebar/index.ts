import { sidebar } from "vuepress-theme-hope";

import { java } from "./java.js";
import { linux } from "./linux.js";
import { vue } from "./vue.js";
import { database } from "./database.js";
import { deploy } from "./deploy.js";
import { software } from "./software.js";

export const defaultSidebar = sidebar({
    // 把更精确的路径放在前面
    "/java": java,
    "/linux": linux,
    "/vue": vue,
    "/database": database,
    "/deploy": deploy,
    "/software": software,
    // 必须放在最后
    "/": [
    "",
    "intro",
    "slides",
  ],
});
