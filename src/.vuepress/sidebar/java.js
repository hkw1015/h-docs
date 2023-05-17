import { arraySidebar } from "vuepress-theme-hope";

export const java = arraySidebar([
  {
    text: "Java 基础",
    icon: "java",
    collapsible: true,
    prefix: "basic/",
    children: [
      "basic-grammar",
      "array",
      "object-oriented-1",
      "object-oriented-2",
      "object-oriented-3",
      "exception",
      "enum-and-annotation",
      "collection",
      "genericity",
      "io",
      "multi-thread",
      "common-class",
      "reflection",
      "network",
      {
          text: "Java 新特性",
          icon: "creative",
          collapsible: true,
          children: [
              "jdk8-new-feature"
          ]
      }
    ]
  },
  {
    text: "JDBC",
    icon: "code",
    collapsible: true,
    prefix: "jdbc/",
    children: [
      "jdbc-1",
      "jdbc-2",
      "jdbc-3",
      "jdbc-4",
      "jdbc-5",
      "jdbc-6",
      "jdbc-7",
      "jdbc-8",
      "jdbc-9"
    ]
  },
  {
    text: "常用框架",
    icon: "Category",
    collapsible: true,
    prefix: "framework/",
    children: [
      {
          text: "Spring",
          icon: "bxl-spring-boot",
          collapsible: true,
          prefix: "spring/",
          children: [
              {
                  text: "Spring 核心",
                  collapsible: true,
                  prefix: "core/",
                  children: [
                      "spring-summary",
                      "spring-ioc",
                      "spring-aop",
                      "spring-jdbcTemplate",
                      "spring-tx",
                  ]
              },
              {
                  text: "Spring 注解",
                  collapsible: true,
                  prefix: "annotation/",
                  children: [
                      "spring-annotation-1",
                      "spring-annotation-2",
                      "spring-annotation-3",
                      "spring-annotation-4",
                      "spring-annotation-5",
                      "spring-annotation-6",
                  ]
              }
          ]
      },
      {
          text: "SpringBoot",
          icon: "bxl-spring-boot",
          collapsible: true,
          prefix: "springboot/",
          children: [
            {
                text: "SpringBoot 基础",
                collapsible: true,
                prefix: "basic/",
                children: [
                    "springboot2-basic-1",
                    "springboot2-basic-2",
                    "springboot2-basic-3",
                ]
            },
            {
                text: "SpringBoot 核心",
                collapsible: true,
                prefix: "core/",
                children: [
                    "springboot2-core-1",
                    "springboot2-core-2",
                    "springboot2-core-3",
                    "springboot2-core-4",
                    "springboot2-core-5",
                    "springboot2-core-6",
                ]
            }
          ]
      },
      {
          text: "SpringMVC",
          icon: "bxl-spring-boot",
          collapsible: true,
          prefix: "springmvc/",
          children: [
              "springmvc-1",
              "springmvc-2",
              "springmvc-3",
              "springmvc-4",
              "springmvc-5",
              "springmvc-6",
          ]
      },
      {
          text: "MyBatis",
          icon: "database",
          collapsible: true,
          prefix: "mybatis/",
          children: [
              "mybatis-1",
              "mybatis-2",
              "mybatis-3",
              "mybatis-4",
          ]
      },
      {
          text: "MyBatis-Plus",
          icon: "database",
          collapsible: true,
          prefix: "mybatis-plus/",
          children: [
              "mybatis-plus-1",
              "mybatis-plus-2",
              "mybatis-plus-3",
              "mybatis-plus-4",
              "mybatis-plus-5",
              "mybatis-plus-6",
              "mybatis-plus-7",
              "mybatis-plus-8",
              "mybatis-plus-9",
          ]
      },
    ]
  }
]);