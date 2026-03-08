import dayjs from "dayjs";
import Detail from "./detail.vue";
import OrderForm from "./form/index.vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import { orderTypeMap } from "./utils/constants";
import {
  getOrderList,
  getOrderDetail,
  createOrder,
  updateOrder
} from "@/api/order";

export function useOrder() {
  const form = reactive({
    username: "",
    status: ""
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
      label: "客户名称",
      prop: "customer",
      minWidth: 100
    },
    {
      label: "订单类型",
      prop: "orderType",
      minWidth: 100,
      formatter: ({ orderType }) => orderTypeMap[orderType] || orderType
    },
    {
      label: "订单金额",
      prop: "amount",
      minWidth: 100
    },
    {
      label: "订单状态",
      prop: "status",
      minWidth: 100
    },
    {
      label: "创建时间",
      prop: "createTime",
      minWidth: 180,
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation",
      width: 210
    }
  ];

  function handleSizeChange(_val: number) {}

  function handleCurrentChange(_val: number) {}

  function handleSelectionChange(_val) {}

  async function onDetail(row: any) {
    try {
      const res = await getOrderDetail({ id: row.id });
      if (res.success && res.data) {
        addDialog({
          title: "订单详情",
          fullscreen: true,
          hideFooter: true,
          contentRenderer: () => Detail,
          props: {
            data: [res.data]
          }
        });
      }
    } catch {
      message("获取订单详情失败", { type: "error" });
    }
  }

  function openCreateDialog() {
    addDialog({
      title: "新建订单",
      props: {
        formInline: {
          title: "新增",
          customer: "",
          amount: "",
          orderType: "custom",
          status: "已付款",
          shippingMethod: "快递",
          remark: "",
          selectedFile: ""
        }
      },
      width: "46%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(OrderForm, { ref: formRef, formInline: null }),
      beforeSure: async (done: any) => {
        const FormRef = formRef.value?.getRef();
        if (FormRef) {
          FormRef.validate(async (valid: boolean) => {
            if (valid) {
              try {
                const formData = FormRef.getFormData?.();
                await createOrder(formData);
                message("订单创建成功", { type: "success" });
                done();
                onSearch();
              } catch {
                message("订单创建失败", { type: "error" });
              }
            }
          });
        }
      }
    });
  }

  function openEditDialog(row: any) {
    addDialog({
      title: "编辑订单",
      props: {
        formInline: {
          title: "编辑",
          id: row.id,
          customer: row.customer,
          amount: row.amount,
          orderType: row.orderType || "custom",
          status: row.status,
          shippingMethod: row.shippingMethod || "快递",
          remark: row.remark || "",
          selectedFile: row.selectedFile || ""
        }
      },
      width: "46%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(OrderForm, { ref: formRef, formInline: null }),
      beforeSure: async (done: any) => {
        const FormRef = formRef.value?.getRef();
        if (FormRef) {
          FormRef.validate(async (valid: boolean) => {
            if (valid) {
              try {
                const formData = FormRef.getFormData?.();
                await updateOrder({ id: row.id, ...formData });
                message("订单编辑成功", { type: "success" });
                done();
                onSearch();
              } catch {
                message("订单编辑失败", { type: "error" });
              }
            }
          });
        }
      }
    });
  }

  async function onSearch() {
    loading.value = true;
    try {
      const res = await getOrderList({
        username: form.username,
        status: form.status,
        pageNum: pagination.currentPage,
        pageSize: pagination.pageSize
      });
      if (res.success) {
        dataList.value = res.data.list;
        pagination.total = res.data.total;
      }
    } catch {
      message("获取订单列表失败", { type: "error" });
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
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
