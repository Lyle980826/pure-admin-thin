import dayjs from "dayjs";
import Detail from "./detail.vue";
import OrderForm from "./form/index.vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h } from "vue";
import type { PaginationProps } from "@pureadmin/table";

export function useOrder() {
  const form = reactive({
    username: ""
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
      formatter: ({ orderType }) => (orderType === "custom" ? "定制" : "代打")
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

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  function onDetail(row) {
    // 模拟API调用获取订单详情
    setTimeout(() => {
      const orderDetail = {
        ...row,
        remark: "测试订单",
        address: "北京市朝阳区",
        phone: "13800138000",
        paymentMethod: "支付宝",
        shippingMethod: "快递",
        orderType: row.orderType || "custom"
      };
      addDialog({
        title: "订单详情",
        fullscreen: true,
        hideFooter: true,
        contentRenderer: () => Detail,
        props: {
          data: [orderDetail]
        }
      });
    }, 300);
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
      beforeSure: done => {
        const FormRef = formRef.value?.getRef();
        if (FormRef) {
          FormRef.validate(valid => {
            if (valid) {
              // 模拟API调用创建订单
              setTimeout(() => {
                message("订单创建成功", { type: "success" });
                done(); // 关闭弹框
                onSearch(); // 刷新表格数据
              }, 500);
            }
          });
        } else {
          // 简单处理，直接关闭弹框
          message("订单创建成功", { type: "success" });
          done();
          onSearch();
        }
      }
    });
  }

  function openEditDialog(row) {
    addDialog({
      title: "编辑订单",
      props: {
        formInline: {
          title: "编辑",
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
      beforeSure: done => {
        const FormRef = formRef.value?.getRef();
        if (FormRef) {
          FormRef.validate(valid => {
            if (valid) {
              // 模拟API调用更新订单
              setTimeout(() => {
                message("订单编辑成功", { type: "success" });
                done(); // 关闭弹框
                onSearch(); // 刷新表格数据
              }, 500);
            }
          });
        } else {
          // 简单处理，直接关闭弹框
          message("订单编辑成功", { type: "success" });
          done();
          onSearch();
        }
      }
    });
  }

  async function onSearch() {
    loading.value = true;
    // 模拟API调用
    setTimeout(() => {
      dataList.value = [
        {
          id: 1,
          customer: "张三",
          amount: 1000,
          status: "已完成",
          orderType: "custom",
          createTime: "2024-01-01"
        },
        {
          id: 2,
          customer: "李四",
          amount: 2000,
          status: "处理中",
          orderType: "print",
          createTime: "2024-01-02"
        },
        {
          id: 3,
          customer: "王五",
          amount: 3000,
          status: "已付款",
          orderType: "custom",
          createTime: "2024-01-03"
        },
        {
          id: 4,
          customer: "赵六",
          amount: 1500,
          status: "待确认",
          orderType: "custom",
          createTime: "2024-01-04"
        },
        {
          id: 5,
          customer: "孙七",
          amount: 2500,
          status: "生产中",
          orderType: "print",
          createTime: "2024-01-05"
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
    onDetail,
    openCreateDialog,
    openEditDialog,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
