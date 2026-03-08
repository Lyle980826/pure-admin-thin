export interface PrintScheduleForm {
  orderId: number | null;
  orderName: string;
  status: string;
}

export interface PrintScheduleFormProps {
  formInline: {
    title: string;
    id?: number;
    orderId?: number;
    orderName?: string;
    customer?: string;
    fileId?: number;
    fileName?: string;
    scheduledTime?: string;
    remark?: string;
  };
}

export interface PrintScheduleItem {
  id: number;
  scheduleId: number;
  orderId: number;
  orderName: string;
  customer: string;
  fileId: number;
  fileName: string;
  plateNumber: number;
  totalPlates: number;
  objectCount: number;
  plateWeight: number;
  plateTime: number;
  filamentType: string;
  filamentColor: string;
  status: string;
  createTime: string;
  scheduledTime?: string;
  startTime?: string;
  endTime?: string;
  remark?: string;
}
