import dayjs from "dayjs";
import { message } from "@/utils/message";
import { reactive, ref, onMounted } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import {
  getFileList,
  deleteFile as deleteFileApi,
  downloadFile as downloadFileApi
} from "@/api/file";

export function useFile() {
  const form = reactive({
    filename: ""
  });
  const dataList = ref([]);
  const loading = ref(true);
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
      minWidth: 120,
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

  async function downloadFile(id: number) {
    try {
      await downloadFileApi({ id });
      message("文件下载成功", { type: "success" });
    } catch {
      message("文件下载失败", { type: "error" });
    }
  }

  async function deleteFile(id: number) {
    try {
      await deleteFileApi({ id });
      message("文件删除成功", { type: "success" });
      onSearch();
    } catch {
      message("文件删除失败", { type: "error" });
    }
  }

  async function onSearch() {
    loading.value = true;
    try {
      const res = await getFileList({
        filename: form.filename,
        pageNum: pagination.currentPage,
        pageSize: pagination.pageSize
      });
      if (res.success) {
        dataList.value = res.data.list;
        pagination.total = res.data.total;
      }
    } catch {
      message("获取文件列表失败", { type: "error" });
    } finally {
      loading.value = false;
    }
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
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
