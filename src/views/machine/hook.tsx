import dayjs from "dayjs";
import MachineForm from "./form/index.vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h } from "vue";
import type { PaginationProps } from "@pureadmin/table";

export function useMachine() {
  const form = reactive({
    name: ""
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
      label: "机器名称",
      prop: "name",
      minWidth: 100
    },
    {
      label: "机器型号",
      prop: "model",
      minWidth: 100
    },
    {
      label: "机器状态",
      prop: "status",
      minWidth: 100
    },
    {
      label: "机器位置",
      prop: "location",
      minWidth: 100
    },
    {
      label: "购买日期",
      prop: "purchaseDate",
      minWidth: 180,
      formatter: ({ purchaseDate }) =>
        purchaseDate ? dayjs(purchaseDate).format("YYYY-MM-DD") : ""
    },
    {
      label: "维护日期",
      prop: "maintenanceDate",
      minWidth: 180,
      formatter: ({ maintenanceDate }) =>
        maintenanceDate ? dayjs(maintenanceDate).format("YYYY-MM-DD") : ""
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation",
      width: 150
    }
  ];

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  function openCreateDialog() {
    addDialog({
      title: "新建机器",
      props: {
        formInline: {
          title: "新增",
          name: "",
          model: "",
          status: "正常",
          location: "",
          purchaseDate: "",
          maintenanceDate: "",
          remark: ""
        }
      },
      width: "46%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(MachineForm, { ref: formRef, formInline: null }),
      beforeSure: done => {
        const FormRef = formRef.value?.getRef();
        if (FormRef) {
          FormRef.validate(valid => {
            if (valid) {
              // 模拟API调用创建机器
              setTimeout(() => {
                message("机器创建成功", { type: "success" });
                done(); // 关闭弹框
                onSearch(); // 刷新表格数据
              }, 500);
            }
          });
        } else {
          // 简单处理，直接关闭弹框
          message("机器创建成功", { type: "success" });
          done();
          onSearch();
        }
      }
    });
  }

  function openEditDialog(row) {
    addDialog({
      title: "编辑机器",
      props: {
        formInline: {
          title: "编辑",
          name: row.name,
          model: row.model,
          status: row.status,
          location: row.location,
          purchaseDate: row.purchaseDate,
          maintenanceDate: row.maintenanceDate,
          remark: row.remark || ""
        }
      },
      width: "46%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(MachineForm, { ref: formRef, formInline: null }),
      beforeSure: done => {
        const FormRef = formRef.value?.getRef();
        if (FormRef) {
          FormRef.validate(valid => {
            if (valid) {
              // 模拟API调用更新机器
              setTimeout(() => {
                message("机器编辑成功", { type: "success" });
                done(); // 关闭弹框
                onSearch(); // 刷新表格数据
              }, 500);
            }
          });
        } else {
          // 简单处理，直接关闭弹框
          message("机器编辑成功", { type: "success" });
          done();
          onSearch();
        }
      }
    });
  }

  function deleteMachine(_id) {
    // 模拟API调用删除机器
    setTimeout(() => {
      message("机器删除成功", { type: "success" });
      onSearch(); // 刷新表格数据
    }, 500);
  }

  async function onSearch() {
    loading.value = true;
    // 模拟API调用
    setTimeout(() => {
      dataList.value = [
        {
          id: 1,
          name: "3D打印机A",
          model: "Prusa i3 MK3S",
          status: "正常",
          location: "A区-01",
          purchaseDate: "2023-01-01",
          maintenanceDate: "2023-12-01"
        },
        {
          id: 2,
          name: "3D打印机B",
          model: "Creality Ender 3",
          status: "维护中",
          location: "A区-02",
          purchaseDate: "2023-02-01",
          maintenanceDate: "2023-11-01"
        },
        {
          id: 3,
          name: "3D打印机C",
          model: "Anycubic Vyper",
          status: "正常",
          location: "B区-01",
          purchaseDate: "2023-03-01",
          maintenanceDate: "2023-10-01"
        },
        {
          id: 4,
          name: "3D打印机D",
          model: "MakerBot Replicator",
          status: "故障",
          location: "B区-02",
          purchaseDate: "2023-04-01",
          maintenanceDate: "2023-09-01"
        },
        {
          id: 5,
          name: "3D打印机E",
          model: "Ultimaker S5",
          status: "闲置",
          location: "C区-01",
          purchaseDate: "2023-05-01",
          maintenanceDate: "2023-08-01"
        }
      ];
      pagination.total = 5;
      pagination.pageSize = 10;
      pagination.currentPage = 1;
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
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
    openCreateDialog,
    openEditDialog,
    deleteMachine,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
