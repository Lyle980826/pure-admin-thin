import { http } from "@/utils/http";

export type OrderResult = {
  success: boolean;
  data: {
    list: Array<any>;
    total: number;
    pageNum: number;
    pageSize: number;
  };
};

export type OrderDetailResult = {
  success: boolean;
  data: any;
};

export type CommonResult = {
  success: boolean;
  message: string;
};

/** 获取订单列表 */
export const getOrderList = (params?: object) => {
  return http.request<OrderResult>("get", "/order/list", { params });
};

/** 获取订单详情 */
export const getOrderDetail = (params?: object) => {
  return http.request<OrderDetailResult>("get", "/order/detail", { params });
};

/** 创建订单 */
export const createOrder = (data?: object) => {
  return http.request<CommonResult>("post", "/order/create", { data });
};

/** 更新订单 */
export const updateOrder = (data?: object) => {
  return http.request<CommonResult>("put", "/order/update", { data });
};

/** 删除订单 */
export const deleteOrder = (data?: object) => {
  return http.request<CommonResult>("delete", "/order/delete", { data });
};
