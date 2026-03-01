<script setup lang="tsx">
import { ref } from "vue";
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
</script>

<template>
  <div>
    <el-scrollbar>
      <PureDescriptions border :data="data" :columns="columns" :column="5" />
    </el-scrollbar>
  </div>
</template>
