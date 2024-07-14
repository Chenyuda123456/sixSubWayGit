<template>
  <div
    :class="
      isPositionRight && payCode == payMethods['cashMethod']
        ? 'stepPayguide-cash-style-right stepPayguide-style-right'
        : isPositionRight
        ? 'stepPayguide-style-right'
        : ''
    "
    class="stepPayguide"
  >
    <div :class="isPositionRight ? '' : 'display-flex-between'">
      <div class="stepPayguide-l">
        <div class="ticketDetail">
          <div v-if="endArrivalSite" class="destination display-flex-center">
            <span>{{ $t('destinationsite') }}</span>
            <span v-chStationToEn="endArrivalSite" class="over-text">{{ endArrivalSite }}</span>
          </div>
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
        <img v-if="qrInfo" :src="qrInfo" class="qr" />
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
        <div
          :class="
            isPositionRight
              ? 'ticketDetail cashResult'
              : 'display-flex-center result'
          "
        >
          <div class="finish">
            <i>{{ $t('Inserted') }}</i> <span>{{ paied }}.00</span>
          </div>
          <div v-if="shouldPaied > 0" class="unfinished">
            <i>{{ $t('Remain') }}</i> <span>{{ shouldPaied }}.00</span>
          </div>
          <div v-if="outChanged > 0" class="unfinished">
            <i>{{ $t('exchange') }}</i> <span>{{ outChanged }}.00</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import subwayInfo from '@/components/buyTicket/BuyTicketMessages.js';
