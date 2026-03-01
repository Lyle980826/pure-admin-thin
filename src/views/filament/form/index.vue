<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    name: "",
    type: "PLA",
    color: "#FFFFFF",
    manufacturer: "",
    weight: "1000",
    price: "",
    stock: 0,
    location: "",
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

const typeOptions = [
  { label: "PLA", value: "PLA" },
  { label: "ABS", value: "ABS" },
  { label: "PETG", value: "PETG" },
  { label: "TPU", value: "TPU" },
  { label: "其他", value: "其他" }
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
        <el-form-item label="耗材名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入耗材名称"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="耗材类型" prop="type">
          <el-select
            v-model="newFormInline.type"
            placeholder="请选择耗材类型"
            class="w-full"
          >
            <el-option
              v-for="(item, index) in typeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="耗材颜色" prop="color">
          <el-color-picker v-model="newFormInline.color" show-alpha />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="制造商">
          <el-input
            v-model="newFormInline.manufacturer"
            clearable
            placeholder="请输入制造商"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="重量(g)" prop="weight">
          <el-input
            v-model="newFormInline.weight"
            clearable
            placeholder="请输入重量"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="价格">
          <el-input
            v-model="newFormInline.price"
            clearable
            placeholder="请输入价格"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="库存数量" prop="stock">
          <el-input
            v-model.number="newFormInline.stock"
            clearable
            placeholder="请输入库存数量"
            type="number"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="存放位置" prop="location">
          <el-input
            v-model="newFormInline.location"
            clearable
            placeholder="请输入存放位置"
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
