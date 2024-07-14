<template>
  <div
    :class="isPositionRight ? 'stepSite-style-right' : 'stepSite-style-bottom'"
    class="stepSite"
  >
    <div class="hint">
      <img src="@/assets/icon_tips.png" />
      <div
        v-en="{
          lineHeight: '28px',
          textAlign: 'left'
        }"
        class="hint-text"
      >
        {{
          $t(
            'CurrentlyPurchasingExitTicketsReissuedExitTicketsArePricedAtTheHighestFareInTheNetwork'
          )
        }}
      </div>
    </div>
    <div
      v-en="{
        marginTop: '16px'
      }"
      class="stepSite-t"
    >
      <div class="flex justify-between">
        <div class="stepSite-t-title">{{ $t('ExitTicket') }}</div>
        <div class="stepSite-t-title">{{ $t('Validity') }}：{{ date }}</div>
      </div>
      <div class="stepSite-t-main display-flex-between">
        <div class="stepSite-t-l">
          <div class="l-t">{{ $t('destinationsite') }}</div>
          <div class="over-text">—</div>
        </div>
        <div class="stepSite-t-c">
          <div class="c-t">{{ $t('ticketval') }}</div>
          <div class="c-b">{{ parseInt(price) }}.00</div>
        </div>
        <div class="stepSite-t-r">
          <div class="r-t">{{ $t('payval') }}</div>
          <div class="r-b">{{ Math.floor(count * price) }}.00</div>
        </div>
      </div>
    </div>
    <div
      v-en="{
        bigScreen: {
          marginTop: '16px'
        }
      }"
      class="stepSite-c"
    >
      <div class="stepSite-c-t display-flex-between">
        <div class="stepSite-c-t-l">{{ $t('chooseticketnumber') }}</div>
        <div class="stepSite-c-t-r flex">
          <span>{{ $t('AmountBuy') }}：</span>
          <div class="minus" @click="onChangeTicketCount(-1)">
            <img class="imgOne" src="@/assets/icon_minus1.png" />
            <img class="imgTwo" src="@/assets/icon_minus2.png" />
          </div>
          <span>{{ parseInt(count) }}</span>
          <div class="plus" @click="onChangeTicketCount(1)">
            <img class="imgOne" src="@/assets/icon_plus1.png" />
            <img class="imgTwo" src="@/assets/icon_plus2.png" />
          </div>
        </div>
      </div>
      <div class="stepSite-c-t-main display-flex-between">
        <div
          v-for="(item, index) in ticketNumArr"
          :key="index"
          :class="item == count ? 'activate' : ''"
          class="item"
          @click="chooseNum(item)"
        >
          {{ item
          }}<span
            v-en="{
              bigScreen: {
                marginTop: '16px'
              }
            }"
            >{{ $t('AmountBuy2') }}</span
          >
        </div>
      </div>
    </div>
    <div
      v-en="{
        bigScreen: {
          marginTop: '16px'
        }
      }"
      class="stepSite-b"
    >
      <div class="stepSite-b-title">{{ $t('Payment') }}</div>
      <div class="display-flex-between">
        <div
          :class="{
            grayScale: !IsQrPayEnable
          }"
          class="stepSite-b-item display-flex-center"
          @click="onPay(payMethods['QRCodeMethod'])"
        >
          <img src="@/assets/icon_scan.png" />
          <span :style="{ opacity: IsQrPayEnable ? 1 : 0.6 }">{{
            $t('scan')
          }}</span>
        </div>
        <div
          :class="{
            grayScale: !IsCoinPayEnable
          }"
          class="stepSite-b-item display-flex-center"
          @click="onPay(payMethods['cashMethod'])"
        >
          <img src="@/assets/icon_cash.png" />
          <span :style="{ opacity: IsCoinPayEnable ? 1 : 0.6 }">{{
            $t('cash')
          }}</span>
        </div>
        <div
          :class="{
            grayScale: !IsDigCashPayEnable
          }"
          class="stepSite-b-item display-flex-center"
          @click="onPay(payMethods['numberMethod'])"
        >
          <img src="@/assets/icon_cny.png" />
          <span :style="{ opacity: IsDigCashPayEnable ? 1 : 0.6 }">{{
            $t('digitalrmb')
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { payMethods } from '@/views/ticketCard/enum.ts';
import { PayTypes } from '@/views/ticket/js/index.js';
import { mapGetters, useStore } from 'vuex';
import { Ticket } from '../../../ticket/js';
import $ from 'jquery';
export default {
  components: {},
  filters: {},
  mixins: [],
  beforeRouteEnter(to, from, next) {
    console.log(this, 'beforeRouteEnter'); // undefined
    console.log('to', to);
    console.log('from', from);
    console.log('next', next);
    next(vm => {
      //因为当钩子执行前，组件实例还没被创建
      // vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
      console.log(vm); //当前组件的实例
      // 清除买票数据
      vm.$store.dispatch('clearData');
      if (to.query && !$.isEmptyObject(to.query)) {
        vm.onBuyTickets(to.query);
      }
    });
  },
  props: {},
  data() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return {
      ticketNumArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      styleRight: true,
      position: 'right',
      date: year + '-' + month + '-' + day,
      payMethods
    };
  },
  computed: {
    isShowDestination() {
      if (this.arrivalSite) {
        return false;
      } else {
        return !!this.destination;
      }
    },
    ...mapGetters({
      price: 'getPrice',
      allMostPrice: 'getAllMostPrice',
      origin: 'getOrigin',
      endName: 'getEndName',
      stationInfo: 'getTransitData',
      arrivalSite: 'getArrivalSite',
      destination: 'getDestination',
      count: 'getCount',
      endArrivalSite: 'endArrivalSite',
      isBuyFare: 'isBuyFare',
      isBuyOutFare: 'isBuyOutFare',
      IsCoinPayEnable: 'IsCoinPayEnable',
      IsQrPayEnable: 'IsQrPayEnable',
      IsDigCashPayEnable: 'IsDigCashPayEnable'
    }),
    isPositionRight() {
      let store = useStore();
      return store.state.isWidthScreen ? true : false;
    }
  },
  watch: {},
  beforeCreate() {
    window['onBuyTickets'] = options => {
      const json = JSON.parse(options);
      json.price = json.fare;
      let { arrivalSite, destination, count, price, payType, ticketType } =
        json;
      console.log(
        'exitFare',
        arrivalSite,
        destination,
        count,
        price,
        payType,
        ticketType
      );
      let payCode = new PayTypes(payType).code;

      if (!this.isBuyOutFare && ticketType) {
        return window?.bridge?.tts(
          this.$t('ThisDeviceDoesNotSupportThePurchaseOfExitTickets')
        );
      }
      if (!this.isBuyFare && !ticketType) {
        return window?.bridge?.tts(
          this.$t('ThisDeviceDoesNotSupportThePurchaseOfSingleTripTickets')
        );
      }
      if (!this.IsDigCashPayEnable && payCode == payMethods['numberMethod']) {
        return window?.bridge?.tts(
          this.$t('ThisDeviceDoesNotSupportThePurchaseOfTicketsWithDigitalRMB')
        );
      } else if (!this.IsQrPayEnable && payCode == payMethods['QRCodeMethod']) {
        return window?.bridge?.tts(
          this.$t('ThisDeviceDoesNotSupportQRCodeTicketing')
        );
      } else if (!this.IsCoinPayEnable && payCode == payMethods['cashMethod']) {
        return window?.bridge?.tts(
          this.$t('ThisDeviceDoesNotSupportCashTicketing')
        );
      }
      if (ticketType) {
        this.onBuyTickets(json);
      } else {
        if (this.$store.getters.getIsPaymentArea) {
          return window?.bridge?.tts(
            this.$t('ThisDeviceDoesNotSupportTicketPurchasing')
          );
        } else {
          this.$router.push({
            name: 'menubuy',
            query: json
          });
        }
      }
    };
    window['onChangeTicketCount'] = count => {
      this.onChangeTicketCount(count);
    };
    window['onPay'] = type => {
      let pay = new PayTypes(type);
      this.onPay(pay.code);
    };
  },
  methods: {
    async onBuyTickets({
      arrivalSite,
      destination,
      count,
      price,
      payType,
      noNLG = false
    }) {
      console.log('onBuyTickets--', arrivalSite, destination, count, price);
      let payCode = new PayTypes(payType).code;
      // 0 参数处理
      if (count) {
        if (count > 10) {
          count = 10;
        }
      }
      let ticket = new Ticket({
        count,
        price: this.allMostPrice || 4,
        payCode
      });
      this.$store.commit('setTicketData', ticket);
      if (payCode) {
        this.onPay(payCode);
      }
      try {
        if (window.bridge && !noNLG) {
          window?.bridge?.generateNLG(
            'buyTickets',
            ticket.origin,
            '',
            Number(ticket.count),
            '',
            ''
          );
        }
      } catch (e) {
        console.error('内容播报：买票 发生错误', e);
      }
    },
    onChangeTicketCount(count) {
      console.log(count);
      let num = Number(this.count);

      num = num + count * 1;

      if (num < 1) num = 1;

      if (num > 10) num = 10;
      this.$store.commit('setTicketData', {
        count: Math.floor(num)
      });
    },
    chooseNum(e) {
      this.$store.commit('setTicketData', {
        count: e
      });
    },
    // 支付方式选择
    onPay(code) {
      const jump = () => {
        this.$store.commit('setTicketData', {
          payCode: code
        });
        this.$router.push({
          name: 'moneyFareExitPayGuide'
        });
      };
      if (code == payMethods['cashMethod']) {
        if (this.IsCoinPayEnable) {
          jump();
        } else {
          window?.bridge?.tts(this.$t('ThisDeviceDoesNotSupportCashTicketing'));
        }
      } else if (code == payMethods['QRCodeMethod']) {
        if (this.IsQrPayEnable) {
          jump();
        } else {
          window?.bridge?.tts(
            this.$t('ThisDeviceDoesNotSupportQRCodeTicketing')
          );
        }
      } else if (code == payMethods['numberMethod']) {
        if (this.IsDigCashPayEnable) {
          jump();
        } else {
          window?.bridge?.tts(
            this.$t(
              'ThisDeviceDoesNotSupportThePurchaseOfTicketsWithDigitalRMB'
            )
          );
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.hint {
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
.stepSite {
  text-align: center;
  width: auto;
  margin: auto 26px;
  margin-top: 190px;
  .stepSite-t {
    box-sizing: border-box;
    height: 224px;
    background: linear-gradient(360deg, #edf6ff 0%, #ffffff 100%);
    background-size: cover;
    padding: 30px;
    margin-top: 65px;
    box-shadow: 0 0 10px 1px rgba(165, 177, 223, 0.5);
    border-radius: 30px;
    position: relative;

    img {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      margin: auto;
    }

    .stepSite-t-title {
      font-size: 30px;
      font-weight: 500;
      color: #4868c1;
      margin-bottom: 36px;
      text-align: left;
      line-height: 30px;
    }

    .stepSite-t-main {
      > div {
        flex: 1;

        :nth-child(1) {
          font-size: 26px;
          font-weight: 400;
          color: #333333;
          line-height: 26px;
        }

        position: relative;

        &::after {
          content: '';
          position: absolute;
          width: 1px;
          height: 60px;
          background: #4868c1;
          right: 0;
          top: 16px;
        }

        :nth-child(2) {
          margin-top: 30px;
          font-size: 36px;
          line-height: 36px;
          font-weight: bold;
          width: 100%;
        }
      }

      .stepSite-t-l {
        width: 33.33%;

        .l-b {
          width: 90%;
        }
      }

      .stepSite-t-r {
        > div {
          color: #e8730b !important;
        }

        &::after {
          width: 0;
        }
      }
    }
  }

  .stepSite-c {
    margin-top: 30px;
    height: 296px;
    box-sizing: border-box;
    background: linear-gradient(180deg, #ffffff 0%, #edf6ff 100%);
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    border-radius: 30px;
    padding: 30px;
    padding-top: 25px;
    padding-bottom: 0;

    .stepSite-c-t {
      line-height: 40px;
      margin-bottom: 30px;

      .stepSite-c-t-l {
        font-size: 30px;
        font-weight: 500;
        color: #4868c1;
        text-align: left;
      }

      .stepSite-c-t-r {
        .imgOne {
          display: block;
        }
        .imgTwo {
          display: none;
        }
        .plus {
          &:active {
            .imgOne {
              display: none;
            }
            .imgTwo {
              display: block;
            }
          }
        }
        .minus {
          &:active {
            .imgOne {
              display: none;
            }
            .imgTwo {
              display: block;
            }
          }
        }

        :nth-child(1) {
          font-size: 26px;
          font-weight: 400;
          color: #666666;
        }

        img {
          width: 40px;
          height: 40px;
        }

        :nth-child(3) {
          font-size: 26px;
          font-weight: 500;
          color: #333333;
          margin: 0 20px;
        }
      }
    }

    .stepSite-c-t-main {
      padding: 0 30px;
      flex-wrap: wrap;

      .item {
        margin-bottom: 30px;
        width: 160px;
        background: #fcfcfc;
        border-radius: 12px;
        border: 2px solid #85a9ff;
        line-height: 70px;
        font-size: 30px;
        font-weight: 400;
        color: #4868c1;
      }

      .activate {
        background: linear-gradient(180deg, #719bff 0%, #3c76ff 100%);
        box-shadow: 0 2px 8px 0 #7ea4ff;
        border-radius: 12px;
        color: #fff;
      }
    }
  }

  .stepSite-b {
    .stepSite-b-title {
      text-align: left;
      font-size: 30px;
      font-weight: 500;
      color: #4868c1;
      line-height: 30px;
      margin: 30px;
      margin-bottom: 24px;
    }

    .stepSite-b-item {
      align-items: center;
      width: 322px;
      height: 124px;
      background: #fff;
      box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.06);
      border-radius: 20px;
      font-size: 30px;
      font-weight: 500;
      color: #333333;

      img {
        width: 80px;
        height: 80px;
        margin-right: 16px;
      }
    }
  }
}
.stepSite-style-right {
  width: 1080px;
  margin: auto;
  margin-top: 10px;
  .stepSite-t {
    box-sizing: border-box;
    height: 226px;
    margin-top: 26px;
    .stepSite-t-title {
      margin-bottom: 40px;
    }

    .stepSite-t-main {
      > div {
        :nth-child(1) {
        }

        &::after {
        }

        :nth-child(2) {
          font-size: 30px;
          line-height: 30px;
        }
      }

      .stepSite-t-l {
        .l-b {
        }
      }

      .stepSite-t-r {
        > div {
        }

        &::after {
        }
      }
    }
  }

  .stepSite-c {
    .stepSite-c-t {
      .stepSite-c-t-l {
        font-size: 28px;
      }

      .stepSite-c-t-r {
        :nth-child(1) {
        }

        img {
        }

        :nth-child(3) {
        }
      }
    }

    .stepSite-c-t-main {
      .item {
        //width: 120px;
        line-height: 70px;
        font-size: 30px;
        margin: 10px;
      }
    }
  }

  .stepSite-b {
    .stepSite-b-title {
      font-size: 28px;
      line-height: 28px;
      margin: 30px;
      margin-bottom: 20px;
    }

    .stepSite-b-item {
      width: 340px;
      height: 100px;
      font-size: 28px;

      img {
        width: 68px;
        height: 68px;
        margin-right: 10px;
      }
    }
  }
}
</style>
