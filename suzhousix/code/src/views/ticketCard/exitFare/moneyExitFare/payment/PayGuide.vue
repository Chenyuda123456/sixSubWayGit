<template>
  <div class="stepPayguide">
    <div class="">
      <div class="stepPayguide-l">
        <div class="ticketDetail">
          <div class="ticketCount display-flex-center">
            <span>{{ $t('ticketnumber') }}</span>
            <span>{{ parseInt(count) }}</span>
          </div>
          <div class="price display-flex-center">
            <span>{{ $t('ticketval') }}</span>
            <span>{{ parseInt(price) }}.00</span>
          </div>
          <div class="pay display-flex-center">
            <span>{{ $t('payval') }}</span>
            <span>{{ Math.floor(count * price) }}.00</span>
          </div>
        </div>
      </div>
      <div
        v-if="payCode != payMethods['cashMethod']"
        class="stepPayguide-r qrCode-box"
      >
        <img v-if="data.qrInfo" :src="data.qrInfo" class="qr" />
        <img v-else class="qr" src="@/assets/loading.gif" />
        <div
          v-if="payCode == payMethods['QRCodeMethod']"
          class="display-flex-center payWay"
        >
          <img src="@/assets/ico_alipay.png" />
          <img src="@/assets/icon_wechat.png" />
        </div>
        <div v-else class="payWay">
          <img src="@/assets/ico_cny2.png" />
        </div>
        <div class="prompt">{{ $t('scancodeforpay') }}</div>
      </div>
      <div v-else class="stepPayguide-r cash-box">
        <div>
          <img
              v-if=" IsNotesPayEnable"
              class="cash"
              src="@/assets/pay_guide.gif"
          />
          <img
              v-else
              class="cash"
              src="@/assets/pay_guide_coin.gif"
          />
          <div class="hint-box">
            <div class="hint">
              {{
                 IsNotesPayEnable
                  ? $t('putCashOrCoin')
                  : $t('putCoin')
              }}
            </div>
            <div class="remark">
              ({{
                 IsNotesPayEnable
                  ? $t('AcceptableDenominationCoins1YuanCash5Yuan10yuan')
                  : $t('AcceptableDenominationCoins1Yuan')
              }})
            </div>
          </div>
        </div>
        <div class="ticketDetail cashResult">
          <div class="finish">
            <i>{{ $t('Inserted') }}</i
            ><span>{{ data.paied }}.00</span>
          </div>
          <div v-if="shouldPaied > 0" class="unfinished">
            <i>{{ $t('Remain') }}</i
            ><span>{{ shouldPaied }}.00</span>
          </div>
          <div v-if="data.outChanged > 0" class="unfinished">
            <i>{{ $t('exchange') }}</i> <span>{{ data.outChanged }}.00</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BuyTicketBackBtn from '@/components/BuyTicketBackBtn.vue';
import { SecCounter } from '@/utils/tool';
import { payMethods, QRCodeMethod } from '@/views/ticketCard/enum.ts';
import {
  computed,
  reactive,
  watch,
  onUnmounted,
  onMounted,
  onBeforeMount,
  getCurrentInstance
} from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import 'vant/es/dialog/style/index.js';
import { useI18n } from 'vue-i18n';
const { proxy } = getCurrentInstance();
const { t } = useI18n();
const router = useRouter();
const store = useStore();
const data = reactive({
  QRCodeMethod,
  qrInfo: '',
  paied: 0,
  outChanged: 0
});
const getIsZhiBi = computed(() => store.getters.getIsZhiBi);
const IsNotesPayEnable = computed(() => store.getters.IsNotesPayEnable);
const getPayMethod = computed(() => store.getters.getPayMethod);
const payCode = computed(() => store.getters.getPayCode);
const price = computed(() => store.getters.getPrice);
const count = computed(() => store.getters.getCount);
const ticketStatus = computed(() => store.getters.getTicketStatus);
const paymentType = computed(() => payMethods[payCode.value]);
const shouldPaied = computed(
  () => Math.floor(count.value * price.value) - data.paied
);
watch(
  ticketStatus,
  val => {
    // 监听买票状态
    console.log('ticketStatus.value---', val);
    if (val && val.sts) {
      const { qrInfo, paied, outChanged } = val;
      if (paied) {
        // 更新已付金额
        data.paied = paied;
      }
      if (outChanged) {
        // 更新找零金额
        data.outChanged = outChanged;
      }
      if (qrInfo) {
        data.qrInfo = 'data:image/png;base64,' + qrInfo;
      }
    }
  },
  {
    immediate: true,
    deep: true
  }
);

onBeforeMount(() => {
  console.log({
    paymentType: payCode.value,
    price: Number(price.value) * 100,
    number: count.value,
    mediumType: 1, // 发售出站票
    isConfirm: true
  });
  window?.bridge?.triggerBuyTickets(
    JSON.stringify({
      specifyType: 1, // 按金额
      paymentType: payCode.value,
      price: Number(price.value) * 100,
      number: count.value,
      mediumType: 1, // 发售出站票
      isConfirm: true
    })
  );
});
onMounted(() => {});
onUnmounted(() => {});
</script>
<style lang="scss" scoped>
.stepPayguide {
  position: relative;
  text-align: center;
  box-sizing: border-box;
  margin: auto;
  height: 758px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.1);
  border-radius: 30px;
  box-sizing: border-box;
  padding-top: 36px;
  width: 1028px;
  margin-top: 288px;
  .ticketDetail {
    > div {
      margin-top: 40px;
      font-size: 30px;
      line-height: 30px;

      :nth-child(1) {
        flex: 1;
        height: 30px;
        color: rgba(51, 51, 51, 0.6);
        text-align: right;
        margin-right: 60px;
      }

      :nth-child(2) {
        text-align: left;
        font-weight: bold;
        color: #333333;
        flex: 1;
      }
    }

    .pay {
      span {
        color: #e8730b;
      }
    }
  }

  .qrCode-box {
    .qr {
      margin-top: 38px;
      width: 240px;
      height: 240px;
    }

    .payWay {
      margin-top: 20px;
      img {
        height: 48px;
        margin: 0 30px;
      }
    }

    .prompt {
      height: 26px;
      font-size: 26px;
      font-weight: 400;
      color: #4868c1;
      line-height: 26px;
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
      bottom: 60px;
    }
  }

  .cash-box {
    display: flex;
    flex-direction: column-reverse;
    .cash {
      margin: auto;
      margin-top: 30px;
      width: 440px;
      height: 180px;
    }
    .hint-box {
      position: relative;
      margin-top: 40px;
      bottom: 0;
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
    }
    .cashResult {
      > div {
        display: flex;
        i {
          flex: 1;
        }
        span {
          flex: 1;
        }
      }

      .unfinished {
        i {
          color: #e8730b;
        }
        span {
          color: #e8730b;
        }
      }
    }
  }
}

@media (min-width: 1600px) {
  .stepPayguide {
    width: 1080px;
    margin-top: 36px;
  }
}
</style>
