import dayjs from "dayjs";
import PrintScheduleForm from "./form/index.vue";
import FilamentInfo from "@/components/FilamentInfo/index.vue";
import OrderDetail from "@/views/order/detail.vue";
import FileDetail from "@/views/file/detail.vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import { statusMap, statusTypeMap } from "./utils/constants";
import {
  getPrintScheduleList,
  getPrintScheduleDetail,
  createPrintSchedule,
  updatePrintSchedule,
  deletePrintSchedule
} from "@/api/print-schedule";
import { getOrderDetail } from "@/api/order";
import { getFileDetail } from "@/api/file";

export function usePrintSchedule() {
  const form = reactive({
    orderName: "",
    status: "",
    filamentType: "",
    filamentColor: ""
  });
  const dataList = ref([]);
  const loading = ref(true);
  const formRef = ref();
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "序号",
      prop: "id",
      width: 60
    },
    {
      label: "订单ID",
      prop: "orderId",
      minWidth: 90,
      cellRenderer: ({ row }) =>
        h(
          "span",
          {
            class:
              "text-blue-600 cursor-pointer hover:text-blue-800 hover:underline",
            onClick: () => openOrderDetail(row)
          },
          row.orderId
        )
    },
    {
      label: "文件信息",
      prop: "fileName",
      minWidth: 220,
      cellRenderer: ({ row }) =>
        h(
          "span",
          {
            class:
              "text-blue-600 cursor-pointer hover:text-blue-800 hover:underline",
            onClick: () => openFileDetail(row)
          },
          `${row.fileName}-第${row.plateNumber}盘`
        )
    },
    {
      label: "耗材信息",
      minWidth: 120,
      cellRenderer: ({ row }) =>
        h(FilamentInfo, {
          filamentType: row.filamentType,
          filamentColor: row.filamentColor,
          plateWeight: row.plateWeight
        })
    },
    {
      label: "打印时长",
      prop: "maxPlateTime",
      minWidth: 120,
      formatter: ({ maxPlateTime }) => {
        if (!maxPlateTime) return "0";
        const hours = Math.floor(maxPlateTime / 60);
        const minutes = maxPlateTime % 60;
        if (hours > 0 && minutes > 0) {
          return `${hours}h${minutes}m`;
        } else if (hours > 0) {
          return `${hours}h`;
        } else {
          return `${minutes}m`;
        }
      }
    },
    {
      label: "计划打印时间",
      prop: "scheduledTime",
      minWidth: 160,
      formatter: ({ scheduledTime }) =>
        scheduledTime
          ? dayjs(scheduledTime).format("YYYY-MM-DD HH:mm:ss")
          : "--"
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 90,
      cellRenderer: ({ row }) => (
        <el-tag type={statusTypeMap[row.status] || "info"} size="small">
          {statusMap[row.status] || row.status}
        </el-tag>
      )
    },
    {
      label: "创建时间",
      prop: "createTime",
      minWidth: 160,
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation",
      width: 220
    }
  ];

  function handleSizeChange(_val: number) {}

  function handleCurrentChange(_val: number) {}

  function handleSelectionChange(_val) {}

  async function onDetail(row: any) {
    try {
      const res = await getPrintScheduleDetail(row.id);
      if (res.success && res.data) {
        message("查看打印计划详情", { type: "info" });
      }
    } catch {
      message("获取打印计划详情失败", { type: "error" });
    }
  }

  async function openOrderDetail(row: any) {
    try {
      const res = await getOrderDetail({ id: row.orderId });
      if (res.success && res.data) {
        addDialog({
          title: "订单详情",
          fullscreen: true,
          hideFooter: true,
          contentRenderer: () => OrderDetail,
          props: {
            data: [res.data]
          }
        });
      }
    } catch {
      message("获取订单详情失败", { type: "error" });
    }
  }

  async function openFileDetail(row: any) {
    try {
      const res = await getFileDetail(row.fileId);
      if (res.success && res.data) {
        addDialog({
          title: "文件详情",
          fullscreen: true,
          hideFooter: true,
          contentRenderer: () => h(FileDetail, { id: row.fileId })
        });
      }
    } catch {
      message("获取文件详情失败", { type: "error" });
    }
  }

  function openCreateDialog() {
    const formData = {
      title: "新增",
      orderName: "",
      customer: "",
      fileName: "",
      scheduledTime: "",
      remark: ""
    };
    addDialog({
      title: "新建打印计划",
      props: {
        formInline: formData
      },
      width: "60%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(PrintScheduleForm, { ref: formRef, formInline: formData }),
      beforeSure: async (done: any) => {
        const FormRef = formRef.value?.getRef();
        if (FormRef) {
          FormRef.validate(async (valid: boolean) => {
            if (valid) {
              try {
                const data = FormRef.getFormData?.();
                await createPrintSchedule(data);
                message("打印计划创建成功", { type: "success" });
                done();
                onSearch();
              } catch {
                message("打印计划创建失败", { type: "error" });
              }
            }
          });
        }
      }
    });
  }

  function openEditDialog(row: any) {
    const formData = {
      title: "编辑",
      id: row.id,
      orderName: row.orderName,
      customer: row.customer,
      fileName: row.fileName,
      scheduledTime: row.scheduledTime,
      status: row.status,
      remark: row.remark || ""
    };
    addDialog({
      title: "编辑打印计划",
      props: {
        formInline: formData
      },
      width: "60%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(PrintScheduleForm, { ref: formRef, formInline: formData }),
      beforeSure: async (done: any) => {
        const FormRef = formRef.value?.getRef();
        if (FormRef) {
          FormRef.validate(async (valid: boolean) => {
            if (valid) {
              try {
                const data = FormRef.getFormData?.();
                await updatePrintSchedule({ id: row.id, ...data });
                message("打印计划编辑成功", { type: "success" });
                done();
                onSearch();
              } catch {
                message("打印计划编辑失败", { type: "error" });
              }
            }
          });
        }
      }
    });
  }

  async function onDelete(row: any) {
    try {
      await deletePrintSchedule({ id: row.id });
      message("删除成功", { type: "success" });
      onSearch();
    } catch {
      message("删除失败", { type: "error" });
    }
  }

  async function onSearch() {
    loading.value = true;
    try {
      const res = await getPrintScheduleList({
        orderName: form.orderName,
        status: form.status,
        filamentType: form.filamentType,
        filamentColor: form.filamentColor,
        pageNum: pagination.currentPage,
        pageSize: pagination.pageSize
      });
      if (res.success) {
        dataList.value = res.data.list;
        pagination.total = res.data.total;
      }
    } catch {
      message("获取打印计划列表失败", { type: "error" });
    } finally {
      loading.value = false;
    }
  }

  const resetForm = (formEl: any) => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    onDetail,
    openCreateDialog,
    openEditDialog,
    onDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
