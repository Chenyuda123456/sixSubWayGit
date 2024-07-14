<template>
  <div style="text-align: center">
    <div class="text-2xl font-bold text-blue mt-[288px] xl:mt-[20px]">
      {{ $t('PleasePlaceYourTicketOnTheCardReader') }}
    </div>
    <img
      src="@/assets/img_card@2x.png"
      alt=""
      class="block m-auto mt-[120px] xl:mt-[80px] xl:w-[600px] w-[760px]"
    />
    <div class="color-gray text-base text-gray mt-40 text-opacity-60">
      {{ $t('ReadingCard') }}
    </div>
    <div class="mt-60 text-blue text-base">
      {{ $t('PleaseDoNotMoveYourCardFromTheCardReadingArea') }}
    </div>
  </div>

  <div class="dialog">
    <van-dialog
      v-model:show="isShowWarning"
      width="944"
      class-name="dialog-warning"
      overlay-class="overlay"
    >
      <div class="flex justify-between items-center text-blue px-30 py-24">
        <span class="text-lg font-bold">{{ $t('ReminderInformation') }}</span>
        <span class="text-[28px]">{{ $t('OutboundEnd') }}}</span>
      </div>
      <!-- 无需更新 -->
      <div class="text-base text-gray text-center mt-[129px] mb-[205px]">
        {{ $t('ReminderExitTicket') }}
      </div>
      <div class="text-center text-base text-gray text-opacity-60 pb-30">
        <span class="text-blue">5s</span>{{ $t('returnToHomepage') }}
      </div>

      <!-- 无法使用1 -->
      <!--      <div class="flex justify-center items-center mt-[79px]">
        <img src="@/assets/icons/icon_error3@2x.png" alt="" class="w-[120px]" />
        <span class="text-orange text-base pl-30"
          >该票卡无法在苏州轨道交通使用，请付费出站。</span
        >
      </div>
      <div class="flex justify-center items-center mt-[103px] pb-60">
        <button class="btn btn-cancel mr-40">取消（10s）</button>
        <button class="btn btn-bp">{{ $t('StartCompensationFare')}}</button>
      </div>-->
    </van-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed, watch, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

import { Dialog } from 'vant';
import 'vant/es/dialog/style/index.js';
import { useStore } from 'vuex';
const store = useStore();
const VanDialog = Dialog.Component;
const isShowWarning = ref(false);
const data = reactive({
  backTimer: null
});
const cardResult = computed(() => store.state.card.cardResult);
watch(
  cardResult,
  newValue => {
    if (newValue.sts == 999 && newValue.substs == 256) {
      if (newValue.errorList && newValue.errorList.length) {
        // 更新失败或者读卡错误
      } else {
        router.push('console');
      }
    }
  },
  { deep: true }
);

onMounted(() => {
  store.commit('setCardUpdate', {
    mediumType: 0
  });
  // 查询卡
  window?.bridge?.triggerProcessCardBusiness(
    JSON.stringify({
      api: 'ProcessCardBusiness',
      param: {
        processType: 'QueryCard',
        mediumType: 0,
        isConfirm: false
      }
    })
  );
  // data.backTimer = setTimeout(() => {
  //   router.push({
  //     name: 'console'
  //   });
  // }, 2000);
});
onUnmounted(() => {
  data.backTimer && clearTimeout(data.backTimer);
});
</script>

<style lang="scss" scoped>
.btn {
  width: 332px;
  height: 88px;
  background: #fcfcfc;
  border-radius: 44px;
  line-height: 88px;
  @apply text-center text-lg;
  &.btn-cancel {
    border: 3px solid #85a9ff;
    @apply text-blue;
  }
  &.btn-bp {
    background: linear-gradient(360deg, #5687fc 0%, #6f99ff 100%);
    box-shadow: 0px 4px 5px 0px rgba(86, 135, 252, 0.4);
    @apply text-white;
  }
}
</style>
