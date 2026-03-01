interface FormItemProps {
  id?: number;
  /** 用于判断是`新增`还是`修改` */
  title: string;
  customer: string;
  amount: string | number;
  orderType: string;
  status: string;
  shippingMethod: string;
  remark: string;
  selectedFile: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
