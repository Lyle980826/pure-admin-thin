import type { FormRules } from "element-plus";

export const formRules = {
  filename: [{ required: true, message: "请输入文件名", trigger: "blur" }],
  fileType: [{ required: true, message: "请选择文件类型", trigger: "change" }]
} as FormRules;
