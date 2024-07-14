<template>
  <div class="flex justify-center">
    <div class="flex items-center xl:mt-[60px] mt-[156px]">
      <div
        v-for="(item, index) in updateStepList"
        :key="index"
        class="step-item text-lg text-blue text-center xl:leading-[88px] leading-[93px]"
        :class="stepIndex === index && 'active'"
      >
        {{ item }}
      </div>
    </div>
  </div>

  <!--票卡核验失败-->
  <!--  <div v-if="false" class="flex flex-col items-center mt-80">-->
  <!--    <img src="@/assets/img_recycle_error.png" alt="" class="block w-[600px]" />-->
  <!--    <div class="text-blue text-lg font-bold mt-60">-->
  <!--      车票核验失败信息异常提示，如需帮助可呼叫客服-->
  <!--    </div>-->
  <!--  </div>-->
  <div class="flex flex-col items-center xl:mt-[80px] mt-[180px]">
    <!-- 回收车票 -->
    <template v-if="stepIndex === 0">
      <div v-if="!cardResult.processInfo.shouldRefund">
        <img
          src="@/assets/img_recycle_1@2x.png"
          alt=""
          class="block w-[600px] m-auto"
        />
        <div
          class="text-blue text-center text-lg font-bold xl:mt-[60px] mt-[80px]"
        >
          {{ $t('PleasePutTheTicketIntoTheVotingSlotBelowTheEquipment') }}
        </div>
      </div>
      <div v-else class="text-center">
        <img src="@/assets/img_recycle.gif" alt="" class="w-[300px]" />
        <div
          class="text-lg text-center font-bold xl:mt-[60px] mt-[80px] xl:mt-[40px]"
        >
          {{ $t('ShouldBeReturned') }}
          <span class="text-blue">
            &nbsp;{{ cardResult.processInfo.shouldRefund / 100
            }}{{ $t('yuan') }}
          </span>
        </div>
        <div class="flex justify-center mt-[80px] xl:mt-[30px]">
          <button
            class="xl:w-[320px] w-[480px] h-[88px] leading-88 bg-update text-white text-lg text-center xl:rounded-[12px] rounded-[20px]"
            @click="confirmRefund"
          >
            {{ $t('OK') }}
          </button>
        </div>
      </div>
    </template>
    <!-- 退款-->
    <div v-else class="text-center">
      <!-- 退款loading-->
      <div v-if="data.refunding">
        <img src="@/assets/loading.gif" alt="" class="w-[300px]" />
        <div class="text-blue text-base mt-24">
          {{ $t('RefundInProgress') }}
        </div>
      </div>
      <div v-else>
        <div>
          <img src="@/assets/img_submitted.png" alt="" class="w-[300px]" />
          <div class="text-blue text-base mt-24">
            {{ $t('ThisServiceIsOverThankYouForYourCooperation') }}
          </div>
          <div class="text-blue text-base mt-24">
            {{
              $t(
                'TheRefundHasBeenCompletedPleaseTakeTheCashFromTheChangeSlotBelow'
              )
            }}
          </div>
        </div>
      </div>
    </div>
    <!-- 车票回收成功 不需要了
    <template v-if="stepIndex === 1">
      <div v-if="true">
        <img src="@/assets/img_recycle.gif" alt="" class="block w-[300px]" />
        <div
          class="text-blue text-lg text-center font-bold xl:mt-[60px] mt-[80px]"
        >
          车票回收成功
        </div>
      </div>

       车票核验中 不需要了
      <div v-if="false">
        <img src="@/assets/img_checking.gif" alt="" class="block w-[300px]" />
        <div
          class="text-blue text-lg text-center font-bold xl:mt-[60px] mt-[80px]"
        >
          车票核验中，请稍候...
        </div>
      </div>
    </template>-->

    <!-- 发售出站票 -->
    <!--    <template v-if="stepIndex === 2">
      <div v-if="false">
        <img src="@/assets/img_submitted.png" alt="" class="block w-[300px]" />
        <div class="text-blue text-lg font-bold xl:mt-[60px] mt-[80px]">
          已提交退款申请
        </div>
        <div class="text-blue text-xs mt-24">
          现金支付请在下方找零口取走现金，在线支付预计将在1-2个工作日内退还原账户
        </div>
      </div>

      <div class="flex flex-col items-center">
        <img src="@/assets/img_refund.png" alt="" class="block w-[300px]" />
        <div class="text-blue text-lg font-bold xl:mt-[60px] mt-[80px]">
          退票完成，请问是否需要打印凭据？
        </div>
        <button
          class="xl:w-[320px] w-[480px] h-[88px] leading-88 bg-update text-white text-lg text-center xl:rounded-[12px] rounded-[20px] mt-30"
        >
          打印凭据
        </button>
      </div>
    </template>-->
    <!-- 取票出站 -->
    <!-- <template v-if="stepIndex === 3">
      <div class="flex flex-col items-center">
        <img src="@/assets/img_print_done.png" alt="" class="block w-[300px]" />
        <div class="text-blue text-lg font-bold xl:mt-[60px] mt-[80px]">
          单据打印完成
        </div>
        <div class="text-blue text-xs mt-24">
          请在设备凭条出口取走您的小单，本次服务结束，感谢您的配合
        </div>
      </div>
      <div class="text-base text-gray text-opacity-60 mt-30">
        <span class="text-blue">{{ data.timeSeconds }}s</span>自动返回首页
      </div>
    </template>-->
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch, onUnmounted, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const updateStepList = [t('RecyclingTickets'), t('Refund')];
const stepIndex = ref(0);
const router = useRouter();
const store = useStore();
const cardResult = computed(() => store.state.card.cardResult);
const data = reactive({
  refunding: true
});
watch(
  cardResult,
  newValue => {
    if (newValue.sts == 999 && newValue.substs == 256) {
      if (newValue.errorList && newValue.errorList.length) {
        console.log('退票失败');
      } else {
        data.refunding = false;
      }
    }
  },
  { deep: true }
);

const confirmRefund = () => {
  stepIndex.value = 1;
  window?.bridge?.triggerProcessCardBusiness(
    JSON.stringify({
      api: 'ProcessCardBusiness',
      param: {
        processType: 'RefundCard',
        isConfirm: true
      }
    })
  );
};
</script>
<style scoped lang="scss">
@media screen and (min-width: 1180px) {
  .bg-update {
    background: linear-gradient(360deg, #5687fc 0%, #6f99ff 100%);
    box-shadow: 0px 4px 5px 0px rgba(86, 135, 252, 0.4);
  }
  .step-item {
    width: 808px;
    height: 96px;
    background: url('/src/assets/steps_progress2.png') no-repeat center;
    background-size: 100%;
    &.active {
      background-image: url('/src/assets/steps_active2.png');
      @apply text-white;
    }
  }
}

@media screen and (max-width: 1180px) {
  .bg-update {
    background: linear-gradient(360deg, #5687fc 0%, #6f99ff 100%);
    box-shadow: 0px 4px 5px 0px rgba(86, 135, 252, 0.4);
  }
  .step-item {
    width: 500px;
    height: 100px;
    background: url('/src/assets/steps_progress2@2x.png') no-repeat center;
    background-size: 100%;
    &.active {
      background-image: url('/src/assets/steps_active2@2x.png');
      @apply text-white;
    }
  }
}
</style>
