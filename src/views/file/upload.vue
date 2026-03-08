<script setup lang="ts">
import { useRouter } from "vue-router";
import { useFileUpload } from "./hook/useFileUpload";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import UploadIcon from "~icons/ri/upload-2-line?width=26&height=26";
import { useOrderStoreHook } from "@/store/modules/order";
import FileAnalysisResult from "./components/FileAnalysisResult.vue";

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
      <FileAnalysisResult :analysisResult="analysisResult" />
      <!-- 操作按钮 -->
      <re-col :value="24" :xs="24" :sm="24" class="mt-5 text-right">
        <el-button @click="backToUpload">返回选择文件</el-button>
        <el-button type="primary" @click="completeUpload">上传文件</el-button>
      </re-col>
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
            <el-button type="primary" @click="emit('upload-complete')">
              返回文件列表
            </el-button>
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
