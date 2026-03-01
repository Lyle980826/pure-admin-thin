<script setup lang="ts">
import { ref, computed } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";
import UploadIcon from "~icons/ri/upload-2-line?width=26&height=26";
import JSZip from "jszip";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    filename: "",
    fileType: "pdf",
    fileSize: "",
    uploadTime: "",
    remark: "",
    fileList: []
  })
});

const fileTypeOptions = [
  { label: "PDF", value: "pdf" },
  { label: "图片", value: "image" },
  { label: "Excel", value: "excel" },
  { label: "Word", value: "word" },
  { label: "3MF", value: "3mf" },
  { label: "GCODE", value: "gcode" },
  { label: "其他", value: "other" }
];

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const plateInfo = ref([]);
const activeTab = ref("0");
const plateImages = ref({});

// 计算当前选中的 plate 数据
const currentPlate = computed(() => {
  return plateInfo.value[Number(activeTab.value)];
});

async function handleFileChange(_file: any, fileList: any[]) {
  // 更新文件列表
  newFormInline.value.fileList = fileList;

  // 如果有文件，更新文件名、大小和类型
  if (fileList.length > 0) {
    const lastFile = fileList[fileList.length - 1];
    newFormInline.value.filename = lastFile.name;
    newFormInline.value.fileSize = formatFileSize(lastFile.size);

    // 从文件名推断文件类型
    const fileExtension = lastFile.name.split(".").pop()?.toLowerCase();
    if (fileExtension) {
      if (["pdf"].includes(fileExtension)) {
        newFormInline.value.fileType = "pdf";
      } else if (
        ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension)
      ) {
        newFormInline.value.fileType = "image";
      } else if (["xls", "xlsx"].includes(fileExtension)) {
        newFormInline.value.fileType = "excel";
      } else if (["doc", "docx"].includes(fileExtension)) {
        newFormInline.value.fileType = "word";
      } else if (["3mf"].includes(fileExtension)) {
        newFormInline.value.fileType = "3mf";
      } else if (["gcode"].includes(fileExtension)) {
        newFormInline.value.fileType = "gcode";
      } else {
        newFormInline.value.fileType = "other";
      }
    }

    // 解析文件
    await parseFile(lastFile.raw);
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

async function parseFile(file: File | undefined) {
  if (!file) return;

  const fileExtension = file.name.split(".").pop()?.toLowerCase();

  if (fileExtension === "3mf" || fileExtension === "zip") {
    // 解析3MF或ZIP文件
    try {
      const zip = new JSZip();
      const content = await zip.loadAsync(file);

      console.log("ZIP文件内容:", Object.keys(content.files));

      // 遍历ZIP文件中的所有文件
      for (const fileName in content.files) {
        if (!content.files[fileName].dir) {
          console.log("文件名:", fileName);

          // 检查是否是 slice_info.config 文件
          if (fileName.includes("Metadata/slice_info.config")) {
            const fileContent = await content.files[fileName].async("text");
            console.log("slice_info.config 文件内容:", fileContent);
            // 解析XML内容
            parseSliceInfoConfig(fileContent);
          }
          // 检查是否是 Metadata 目录下的 plate_*.png 图片
          else if (fileName.match(/Metadata\/plate_\d+\.png/)) {
            const plateNumber = fileName.match(/plate_(\d+)\.png/)[1];
            const fileContent = await content.files[fileName].async("base64");
            const imageUrl = `data:image/png;base64,${fileContent}`;
            plateImages.value[plateNumber] = imageUrl;
            console.log(`分盘 ${plateNumber} 图片已加载`);
          }
          // 读取XML文件
          else if (fileName.endsWith(".xml") || fileName.endsWith(".rels")) {
            const fileContent = await content.files[fileName].async("text");
            console.log("XML文件内容:", fileContent);
          }
          // 读取其他图片文件
          else if (fileName.endsWith(".png") || fileName.endsWith(".jpg")) {
            const fileContent = await content.files[fileName].async("base64");
            console.log(
              "图片文件内容（Base64）:",
              fileContent.substring(0, 100) + "..."
            );
          }
        }
      }

      console.log("ZIP文件解析完成");
    } catch (error) {
      console.error("ZIP文件解析失败:", error);
    }
  } else if (fileExtension === "gcode") {
    // 解析GCODE文件
    const reader = new FileReader();
    reader.onload = function (e) {
      const content = e.target?.result;
      console.log(
        "GCODE文件内容:",
        content?.toString().substring(0, 500) + "..."
      );

      // 检查GCODE文件中是否包含Metadata信息
      if (typeof content === "string") {
        if (content.includes("Metadata")) {
          console.log("GCODE文件中包含Metadata信息");
        }
      }
    };
    reader.readAsText(file);
  } else if (fileExtension === "config") {
    // 直接解析slice_info.config文件
    const reader = new FileReader();
    reader.onload = function (e) {
      const content = e.target?.result;
      if (typeof content === "string") {
        console.log("slice_info.config 文件内容:", content);
        parseSliceInfoConfig(content);
      }
    };
    reader.readAsText(file);
  } else {
    // 其他文件类型的解析逻辑
    const reader = new FileReader();

    reader.onload = function (e) {
      const content = e.target?.result;
      console.log("文件内容:", content);

      if (fileExtension) {
        switch (fileExtension) {
          case "txt":
          case "json":
            console.log("文本文件解析:", content);
            // 可以在这里处理文本文件
            break;
          case "csv":
            console.log("CSV文件解析:", content);
            // 可以在这里处理CSV文件
            break;
          case "pdf":
            console.log("PDF文件解析（需要专门的PDF解析库）");
            // 需要使用PDF.js等库来解析PDF
            break;
          case "jpg":
          case "jpeg":
          case "png":
            console.log("图片文件解析");
            // 可以在这里处理图片文件
            break;
          case "xls":
          case "xlsx":
            console.log("Excel文件解析（需要专门的Excel解析库）");
            // 需要使用xlsx等库来解析Excel
            break;
          case "doc":
          case "docx":
            console.log("Word文件解析（需要专门的Word解析库）");
            // 需要使用专门的库来解析Word
            break;
          default:
            console.log("未知文件类型，无法解析");
        }
      }
    };

    // 根据文件类型选择不同的读取方式
    if (["txt", "json", "csv"].includes(fileExtension)) {
      reader.readAsText(file);
    } else if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  }
}

function parseSliceInfoConfig(xmlContent: string) {
  // 解析slice_info.config XML文件
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

    // 提取header信息
    const headerItems = xmlDoc.querySelectorAll("header header_item");
    const headerInfo = {};
    headerItems.forEach(item => {
      const key = item.getAttribute("key");
      const value = item.getAttribute("value");
      if (key && value) {
        headerInfo[key] = value;
      }
    });
    console.log("Header信息:", headerInfo);

    // 提取plate信息
    const plates = xmlDoc.querySelectorAll("plate");
    const platesData = [];

    plates.forEach((plate, index) => {
      const metadataItems = plate.querySelectorAll("metadata");
      const metadata = {};
      metadataItems.forEach(item => {
        const key = item.getAttribute("key");
        const value = item.getAttribute("value");
        if (key && value) {
          metadata[key] = value;
        }
      });

      // 提取object信息
      const objects = [];
      const objectElements = plate.querySelectorAll("object");
      objectElements.forEach(obj => {
        objects.push({
          identify_id: obj.getAttribute("identify_id"),
          name: obj.getAttribute("name"),
          skipped: obj.getAttribute("skipped") === "true"
        });
      });

      // 提取filament信息
      const filaments = [];
      const filamentElements = plate.querySelectorAll("filament");
      filamentElements.forEach(filament => {
        filaments.push({
          id: filament.getAttribute("id"),
          tray_info_idx: filament.getAttribute("tray_info_idx"),
          type: filament.getAttribute("type"),
          color: filament.getAttribute("color"),
          used_m: filament.getAttribute("used_m"),
          used_g: filament.getAttribute("used_g")
        });
      });

      // 提取warning信息
      const warnings = [];
      const warningElements = plate.querySelectorAll("warning");
      warningElements.forEach(warning => {
        warnings.push({
          msg: warning.getAttribute("msg"),
          level: warning.getAttribute("level"),
          error_code: warning.getAttribute("error_code")
        });
      });

      platesData.push({
        index: index + 1,
        metadata,
        objects,
        filaments,
        warnings
      });
    });

    // 更新plateInfo响应式变量
    plateInfo.value = platesData;
    console.log("分盘信息:", platesData);

    // 如果有分盘数据，默认选中第一个
    if (platesData.length > 0) {
      activeTab.value = "0";
    }

    // 计算总打印时间和总耗材使用量
    let totalTime = 0;
    let totalWeight = 0;

    platesData.forEach(plate => {
      const prediction = parseFloat(plate.metadata.prediction || "0");
      const weight = parseFloat(plate.metadata.weight || "0");
      totalTime += prediction;
      totalWeight += weight;
    });

    console.log("总打印时间:", totalTime, "秒");
    console.log("总耗材使用量:", totalWeight, "克");
  } catch (error) {
    console.error("解析slice_info.config失败:", error);
  }
}

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
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
            multiple
            action="#"
            class="w-full"
            :auto-upload="false"
            :on-change="handleFileChange"
          >
            <div class="el-upload__text">
              <UploadIcon class="m-auto mb-2" />
              可点击或拖拽上传
            </div>
          </el-upload>
        </el-form-item>
      </re-col>

      <!-- 分盘信息 -->
      <re-col v-if="plateInfo.length > 0" :value="24" :xs="24" :sm="24">
        <el-form-item label="分盘信息">
          <div class="segmented-container mb-4">
            <el-segmented
              v-model="activeTab"
              :options="
                plateInfo.map(plate => ({
                  label: `分盘 ${plate.index}`,
                  value: (plate.index - 1).toString()
                }))
              "
            />
          </div>
        </el-form-item>

        <div v-if="plateInfo[Number(activeTab)]" class="plate-info">
          <el-form-item label="">
            <!-- 耗材信息 -->
            <div
              v-if="currentPlate?.filaments?.length > 0"
              class="info-section"
            >
              <el-table
                :data="currentPlate?.filaments || []"
                size="small"
                showOverflowTooltip
                style="width: 100%"
              >
                <el-table-column prop="type" label="类型" width="100" />
                <el-table-column prop="color" label="颜色" width="100">
                  <template #default="scope">
                    <div
                      class="color-block"
                      :style="{ backgroundColor: scope.row.color }"
                    />
                  </template>
                </el-table-column>
                <el-table-column prop="used_g" label="使用量(g)" width="100" />
                <el-table-column label="预览图片">
                  <template #default="">
                    <el-image
                      v-if="currentPlate && plateImages[currentPlate.index]"
                      :src="plateImages[currentPlate.index]"
                      :preview-src-list="[plateImages[currentPlate.index]]"
                      preview-teleported
                      loading="lazy"
                      fit="cover"
                      class="table-image"
                    />
                    <span v-else>无</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
        </div>
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
          <el-input v-model="newFormInline.fileSize" readonly class="w-full" />
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
    </el-row>
  </el-form>
</template>

<style scoped>
.plate-info {
  margin-top: 10px;
}

.info-section {
  margin-bottom: 20px;
}

.info-section h4 {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.color-block {
  width: 20px;
  height: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.preview-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 200px;
  overflow: hidden;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.plate-preview-img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
}

.table-image {
  width: 80px;
  height: 80px;
  cursor: pointer;
}

:deep(.el-image-viewer) {
  z-index: 20000;
}

:deep(.el-table__row:last-child .el-table__cell) {
  border-bottom: none;
}

:deep(.el-table) {
  border-bottom: none;
}

.segmented-container {
  overflow-x: auto;
  white-space: nowrap;
}

.segmented-container :deep(.el-segmented) {
  min-width: 100%;
}
</style>
