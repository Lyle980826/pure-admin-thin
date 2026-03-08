<script setup lang="ts">
import { PureDescriptions } from "@pureadmin/descriptions";
import { ref, onMounted } from "vue";

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
});

const columns = ref([
  { label: "客户名称", prop: "customer" },
  {
    label: "订单类型",
    prop: "orderType",
    formatter: (val: string) => (val === "custom" ? "定制" : "代打")
  },
  { label: "订单金额", prop: "amount" },
  { label: "订单状态", prop: "status" },
  { label: "配送方式", prop: "shippingMethod" },
  { label: "付款方式", prop: "paymentMethod" },
  { label: "联系电话", prop: "phone" },
  { label: "收货地址", prop: "address" },
  {
    label: "创建时间",
    prop: "createTime",
    formatter: (val: string) => new Date(val).toLocaleString()
  },
  { label: "备注", prop: "remark" }
]);
</script>

<template>
  <div>
    <el-scrollbar>
      <!-- 订单基本信息 -->
      <PureDescriptions border :data="data" :columns="columns" :column="5" />
    </el-scrollbar>
  </div>
</template>

<style scoped>
/* 可以保留一些基础样式 */
</style>
