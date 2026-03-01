export const formRules = {
  name: [{ required: true, message: "请输入机器名称" }],
  model: [{ required: true, message: "请输入机器型号" }],
  status: [{ required: true, message: "请选择机器状态" }],
  location: [{ required: true, message: "请输入机器位置" }]
};
