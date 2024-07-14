<template>
  <div class="stepPayguide display-flex-center">
    <div>
      <div class="title">
        <span>{{ $t('ReissueAmount') }}：</span
        ><span class="price"
          >{{ cardResult.processInfo.amount / 100 }}{{ $t('yuan') }}</span
        >
      </div>
      <div
        v-if="paymentType == 'QRCodeMethod' || paymentType == 'numberMethod'"
        class="qrCode-box"
      >
        <div class="qrImgBox display-flex-center -align-center">
          <img
            v-if="cardResult.qrInfo"
            :src="'data:image/png;base64,' + cardResult.qrInfo"
            class="qr"
          />
          <img v-else src="@/assets/loading.gif" />
        </div>
        <div
          v-if="paymentType == 'QRCodeMethod'"
          class="display-flex-center payWay"
        >
          <img src="@/assets/ico_alipay.png" />
          <img src="@/assets/icon_wechat.png" />
        </div>
        <!--数字人民币-->
        <!--数字人民币-->
        <div
          v-if="paymentType == 'numberMethod'"
          class="payWay display-flex-center"
        >
          <img src="@/assets/ico_cny2.png" />
        </div>
        <div class="prompt">{{ $t('scancodeforpay') }}</div>
      </div>
      <!--现金-->
      <div v-if="paymentType == 'cashMethod'" class="cash-box">
        <img class="cash" src="@/assets/cash-guide@2x.png" />
        <div class="hint">
          {{ getIsZhiBi ? $t('putCashOrCoin') : $t('putCoin') }}
        </div>
        <div class="remark">
          ({{
            getIsZhiBi
              ? $t('AcceptableDenominationCoins1YuanCash5Yuan10yuan')
              : $t('AcceptableDenominationCoins1Yuan')
          }})
        </div>
        <div class="display-flex-center result">
          <div class="finish">
            <i>{{ $t('Inserted') }}</i>
            <span>{{ cardResult.processInfo.paied / 100 }}.00</span>
          </div>
          <div class="unfinished">
            &nbsp;&nbsp;&nbsp; <i>{{ $t('Remain') }}</i>
            <span
              >{{
                (cardResult.processInfo.amount - cardResult.processInfo.paied) /
                  100 >
                0
                  ? (cardResult.processInfo.amount -
                      cardResult.processInfo.paied) /
                    100
                  : 0
              }}.00</span
            >
          </div>
          <div v-if="cardResult.processInfo.outChanged > 0" class="unfinished">
            &nbsp;&nbsp;&nbsp; <i>{{ $t('exchange') }}</i>
            <span>{{ cardResult.processInfo.outChanged }}.00</span>
          </div>
        </div>
      </div>
      <!-- :class="[isWait ? 'disable' : '']"-->
      <!--    <buy-ticket-back-btn class="buyTicketBack" @click="goBack">-->
      <!--      {{ data.timeSecondsText }}（{{ data.timeSeconds }}）-->
      <!--    </buy-ticket-back-btn>-->
    </div>
  </div>
</template>

<script setup>
import BuyTicketBackBtn from '@/components/BuyTicketBackBtn.vue';
import { SecCounter } from '@/utils/tool';
import { payMethods, QRCodeMethod } from '@/views/ticketCard/enum.ts';
import { computed, reactive, watch, onUnmounted, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { Dialog } from 'vant';
import 'vant/es/dialog/style/index.js';
import { useI18n } from 'vue-i18n';
const router = useRouter();
const store = useStore();
const getIsZhiBi = computed(() => store.getters.getIsZhiBi);
const cardResult = computed(() => store.state.card.cardResult);
const paymentType = computed(() => payMethods[cardResult.value['paymentType']]);
const { t } = useI18n();
const data = reactive({
  QRCodeMethod,
  timer: null,
  qrInfo: '',
  outChanged: 0
});
watch(
  cardResult,
  newValue => {
    if (newValue.sts == 204) {
      // 支付成功去更新
      router.push({
        name: 'updatePayResult'
      });
    }
  },
  { deep: true }
);
</script>
<style lang="scss" scoped>
.stepPayguide {
  text-align: center;
  box-sizing: border-box;
  margin: auto;
  margin-top: 36px;
  width: 1080px;
  height: 758px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.1);
  border-radius: 30px;
  .title {
    text-align: center;
    height: 30px;
    font-size: 30px;
    font-weight: 400;
    color: #333333;
    line-height: 30px;
    padding: 60px;
    .price {
      color: #e8730b;
    }
  }
  .qrCode-box {
    .qrImgBox {
      height: 280px;
      img {
        margin: auto;
        width: 280px;
        height: 280px;
      }
    }
    .payWay {
      margin-top: 20px;
      img {
        height: 56px;
        margin: 0 30px;
      }
    }

    .prompt {
      height: 26px;
      font-size: 26px;
      font-weight: 400;
      color: #4868c1;
      line-height: 26px;
      margin-top: 50px;
    }
  }

  .cash-box {
    .cash {
      width: 300px;
      height: 240px;
      border-radius: 12px;
      margin: auto;
    }

    .hint {
      margin-top: 40px;
      font-size: 30px;
      font-weight: 500;
      color: #4868c1;
      line-height: 30px;
    }

    .remark {
      margin-top: 20px;
      font-size: 24px;
      font-weight: 400;
      color: rgba(51, 51, 51, 0.6);
      line-height: 24px;
    }

    .result {
      > div {
        margin: 40px 0 30px;
        font-size: 26px;
        font-weight: 400;
        color: #333333;
        line-height: 26px;

        span {
          color: #e8730b;
        }
      }
    }
  }
  .remainder-box {
    .remainder_img {
      width: 280px;
      height: 280px;
      margin: auto;
    }
    .remainder-box-text {
      height: 30px;
      font-size: 30px;
      font-weight: 500;
      color: #4868c1;
      line-height: 30px;
      text-align: center;
      margin-top: 40px;
    }
  }
  .color-warn {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 26px;
    font-weight: 400;
    color: #e8730b;
    line-height: 39px;
    width: 1028px;
    margin: 40px auto 0px;
    display: flex;
    align-items: center;
  }
}
.btn {
  width: 220px;
  height: 80px;
  background: #fcfcfc;
  border-radius: 44px;
  line-height: 80px;
  @apply text-center text-lg;
  &.btn-bp {
    background: linear-gradient(360deg, #5687fc 0%, #6f99ff 100%);
    box-shadow: 0px 4px 5px 0px rgba(86, 135, 252, 0.4);
    @apply text-white;
  }
}
@media screen and (max-width: 1180px) {
  .stepPayguide {
    width: 1028px;
    margin-top: 288px;
  }
}
</style>
