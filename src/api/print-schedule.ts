import { http } from "@/utils/http";

export type PrintScheduleResult = {
  success: boolean;
  data: {
    list: Array<any>;
    total: number;
    pageNum: number;
    pageSize: number;
  };
};

export type PrintScheduleDetailResult = {
  success: boolean;
  data: any;
};

export type CommonResult = {
  success: boolean;
  message: string;
};

/** 获取打印计划列表 */
export const getPrintScheduleList = (params?: object) => {
  return http.request<PrintScheduleResult>("get", "/print-schedule/list", {
    params
  });
};

/** 获取打印计划详情 */
export const getPrintScheduleDetail = (id: number | string) => {
  return http.request<PrintScheduleDetailResult>(
    "get",
    `/print-schedule/detail/${id}`
  );
};

/** 创建打印计划 */
export const createPrintSchedule = (data?: object) => {
  return http.request<CommonResult>("post", "/print-schedule/create", { data });
};

/** 更新打印计划 */
export const updatePrintSchedule = (data?: object) => {
  return http.request<CommonResult>("put", "/print-schedule/update", { data });
};

/** 删除打印计划 */
export const deletePrintSchedule = (data?: object) => {
  return http.request<CommonResult>("delete", "/print-schedule/delete", {
    data
  });
};
