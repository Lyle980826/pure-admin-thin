<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { PureDescriptions } from "@pureadmin/descriptions";
import Back from "~icons/ep/back";
import FileAnalysisResult from "./components/FileAnalysisResult.vue";
import * as FileApi from "@/api/file";

const props = defineProps<{
  id: number | string;
}>();

const emit = defineEmits(["back"]);

const fileInfo = ref<any>(null);
const loading = ref(false);

const analysisResult = computed(() => {
  if (fileInfo.value && fileInfo.value.analysisResult) {
    return fileInfo.value.analysisResult;
  }
  return {
    plates: [],
    plateImages: {},
    totalStats: {
      totalPlates: 0,
      totalObjects: 0,
      totalWeight: 0,
      totalTime: 0
    }
  };
});

const columns = ref([
  { label: "文件名", prop: "name" },
  { label: "文件大小", prop: "size" },
  { label: "文件类型", prop: "type" },
  {
    label: "上传时间",
    prop: "uploadTime",
    formatter: (val: string) => new Date(val).toLocaleString()
  }
]);

async function loadFileDetail() {
  if (!props.id) return;
  loading.value = true;
  try {
    const res = await FileApi.getFileDetail(props.id);
    fileInfo.value = res.data;
  } catch (error) {
    console.error("加载文件详情失败:", error);
  } finally {
    loading.value = false;
  }
}

function goBack() {
  emit("back");
}

onMounted(() => {
  loadFileDetail();
});
</script>

<template>
  <div class="p-5 bg-white rounded-lg shadow-md">
    <div class="mb-5">
      <el-button :icon="useRenderIcon(Back)" @click="goBack">
        返回文件列表
      </el-button>
    </div>

    <el-skeleton :loading="loading" animated>
      <template #template>
        <el-skeleton :rows="10" />
      </template>
      <template #default>
        <div v-if="fileInfo">
          <!-- 文件基本信息 -->
          <div class="mb-5">
            <h3 class="mb-4 text-lg font-bold">文件基本信息</h3>
            <PureDescriptions
              border
              :data="[fileInfo]"
              :columns="columns"
              :column="3"
            />
          </div>

          <!-- 文件分析结果 -->
          <div>
            <h3 class="mb-4 text-lg font-bold">文件分析结果</h3>
            <FileAnalysisResult :analysisResult="analysisResult" />
          </div>
        </div>
        <div v-else class="py-20 text-center">
          <el-empty description="未找到文件信息" />
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<style scoped>
/* 可以保留一些基础样式 */
</style>
