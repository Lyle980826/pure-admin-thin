import dayjs from "dayjs";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import FileForm from "./form/index.vue";

export function useFile() {
  const form = reactive({
    filename: ""
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
      minWidth: 60
    },
    {
      label: "文件名",
      prop: "name",
      minWidth: 150
    },
    {
      label: "文件大小",
      prop: "size",
      minWidth: 100
    },
    {
      label: "文件类型",
      prop: "type",
      minWidth: 100
    },
    {
      label: "上传时间",
      prop: "uploadTime",
      minWidth: 180,
      formatter: ({ uploadTime }) =>
        dayjs(uploadTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation"
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

  function downloadFile(id: number) {
    console.log("下载文件，ID:", id);
    message("文件下载成功", { type: "success" });
  }

  function deleteFile(id: number) {
    console.log("删除文件，ID:", id);
    message("文件删除成功", { type: "success" });
    onSearch();
  }

  function openUploadDialog() {
    addDialog({
      title: "上传文件",
      width: "46%",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(FileForm, {
          ref: formRef,
          formInline: {
            title: "新增",
            filename: "",
            fileType: "pdf",
            fileSize: "",
            uploadTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            remark: "",
            fileList: []
          }
        }),
      beforeSure: done => {
        const FormRef = formRef.value?.getRef();
        if (FormRef) {
          FormRef.validate(valid => {
            if (valid) {
              message("文件上传成功", { type: "success" });
              done(); // 关闭弹框
              onSearch(); // 刷新表格数据
            }
          });
        } else {
          // 简单处理，直接关闭弹框
          message("文件上传成功", { type: "success" });
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
          name: "文档1.pdf",
          size: "1.2MB",
          type: "PDF",
          uploadTime: "2024-01-01"
        },
        {
          id: 2,
          name: "图片1.jpg",
          size: "2.5MB",
          type: "JPG",
          uploadTime: "2024-01-02"
        },
        {
          id: 3,
          name: "表格1.xlsx",
          size: "3.8MB",
          type: "Excel",
          uploadTime: "2024-01-03"
        }
      ];
      pagination.total = 3;
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
    downloadFile,
    deleteFile,
    openUploadDialog,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
