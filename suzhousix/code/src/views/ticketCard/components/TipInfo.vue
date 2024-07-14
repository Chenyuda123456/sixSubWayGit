<template>
  <div class="hint-box p-30 pt-24 m-auto">
    <div class="flex justify-between items-center pb-24 text-blue">
      <span class="text-lg font-bold">{{ $t('ReminderInformation') }}</span>
      <span class="text-[28px]">{{
        isPaymentArea ? $t('PaidArea') : $t('NonPaidArea')
      }}</span>
    </div>
    <div
      class="h-[460px] bg-white rounded-[30px] flex flex-wrap items-center justify-center"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
const store = useStore();
const isPaymentArea = computed(() => store.getters.getIsPaymentArea);
</script>

<style scoped></style>
