<script setup lang="ts">
import { useRouter } from "vue-router";
import { useFileUpload } from "../hook/useFileUpload";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/rule";
import UploadIcon from "~icons/ri/upload-2-line?width=26&height=26";
import { useOrderStoreHook } from "@/store/modules/order";

const router = useRouter();
const orderStore = useOrderStoreHook();

const emit = defineEmits(["upload-complete"]);

function handleCreateOrder() {
  orderStore.setShouldCreateOrder(true);
  router.push("/order");
}

const {
  ruleFormRef,
  newFormInline,
  analysisResult,
  activeTab,
  activeStep,
  isAnalyzing,
  uploadRef,
  currentPlate,
  formatFileSize,
  handleFileChange,
  handleExceed,
  startAnalysis,
  completeUpload,
  backToUpload,
  getRef
} = useFileUpload();

defineExpose({ getRef });
</script>

<template>
  <div class="p-5 bg-white rounded-lg shadow-md">
    <!-- 步骤条 -->
    <el-steps :active="activeStep" finish-status="success" class="mb-6" simple>
      <el-step title="选择文件" />
      <el-step title="文件分析" />
      <el-step title="上传完成" />
    </el-steps>

    <!-- 第一步：选择文件 -->
    <div v-if="activeStep === 0" class="p-5 mt-5 rounded-lg">
      <el-form
        ref="ruleFormRef"
        :model="newFormInline"
        :rules="formRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <!-- 选择文件 -->
          <re-col :value="24" :xs="24" :sm="24">
            <el-form-item
              label="选择文件"
              prop="fileList"
              :rules="[{ required: true, message: '请选择文件' }]"
            >
              <el-upload
                ref="uploadRef"
                v-model:file-list="newFormInline.fileList"
                drag
                action="#"
                class="w-full"
                :auto-upload="false"
                :on-change="handleFileChange"
                :on-exceed="handleExceed"
                accept=".3mf"
                :limit="1"
              >
                <div class="el-upload__text">
                  <UploadIcon class="m-auto mb-2" />
                  可点击或拖拽选择 3MF 文件
                </div>
                <template #tip>
                  <div class="el-upload__tip text-red-500">
                    仅支持选择 .3mf 格式文件
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </re-col>

          <!-- 文件信息 -->
          <re-col v-if="newFormInline.filename" :value="8" :xs="24" :sm="24">
            <el-form-item label="文件名" prop="filename">
              <el-input
                v-model="newFormInline.filename"
                clearable
                placeholder="请输入文件名"
              />
            </el-form-item>
          </re-col>
          <re-col v-if="newFormInline.fileSize" :value="8" :xs="24" :sm="24">
            <el-form-item label="文件大小">
              <el-input
                v-model="newFormInline.fileSize"
                readonly
                class="w-full"
              />
            </el-form-item>
          </re-col>
          <re-col v-if="newFormInline.uploadTime" :value="8" :xs="24" :sm="24">
            <el-form-item label="上传时间">
              <el-input
                v-model="newFormInline.uploadTime"
                readonly
                class="w-full"
              />
            </el-form-item>
          </re-col>

          <!-- 备注 -->
          <re-col :value="24" :xs="24" :sm="24">
            <el-form-item label="备注">
              <el-input
                v-model="newFormInline.remark"
                placeholder="请输入备注信息"
                type="textarea"
                :rows="3"
              />
            </el-form-item>
          </re-col>

          <!-- 操作按钮 -->
          <re-col :value="24" :xs="24" :sm="24" class="mt-5 text-right">
            <el-button
              type="primary"
              :loading="isAnalyzing"
              :disabled="newFormInline.fileList.length === 0"
              @click="startAnalysis"
            >
              开始分析
            </el-button>
          </re-col>
        </el-row>
      </el-form>
    </div>

    <!-- 第二步：文件分析 -->
    <div v-if="activeStep === 1" class="p-5 mt-5 rounded-lg">
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
              <div class="mb-2 text-sm font-bold text-gray-800">
                文件分析总览
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="flex items-center gap-2">
                  <span class="min-w-[80px] text-sm text-gray-600"
                    >分盘数量:</span
                  >
                  <span class="text-sm font-medium text-gray-800"
                    >{{ analysisResult.totalStats.totalPlates }} 个</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <span class="min-w-[80px] text-sm text-gray-600"
                    >总对象数量:</span
                  >
                  <span class="text-sm font-medium text-gray-800"
                    >{{ analysisResult.totalStats.totalObjects }} 个</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <span class="min-w-[80px] text-sm text-gray-600"
                    >总耗材用量:</span
                  >
                  <span class="text-sm font-medium text-gray-800"
                    >{{
                      analysisResult.totalStats.totalWeight.toFixed(2)
                    }}g</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <span class="min-w-[80px] text-sm text-gray-600"
                    >总打印时间:</span
                  >
                  <span class="text-sm font-medium text-gray-800">{{
                    analysisResult.totalStats.totalTime
                      ? (analysisResult.totalStats.totalTime / 60).toFixed(1) +
                        " 分钟"
                      : "--"
                  }}</span>
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
            <!-- <div class="mb-2 text-sm font-bold text-gray-800">分盘信息</div> -->
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

            <div v-if="analysisResult.plates[Number(activeTab)]" class="mt-2">
              <!-- 分盘基本信息和预览 -->
              <div class="flex flex-wrap gap-5 mb-5">
                <el-descriptions :column="3" border class="w-full">
                  <template #title>
                    <div
                      class="flex items-center text-base font-semibold text-gray-800"
                    >
                      {{ currentPlate?.name }} 详细信息
                      <el-tag
                        :type="currentPlate?.hasGcode ? 'success' : 'warning'"
                        size="small"
                        class="ml-2"
                      >
                        {{ currentPlate?.status }}
                      </el-tag>
                    </div>
                  </template>

                  <el-descriptions-item label="分盘编号">
                    {{ currentPlate?.index }}
                  </el-descriptions-item>

                  <el-descriptions-item label="预计打印时间">
                    {{
                      currentPlate?.metadata.prediction
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
                        {{
                          currentPlate?.thumbnailFile
                            ? "预览图片未加载"
                            : "无预览图片"
                        }}
                      </div>
                    </div>
                  </el-descriptions-item>

                  <el-descriptions-item label="总耗材用量">
                    {{
                      currentPlate?.totalFilamentWeight
                        ? currentPlate.totalFilamentWeight.toFixed(2)
                        : "--"
                    }}g
                  </el-descriptions-item>

                  <el-descriptions-item label="对象数量">
                    {{ currentPlate?.objects?.length || 0 }} 个
                  </el-descriptions-item>

                  <el-descriptions-item label="耗材详情" :span="2">
                    <div
                      v-if="
                        currentPlate?.hasGcode &&
                        currentPlate?.filaments &&
                        currentPlate.filaments.length > 0
                      "
                      class="flex flex-wrap"
                    >
                      <div
                        v-for="filament in currentPlate?.filaments || []"
                        :key="filament.id"
                        class="flex items-center px-3 py-1 mr-2 bg-white border border-gray-200 rounded"
                      >
                        <div
                          class="w-5 h-5 mr-2 border border-gray-300 rounded flex-shrink-0"
                          :style="{
                            backgroundColor: filament.color || '#909399'
                          }"
                        />
                        <span class="text-sm text-gray-800">
                          {{ filament.type || "未知" }} {{ filament.used_g }}g
                        </span>
                      </div>
                    </div>
                    <span v-else>无数据</span>
                  </el-descriptions-item>
                </el-descriptions>
              </div>

              <!-- 对象信息 -->
              <div class="mb-5">
                <!-- <h4 class="mb-2 text-sm font-bold text-gray-800">对象信息</h4> -->
                <div
                  v-if="
                    currentPlate?.hasGcode &&
                    currentPlate?.objects &&
                    currentPlate.objects.length > 0
                  "
                >
                  <el-table
                    :data="currentPlate?.objects || []"
                    size="small"
                    showOverflowTooltip
                    style="width: 100%"
                  >
                    <el-table-column
                      prop="name"
                      label="对象名称"
                      min-width="200"
                    >
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

          <!-- 操作按钮 -->
          <re-col :value="24" :xs="24" :sm="24" class="mt-5 text-right">
            <el-button @click="backToUpload">返回选择文件</el-button>
            <el-button type="primary" @click="completeUpload"
              >上传文件</el-button
            >
          </re-col>
        </el-row>
      </div>
    </div>

    <!-- 第三步：完成 -->
    <div v-if="activeStep === 2" class="p-5 mt-5 rounded-lg">
      <el-result
        icon="success"
        title="文件上传完成"
        sub-title="文件分析完成并已成功上传，您可以新建订单或返回列表。"
      >
        <template #extra>
          <div class="flex items-center justify-center gap-3">
            <el-button @click="handleCreateOrder">新建文件订单</el-button>
            <el-button type="primary" @click="emit('upload-complete')"
              >返回文件列表</el-button
            >
            <el-button @click="backToUpload">返回选择文件</el-button>
          </div>
        </template>
      </el-result>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-table__row:last-child .el-table__cell) {
  border-bottom: none;
}

:deep(.el-table) {
  border-bottom: none;
}
</style>
