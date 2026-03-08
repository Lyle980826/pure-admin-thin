<script setup lang="ts">
import { ref } from "vue";
import { usePrintSchedule } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import {
  statusOptions,
  filamentTypeOptions,
  filamentColorOptions
} from "./utils/constants";

import View from "~icons/ep/view";
import Delete from "~icons/ep/delete";
import Refresh from "~icons/ep/refresh";
import Edit from "~icons/ep/edit";
import Plus from "~icons/ep/plus";

defineOptions({
  name: "PrintSchedule"
});

const formRef = ref();
const {
  form,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  onDetail,
  openCreateDialog,
  openEditDialog,
  onDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange
} = usePrintSchedule();
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-full pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="订单名称" prop="orderName">
        <el-input
          v-model="form.orderName"
          placeholder="请输入订单名称"
          clearable
          class="w-[180px]!"
        />
      </el-form-item>
      <el-form-item label="打印状态" prop="status">
        <el-select
          v-model="form.status"
          placeholder="请选择打印状态"
          clearable
          class="w-[180px]!"
        >
          <el-option
            v-for="(item, index) in statusOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="耗材类型" prop="filamentType">
        <el-select
          v-model="form.filamentType"
          placeholder="请选择耗材类型"
          clearable
          class="w-[180px]!"
        >
          <el-option
            v-for="(item, index) in filamentTypeOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="耗材颜色" prop="filamentColor">
        <el-select
          v-model="form.filamentColor"
          placeholder="请选择耗材颜色"
          clearable
          class="w-[180px]!"
        >
          <el-option
            v-for="(item, index) in filamentColorOptions"
            :key="index"
            :value="item.value"
          >
            <div class="flex items-center">
              <div
                class="w-4 h-4 mr-2 border border-gray-300 rounded flex-shrink-0"
                :style="{ backgroundColor: item.value }"
              />
              <span>{{ item.label }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('ri:search-line')"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar title="打印计划" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(Plus)"
          @click="openCreateDialog"
        >
          新建
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :adaptiveConfig="{ offsetBottom: 108 }"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="{ ...pagination, size }"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin outline-hidden!"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(View)"
              @click="onDetail(row)"
            >
              详情
            </el-button>
            <el-button
              class="reset-margin outline-hidden!"
              link
              type="warning"
              :size="size"
              :icon="useRenderIcon(Edit)"
              @click="openEditDialog(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`是否删除打印计划${row.orderName}`"
              @confirm="onDelete(row)"
            >
              <template #reference>
                <el-button
                  class="reset-margin outline-hidden!"
                  link
                  type="danger"
                  :size="size"
                  :icon="useRenderIcon(Delete)"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
