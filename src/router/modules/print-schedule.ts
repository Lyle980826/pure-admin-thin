const Layout = () => import("@/layout/index.vue");

export default {
  path: "/print-schedule/admin",
  name: "PrintScheduleAdmin",
  component: Layout,
  redirect: "/print-schedule",
  meta: {
    icon: "ep:printer",
    title: "打印计划",
    rank: 2
  },
  children: [
    {
      path: "/print-schedule",
      name: "PrintSchedule",
      component: () => import("@/views/print-schedule/index.vue"),
      meta: {
        title: "打印计划列表",
        showLink: true
      }
    }
  ]
} satisfies RouteConfigsTable;
