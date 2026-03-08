import { defineFakeRoute } from "vite-plugin-fake-server/client";

function calculateMaxTime(data: any[]) {
  const scheduleMaxTimes: Record<number, number> = {};

  data.forEach(item => {
    if (
      !scheduleMaxTimes[item.scheduleId] ||
      item.plateTime > scheduleMaxTimes[item.scheduleId]
    ) {
      scheduleMaxTimes[item.scheduleId] = item.plateTime;
    }
  });

  return data.map(item => ({
    ...item,
    maxPlateTime: scheduleMaxTimes[item.scheduleId]
  }));
}

let printScheduleData = calculateMaxTime([
  {
    id: 1,
    scheduleId: 1,
    orderId: 1,
    orderName: "订单001",
    customer: "客户A",
    fileId: 1,
    fileName: "3D打印模型1.3mf",
    plateNumber: 1,
    totalPlates: 2,
    objectCount: 5,
    plateWeight: 975.25,
    plateTime: 60,
    filamentType: "PLA",
    filamentColor: "#F56C6C",
    status: "pending",
    createTime: "2024-01-05T10:00:00Z",
    remark: "加急处理"
  },
  {
    id: 2,
    scheduleId: 1,
    orderId: 1,
    orderName: "订单001",
    customer: "客户A",
    fileId: 1,
    fileName: "3D打印模型1.3mf",
    plateNumber: 2,
    totalPlates: 2,
    objectCount: 4,
    plateWeight: 75.25,
    plateTime: 60,
    filamentType: "PLA",
    filamentColor: "#F56C6C",
    status: "pending",
    createTime: "2024-01-05T10:00:00Z",
    remark: "加急处理"
  },
  {
    id: 3,
    scheduleId: 2,
    orderId: 2,
    orderName: "订单002",
    customer: "客户B",
    fileId: 2,
    fileName: "3D打印模型2.3mf",
    plateNumber: 1,
    totalPlates: 1,
    objectCount: 3,
    plateWeight: 95.3,
    plateTime: 85,
    filamentType: "ABS",
    filamentColor: "#409EFF",
    status: "completed",
    createTime: "2024-01-06T11:00:00Z",
    scheduledTime: "2024-01-06T12:00:00Z",
    startTime: "2024-01-06T12:00:00Z"
  },
  {
    id: 4,
    scheduleId: 3,
    orderId: 3,
    orderName: "订单003",
    customer: "客户C",
    fileId: 4,
    fileName: "3D打印模型4.3mf",
    plateNumber: 1,
    totalPlates: 3,
    objectCount: 6,
    plateWeight: 73.6,
    plateTime: 60,
    filamentType: "PLA",
    filamentColor: "#FFFFFF",
    status: "completed",
    createTime: "2024-01-04T09:00:00Z",
    scheduledTime: "2024-01-04T10:00:00Z",
    startTime: "2024-01-04T10:00:00Z",
    endTime: "2024-01-04T11:00:00Z"
  },
  {
    id: 5,
    scheduleId: 3,
    orderId: 3,
    orderName: "订单003",
    customer: "客户C",
    fileId: 4,
    fileName: "3D打印模型4.3mf",
    plateNumber: 2,
    totalPlates: 3,
    objectCount: 5,
    plateWeight: 73.6,
    plateTime: 70,
    filamentType: "PLA",
    filamentColor: "#FFFFFF",
    status: "completed",
    createTime: "2024-01-04T09:00:00Z",
    scheduledTime: "2024-01-04T10:00:00Z",
    startTime: "2024-01-04T11:00:00Z",
    endTime: "2024-01-04T12:00:00Z"
  },
  {
    id: 6,
    scheduleId: 3,
    orderId: 3,
    orderName: "订单003",
    customer: "客户C",
    fileId: 4,
    fileName: "3D打印模型4.3mf",
    plateNumber: 3,
    totalPlates: 3,
    objectCount: 4,
    plateWeight: 73.6,
    plateTime: 65,
    filamentType: "PLA",
    filamentColor: "#FFFFFF",
    status: "completed",
    createTime: "2024-01-04T09:00:00Z",
    scheduledTime: "2024-01-04T10:00:00Z",
    startTime: "2024-01-04T12:00:00Z",
    endTime: "2024-01-04T13:00:00Z"
  },
  {
    id: 7,
    scheduleId: 4,
    orderId: 4,
    orderName: "订单004",
    customer: "客户D",
    fileId: 5,
    fileName: "3D打印模型5.3mf",
    plateNumber: 1,
    totalPlates: 1,
    objectCount: 2,
    plateWeight: 75.2,
    plateTime: 65,
    filamentType: "PETG",
    filamentColor: "#67C23A",
    status: "pending",
    createTime: "2024-01-07T14:00:00Z"
  },
  {
    id: 8,
    scheduleId: 5,
    orderId: 5,
    orderName: "订单005",
    customer: "客户E",
    fileId: 1,
    fileName: "3D打印模型1.3mf",
    plateNumber: 1,
    totalPlates: 2,
    objectCount: 5,
    plateWeight: 75.25,
    plateTime: 60,
    filamentType: "PLA",
    filamentColor: "#F56C6C",
    status: "cancelled",
    createTime: "2024-01-03T08:00:00Z",
    scheduledTime: "2024-01-05T10:00:00Z"
  },
  {
    id: 9,
    scheduleId: 5,
    orderId: 5,
    orderName: "订单005",
    customer: "客户E",
    fileId: 1,
    fileName: "3D打印模型1.3mf",
    plateNumber: 2,
    totalPlates: 2,
    objectCount: 4,
    plateWeight: 75.25,
    plateTime: 60,
    filamentType: "PLA",
    filamentColor: "#F56C6C",
    status: "cancelled",
    createTime: "2024-01-03T08:00:00Z",
    scheduledTime: "2024-01-05T10:00:00Z"
  }
]);

