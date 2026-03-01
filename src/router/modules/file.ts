const Layout = () => import("@/layout/index.vue");

export default {
  path: "/file",
  name: "File",
  component: Layout,
  redirect: "/file/list",
  meta: {
    icon: "ep:document",
    title: "文件管理",
    rank: 2
  },
  children: [
    {
      path: "/file/list",
      name: "FileList",
      component: () => import("@/views/file/list/index.vue"),
      meta: {
        title: "文件列表",
        showLink: true
      }
    }
  ]
} satisfies RouteConfigsTable;
