const Layout = () => import("@/layout/index.vue");

export default {
  path: "/machine/admin",
  name: "MachineAdmin",
  component: Layout,
  redirect: "/machine",
  meta: {
    icon: "ep:monitor",
    title: "机器管理",
    rank: 3
  },
  children: [
    {
      path: "/machine",
      name: "Machine",
      component: () => import("@/views/machine/index.vue"),
      meta: {
        title: "机器列表",
        showLink: true
      }
    }
  ]
} satisfies RouteConfigsTable;
