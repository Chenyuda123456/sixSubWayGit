<template>
  <div
    :class="isPositionRight ? 'stepSite-style-right' : 'stepSite-style-bottom'"
    class="stepSite"
  >
    <div class="stepSite-t">
      <div class="flex justify-between">
        <div class="stepSite-t-title"></div>
        <div class="stepSite-t-title">{{ $t('Validity') }}：{{ date }}</div>
      </div>
      <div class="stepSite-t-main display-flex-between">
        <img v-if="styleRight" src="@/assets/bg_ticket_three1.png" />
        <img v-else src="@/assets/bg_ticket_three.png" />
        <div v-if="endArrivalSite" class="stepSite-t-l">
          <div class="l-t">{{ $t('destinationsite') }}</div>
          <div
            v-chStationToEn="endArrivalSite.split('地铁站')[0]"
            class="l-b over-text"
          >{{ endArrivalSite.split('地铁站')[0] }}</div>
        </div>
        <div class="stepSite-t-c">
          <div class="c-t">{{ $t('ticketval') }}</div>
          <div class="c-b">{{ parseInt(price) ? parseInt(price) : $t('Obtaining') }}</div>
        </div>
        <div class="stepSite-t-r">
          <div class="r-t">{{ $t('payval') }}</div>
          <div class="r-b">
            {{ Math.floor(count * price) ? Math.floor(count * price)+ '.00' : $t('Obtaining') }}
          </div>
        </div>
      </div>
    </div>
    <div class="stepSite-c">
      <div class="stepSite-c-t display-flex-between">
        <div class="stepSite-c-t-l">{{ $t('chooseticketnumber') }}</div>
        <div class="flex stepSite-c-t-r">
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
              fontSize: '20px'
            }"
            >{{ $t('AmountBuy2') }}</span
          >
        </div>
      </div>
    </div>
    <div class="stepSite-b">
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
import { mapGetters, useStore } from 'vuex';
import { PayTypes } from '../js/index.js';
import { payMethods } from '@/views/ticketCard/enum.ts';
export default {
  name: 'StepSite',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return {
      date: year + '-' + month + '-' + day,
      payMethods,
      ticketNumArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      styleRight: true,
      position: 'right'
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
      origin: 'getOrigin',
      endName: 'getEndName',
      stationInfo: 'getTransitData',
      arrivalSite: 'getArrivalSite',
      destination: 'getDestination',
      count: 'getCount',
      endArrivalSite: 'endArrivalSite',
      IsCoinPayEnable: 'IsCoinPayEnable',
      IsQrPayEnable: 'IsQrPayEnable',
      IsDigCashPayEnable: 'IsDigCashPayEnable',
      currentIndex: 'getCurrentIndex'
    }),
    isPositionRight() {
      let store = useStore();
      return store.state.isWidthScreen ? true : false;
    }
  },
  watch: {},
  mounted() {
    window['onChangeTicketCount'] = count => {
      this.onChangeTicketCount(count);
    };
    window['onPay'] = payType => {
      if (this.currentIndex == 2) {
        let pay = new PayTypes(payType);
        this.onPay(pay.code);
      }
    };
  },
  beforeUnmount() {
    let flag = Object.prototype.hasOwnProperty.call(window, 'onPay');
    if (flag) {
      delete window.onPay;
    }
  },
  methods: {
    onChangeTicketCount(count) {
      let num = Number(this.count);

      num = num + count * 1;

      if (num < 1) num = 1;

      if (num > 10) num = 10;
      this.$store.commit('setTicketData', {
        count: Math.floor(num),
        price: this.price
      });
    },
    chooseNum(e) {
      this.$store.commit('setTicketData', {
        count: e
      });
    },
    jump(code) {
      if (!this.price){
        return;
      }
      this.$emit('payChange');
      this.$store.commit('setTicketData', {
        payCode: code
      });
      this.$store.commit('setCurrentIndex', 4);
    },
    // 支付方式选择
    onPay(code) {
      console.log('onpy--', code);
      if (code == payMethods['cashMethod']) {
        if (this.IsCoinPayEnable) {
          this.jump(code);
        } else {
          window?.bridge?.tts(this.$t('ThisDeviceDoesNotSupportCashTicketing'));
        }
      } else if (code == payMethods['QRCodeMethod']) {
        if (this.IsQrPayEnable) {
          this.jump(code);
        } else {
          window?.bridge?.tts(
            this.$t('ThisDeviceDoesNotSupportQRCodeTicketing')
          );
        }
      } else if (code == payMethods['numberMethod']) {
        if (this.IsDigCashPayEnable) {
          this.jump(code);
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
.stepSite {
  text-align: center;
  width: auto;
  margin: auto;

  .stepSite-t {
    box-sizing: border-box;
    height: 224px;
    background: linear-gradient(360deg, #edf6ff 0%, #ffffff 100%);
    background-size: cover;
    padding: 30px;
    padding-right: 0;
    margin-top: 20px;
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
      padding-right: 30px;
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
      padding: 0 50px;
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
  width: 750px;

  .stepSite-t {
    box-sizing: border-box;
    height: 226px;

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
      padding: 0;

      .item {
        width: 120px;
        line-height: 70px;
        font-size: 30px;
      }
    }
  }

  .stepSite-b {
    .stepSite-b-title {
      text-align: center;
      font-size: 28px;
      line-height: 28px;
      margin: 30px;
      margin-bottom: 20px;
    }

    .stepSite-b-item {
      width: 238px;
      height: 128px;
      font-size: 28px;

      img {
        width: 68px;
        height: 68px;
        margin-right: 10px;
      }
    }
  }
}
.testBtn {
  &:active {
    border: 10px solid #1d1a1a;
  }
}
</style>
