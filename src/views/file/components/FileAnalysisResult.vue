<script setup lang="ts">
import { ref, computed } from "vue";
import ReCol from "@/components/ReCol";
import FilamentInfo from "@/components/FilamentInfo/index.vue";
import type { AnalysisResult } from "../utils/analyzer";

const props = defineProps<{
  analysisResult: AnalysisResult;
}>();

const activeTab = ref("0");

const currentPlate = computed(() => {
  if (props.analysisResult?.plates) {
    return props.analysisResult.plates[Number(activeTab.value)];
  }
  return null;
});
</script>

<template>
  <div>
    <el-row :gutter="20">
      <!-- 总览信息 -->
      <re-col
        v-if="analysisResult.plates.length > 0"
        :value="24"
        :xs="24"
        :sm="24"
      >
        <div class="p-4 mb-5 bg-blue-50 border border-blue-100 rounded">
          <div class="mb-2 text-sm font-bold text-gray-800">文件分析总览</div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="flex items-center gap-2">
              <span class="min-w-[80px] text-sm text-gray-600">分盘数量:</span>
              <span class="text-sm font-medium text-gray-800">
                {{ analysisResult.totalStats.totalPlates }} 个
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="min-w-[80px] text-sm text-gray-600"
                >总对象数量:</span
              >
              <span class="text-sm font-medium text-gray-800">
                {{ analysisResult.totalStats.totalObjects }} 个
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="min-w-[80px] text-sm text-gray-600"
                >总耗材用量:</span
              >
              <span class="text-sm font-medium text-gray-800">
                {{ analysisResult.totalStats.totalWeight.toFixed(2) }}g
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="min-w-[80px] text-sm text-gray-600"
                >总打印时间:</span
              >
              <span class="text-sm font-medium text-gray-800">
                {{
                  analysisResult.totalStats.totalTime
                    ? (analysisResult.totalStats.totalTime / 60).toFixed(1) +
                      " 分钟"
                    : "--"
                }}
              </span>
            </div>
          </div>
        </div>
      </re-col>

      <!-- 分盘信息 -->
      <re-col
        v-if="analysisResult.plates.length > 0"
        :value="24"
        :xs="24"
        :sm="24"
      >
        <div class="mb-4 overflow-x-auto whitespace-nowrap bg-white">
          <el-segmented
            v-model="activeTab"
            :options="
              analysisResult.plates.map(plate => ({
                label: plate.name,
                value: (plate.index - 1).toString()
              }))
            "
            class="min-w-full"
          />
        </div>

        <div v-if="currentPlate" class="mt-2">
          <!-- 分盘基本信息和预览 -->
          <div class="flex flex-wrap gap-5 mb-5">
            <el-descriptions :column="3" border class="w-full">
              <template #title>
                <div
                  class="flex items-center text-base font-semibold text-gray-800"
                >
                  {{ currentPlate.name }} 详细信息
                  <el-tag
                    :type="currentPlate.hasGcode ? 'success' : 'warning'"
                    size="small"
                    class="ml-2"
                  >
                    {{ currentPlate.status }}
                  </el-tag>
                </div>
              </template>

              <el-descriptions-item label="分盘编号">
                {{ currentPlate.index }}
              </el-descriptions-item>

              <el-descriptions-item label="预计打印时间">
                {{
                  currentPlate.metadata.prediction
                    ? (
                        parseFloat(currentPlate.metadata.prediction) / 60
                      ).toFixed(1) + " 分钟"
                    : "--"
                }}
              </el-descriptions-item>

              <el-descriptions-item
                label="分盘预览"
                :rowspan="3"
                class="align-top"
              >
                <div class="flex items-center justify-center p-2">
                  <el-image
                    v-if="
                      currentPlate &&
                      analysisResult.plateImages[currentPlate.index]
                    "
                    :src="analysisResult.plateImages[currentPlate.index]"
                    :preview-src-list="[
                      analysisResult.plateImages[currentPlate.index]
                    ]"
                    preview-teleported
                    loading="lazy"
                    fit="cover"
                    class="w-[100px] h-[100px] cursor-pointer object-cover rounded-md"
                  />
                  <div
                    v-else
                    class="flex items-center justify-center w-[100px] h-[100px] p-1 text-xs text-gray-500 text-center bg-gray-100 rounded-md"
                  >
                    无预览图片
                  </div>
                </div>
              </el-descriptions-item>

              <el-descriptions-item label="总耗材用量">
                {{
                  currentPlate.totalFilamentWeight
                    ? currentPlate.totalFilamentWeight.toFixed(2)
                    : "--"
                }}g
              </el-descriptions-item>

              <el-descriptions-item label="对象数量">
                {{ currentPlate.objects?.length || 0 }} 个
              </el-descriptions-item>

              <el-descriptions-item label="耗材详情" :span="2">
                <div
                  v-if="
                    currentPlate.hasGcode &&
                    currentPlate.filaments &&
                    currentPlate.filaments.length > 0
                  "
                  class="flex flex-wrap gap-2"
                >
                  <FilamentInfo
                    v-for="filament in currentPlate.filaments"
                    :key="filament.id"
                    :type="filament.type"
                    :color="filament.color"
                    :used-g="filament.used_g"
                  />
                </div>
                <span v-else>无数据</span>
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 对象信息 -->
          <div class="mb-5">
            <div
              v-if="
                currentPlate.hasGcode &&
                currentPlate.objects &&
                currentPlate.objects.length > 0
              "
            >
              <el-table
                :data="currentPlate.objects"
                size="small"
                showOverflowTooltip
                style="width: 100%"
              >
                <el-table-column prop="name" label="对象名称" min-width="200">
                  <template #default="scope">
                    <div class="text-sm text-gray-800 break-all">
                      {{ scope.row.name }}
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div
              v-else
              class="flex items-center justify-center py-10 mt-2 bg-gray-100 rounded"
            >
              <el-empty description="该分盘未切片，无对象数据" />
            </div>
          </div>
        </div>
      </re-col>
    </el-row>
  </div>
</template>

<style scoped>
/* 可以保留一些基础样式 */
</style>
