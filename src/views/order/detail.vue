<script setup lang="tsx">
import { ref, computed, onMounted } from "vue";
import { PureDescriptions } from "@pureadmin/descriptions";

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
});

const columns = [
  {
    label: "订单ID",
    prop: "id"
  },
  {
    label: "客户名称",
    prop: "customer"
  },
  {
    label: "订单类型",
    prop: "orderType",
    formatter: value => (value === "custom" ? "定制订单" : "代打订单")
  },
  {
    label: "订单金额",
    prop: "amount"
  },
  {
    label: "订单状态",
    prop: "status"
  },
  {
    label: "创建时间",
    prop: "createTime"
  },
  {
    label: "配送方式",
    prop: "shippingMethod"
  },
  {
    label: "订单备注",
    prop: "remark"
  }
];

// 模拟分盘信息数据
const plateInfo = ref([]);
const activeTab = ref("0");
const plateImages = ref({});

// 计算当前选中的 plate 数据
const currentPlate = computed(() => {
  return plateInfo.value[Number(activeTab.value)];
});

// 模拟获取分盘信息
function fetchPlateInfo() {
  // 模拟API调用获取分盘信息
  setTimeout(() => {
    plateInfo.value = [
      {
        index: 1,
        metadata: {
          prediction: "3600",
          weight: "150",
          size: "100x100x100"
        },
        objects: [
          {
            identify_id: "obj1",
            name: "零件1",
            skipped: false
          },
          {
            identify_id: "obj2",
            name: "零件2",
            skipped: false
          }
        ],
        filaments: [
          {
            id: "fil1",
            tray_info_idx: "1",
            type: "PLA",
            color: "#FF0000",
            used_m: "1.5",
            used_g: "50"
          },
          {
            id: "fil2",
            tray_info_idx: "2",
            type: "ABS",
            color: "#0000FF",
            used_m: "1.2",
            used_g: "40"
          }
        ],
        warnings: []
      },
      {
        index: 2,
        metadata: {
          prediction: "2400",
          weight: "100",
          size: "80x80x80"
        },
        objects: [
          {
            identify_id: "obj3",
            name: "零件3",
            skipped: false
          }
        ],
        filaments: [
          {
            id: "fil3",
            tray_info_idx: "3",
            type: "PLA",
            color: "#00FF00",
            used_m: "0.8",
            used_g: "30"
          }
        ],
        warnings: []
      }
    ];

    // 模拟分盘图片
    plateImages.value = {
      1: "https://via.placeholder.com/200x200?text=Plate+1",
      2: "https://via.placeholder.com/200x200?text=Plate+2"
    };
  }, 500);
}

onMounted(() => {
  fetchPlateInfo();
});
</script>

<template>
  <div>
    <el-scrollbar>
      <!-- 订单基本信息 -->
      <PureDescriptions border :data="data" :columns="columns" :column="5" />

      <!-- 分盘信息 -->
      <div v-if="plateInfo.length > 0" class="plate-info-section mt-4">
        <h3 class="text-lg font-bold mb-3">分盘信息</h3>

        <!-- 分盘切换 -->
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

        <!-- 分盘详情 -->
        <div v-if="plateInfo[Number(activeTab)]" class="plate-details">
          <!-- 分盘基本信息 -->
          <div class="plate-basic-info mb-4">
            <h4 class="section-title">
              {{ currentPlate?.name || `分盘 ${currentPlate?.index}` }} 信息
            </h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">分盘编号:</span>
                <span class="info-value">{{ currentPlate?.index }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">预计打印时间:</span>
                <span class="info-value">{{
                  currentPlate?.metadata.prediction
                    ? (
                        parseFloat(currentPlate.metadata.prediction) / 60
                      ).toFixed(1) + " 分钟"
                    : "--"
                }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">总耗材用量:</span>
                <span class="info-value"
                  >{{
                    currentPlate?.totalFilamentWeight
                      ? currentPlate.totalFilamentWeight.toFixed(2)
                      : currentPlate?.metadata.weight || "--"
                  }}g</span
                >
              </div>
              <div class="info-item">
                <span class="info-label">物体数量:</span>
                <span class="info-value"
                  >{{ currentPlate?.objects?.length || 0 }} 个</span
                >
              </div>
            </div>
          </div>

          <!-- 分盘预览图片 -->
          <div class="plate-preview mb-4">
            <h4 class="section-title">分盘预览</h4>
            <div class="preview-container">
              <el-image
                v-if="currentPlate && plateImages[currentPlate.index]"
                :src="plateImages[currentPlate.index]"
                :preview-src-list="[plateImages[currentPlate.index]]"
                preview-teleported
                loading="lazy"
                fit="cover"
                class="plate-image"
              />
              <div v-else class="no-preview">无预览图片</div>
            </div>
          </div>

          <!-- 分盘耗材总览 -->
          <div class="plate-summary mb-4">
            <h4 class="section-title">耗材详情</h4>
            <div class="filament-list">
              <div
                v-for="filament in currentPlate?.filaments || []"
                :key="filament.id"
                class="filament-item flex items-center gap-3"
              >
                <div
                  class="color-block"
                  :style="{ backgroundColor: filament.color }"
                />
                <div class="filament-info">
                  <div class="filament-type">{{ filament.type || "未知" }}</div>
                  <div class="filament-weight">{{ filament.used_g }}g</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 物体信息 -->
          <el-card>
            <template #header>
              <div class="card-header">
                <span>物体信息</span>
              </div>
            </template>
            <el-table
              v-if="currentPlate?.objects?.length > 0"
              :data="currentPlate?.objects || []"
              size="small"
              showOverflowTooltip
              style="width: 100%"
            >
              <el-table-column prop="name" label="物体名称" width="200" />
              <el-table-column prop="identify_id" label="物体ID" width="150" />
              <el-table-column prop="skipped" label="是否跳过" width="100">
                <template #default="scope">
                  <el-tag :type="scope.row.skipped ? 'danger' : 'success'">
                    {{ scope.row.skipped ? "是" : "否" }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
            <div v-else class="no-data">无物体信息</div>
          </el-card>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped>
.plate-info-section {
  margin-top: 20px;
}

.plate-details {
  margin-top: 20px;
}

.info-item {
  margin-bottom: 10px;
}

.info-item .label {
  margin-right: 10px;
  font-weight: bold;
}

.color-block {
  width: 20px;
  height: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.table-image {
  width: 80px;
  height: 80px;
  cursor: pointer;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.no-data {
  padding: 20px;
  color: #999;
  text-align: center;
}

.segmented-container {
  overflow-x: auto;
  white-space: nowrap;
}

.segmented-container :deep(.el-segmented) {
  min-width: 100%;
}

:deep(.el-image-viewer) {
  z-index: 20000;
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

.plate-preview {
  margin-bottom: 20px;
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

.section-title {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.plate-basic-info {
  padding: 16px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
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

.flex {
  display: flex;
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

:deep(.el-table__row:last-child .el-table__cell) {
  border-bottom: none;
}

:deep(.el-table) {
  border-bottom: none;
}
</style>
