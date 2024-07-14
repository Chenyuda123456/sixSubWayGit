<template>
  <!-- 储值卡 -->
  <div class="xl:flex justify-center items-center xl:mt-80 mt-48">
    <div class="xl:w-[915px] xl:mx-[0px] xl:mr-[30px] mx-[26px]">
      <BaseInfo></BaseInfo>
    </div>
    <TipInfo
      class="w-[auto] xl:w-[915px] mx-[26px] xl:mx-[0] xl:mt-[0] mt-[20px]"
    >
      <!--无条件更新写卡或者是免费发售出站票 -->
      <div
        v-if="
          (cardResult.sts === 204 &&
            cardResult.processInfo.adjustType === 'AdjustUncondition') ||
          (cardResult.sts === 203 &&
            cardResult.processInfo.adjustType === 'AdjustIssueFreeExitCart')
        "
      >
        <div class="flex justify-center items-center">
          <img
            src="@/assets/icons/icon_waiting.gif"
            alt=""
            class="w-[160px] mr-30"
          />
          <span class="text-blue font-bold text-lg">{{
            $t('TicketUpdateInProgressPleaseWait')
          }}</span>
        </div>
        <div
          v-if="cardResult.mediumType == 0"
          class="text-center mt-96 -align-center flex justify-center"
        >
          <i class="icon icon_tips mr-10 align-text-bottom"></i>
          <span class="text-orange text-[24px]">{{
            $t('UpdateInProgressDoNotMoveYourCard')
          }}</span>
        </div>
      </div>
      <div
        v-else-if="
          cardResult.sts === 999 &&
          cardResult.processInfo.adjustType != 'AdjustNotice'
        "
      >
        <div>
          <div
            v-if="cardResult.substs === 256"
            class="flex justify-center items-center"
          >
            <img
              src="@/assets/icon_update_success.png"
              alt=""
              class="w-[160px] mr-30"
            />
            <div>
              <span class="text-blue font-bold text-lg">{{
                cardResult.processInfo.adjustType === 'AdjustIssueFreeExitCart'
                  ? $t('CardIssuanceSuccessful')
                  : $t('paymentSuccess')
              }}</span>
              <div class="text-gray text-xs text-opacity-60">
                {{ cardResult['promptInfo' + lang] }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 更新的信息  -->
      <div v-else class="flex justify-center items-center">
        <img
          src="@/assets/icons/icon_error3@2x.png"
          alt=""
          class="w-[120px] ml-40"
        />
        <span class="text-orange text-base promptInfo pl-30 pr20">{{
          cardResult['promptInfo' + lang]
        }}</span>
      </div>
    </TipInfo>
  </div>

  <!--按钮显示部分-->
  <div class="flex justify-center items-center mt-40">
    <!--  <button
      v-cloak
      v-if="!(cardResult.sts === 999 && cardResult.substs === 256)"
      v-en="{
        fontSize: $pxToRem(32)
      }"
      class="xl:px-[20px] xl:w-[auto] w-[480px] h-[88px] leading-88 bg-[#EDF3FF] text-blue font-medium text-center xl:rounded-[12px] rounded-[20px] border-[3px] border-blue text-lg mx-20"
      @click="cancelUpdate"
    >
      {{ $t('CancelTheUpdate') }}
    </button>-->
    <!--为了方便测试跳转到补票更新用的 不用的时候请注释掉-->
    <!--    <button-->
    <!--      v-if="!(cardResult.sts === 999 && cardResult.substs === 256)"-->
    <!--      v-en="{-->
    <!--        bigScreen: {-->
    <!--          fontSize: $pxToRem(32)-->
    <!--        }-->
    <!--      }"-->
    <!--      class="xl:px-[20px] xl:w-[auto] w-[480px] h-[88px] leading-88 bg-[#EDF3FF] text-blue font-medium text-center xl:rounded-[12px] rounded-[20px] border-[3px] border-blue text-lg mx-20"-->
    <!--      @click="jumpMakeUpTicket"-->
    <!--    >-->
    <!--      {{ $t('StartCompensationFare') }}-->
    <!--    </button>-->

    <!--无条件免费更新-->
    <button
      v-if="
        cardResult.processInfo.adjustType === 'AdjustUncondition' &&
        cardResult.sts !== 999
      "
      class="xl:px-[20px] xl:w-[auto] w-[480px] h-[88px] leading-88 bg-update text-white text-lg text-center xl:rounded-[12px] rounded-[20px] xl:mx-20"
      :class="{ grayScale: data.isClick }"
      @click="handlerUpdate"
    >
      {{ $t('StartUpdate') }}
    </button>

    <button
      v-if="
        cardResult.processInfo.adjustType === 'AdjustIssueFreeExitCart' &&
        cardResult.sts !== 999
      "
      class="xl:px-[20px] xl:w-[auto] w-[480px] h-[88px] leading-88 bg-update text-white text-lg text-center xl:rounded-[12px] rounded-[20px] xl:mx-20"
      :class="{ grayScale: data.isClick }"
      @click="handlerFreeExit"
    >
      免费发卡
    </button>
    <button
      v-if="
        cardResult.processInfo.adjustType === 'AdjustEntryStation' ||
        cardResult.processInfo.adjustType === 'AdjustExitStation' ||
        cardResult.processInfo.adjustType === 'AdjustFareOverTimeTravel' ||
        cardResult.processInfo.adjustType === 'AdjustFareOverTime' ||
        cardResult.processInfo.adjustType === 'AdjustFareOverTravel'
      "
      class="xl:px-[20px] xl:w-[auto] w-[480px] h-[88px] leading-88 bg-update text-white text-lg text-center xl:rounded-[12px] rounded-[20px] xl:mx-20"
      @click="jumpMakeUpTicket"
    >
      {{ $t('StartCompensationFare') }}
    </button>
    <!--<button
      class="w-[320px] h-[88px] leading-88 bg-update text-white text-lg text-center rounded-[12px]"
    >
      开始回收
    </button>-->
  </div>
