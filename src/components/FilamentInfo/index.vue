<script setup lang="ts">
import { computed } from "vue";

interface Props {
  filamentType?: string;
  filamentColor?: string;
  plateWeight?: number | string;
  type?: string;
  color?: string;
  usedG?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  filamentType: "",
  filamentColor: "",
  plateWeight: 0,
  type: "",
  color: "",
  usedG: 0
});

const colorMap: Record<string, string> = {
  红色: "#F56C6C",
  蓝色: "#409EFF",
  白色: "#FFFFFF",
  绿色: "#67C23A",
  黄色: "#E6A23C",
  黑色: "#303133",
  紫色: "#909399",
  橙色: "#F57C00"
};

const displayType = computed(() => props.filamentType || props.type || "未知");
const displayColor = computed(() => {
  const color = props.filamentColor || props.color;
  if (!color) return "#909399";
  if (color.startsWith("#")) return color;
  return colorMap[color] || "#909399";
});
const displayWeight = computed(() => {
  const weight = props.plateWeight || props.usedG;
  const num = typeof weight === "string" ? parseFloat(weight) : weight;
  return isNaN(num) ? 0 : num;
});
</script>

<template>
  <div class="flex items-center px-3 py-1 bg-white">
    <div
      class="w-5 h-5 mr-2 border border-gray-300 rounded shrink-0"
      :style="{ backgroundColor: displayColor }"
    />
    <span class="text-sm text-gray-800">
      {{ displayType }} {{ displayWeight.toFixed(2) }}g
    </span>
  </div>
</template>
