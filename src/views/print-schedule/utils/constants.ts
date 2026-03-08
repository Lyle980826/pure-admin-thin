export const statusOptions = [
  { label: "待打印", value: "pending" },
  { label: "已完成", value: "completed" },
  { label: "已取消", value: "cancelled" }
];

export const statusMap: Record<string, string> = {
  pending: "待打印",
  completed: "已完成",
  cancelled: "已取消"
};
export const statusTypeMap: Record<string, string> = {
  pending: "info",
  printing: "primary",
  completed: "success",
  cancelled: "danger"
};

export const filamentTypeOptions = [
  { label: "PLA", value: "PLA" },
  { label: "ABS", value: "ABS" },
  { label: "PETG", value: "PETG" },
  { label: "TPU", value: "TPU" }
];

export const filamentColorOptions = [
  { label: "红色", value: "#F56C6C" },
  { label: "蓝色", value: "#409EFF" },
  { label: "白色", value: "#FFFFFF" },
  { label: "绿色", value: "#67C23A" },
  { label: "黄色", value: "#E6A23C" },
  { label: "黑色", value: "#303133" },
  { label: "紫色", value: "#909399" },
  { label: "橙色", value: "#F57C00" }
];
