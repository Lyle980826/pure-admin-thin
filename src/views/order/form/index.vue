<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";
import {
  orderTypeOptions,
  shippingMethods,
  statusOptions
} from "../utils/constants";
import { getFileList } from "@/api/file";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    customer: "",
    amount: "",
    orderType: "custom",
    status: "已付款",
    shippingMethod: "快递",
    remark: "",
    selectedFile: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const fileOptions = ref<any[]>([]);

// 加载文件列表
onMounted(async () => {
  try {
    const res = await getFileList();
    if (res.success) {
      fileOptions.value = res.data.list.map((file: any) => ({
        label: file.name,
        value: file.id
      }));
    }
  } catch (error) {
    console.error("获取文件列表失败:", error);
  }
});

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
    label-width="100px"
  >
    <el-row :gutter="20">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="客户名称" prop="customer">
          <el-input
            v-model="newFormInline.customer"
            clearable
            placeholder="请输入客户名称"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="订单类型" prop="orderType">
          <el-select
            v-model="newFormInline.orderType"
            placeholder="请选择订单类型"
            class="w-full"
          >
            <el-option
              v-for="(item, index) in orderTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="订单金额" prop="amount">
          <el-input
            v-model="newFormInline.amount"
            type="number"
            clearable
            placeholder="请输入订单金额"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="订单状态">
          <template v-if="newFormInline.title === '新增'">
            <el-input v-model="newFormInline.status" readonly class="w-full" />
          </template>
          <template v-else>
            <el-select
              v-model="newFormInline.status"
              placeholder="请选择订单状态"
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
          </template>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="配送方式">
          <el-select
            v-model="newFormInline.shippingMethod"
            placeholder="请选择配送方式"
            class="w-full"
            clearable
          >
            <el-option
              v-for="(item, index) in shippingMethods"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="选择文件" prop="selectedFile">
          <el-select
            v-model="newFormInline.selectedFile"
            placeholder="请选择文件"
            class="w-full"
            clearable
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
