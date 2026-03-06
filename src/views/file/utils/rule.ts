import type { FormRules } from "element-plus";

export const formRules = {
  filename: [{ required: true, message: "请输入文件名", trigger: "blur" }]
} as FormRules;
