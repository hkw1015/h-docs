import { arraySidebar } from "vuepress-theme-hope";

export const deploy = arraySidebar([
  {
    text: "Docker",
    icon: "docker",
    prefix: "docker/",
    collapsible: true,
    children: [
        {
            text: "Docker 基础",
            prefix: "basic/",
            collapsible: true,
            children: [
                "docker-basic-1",
                "docker-basic-2",
                "docker-basic-3",
                "docker-basic-4",
                "docker-basic-5",
                "docker-basic-6",
                "docker-basic-7",
            ]
        },
        {
            text: "Docker 高级",
            prefix: "senior/",
            collapsible: true,
            children: [

            ]
        }
    ]
  },
  {
    text: "Nginx",
    icon: "nginx",
    prefix: "nginx/",
    collapsible: true,
    children: [
    ]
  },
  {
    text: "Jenkins",
    icon: "jenkins",
    prefix: "jenkins/",
    collapsible: true,
    children: [
    ]
  },
]);