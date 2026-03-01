import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  customer: [{ required: true, message: "客户名称为必填项", trigger: "blur" }],
  orderType: [{ required: true, message: "请选择订单类型", trigger: "change" }],
  amount: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("订单金额为必填项"));
        } else if (Number(value) <= 0) {
          callback(new Error("订单金额必须大于0"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  selectedFile: [{ required: true, message: "请选择文件", trigger: "change" }]
});
