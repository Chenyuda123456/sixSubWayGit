<template>
  <div
    class="stepPayresult display-flex-center van-row--align-center px-[40px]"
  >
    <!--找零-->
    <div v-if="false" class="display-flex-center van-row--align-center">
      <img src="@/assets/loading.gif" />
      <div class="text-box">
        <div>{{ $t('RefundInProgress') }}</div>
        <div>
          {{
            $t('PleaseUseTheChangeSlotBelowToRetrieveTheCashYouHaveAlreadyPaid')
          }}
        </div>
      </div>
    </div>
    <!--支付结果-->
    <div v-if="cardResult.sts == 204">
      <div class="display-flex-center van-row--align-center">
        <img class="icon-loading" src="@/assets/loading.gif" />
        <div class="text-box">
          <div v-if="cardResult.processInfo.amount">
            {{ $t('paysuccess') }}
          </div>
          <div class="w-[580px]">{{ $t('WritingCard') }}</div>
        </div>
      </div>
    </div>
    <div v-if="cardResult.sts == 999 && cardResult.substs == 256">
      <div class="display-flex-center van-row--align-center">
        <img src="@/assets/icon_recharge_success.png" />
        <div class="text-box">
          <div>{{ $t('RechargedSuccessfully') }}</div>
          <div>{{ $t('PleaseTakeYourTicketCard') }}</div>
        </div>
      </div>
      <div
        v-show="
          cardResult.qrPicInfo &&
          cardResult.paymentType == payMethods['cashMethod']
        "
      >
        <div class="text-[28px] my-[40px]">
          {{
            $t(
              'PleaseScanTheCodeToIssueTheTicketAsSoonAsPossibleAndCloseTheDisplayInterfacePromptlyAfterTheScanIsCompleted'
            )
          }}
        </div>
        <img
          class="qr w-[200px] h-[200px]"
          style="margin: 0"
          :src="'data:image/png;base64,' + cardResult.qrPicInfo"
        />
      </div>

      <!--不知道是否需要打印凭据 暂留-->
      <!--      <div class="flex justify-center items-center mt-80">
        <button
          class="w-[320px] h-[88px] leading-88 bg-update text-white text-lg text-center xl:rounded-[12px] rounded-[20px] mr-40"
          @click="isShowWarning = true"
        >
          {{ $t('ElectronicInvoice') }}
        </button>
        <button
          class="w-[320px] h-[88px] leading-88 bg-[#EDF3FF] text-blue font-medium text-center xl:rounded-[12px] rounded-[20px] border-[3px] border-blue text-lg mr-40"
        >
          {{ $t('PrintReceipt') }}
        </button>
      </div>-->
    </div>
    <!--    <div class="hint">
      <img src="@/assets/icon_tips.png" />
      <div class="hint-text">{{ $t('dontmove') }}</div>
    </div>-->
    <!-- 打印发票对话框-->
    <van-dialog
      v-model:show="isShowWarning"
      :show-confirm-button="false"
      width="944"
      class-name="dialog-warning"
      overlay-class="overlay"
    >
      <div class="flex justify-center items-center mt-[79px]">
        <span class="text-blue text-base pl-30">{{
          $t('ToIssueAnElectronicInvoicePleaseScanTheQRCodeBelow')
        }}</span>
      </div>
      <img
        src="@/assets/qr.png"
        alt=""
        style="margin: auto; margin-top: 76px; margin-bottom: 124px"
        class="w-[120px]"
      />
      <div>
        <button
          class="w-[280px] h-[88px] leading-88 bg-update text-white text-lg text-center rounded-[88px] mb-[60px]"
          @click="isShowWarning = false"
        >
          {{ $t('Close') }}
        </button>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { Dialog } from 'vant';
import 'vant/es/dialog/style/index.js';
import { computed, ref, reactive, watch, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
const VanDialog = Dialog.Component;
const router = useRouter();
const store = useStore();
const cardResult = computed(() => store.state.card.cardResult);
const isShowWarning = ref(false);
</script>
<style lang="scss" scoped>
.bg-update {
  background: linear-gradient(360deg, #5687fc 0%, #6f99ff 100%);
  box-shadow: 0px 4px 5px 0px rgba(86, 135, 252, 0.4);
}
.stepPayresult {
  position: relative;
  text-align: center;
  margin: auto;
  width: 1080px;
  height: 758px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.1);
  border-radius: 30px;
  margin-top: 36px;

  .icon-loading {
    position: absolute;
    visibility: hidden;
    z-index: 1;
    animation-name: ani1;
    animation-iteration-count: 1;
    animation-duration: 0s;
    animation-delay: 2s;
    animation-fill-mode: forwards;
  }

  .icon-success {
    z-index: 2;
    position: relative;
    animation-iteration-count: 1;
    animation-name: ani2;
    animation-duration: 0s;
    animation-delay: 2s;
    animation-fill-mode: forwards;
  }

  img {
    width: 200px;
    margin-right: 80px;
  }

  .text-box {
    text-align: left;

    :nth-child(1) {
      font-size: 44px;
      font-weight: bold;
      color: #4868c1;
      line-height: 44px;
    }

    :nth-child(2) {
      font-size: 30px;
      font-weight: 400;
      color: rgba(51, 51, 51, 0.6);
      line-height: 30px;
      margin-top: 30px;
    }
  }
}

.hint {
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  bottom: 62px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 26px;
  font-weight: 400;
  color: #e8730b;
  line-height: 26px;

  img {
    width: 30px;
    height: 30px;
    margin-right: 16px;
  }
}
@media screen and (max-width: 1180px) {
  .stepPayresult {
    width: 1028px;
    margin-top: 288px;
  }
}

@keyframes ani1 {
  0% {
    z-index: 1;
  }
  100% {
    z-index: 2;
    position: relative;
    visibility: visible;
  }
}

@keyframes ani2 {
  0% {
    z-index: 2;
  }
  100% {
    z-index: -1;
    position: absolute;
    visibility: hidden;
  }
}
</style>
