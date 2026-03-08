import { http } from "@/utils/http";

export type FileResult = {
  success: boolean;
  data: {
    list: Array<any>;
    total: number;
    pageNum: number;
    pageSize: number;
  };
};

export type FileDetailResult = {
  success: boolean;
  data: any;
};

export type CommonResult = {
  success: boolean;
  message: string;
};

/** 获取文件列表 */
export const getFileList = (params?: object) => {
  return http.request<FileResult>("get", "/file/list", { params });
};

/** 获取文件详情 */
export const getFileDetail = (id: number | string) => {
  return http.request<FileDetailResult>("get", `/file/detail/${id}`);
};

/** 删除文件 */
export const deleteFile = (data?: object) => {
  return http.request<CommonResult>("delete", "/file/delete", { data });
};

/** 下载文件 */
export const downloadFile = (params?: object) => {
  return http.request<CommonResult>("get", "/file/download", { params });
};
