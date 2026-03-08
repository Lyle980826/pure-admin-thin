import FilamentForm from "./form/index.vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h } from "vue";
import type { PaginationProps } from "@pureadmin/table";

export function useFilament() {
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
      label: "耗材名称",
      prop: "name",
      minWidth: 100
    },
    {
      label: "耗材类型",
      prop: "type",
      minWidth: 100
    },
    {
      label: "颜色",
      prop: "color",
      width: 80,
      slot: "color"
    },
    {
      label: "制造商",
      prop: "manufacturer",
      minWidth: 100
    },
    {
      label: "重量(g)",
      prop: "weight",
      minWidth: 100
    },
    {
      label: "价格",
      prop: "price",
      minWidth: 100
    },
    {
      label: "库存",
      prop: "stock",
      minWidth: 100
    },
    {
      label: "存放位置",
      prop: "location",
      minWidth: 100
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
      title: "新建耗材",
      props: {
        formInline: {
          title: "新增",
          name: "",
          type: "PLA",
          color: "#FFFFFF",
          manufacturer: "",
          weight: "1000",
          price: "",
          stock: 0,
          location: "",
          remark: ""
        }
      },
      width: "46%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(FilamentForm, { ref: formRef, formInline: null }),
      beforeSure: done => {
        const FormRef = formRef.value?.getRef();
        if (FormRef) {
          FormRef.validate(valid => {
            if (valid) {
              // 模拟API调用创建耗材
              setTimeout(() => {
                message("耗材创建成功", { type: "success" });
                done(); // 关闭弹框
                onSearch(); // 刷新表格数据
              }, 500);
            }
          });
        } else {
          // 简单处理，直接关闭弹框
          message("耗材创建成功", { type: "success" });
          done();
          onSearch();
        }
      }
    });
  }

  function openEditDialog(row) {
    addDialog({
      title: "编辑耗材",
      props: {
        formInline: {
          title: "编辑",
          name: row.name,
          type: row.type,
          color: row.color,
          manufacturer: row.manufacturer,
          weight: row.weight,
          price: row.price,
          stock: row.stock,
          location: row.location,
          remark: row.remark || ""
        }
      },
      width: "46%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(FilamentForm, { ref: formRef, formInline: null }),
      beforeSure: done => {
        const FormRef = formRef.value?.getRef();
        if (FormRef) {
          FormRef.validate(valid => {
            if (valid) {
              // 模拟API调用更新耗材
              setTimeout(() => {
                message("耗材编辑成功", { type: "success" });
                done(); // 关闭弹框
                onSearch(); // 刷新表格数据
              }, 500);
            }
          });
        } else {
          // 简单处理，直接关闭弹框
          message("耗材编辑成功", { type: "success" });
          done();
          onSearch();
        }
      }
    });
  }

  function deleteFilament(_id) {
    // 模拟API调用删除耗材
    setTimeout(() => {
      message("耗材删除成功", { type: "success" });
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
          name: "PLA耗材",
          type: "PLA",
          color: "#FF0000",
          manufacturer: "Prusa",
          weight: "1000",
          price: "100",
          stock: 10,
          location: "A区-01"
        },
        {
          id: 2,
          name: "ABS耗材",
          type: "ABS",
          color: "#00FF00",
          manufacturer: "Creality",
          weight: "1000",
          price: "120",
          stock: 5,
          location: "A区-02"
        },
        {
          id: 3,
          name: "PETG耗材",
          type: "PETG",
          color: "#0000FF",
          manufacturer: "Anycubic",
          weight: "1000",
          price: "150",
          stock: 8,
          location: "B区-01"
        },
        {
          id: 4,
          name: "TPU耗材",
          type: "TPU",
          color: "#FFFF00",
          manufacturer: "MakerBot",
          weight: "1000",
          price: "200",
          stock: 3,
          location: "B区-02"
        },
        {
          id: 5,
          name: "PLA+耗材",
          type: "PLA",
          color: "#FF00FF",
          manufacturer: "Ultimaker",
          weight: "1000",
          price: "130",
          stock: 7,
          location: "C区-01"
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
    deleteFilament,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
