/**
 * 订单模块常量配置
 */

// 订单类型基础配置
const orderTypeConfig = [
  { key: "custom", label: "定制订单", display: "定制" },
  { key: "print", label: "代打订单", display: "代打" }
];

// 订单类型选项（用于下拉选择框）
export const orderTypeOptions = orderTypeConfig.map(item => ({
  label: item.label,
  value: item.key
}));

// 订单类型映射（用于表格格式化）
export const orderTypeMap = orderTypeConfig.reduce(
  (map, item) => {
    map[item.key] = item.display;
    return map;
  },
  {} as Record<string, string>
);

// 配送方式选项
export const shippingMethods = [
  { label: "快递", value: "快递" },
  { label: "自提", value: "自提" }
];

// 状态选项
export const statusOptions = [
  { label: "已付款", value: "已付款" },
  { label: "处理中", value: "处理中" },
  { label: "待确认", value: "待确认" },
  { label: "生产中", value: "生产中" },
  { label: "已完成", value: "已完成" },
  { label: "已取消", value: "已取消" }
];

// 状态映射
export const statusMap = statusOptions.reduce(
  (map, item) => {
    map[item.value] = item.label;
    return map;
  },
  {} as Record<string, string>
);
