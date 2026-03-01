export const formRules = {
  name: [{ required: true, message: "请输入耗材名称" }],
  type: [{ required: true, message: "请选择耗材类型" }],
  color: [{ required: true, message: "请输入耗材颜色" }],
  weight: [{ required: true, message: "请输入耗材重量" }],
  stock: [{ required: true, message: "请输入库存数量" }]
};