export default defineFakeRoute([
  {
    url: "/print-schedule/list",
    method: "get",
    response: ({ query }) => {
      const {
        pageNum = 1,
        pageSize = 10,
        orderName = "",
        status = "",
        filamentType = "",
        filamentColor = ""
      } = query as any;
      let filteredData = [...printScheduleData];

      if (orderName) {
        filteredData = filteredData.filter(item =>
          item.orderName.includes(orderName)
        );
      }

      if (status) {
        filteredData = filteredData.filter(item => item.status === status);
      }

      if (filamentType) {
        filteredData = filteredData.filter(
          item => item.filamentType === filamentType
        );
      }

      if (filamentColor) {
        filteredData = filteredData.filter(
          item => item.filamentColor === filamentColor
        );
      }

      const total = filteredData.length;
      const start = (pageNum - 1) * pageSize;
      const end = start + pageSize;
      const data = filteredData.slice(start, end);

      return {
        success: true,
        data: {
          list: data,
          total,
          pageNum: parseInt(pageNum),
          pageSize: parseInt(pageSize)
        }
      };
    }
  },
  {
    url: "/print-schedule/detail/:id",
    method: "get",
    response: ({ params }) => {
      const { id } = params as any;
      const item = printScheduleData.find(p => p.id === parseInt(id));
      if (item) {
        return {
          success: true,
          data: item
        };
      } else {
        return {
          success: false,
          message: "打印计划不存在"
        };
      }
    }
  },
  {
    url: "/print-schedule/create",
    method: "post",
    response: ({ body }) => {
      const data = body as any;
      const newId = Math.max(...printScheduleData.map(p => p.id)) + 1;
      const newItem = {
        id: newId,
        scheduleId: newId,
        orderId: data.orderId,
        orderName: data.orderName,
        customer: data.customer,
        fileId: data.fileId,
        fileName: data.fileName,
        plateNumber: 1,
        totalPlates: 1,
        objectCount: 1,
        plateWeight: 0,
        plateTime: 0,
        filamentType: "PLA",
        filamentColor: "#FFFFFF",
        status: "pending",
        createTime: new Date().toISOString(),
        scheduledTime: data.scheduledTime,
        remark: data.remark
      };
      printScheduleData.unshift(newItem);
      return {
        success: true,
        message: "创建成功"
      };
    }
  },
  {
    url: "/print-schedule/update",
    method: "put",
    response: ({ body }) => {
      const data = body as any;
      const index = printScheduleData.findIndex(p => p.id === data.id);
      if (index !== -1) {
        printScheduleData[index] = {
          ...printScheduleData[index],
          ...data
        };
        return {
          success: true,
          message: "更新成功"
        };
      } else {
        return {
          success: false,
          message: "打印计划不存在"
        };
      }
    }
  },
  {
    url: "/print-schedule/delete",
    method: "delete",
    response: ({ body }) => {
      const { id } = body as any;
      printScheduleData = printScheduleData.filter(
        item => item.id !== parseInt(id)
      );
      return {
        success: true,
        message: "删除成功"
      };
    }
  }
]);
