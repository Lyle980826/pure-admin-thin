<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/rule";
import type { PrintScheduleFormProps } from "../utils/types";
import { statusOptions } from "../utils/constants";
import { getOrderList } from "@/api/order";
import { getFileList } from "@/api/file";

const props = defineProps<PrintScheduleFormProps>();

const ruleFormRef = ref();
const newFormInline = ref({
  title: "新增",
  id: undefined,
  orderId: undefined,
  orderName: "",
  customer: "",
  fileId: undefined,
  fileName: "",
  scheduledTime: "",
  status: "pending",
  remark: ""
});
const orderOptions = ref<any[]>([]);
const fileOptions = ref<any[]>([]);

watch(
  () => props.formInline,
  newVal => {
    if (newVal) {
      newFormInline.value = {
        ...newFormInline.value,
        ...newVal
      };
    }
  },
  { immediate: true, deep: true }
);

onMounted(async () => {
  try {
    const [orderRes, fileRes] = await Promise.all([
      getOrderList(),
      getFileList()
    ]);

    if (orderRes.success) {
      orderOptions.value = orderRes.data.list.map((order: any) => ({
        label: `${order.orderName} - ${order.customer}`,
        value: order.id,
        customer: order.customer,
        orderName: order.orderName
      }));
    }

    if (fileRes.success) {
      fileOptions.value = fileRes.data.list.map((file: any) => ({
        label: file.name,
        value: file.id,
        fileName: file.name
      }));
    }
  } catch (error) {
    console.error("获取数据失败:", error);
  }
});

function handleOrderChange(value: number) {
  const selected = orderOptions.value.find((o: any) => o.value === value);
  if (selected) {
    newFormInline.value.orderId = value;
    newFormInline.value.orderName = selected.orderName;
    newFormInline.value.customer = selected.customer;
  } else {
    newFormInline.value.orderId = undefined;
    newFormInline.value.orderName = "";
    newFormInline.value.customer = "";
  }
}

function handleFileChange(value: number) {
  const selected = fileOptions.value.find((f: any) => f.value === value);
  if (selected) {
    newFormInline.value.fileId = value;
    newFormInline.value.fileName = selected.fileName;
  } else {
    newFormInline.value.fileId = undefined;
    newFormInline.value.fileName = "";
  }
}

function getRef() {
  return ruleFormRef.value;
}

function getFormData() {
  return { ...newFormInline.value };
}

defineExpose({ getRef, getFormData });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="120px"
  >
    <el-row :gutter="20">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="选择订单" prop="orderName">
          <el-select
            v-model="newFormInline.orderId"
            placeholder="请选择订单"
            class="w-full"
            clearable
            @change="handleOrderChange"
          >
            <el-option
              v-for="(item, index) in orderOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="选择文件">
          <el-select
            v-model="newFormInline.fileId"
            placeholder="请选择文件"
            class="w-full"
            clearable
            @change="handleFileChange"
          >
            <el-option
              v-for="(item, index) in fileOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="计划打印时间">
          <el-date-picker
            v-model="newFormInline.scheduledTime"
            type="datetime"
            placeholder="选择日期时间（可选）"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            class="w-full"
            clearable
          />
        </el-form-item>
      </re-col>
      <re-col
        v-if="newFormInline.title === '编辑'"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="打印状态">
          <el-select
            v-model="newFormInline.status"
            placeholder="请选择打印状态"
            class="w-full"
            clearable
          >
            <el-option
              v-for="(item, index) in statusOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>
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
