<template>
  <div>
    <!--选择车站-->
    <div class="card">
      <div class="card-title">
        <div class="card-title-l">ID：{{ cardResult.cardLogicId }}</div>
        <div class="card-title-c">
          {{ $t('AccountBalance') }}：{{
            cardResult.processInfo.afterRecharge / 100
          }}
        </div>
        <div class="card-title-r">{{ cardResult['cardType' + lang] }}</div>
      </div>
      <div class="card-main">
        <div class="card-main-title">{{ $t('RechargeAmount') }}</div>
        <div class="card-main-money">
          <div
            v-for="(item, index) in moneyList"
            :key="index"
            :class="{ active: item == amount }"
            class="item"
            @click="choosePayMoney(item)"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </div>
    <div class="wrapper mode-wrapper">
      <div class="display-flex-between-center">
        <div class="Payment">{{ $t('Payment') }}</div>
        <!--只有需要付钱并且是实体票才显示-->
        <div
          class="mr-[40px] mt-[10px] text-[20px]"
          style="transform: scale(1.4)"
        >
          <a-checkbox v-model:checked="isPrint">{{
            $t('DoYouNeedAReceiptPrinted')
          }}</a-checkbox>
        </div>
      </div>
      <div class="mode-wrapper-cont display-flex-between-center">
        <div
          v-for="(item, index) in payTypeData"
          :key="index"
          :class="{
            grayScale: !item.isUse
          }"
          :span="parseInt(24 / payTypeData.length)"
          class="pay-type-item text-center display-flex-center"
          @click="choosePayType(item.code)"
        >
          <img :src="item.imgUrl" alt="" />
          <span :style="{ opacity: item.isUse ? 1 : 0.6 }" class="">{{
            item.text
          }}</span>
        </div>
      </div>
    </div>
    <!--操作提示-->
    <div class="color-warn">
      <img src="@/assets/icon_tips.png" style="margin-top: 3px" />
      <div>&nbsp;&nbsp;&nbsp;{{ $t('dontmove') }}</div>
    </div>
  </div>
</template>

