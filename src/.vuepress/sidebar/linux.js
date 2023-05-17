import { arraySidebar } from "vuepress-theme-hope";

export const linux = arraySidebar([
  {
    text: "Linux 入门",
    icon: "linux",
    collapsible: true,
    prefix: "basic/",
    children: [
      "linux-basic-1",
      "linux-basic-2",
      "linux-basic-3",
      "linux-basic-4",
      "linux-basic-5",
      "linux-basic-6",
      "linux-basic-7",
      "linux-basic-8",
      "linux-basic-9",
    ]
  },
  {
    text: "Linux 高级",
    icon: "linux",
    collapsible: true,
    prefix: "senior/",
    children: [
      
    ]
  }
]);