</template>

<script setup>
import { Dialog } from 'vant';
import { payMethods } from '@/views/ticketCard/enum.ts';
import { SecCounter } from '@/utils/tool';
import 'vant/es/dialog/style/index.js';
import BaseInfo from '@views/ticketCard/components/BaseInfo.vue';
import TipInfo from '@views/ticketCard/components/TipInfo.vue';
// 回收 重发 用的 页面 adjustNotice
import { computed, onUnmounted, reactive, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
const VanDialog = Dialog.Component;
const store = useStore();
const router = useRouter();
const isPaymentArea = computed(() => store.getters.getIsPaymentArea);
const cardResult = computed(() => store.state.card.cardResult);
const cardUpdate = computed(() => store.state.card.cardUpdate);
const lang = window.localStorage.getItem('lang') === 'en' ? 'En' : 'Cn';
const data = reactive({
  isClick: false
});

const jumpMakeUpTicket = () => {
  router.push({
    name: 'makeUpTicket'
  });
};
const handlerUpdate = () => {
  if (data.isClick) {
    return;
  }
  data.isClick = true;
  window?.bridge?.triggerProcessCardBusiness(
    JSON.stringify({
      api: 'ProcessCardBusiness',
      param: {
        ...cardUpdate.value,
        isConfirm: true
      }
    })
  );
};
const handlerFreeExit = () => {
  if (data.isClick) {
    return;
  }
  data.isClick = true;
  window?.bridge?.triggerProcessCardBusiness(
    JSON.stringify({
      api: 'ProcessCardBusiness',
      param: {
        ...cardUpdate.value,
        paymentType: payMethods['cashMethod'],
        isConfirm: true
      }
    })
  );
};
// const cancelUpdate = () => {
//   console.log('triggerCancelBusiness', window?.bridge?.triggerCancelBusiness);
//   window?.bridge?.triggerCancelBusiness(true, true);
// };

onUnmounted(() => {});
</script>
<style scoped lang="scss">
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

.hint-box {
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
  border-radius: 30px;
}

.bg-update {
  background: linear-gradient(360deg, #5687fc 0%, #6f99ff 100%);
  box-shadow: 0px 4px 5px 0px rgba(86, 135, 252, 0.4);
}
.promptInfo {
  width: 60%;
  white-space: normal;
  word-break: keep-all;
  overflow-wrap: break-word;
}
</style>
