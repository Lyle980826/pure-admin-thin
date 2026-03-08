import type { FormRules } from "element-plus";

export const formRules: FormRules = {
  orderName: [
    {
      required: true,
      message: "请选择订单",
      trigger: "change"
    }
  ]
};
