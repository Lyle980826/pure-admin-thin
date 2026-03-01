const Layout = () => import("@/layout/index.vue");

export default {
  path: "/order/admin",
  name: "OrderAdmin",
  component: Layout,
  redirect: "/order",
  meta: {
    icon: "ep:shopping-cart",
    title: "订单管理",
    rank: 1
  },
  children: [
    {
      path: "/order",
      name: "Order",
      component: () => import("@/views/order/index.vue"),
      meta: {
        title: "订单列表",
        showLink: true
      }
    }
  ]
} satisfies RouteConfigsTable;