<script>
import { PayTypes } from '@/views/ticket/js/index.js';
import { getAssetsFile } from '@/utils/tool';
import { mapGetters } from 'vuex';
import { payMethods } from '@/views/ticketCard/enum.ts';
import { watch } from 'vue';
export default {
  name: 'Charge',
  components: {},
  filters: {},
  props: {},
  data() {
    return {
      lang: window.localStorage.getItem('lang') === 'en' ? 'En' : 'Cn',
      payType: null,
      moneyList: [50, 100, 150, 200, 300, 500],
      amount: 100,
      isPrint: false
    };
  },
  watch: {
    cardResult: {
      handler(val) {
        if (val.sts == 301 || val.sts == 302) {
          this.$router.push({
            name: 'chargePayGuide'
          });
        }
      },
      deep: true
    }
  },
  computed: {
    payTypeData() {
      const payTypes = [
        {
          imgUrl: getAssetsFile('icon_scan.png'),
          text: this.$t('scan'),
          code: payMethods['QRCodeMethod'],
          isUse: this.IsQrPayEnable
        },
        // {
        //   imgUrl: getAssetsFile('icon_cash.png'),
        //   text: this.$t('cash'),
        //   code: payMethods['cashMethod'],
        //   isUse: this.IsNotesPayEnable
        // },
        {
          imgUrl: getAssetsFile('icon_cny.png'),
          text: this.$t('digitalrmb'),
          code: payMethods['numberMethod'],
          isUse: this.IsDigCashPayEnable
        }
      ];
      return payTypes;
    },
    ...mapGetters({
      cardResult: 'getCardResult',
      IsQrPayEnable: 'IsQrPayEnable',
      IsNotesPayEnable: 'IsNotesPayEnable',
      IsDigCashPayEnable: 'IsDigCashPayEnable'
    })
  },
  mounted() {
    if (window.config.isChargeTest) {
      this.moneyList = [0.01, ...this.moneyList];
    }
    window['onPay'] = type => {
      let pay = new PayTypes(type);
      this.choosePayType(pay.code);
    };
  },
  beforeUnmount() {
    window['onPay'] = () => null;
  },
  methods: {
    // 选择支付金额
    choosePayMoney(val) {
      console.log(val);
      this.amount = val;
    },
    // 选择支付方式
    choosePayType(code) {
      let isUse = false;
      if (code == payMethods['cashMethod']) {
        isUse = this.IsNotesPayEnable;
      } else if (code == payMethods['QRCodeMethod']) {
        isUse = this.IsQrPayEnable;
      } else if (code == payMethods['numberMethod']) {
        isUse = this.IsDigCashPayEnable;
      }
      if (!isUse) {
        return;
      }
      console.log(code);
      window?.bridge?.triggerProcessCardBusiness(
        JSON.stringify({
          api: 'ProcessCardBusiness',
          param: {
            isPrint: this.isPrint,
            processType: 'RechargeCard',
            amount: this.amount * 100,
            paymentType: code,
            isConfirm: true
          }
        })
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@media screen and (min-width: 1080px) {
  // in-And-out
  .card {
    width: 1080px;
    height: 436px;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    margin: 36px auto 40px;
    .card-title {
      display: flex;
      justify-content: space-between;
      font-size: 26px;
      color: #333333;
      padding: 30px;
      border-bottom: 1px solid #e4e4e4;
    }
    .card-main {
      padding: 40px 30px 0;
      .card-main-title {
        height: 28px;
        font-size: 26px;
        font-weight: 500;
        color: #4868c1;
        line-height: 30px;
      }
      .card-main-money {
        display: flex;
        flex-wrap: wrap;
        > div {
          width: 180px;
          height: 90px;
          background: #fcfcfc;
          border-radius: 12px;
          border: 2px solid #85a9ff;
          text-align: center;
          line-height: 90px;
          font-size: 30px;
          font-weight: 400;
          color: #4868c1;
          margin-right: 30px;
          margin-top: 30px;
        }
        :nth-child(5n) {
          margin-right: 0;
        }
        .active {
          background: linear-gradient(180deg, #719bff 0%, #3c76ff 100%);
          box-shadow: 0px 2px 8px 0px #7ea4ff;

          color: #ffffff;
        }
      }
    }
  }
  .color-orange {
    color: #e8730b;
  }
  // payout
  .wrapper {
    width: 1080px;
    margin: auto;
    .color-lightblue {
      padding: 0 40px;
      font-weight: bold;
      color: #5687fc;
      line-height: 80px;
      font-size: 36px;
    }
  }
  .mode-wrapper {
    .Payment {
      margin-left: 30px;
      height: 30px;
      font-size: 30px;
      font-weight: 500;
      color: #4868c1;
      line-height: 30px;
      margin-top: 10px;
    }

    .mode-wrapper-cont {
      width: 1080px;
      margin: auto;
      margin-top: 24px;

      .pay-type-item {
        height: 140px;
        background: linear-gradient(180deg, #ffffff 0%, #edf6ff 100%);
        box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        font-size: 30px;
        font-weight: 500;
        color: #333333;
        line-height: 140px;
        margin-right: 16px;
        flex: 1;

        img {
          width: 70px;
          height: 70px;
          margin-right: 12px;
        }
      }

      :nth-last-child(1) {
        margin-right: 0px;
      }
    }
  }
  .color-warn {
    font-size: 26px;
    font-weight: 400;
    color: #e8730b;
    line-height: 39px;
    width: 1028px;
    margin: 30px auto 0px;
    display: flex;
    align-items: center;
  }
}
@media screen and (max-width: 1180px) {
  .card {
    width: 1028px;
    height: 452px;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    margin: 36px auto 40px;
    margin-top: 288px;
    .card-title {
      display: flex;
      justify-content: space-between;
      font-size: 28px;
      color: #333333;
      padding: 30px;
      border-bottom: 1px solid #e4e4e4;
    }
    .card-main {
      padding: 40px 30px 0;
      .card-main-title {
        height: 28px;
        font-size: 36px;
        font-weight: 500;
        color: #4868c1;
        line-height: 30px;
      }
      .card-main-money {
        display: flex;
        flex-wrap: wrap;
        > div {
          width: 170px;
          height: 90px;
          background: #fcfcfc;
          border-radius: 12px;
          border: 2px solid #85a9ff;
          text-align: center;
          line-height: 90px;
          font-size: 30px;
          font-weight: 400;
          color: #4868c1;
          margin-right: 29px;
          margin-top: 30px;
        }
        :nth-child(5n) {
          margin-right: 0;
        }
        .active {
          background: linear-gradient(180deg, #719bff 0%, #3c76ff 100%);
          box-shadow: 0px 2px 8px 0px #7ea4ff;

          color: #ffffff;
        }
      }
    }
  }
  // payout
  .wrapper {
    width: 1080px;
    margin: auto;
    .color-lightblue {
      padding: 0 40px;
      font-weight: bold;
      color: #5687fc;
      line-height: 80px;
      font-size: 36px;
    }
  }
  .mode-wrapper {
    .Payment {
      margin-left: 56px;
      height: 30px;
      font-size: 36px;
      font-weight: 500;
      color: #4868c1;
      margin-top: 10px;
    }

    .mode-wrapper-cont {
      width: 1028px;
      margin: auto;
      margin-top: 40px;

      .pay-type-item {
        height: 140px;
        background: linear-gradient(180deg, #ffffff 0%, #edf6ff 100%);
        box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        font-size: 30px;
        font-weight: 500;
        color: #333333;
        line-height: 140px;
        margin-right: 16px;
        flex: 1;

        img {
          width: 70px;
          height: 70px;
          margin-right: 12px;
        }
      }

      :nth-last-child(1) {
        margin-right: 0px;
      }
    }
  }
  .color-warn {
    font-size: 26px;
    font-weight: 400;
    color: #e8730b;
    line-height: 39px;
    margin: 30px auto 0px;
    margin-left: 56px;
    display: flex;
    align-items: center;
  }
}
</style>
