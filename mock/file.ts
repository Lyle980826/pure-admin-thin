import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 模拟文件数据
let fileData = [
  {
    id: 1,
    name: "3D打印模型1.3mf",
    size: "5.2MB",
    type: "3MF",
    uploadTime: "2024-01-01T10:00:00Z",
    status: "已上传",
    hasGcode: true,
    totalPlates: 2,
    totalWeight: 150.5,
    totalTime: 120
  },
  {
    id: 2,
    name: "3D打印模型2.3mf",
    size: "8.7MB",
    type: "3MF",
    uploadTime: "2024-01-02T11:00:00Z",
    status: "已上传",
    hasGcode: true,
    totalPlates: 1,
    totalWeight: 95.3,
    totalTime: 85
  },
  {
    id: 3,
    name: "3D打印模型3.3mf",
    size: "12.3MB",
    type: "3MF",
    uploadTime: "2024-01-03T12:00:00Z",
    status: "已上传",
    hasGcode: false,
    totalPlates: 0,
    totalWeight: 0,
    totalTime: 0
  },
  {
    id: 4,
    name: "3D打印模型4.3mf",
    size: "6.8MB",
    type: "3MF",
    uploadTime: "2024-01-04T13:00:00Z",
    status: "已上传",
    hasGcode: true,
    totalPlates: 3,
    totalWeight: 220.8,
    totalTime: 180
  },
  {
    id: 5,
    name: "3D打印模型5.3mf",
    size: "3.5MB",
    type: "3MF",
    uploadTime: "2024-01-05T14:00:00Z",
    status: "已上传",
    hasGcode: true,
    totalPlates: 1,
    totalWeight: 75.2,
    totalTime: 65
  }
];

export default defineFakeRoute([
  {
    url: "/file/list",
    method: "get",
    response: ({ query }) => {
      const { pageNum = 1, pageSize = 10 } = query as any;
      const filteredData = [...fileData];

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
    url: "/file/delete",
    method: "delete",
    response: ({ body }) => {
      const { id } = body as any;
      fileData = fileData.filter(item => item.id !== parseInt(id));
      return {
        success: true,
        message: "删除成功"
      };
    }
  },
  {
    url: "/file/download",
    method: "get",
    response: ({ query }) => {
      const { id } = query as any;
      const file = fileData.find(item => item.id === parseInt(id));
      if (file) {
        return {
          success: true,
          message: `开始下载文件: ${file.name}`
        };
      } else {
        return {
          success: false,
          message: "文件不存在"
        };
      }
    }
  },
  {
    url: "/file/analysis",
    method: "post",
    response: ({ body }) => {
      const { fileId } = body as any;
      const file = fileData.find(item => item.id === parseInt(fileId));
      if (file) {
        return {
          success: true,
          data: {
            totalStats: {
              totalPlates: file.totalPlates,
              totalObjects: file.totalPlates * 5,
              totalWeight: file.totalWeight,
              totalTime: file.totalTime
            },
            plates: Array.from({ length: file.totalPlates }, (_, i) => ({
              index: i + 1,
              name: `分盘 ${i + 1}`,
              status: file.hasGcode ? "已切片" : "未切片",
              hasGcode: file.hasGcode,
              metadata: {
                prediction: file.totalTime / file.totalPlates
              },
              totalFilamentWeight: file.totalWeight / file.totalPlates,
              filaments: [
                {
                  id: 1,
                  type: "PLA",
                  color: "#FF0000",
                  used_g: file.totalWeight / file.totalPlates
                }
              ],
              objects: Array.from({ length: 5 }, (_, j) => ({
                name: `对象 ${j + 1}`,
                weight: file.totalWeight / file.totalPlates / 5
              }))
            })),
            plateImages: {
              1: "https://via.placeholder.com/100x100?text=Plate+1",
              2: "https://via.placeholder.com/100x100?text=Plate+2",
              3: "https://via.placeholder.com/100x100?text=Plate+3"
            }
          }
        };
      } else {
        return {
          success: false,
          message: "文件不存在"
        };
      }
    }
  },
  {
    url: "/file/detail/:id",
    method: "get",
    response: ({ params }) => {
      const { id } = params as any;
      const file = fileData.find(item => item.id === parseInt(id));
      if (file) {
        return {
          success: true,
          data: {
            ...file,
            analysisResult: {
              totalStats: {
                totalPlates: file.totalPlates,
                totalObjects: file.totalPlates * 5,
                totalWeight: file.totalWeight,
                totalTime: file.totalTime
              },
              plates: Array.from({ length: file.totalPlates }, (_, i) => ({
                index: i + 1,
                name: `分盘 ${i + 1}`,
                status: file.hasGcode ? "已切片" : "未切片",
                hasGcode: file.hasGcode,
                metadata: {
                  prediction:
                    file.totalPlates > 0
                      ? (file.totalTime / file.totalPlates).toString()
                      : "0"
                },
                totalFilamentWeight:
                  file.totalPlates > 0
                    ? file.totalWeight / file.totalPlates
                    : 0,
                filaments: [
                  {
                    id: "1",
                    type: "PLA",
                    color: "#FF0000",
                    used_g:
                      file.totalPlates > 0
                        ? (file.totalWeight / file.totalPlates).toString()
                        : "0"
                  }
                ],
                objects: Array.from({ length: 5 }, (_, j) => ({
                  identify_id: `obj_${j + 1}`,
                  name: `对象 ${j + 1}`,
                  skipped: false
                }))
              })),
              plateImages: {
                1: "https://via.placeholder.com/100x100?text=Plate+1",
                2: "https://via.placeholder.com/100x100?text=Plate+2",
                3: "https://via.placeholder.com/100x100?text=Plate+3"
              }
            }
          }
        };
      } else {
        return {
          success: false,
          message: "文件不存在"
        };
      }
    }
  }
]);
