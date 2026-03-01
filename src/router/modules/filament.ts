const Layout = () => import("@/layout/index.vue");

export default {
  path: "/filament/admin",
  name: "FilamentAdmin",
  component: Layout,
  redirect: "/filament",
  meta: {
    icon: "ep:goods",
    title: "耗材管理",
    rank: 4
  },
  children: [
    {
      path: "/filament",
      name: "Filament",
      component: () => import("@/views/filament/index.vue"),
      meta: {
        title: "耗材列表",
        showLink: true
      }
    }
  ]
} satisfies RouteConfigsTable;
