<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";

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

const fileOptions = [
  { label: "文档1.pdf", value: "1" },
  { label: "图片1.jpg", value: "2" },
  { label: "表格1.xlsx", value: "3" }
];

const shippingMethods = [
  { label: "快递", value: "快递" },
  { label: "自提", value: "自提" }
];

const statusOptions = [
  { label: "已付款", value: "已付款" },
  { label: "处理中", value: "处理中" },
  { label: "待确认", value: "待确认" },
  { label: "生产中", value: "生产中" },
  { label: "已完成", value: "已完成" },
  { label: "已取消", value: "已取消" }
];

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

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
            <el-option label="定制订单" value="custom" />
            <el-option label="代打订单" value="print" />
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
