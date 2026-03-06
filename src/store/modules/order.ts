import { defineStore } from "pinia";
import { store } from "@/store";

export const useOrderStore = defineStore("order", {
  state: () => ({
    shouldCreateOrder: false
  }),
  getters: {
    getShouldCreateOrder(state) {
      return state.shouldCreateOrder;
    }
  },
  actions: {
    setShouldCreateOrder(value: boolean) {
      this.shouldCreateOrder = value;
    },
    resetShouldCreateOrder() {
      this.shouldCreateOrder = false;
    }
  }
});

export function useOrderStoreHook() {
  return useOrderStore(store);
}
