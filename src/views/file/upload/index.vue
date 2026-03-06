<script setup lang="ts">
import { useFileUpload } from "../hook/useFileUpload";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/rule";
import UploadIcon from "~icons/ri/upload-2-line?width=26&height=26";
import type { PlateInfo } from "../utils/analyzer";

const emit = defineEmits(["upload-complete"]);

const fileTypeOptions = [
  { label: "PDF", value: "pdf" },
  { label: "图片", value: "image" },
  { label: "Excel", value: "excel" },
  { label: "Word", value: "word" },
  { label: "3MF", value: "3mf" },
  { label: "GCODE", value: "gcode" },
  { label: "其他", value: "other" }
];

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
  startAnalysis,
  completeUpload,
  backToAnalysis,
  backToUpload,
  handleObjectClick,
  getRef
} = useFileUpload();

defineExpose({ getRef });
</script>

<template>
  <div class="file-upload-container">
    <!-- 步骤条 -->
    <el-steps :active="activeStep" finish-status="success" class="mb-6" simple>
      <el-step title="上传文件" description="选择并上传3MF文件" />
      <el-step title="文件分析" description="系统自动分析文件内容" />
      <el-step title="完成" description="查看分析结果并确认" />
    </el-steps>

    <!-- 第一步：上传文件 -->
    <div v-if="activeStep === 0" class="step-content">
      <el-form
        ref="ruleFormRef"
        :model="newFormInline"
        :rules="formRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <!-- 文件上传 -->
          <re-col :value="24" :xs="24" :sm="24">
            <el-form-item
              label="文件上传"
              prop="fileList"
              :rules="[{ required: true, message: '请上传文件' }]"
            >
              <el-upload
                ref="uploadRef"
                v-model:file-list="newFormInline.fileList"
                drag
                action="#"
                class="w-full"
                :auto-upload="false"
                :on-change="handleFileChange"
                accept=".3mf"
              >
                <div class="el-upload__text">
                  <UploadIcon class="m-auto mb-2" />
                  可点击或拖拽上传 3MF 文件
                </div>
                <template #tip>
                  <div class="el-upload__tip text-red-500">
                    仅支持上传 .3mf 格式文件
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </re-col>

          <!-- 文件信息 -->
          <re-col v-if="newFormInline.filename" :value="12" :xs="24" :sm="24">
            <el-form-item label="文件名" prop="filename">
              <el-input
                v-model="newFormInline.filename"
                clearable
                placeholder="请输入文件名"
              />
            </el-form-item>
          </re-col>
          <re-col v-if="newFormInline.fileType" :value="12" :xs="24" :sm="24">
            <el-form-item label="文件类型" prop="fileType">
              <el-select
                v-model="newFormInline.fileType"
                placeholder="请选择文件类型"
                class="w-full"
              >
                <el-option
                  v-for="(item, index) in fileTypeOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </re-col>
          <re-col v-if="newFormInline.fileSize" :value="12" :xs="24" :sm="24">
            <el-form-item label="文件大小">
              <el-input
                v-model="newFormInline.fileSize"
                readonly
                class="w-full"
              />
            </el-form-item>
          </re-col>
          <re-col v-if="newFormInline.uploadTime" :value="12" :xs="24" :sm="24">
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
          <re-col :value="24" :xs="24" :sm="24" class="text-right">
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
    <div v-if="activeStep === 1" class="step-content">
      <el-form
        ref="ruleFormRef"
        :model="newFormInline"
        :rules="formRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <!-- 总览信息 -->
          <re-col
            v-if="analysisResult.plates.length > 0"
            :value="24"
            :xs="24"
            :sm="24"
          >
            <div class="total-info mb-4">
              <h4 class="section-title">文件分析总览</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">分盘数量:</span>
                  <span class="info-value"
                    >{{ analysisResult.totalStats.totalPlates }} 个</span
                  >
                </div>
                <div class="info-item">
                  <span class="info-label">总物体数量:</span>
                  <span class="info-value"
                    >{{ analysisResult.totalStats.totalObjects }} 个</span
                  >
                </div>
                <div class="info-item">
                  <span class="info-label">总耗材用量:</span>
                  <span class="info-value"
                    >{{
                      analysisResult.totalStats.totalWeight.toFixed(2)
                    }}g</span
                  >
                </div>
                <div class="info-item">
                  <span class="info-label">总打印时间:</span>
                  <span class="info-value">{{
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
            <el-form-item label="分盘信息">
              <div class="segmented-container mb-4">
                <el-segmented
                  v-model="activeTab"
                  :options="
                    analysisResult.plates.map(plate => ({
                      label: plate.name,
                      value: (plate.index - 1).toString()
                    }))
                  "
                />
              </div>
            </el-form-item>

            <div
              v-if="analysisResult.plates[Number(activeTab)]"
              class="plate-info"
            >
              <!-- 分盘基本信息和预览 -->
              <div class="plate-header mb-4">
                <el-descriptions :column="3" border class="plate-descriptions">
                  <template #title>
                    <div class="descriptions-title">
                      {{ currentPlate?.name }} 信息
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
                    :rowspan="2"
                    class="preview-cell"
                  >
                    <div class="plate-preview-in-descriptions">
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
                        class="plate-image-in-descriptions"
                      />
                      <div v-else class="no-preview-in-descriptions">
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

                  <el-descriptions-item label="物体数量">
                    {{ currentPlate?.objects?.length || 0 }} 个
                  </el-descriptions-item>

                  <el-descriptions-item label="耗材详情" :span="2">
                    <div
                      v-if="
                        currentPlate?.hasGcode &&
                        currentPlate?.filaments &&
                        currentPlate.filaments.length > 0
                      "
                      class="filament-list-tags"
                    >
                      <el-tag
                        v-for="filament in currentPlate?.filaments || []"
                        :key="filament.id"
                        :style="{ borderLeft: `4px solid ${filament.color}` }"
                        class="filament-tag mr-2 mb-2"
                      >
                        {{ filament.type || "未知" }} {{ filament.used_g }}g
                      </el-tag>
                    </div>
                    <span v-else>无数据</span>
                  </el-descriptions-item>
                </el-descriptions>
              </div>

              <!-- 物体信息 -->
              <div class="info-section">
                <h4 class="section-title">物体信息</h4>
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
                      label="物体名称"
                      min-width="200"
                    >
                      <template #default="scope">
                        <div class="object-name">{{ scope.row.name }}</div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="identify_id"
                      label="物体ID"
                      width="150"
                    />
                    <el-table-column
                      prop="skipped"
                      label="是否跳过"
                      width="100"
                    >
                      <template #default="scope">
                        <el-tag
                          :type="scope.row.skipped ? 'danger' : 'success'"
                        >
                          {{ scope.row.skipped ? "是" : "否" }}
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                      <template #default="scope">
                        <el-button
                          type="primary"
                          size="small"
                          @click="handleObjectClick(scope.row)"
                        >
                          查看详情
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div v-else class="no-data">
                  <el-empty description="该分盘未切片，无物体数据" />
                </div>
              </div>
            </div>
          </re-col>

          <!-- 操作按钮 -->
          <re-col :value="24" :xs="24" :sm="24" class="text-right">
            <el-button @click="backToUpload">返回上传</el-button>
            <el-button type="primary" @click="completeUpload">完成</el-button>
          </re-col>
        </el-row>
      </el-form>
    </div>

    <!-- 第三步：完成 -->
    <div v-if="activeStep === 2" class="step-content">
      <el-result
        icon="success"
        title="文件上传分析完成"
        sub-title="文件已成功上传并分析完成，您可以查看分析结果或返回列表。"
      >
        <template #extra>
          <div class="flex">
            <el-button @click="backToAnalysis">返回分析</el-button>
            <el-button type="primary" @click="emit('upload-complete')"
              >返回文件列表</el-button
            >
            <el-button>打印分析报告</el-button>
          </div>
        </template>
      </el-result>
    </div>
  </div>
</template>

<style scoped>


/* 响应式布局 */
@media (width <= 768px) {
  .file-upload-container {
    padding: 10px;
  }

  .step-content {
    padding: 10px;
  }

  .plate-header {
    flex-direction: column;
  }

  .plate-basic-info,
  .plate-preview {
    flex: none;
    width: 100%;
  }

  .plate-basic-info-with-preview {
    flex-direction: column;
  }

  .plate-preview-small {
    flex: none;
    width: 100%;
  }

  .info-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .no-data {
    padding: 20px 0;
  }

  .flex {
    flex-direction: column;
    gap: 8px;
  }
}

.file-upload-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

.step-content {
  padding: 20px;
  margin-top: 20px;
  background-color: #fafafa;
  border-radius: 8px;
}

.plate-info {
  margin-top: 10px;
}

.info-section {
  margin-bottom: 20px;
}

.section-title {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.total-info {
  padding: 16px;
  margin-bottom: 20px;
  background-color: #f0f9ff;
  border: 1px solid #e1f5fe;
  border-radius: 4px;
}

.plate-basic-info {
  flex: 1;
  min-width: 0;
  padding: 16px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.plate-header {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.plate-basic-info-with-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
}

.plate-preview-small {
  flex: 0 0 150px;
  min-width: 150px;
}

.preview-container-small {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100px;
  overflow: hidden;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.plate-image-small {
  width: 100%;
  height: 100%;
}

.no-preview-small {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 12px;
  color: #909399;
  background-color: #f5f7fa;
}

.filament-info-item {
  align-items: flex-start;
}

.filament-list-inline {
  display: flex;

  /* flex-direction: column; */
  gap: 4px;
}

.filament-item-inline {
  display: flex;
  gap: 6px;
  align-items: center;
}

.color-block-small {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  border: 1px solid #ddd;
  border-radius: 3px;
}

.filament-detail {
  font-size: 13px;
  color: #303133;
}

.plate-descriptions {
  width: 100%;
}

.descriptions-title {
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.preview-cell {
  vertical-align: top;
}

.plate-preview-in-descriptions {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.plate-image-in-descriptions {
  width: 50px;
  height: 50px;
  cursor: pointer;
  object-fit: cover;
  border-radius: 6px;
}

.no-preview-in-descriptions {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  padding: 4px;
  font-size: 10px;
  color: #909399;
  text-align: center;
  background-color: #f5f7fa;
  border-radius: 6px;
}

.filament-list-tags {
  display: flex;
  flex-wrap: wrap;
}

.filament-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.plate-preview {
  flex: 1;
  min-width: 300px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.info-label {
  min-width: 80px;
  font-size: 14px;
  color: #606266;
}

.info-value {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.filament-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filament-type {
  font-size: 12px;
  color: #606266;
}

.filament-weight {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.expand-content {
  padding: 16px;
  margin-top: 8px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.expand-title {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.preview-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.plate-image {
  max-width: 100%;
  max-height: 300px;
  cursor: pointer;
  border-radius: 4px;
}

.no-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  font-size: 14px;
  color: #999;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.plate-summary {
  margin-bottom: 20px;
}

.filament-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.filament-item {
  padding: 8px 12px;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.object-name {
  font-size: 14px;
  color: #303133;
  word-break: break-all;
}

.flex {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
}

.items-center {
  align-items: center;
}

.gap-3 {
  gap: 12px;
}

.gap-4 {
  gap: 16px;
}

.mb-4 {
  margin-bottom: 16px;
}

.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  margin-top: 8px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.ml-2 {
  margin-left: 8px;
}

.text-right {
  margin-top: 20px;
  text-align: right;
}

:deep(.el-table__row:last-child .el-table__cell) {
  border-bottom: none;
}

:deep(.el-table) {
  border-bottom: none;
}

.color-block {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

:deep(.el-image-viewer) {
  z-index: 20000;
}

.segmented-container {
  overflow-x: auto;
  white-space: nowrap;
  background-color: #fff;
}

.segmented-container :deep(.el-segmented) {
  min-width: 100%;
}
</style>
