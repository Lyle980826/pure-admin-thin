import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 模拟订单数据
let orderData = [
  {
    id: 1,
    customer: "张三",
    amount: 1000,
    status: "已完成",
    orderType: "custom",
    createTime: "2024-01-01T10:00:00Z",
    remark: "测试订单",
    address: "北京市朝阳区",
    phone: "13800138000",
    paymentMethod: "支付宝",
    shippingMethod: "快递",
    selectedFile: 1
  },
  {
    id: 2,
    customer: "李四",
    amount: 2000,
    status: "处理中",
    orderType: "print",
    createTime: "2024-01-02T11:00:00Z",
    remark: "",
    address: "上海市浦东新区",
    phone: "13900139000",
    paymentMethod: "微信",
    shippingMethod: "自提",
    selectedFile: 2
  },
  {
    id: 3,
    customer: "王五",
    amount: 3000,
    status: "已付款",
    orderType: "custom",
    createTime: "2024-01-03T12:00:00Z",
    remark: "",
    address: "广州市天河区",
    phone: "13700137000",
    paymentMethod: "支付宝",
    shippingMethod: "快递",
    selectedFile: 3
  },
  {
    id: 4,
    customer: "赵六",
    amount: 1500,
    status: "待确认",
    orderType: "custom",
    createTime: "2024-01-04T13:00:00Z",
    remark: "",
    address: "深圳市南山区",
    phone: "13600136000",
    paymentMethod: "微信",
    shippingMethod: "快递",
    selectedFile: 4
  },
  {
    id: 5,
    customer: "孙七",
    amount: 2500,
    status: "生产中",
    orderType: "print",
    createTime: "2024-01-05T14:00:00Z",
    remark: "",
    address: "杭州市西湖区",
    phone: "13500135000",
    paymentMethod: "支付宝",
    shippingMethod: "自提",
    selectedFile: 5
  }
];
let orderIdCounter = 6;

export default defineFakeRoute([
  {
    url: "/order/list",
    method: "get",
    response: ({ query }) => {
      const { username, status, pageNum = 1, pageSize = 10 } = query as any;
      let filteredData = [...orderData];

      if (username) {
        filteredData = filteredData.filter(item =>
          item.customer.toLowerCase().includes(username.toLowerCase())
        );
      }

      if (status) {
        filteredData = filteredData.filter(item => item.status === status);
      }

      const total = filteredData.length;
      const start = (pageNum - 1) * pageSize;
      const end = start + pageSize;
      const data = filteredData.slice(start, end);

      return {
        success: true,
        data: {
          list: data,
          total,
          pageNum: parseInt(pageNum),
          pageSize: parseInt(pageSize)
        }
      };
    }
  },
  {
    url: "/order/detail",
    method: "get",
    response: ({ query }) => {
      const { id } = query as any;
      const order = orderData.find(item => item.id === parseInt(id));
      return {
        success: true,
        data: order
      };
    }
  },
  {
    url: "/order/create",
    method: "post",
    response: ({ body }) => {
      const newOrder = {
        id: orderIdCounter++,
        ...(body as any),
        createTime: new Date().toISOString()
      };
      orderData.unshift(newOrder);
      return {
        success: true,
        message: "订单创建成功",
        data: newOrder
      };
    }
  },
  {
    url: "/order/update",
    method: "put",
    response: ({ body }) => {
      const { id, ...updateData } = body as any;
      const index = orderData.findIndex(item => item.id === parseInt(id));
      if (index !== -1) {
        orderData[index] = {
          ...orderData[index],
          ...updateData
        };
      }
      return {
        success: true,
        message: "订单更新成功"
      };
    }
  },
  {
    url: "/order/delete",
    method: "delete",
    response: ({ body }) => {
      const { id } = body as any;
      orderData = orderData.filter(item => item.id !== parseInt(id));
      return {
        success: true,
        message: "删除成功"
      };
    }
  }
]);
