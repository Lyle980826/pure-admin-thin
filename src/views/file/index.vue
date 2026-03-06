<script setup lang="ts">
import { ref } from "vue";
import { useFile } from "./hook/useFile";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import FileForm from "./upload/index.vue";

import Download from "~icons/ep/download";
import Delete from "~icons/ep/delete";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";
import Back from "~icons/ep/back";

defineOptions({
  name: "File"
});

const showUploadForm = ref(false);
const formRef = ref();
const {
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
} = useFile();

function openUploadForm() {
  showUploadForm.value = true;
}

function closeUploadForm() {
  showUploadForm.value = false;
  onSearch();
}
</script>

<template>
  <div class="main">
    <!-- 文件列表 -->
    <div v-if="!showUploadForm">
      <el-form
        ref="formRef"
        :inline="true"
        :model="form"
        class="search-form bg-bg_color w-full pl-8 pt-[12px] overflow-auto"
      >
        <el-form-item label="文件名" prop="filename">
          <el-input
            v-model="form.filename"
            placeholder="请输入文件名"
            clearable
            class="w-[180px]!"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="useRenderIcon('ri:search-line')"
            :loading="loading"
            @click="onSearch"
          >
            搜索
          </el-button>
          <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <PureTableBar title="文件列表" :columns="columns" @refresh="onSearch">
        <template #buttons>
          <el-button
            type="primary"
            :icon="useRenderIcon(AddFill)"
            @click="openUploadForm()"
          >
            上传文件
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            align-whole="center"
            showOverflowTooltip
            table-layout="auto"
            :loading="loading"
            :size="size"
            adaptive
            :adaptiveConfig="{ offsetBottom: 108 }"
            :data="dataList"
            :columns="dynamicColumns"
            :pagination="{ ...pagination, size }"
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)'
            }"
            @selection-change="handleSelectionChange"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
          >
            <template #operation="{ row }">
              <el-button
                class="reset-margin"
                link
                type="primary"
                :size="size"
                :icon="useRenderIcon(Download)"
                @click="downloadFile(row.id)"
              >
                下载
              </el-button>
              <el-popconfirm
                :title="`是否删除文件${row.name}`"
                @confirm="deleteFile(row.id)"
              >
                <template #reference>
                  <el-button
                    class="reset-margin"
                    link
                    type="danger"
                    :size="size"
                    :icon="useRenderIcon(Delete)"
                  >
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>

    <!-- 上传表单 -->
    <div v-else class="upload-container">
      <div class="upload-header">
        <el-button :icon="useRenderIcon(Back)" @click="closeUploadForm">
          返回文件列表
        </el-button>
      </div>
      <FileForm @upload-complete="closeUploadForm" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}

.upload-header {
  margin-bottom: 20px;
}
</style>
