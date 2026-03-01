const Layout = () => import("@/layout/index.vue");

export default {
  path: "/file/admin",
  name: "FileAdmin",
  component: Layout,
  redirect: "/file",
  meta: {
    icon: "ep:document",
    title: "文件管理",
    rank: 2
  },
  children: [
    {
      path: "/file",
      name: "File",
      component: () => import("@/views/file/index.vue"),
      meta: {
        title: "文件列表",
        showLink: true
      }
    }
  ]
} satisfies RouteConfigsTable;
