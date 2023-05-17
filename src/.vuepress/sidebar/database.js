import { arraySidebar } from "vuepress-theme-hope";

export const database = arraySidebar([
  {
    text: "MySQL",
    icon: "mysql",
    prefix: "mysql/",
    collapsible: true,
    children: [
      {
          text: "MySQL 安装",
          link: "install/mysql-install"
      },
      {
          text: "MySQL 基础",
          prefix: "basic/",
          collapsible: true,
          children: [
              "mysql-basic-1",
              "mysql-basic-2",
              "mysql-basic-3",
              "mysql-basic-4",
              "mysql-basic-5",
              "mysql-basic-6",
              "mysql-basic-7",
              "mysql-basic-8",
              "mysql-basic-9",
              "mysql-basic-10",
              "mysql-basic-11",
              "mysql-basic-12",
              "mysql-basic-13",
              "mysql-basic-14",
              "mysql-basic-15",
          ]
      }
    ]
  },
  {
    text: "Redis",
    icon: "redis",
    prefix: "redis/",
    collapsible: true,
    children: [
      "redis-1",
      "redis-2",
      "redis-3",
      "redis-4",
      "redis-5",
      "redis-6",
      "redis-7",
      "redis-8",
      "redis-9",
      "redis-10",
      "redis-11",
      "redis-12",
      "redis-13",
      "redis-14",
      "redis-15",
      "redis-16",
      "redis-17",
    ]
  }
]);