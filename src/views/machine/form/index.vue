<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    name: "",
    model: "",
    status: "正常",
    location: "",
    purchaseDate: "",
    maintenanceDate: "",
    remark: ""
  })
});

const emit = defineEmits(["update:formInline"]);

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

function handleSubmit() {
  if (!ruleFormRef.value) return;
  ruleFormRef.value.validate(valid => {
    if (valid) {
      emit("update:formInline", newFormInline.value);
    }
  });
}

const statusOptions = [
  { label: "正常", value: "正常" },
  { label: "维护中", value: "维护中" },
  { label: "故障", value: "故障" },
  { label: "闲置", value: "闲置" }
];
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
        <el-form-item label="机器名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入机器名称"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="机器型号" prop="model">
          <el-input
            v-model="newFormInline.model"
            clearable
            placeholder="请输入机器型号"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="机器状态" prop="status">
          <el-select
            v-model="newFormInline.status"
            placeholder="请选择机器状态"
            class="w-full"
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
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="机器位置" prop="location">
          <el-input
            v-model="newFormInline.location"
            clearable
            placeholder="请输入机器位置"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="购买日期">
          <el-date-picker
            v-model="newFormInline.purchaseDate"
            type="date"
            placeholder="选择购买日期"
            class="w-full"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="维护日期">
          <el-date-picker
            v-model="newFormInline.maintenanceDate"
            type="date"
            placeholder="选择维护日期"
            class="w-full"
          />
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