import { mapGetters, useStore } from 'vuex';
import { payMethods } from '@/views/ticketCard/enum.ts';
import { ElMessage, ElMessageBox } from 'element-plus';
import axios from 'axios';
import dayjs from 'dayjs';
export default {
  name: 'StepPayguide',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    const store = useStore();
    return {
      payMethods,
      timer: null,
      second: null,
      Inserted: 0,
      position: store.state.isWidthScreen ? 'right' : 'bottom',
      qrInfo: '',
      paied: 0,
      outChanged: 0
    };
  },
  computed: {
    ...mapGetters({
      getIsZhiBi: 'getIsZhiBi',
      IsNotesPayEnable: 'IsNotesPayEnable',
      payMethod: 'getPayMethod',
      price: 'getPrice',
      origin: 'getOrigin',
      endName: 'getEndName',
      count: 'getCount',
      arrivalSite: 'getArrivalSite',
      arrivalSiteId: 'getArrivalSiteId',
      endArrivalSite: 'endArrivalSite',
      payCode: 'getPayCode',
      ticketStatus: 'getTicketStatus',
      cash: ''
    }),
    isPositionRight() {
      return this.position === 'right';
    },
    shouldPaied() {
      return Math.floor(this.count * this.price) - this.paied;
    }
  },
  watch: {
    payCode: {
      immediate: true,
      handler: function (val) {
        let type =
          val === payMethods['QRCodeMethod'] ||
          val === payMethods['numberMethod']
            ? 'scanning'
            : val === payMethods['cashMethod']
            ? 'cash'
            : '';
        if (type && window.bridge) {
          window?.bridge?.generateNLG(
            type,
            this.origin,
            this.endName,
            this.count * 1,
            '',
            ''
          );
        }
      }
    },
    ticketStatus: {
      immediate: true,
      deep: true,
      handler: function (val) {
        // 监听买票状态
        console.log('监听买票状态', val);
        if (val && val.sts) {
          const { sts, substs, qrInfo, paied, outChanged } = val;
          if (
            this.ticketStatus?.errorList &&
            this.ticketStatus?.errorList?.length &&
            sts === 999
          ) {
            this.$store.commit('setCurrentIndex', 5);
            this.$store.commit('setPayResult', 'fail');
            return;
          }
          // 单程票发行&找零逻辑状态
          if (sts === 203) {
            this.$store.commit('setCurrentIndex', 5);
            this.$store.commit('setPayResult', 'success');
          }
          if (paied) {
            // 更新已付金额
            this.paied = paied;
          }
          if (outChanged) {
            // 更新找零金额
            this.outChanged = outChanged;
          }
          if (qrInfo) {
            this.qrInfo = 'data:image/png;base64,' + qrInfo;
          }
        }
      }
    }
  },
  async created() {
    console.log('购票信息--', {
      specifyType: this.arrivalSite ? 2 : 1,
      paymentType: this.payCode,
      srcStationName: window?.bridge?.getDefaultSite(),
      dstStationName: this.arrivalSite,
      price: Number(this.price) * 100,
      number: this.count
    });
    window?.bridge?.stopTheWorld(true, 1);
    if (Number(this.price) && this.arrivalSite) {
      console.log('等待index  onTicketPriceGet 中的票价返回');
      this.verifyTime();
    } else if (Number(this.price)) {
      this.openBuy();
    }
  },
  beforeUnmount() {
    ElMessageBox.close();
  },
  methods: {
    openBuy() {
      window?.bridge?.triggerBuyTickets(
        JSON.stringify({
          specifyType: this.arrivalSite ? 2 : 1,
          paymentType: this.payCode,
          srcStationName: window?.bridge?.getDefaultSite(),
          dstStationName: this.arrivalSite,
          dstStationId: this.arrivalSiteId,
          price: Number(this.price) * 100,
          number: this.count,
          mediumType: 0, // 发售单程票
          isConfirm: true
        })
      );
    },
    verifyTime() {
      // 判断是否三分末班车 提示乘客 是否购票呢
      let lastTime = window?.bridge?.getStationLastTime?.(this.arrivalSite);
      // lastTime = '12:16';
      if (lastTime) {
        let message = '';
        let arr = lastTime.split(':');
        arr[0] * 1 < 12 ? (arr[0] = arr[0] * 1 + 24) : ' ';
        let allMinute = arr[0] * 60 + arr[1] * 1;
        let current = new Date();
        let currentMinute = current.getHours() * 60 + current.getMinutes();
        if (allMinute - currentMinute <= 3) {
          if (allMinute <= currentMinute) {
            message = this.$t(
              'NoSubwayServiceAvailableAtTheMomentPleaseConfirmYourTicketPurchase'
            );
          } else {
            message = `${this.$t('TheLastBusIsLeavingIn')}${
              allMinute - currentMinute
            }${this.$t('minutesPleaseConfirmYourTicketPurchase')}`;
          }
          ElMessageBox.confirm(message, '', {
            confirmButtonText: this.$t('OK'),
            cancelButtonText: this.$t('goBack'),
            type: 'warning',
            showClose: false,
            closeOnClickModal: false
          })
            .then(() => {
              this.openBuy();
            })
            .catch(() => {
              this.$emit('goBack', { isOverTime: false });
            });
        } else {
          this.openBuy();
        }
      } else {
        this.openBuy();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.stepPayguide {
  text-align: center;
  box-sizing: border-box;
  margin: auto;
  width: auto;
  height: 524px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.1);
  border-radius: 30px;
  padding: 40px 120px;
  margin-top: 20px;
  position: relative;
  .ticketDetail {
    > div {
      margin-top: 40px;
      font-size: 30px;
      line-height: 30px;

      :nth-child(1) {
        width: 4em;
        height: 30px;
        color: rgba(51, 51, 51, 0.6);
        text-align: right;
        margin-right: 60px;
      }

      :nth-child(2) {
        text-align: left;
        font-weight: bold;
        color: #333333;
        width: 280px;
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
    .cash {
      margin-top: 38px;
      width: 320px;
      height: 180px;
      border-radius: 12px;
    }
    .hint-box {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 60px;
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

    .result {
      > div {
        margin: 10px;
        margin-top: 30px;
        font-size: 26px;
        font-weight: 400;
        color: #333333;
        line-height: 26px;

        span {
          color: #e8730b;
          margin-top: 10px;
          display: inline-block;
        }
      }
    }

    .cashResult {
    }
  }
}

@media (min-width: 1600px) {
  .stepPayguide-style-right {
    width: 750px;
    padding: 50px;
    padding-top: 20px;
    height: 758px;
    margin-top: 0;
    .ticketDetail {
      > div {
        padding-top: 30px;
        margin-top: 0;

        :nth-child(1) {
          margin-right: 40px;
          flex: 1;
        }

        :nth-child(2) {
          margin-left: 40px;
          flex: 1;
        }
      }

      .pay {
        span {
        }
      }
    }

    .qrCode-box {
      .qr {
        margin: auto;
        margin-top: 50px;
        width: 240px;
        height: 240px;
      }

      .payWay {
        img {
        }
      }

      .prompt {
        position: relative;
        height: 28px;
        font-size: 28px;
        line-height: 28px;
        margin-top: 54px;
        bottom: 0;
      }
    }

    .cash-box {
      display: flex;
      flex-direction: column-reverse;

      .cash {
        margin: auto;
        margin-top: 60px;
        width: 440px;
        height: 180px;
      }

      .hint-box {
        position: relative;
        margin-top: 40px;
        bottom: 0;
        .hint {
          font-size: 28px;
          line-height: 28px;
        }

        .remark {
          margin-top: 26px;
        }
      }

      .cashResult {
        padding-top: 0 !important;

        .unfinished {
          i {
            color: #e8730b !important;
          }

          span {
            color: #e8730b !important;
          }
        }
      }
    }
  }

  .stepPayguide-cash-style-right {
    .ticketDetail {
      > div {
        display: flex;
        :nth-child(1) {
          margin-right: 40px;
          flex: 1;
        }
        :nth-child(2) {
          margin-left: 40px;
          flex: 1;
        }
      }

      .pay {
        span {
        }
      }
    }
    .ticketDetail {
      padding-top: 6px;

      > div {
        padding-top: 24px !important;
      }
    }
  }
}
</style>
