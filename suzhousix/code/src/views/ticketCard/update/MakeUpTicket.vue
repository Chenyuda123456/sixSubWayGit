<template>
  <div>
    <!--选择车站-->
    <div class="card">
      <div class="card-title">
        <div class="card-title-l">
          {{ cardResult['cardType' + lang] || $t('ElectronicTicket') }}
        </div>
        <div
          v-if="cardResult['cardLogicId'] || lastECarddata['userId']"
          class="card-title-c"
        >
          ID：{{ cardResult['cardLogicId'] || lastECarddata['userId'] }}
        </div>
        <div class="card-title-r">{{ $t('TicketUpdate') }}</div>
      </div>
      <!-- 超时超程只需要显示信息不需要选站点-->
      <a-row
        v-if="
          cardResult.processInfo.adjustType == 'AdjustFareOverTimeTravel' ||
          cardResult.processInfo.adjustType == 'AdjustFareOverTime' ||
          cardResult.processInfo.adjustType == 'AdjustFareOverTravel'
        "
        class="card-top"
      >
        <a-col class="card-top-left" span="24">
          <div class="flex text-[28px] mb-[22px]">
            <span
              class="text-gray text-opacity-60 pr-36 text-right"
              style="flex: 1"
              >{{ $t('usedTime') }}</span
            >
            <span class="text-gray font-bold" style="flex: 1">
              {{
                cardResult['lastTransTime']?.length
                  ? cardResult['lastTransTime'].slice(0, 10) +
                    ' ' +
                    cardResult['lastTransTime'].slice(10)
                  : $t('NotObtained')
              }}</span
            >
          </div>
        </a-col>
        <a-col class="card-top-right" span="24">
          <div class="flex text-[28px]">
            <span
              class="text-gray text-opacity-60 pr-36 text-right"
              style="flex: 1"
              >{{ $t('usedBus') }}</span
            >
            <span class="text-gray font-bold" style="flex: 1">{{
              cardResult['lastStation' + lang] || $t('NotObtained')
            }}</span>
          </div>
        </a-col>
      </a-row>
      <!--如果是补进站：单程票不需要选站，默认用发售站点，储值卡需要选站，补进站不需要支付，直接跳转更新成功界面-->
      <!--如果是补出站：进站使用最后使用站点-->
      <a-row v-else flex justify="center" class="card-top text-center">
        <a-col
          v-if="cardResult.processInfo.adjustType == 'AdjustEntryStation'"
          class="card-top-left"
          span="11"
        >
          <div
            v-en="{
              paddingTop: $pxToRem(4),
              fontSize: $pxToRem(26),
              lineHeight: $pxToRem(28)
            }"
            class="card-top-name"
            @click="showDialog('start')"
          >
            {{ $t('insite') }}
          </div>
          <p class="card-top-text" @click="showDialog('start')">
            {{ resStationName || '--' }}
          </p>
        </a-col>

        <!--补出站才显示讷-->
        <a-col
          v-if="cardResult.processInfo.adjustType == 'AdjustExitStation'"
          class="card-top-left"
          span="11"
        >
          <div
            v-en="{
              paddingTop: $pxToRem(4),
              fontSize: $pxToRem(26),
              lineHeight: $pxToRem(28)
            }"
            class="card-top-name"
          >
            {{ $t('insite') }}
          </div>
          <p class="card-top-text">
            {{
              cardResult['lastStation' + lang] ||
              lastECarddata['inStationName' + lang] ||
              '--'
            }}
          </p>
        </a-col>
        <a-col
          v-if="cardResult.processInfo.adjustType == 'AdjustExitStation'"
          class="card-top-center"
          span="2"
        >
          <img src="@/assets/icon_arrow2.png" />
        </a-col>
        <a-col
          v-if="cardResult.processInfo.adjustType == 'AdjustExitStation'"
          class="card-top-right"
          span="11"
        >
          <div
            v-en="{
              paddingTop: $pxToRem(4),
              paddingLeft: $pxToRem(4),
              paddingRight: $pxToRem(4),
              boxSizing: 'border-box',
              fontSize: $pxToRem(26),
              lineHeight: $pxToRem(28)
            }"
            class="card-top-name"
            @click="showDialog('end')"
          >
            {{ $t('outsite') }}
          </div>
          <p class="card-top-text" @click="showDialog('end')">
            {{ resStationName || '--' }}
          </p>
        </a-col>
        <!--补出站才显示讷-->
      </a-row>
      <div class="card-bottom">
        <div v-if="cardResult.mediumType == 0" justify="center">
          <!--次卡支付 非付费区且次卡-->
          <div v-if="cardCategoryTypeRes === 'frequency' && !getIsPaymentArea">
            {{ $t('compenseTimes') }}：{{ cardResult.processInfo.amount }}
            <span class="color-orange">
              {{ $t('times') }}
            </span>
          </div>
          <!--金额支付-->
          <div v-else>
            {{ $t('compenseAmount') }}：{{
              cardResult.processInfo.amount / 100
            }}
            <span class="color-orange">
              {{ $t('price') }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <!--实体卡-->
    <div v-if="cardResult.mediumType == 0">
      <!--支付方式:不是补进站或者补超时需要付钱的-->
      <div
        v-if="
          (cardResult.processInfo.adjustType != 'AdjustEntryStation' &&
            cardResult.processInfo.adjustType != 'AdjustFareOverTime') ||
          (cardResult.processInfo.adjustType == 'AdjustFareOverTime' &&
            cardResult.processInfo.amount)
        "
        class="wrapper mode-wrapper mb-[30px]"
      >
        <div class="display-flex-between-center">
          <div class="Payment">{{ $t('Payment') }}</div>
          <!--只有需要付钱并且是实体票才显示-->
          <div
            v-if="
              cardResult.processInfo.amount > 0 && cardResult.mediumType == 0
            "
            class="mr-[40px] xl:mr-[450px] mt-[10px] text-[20px]"
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
            :span="parseInt(24 / payTypeData.length)"
            class="pay-type-item text-center display-flex-center"
            :class="item.isUse ? '' : 'grayScale'"
            @click="choosePayType(item.code)"
          >
            <img :src="item.imgUrl" alt="" />
            <span :style="{ opacity: item.isUse ? 1 : 0.6 }" class="">{{
              item.text
            }}</span>
          </div>
        </div>
      </div>
      <div class="color-warn">
        <img src="@/assets/icon_tips.png" style="margin-top: 3px" />
        <div>&nbsp;&nbsp;&nbsp;{{ $t('dontmove') }}</div>
      </div>
      <div
        v-if="
          cardResult.processInfo.adjustType == 'AdjustEntryStation' ||
          (cardResult.processInfo.adjustType == 'AdjustFareOverTime' &&
            !cardResult.processInfo.amount)
        "
        class="wrapper mode-wrapper display-flex-center pt-[60px]"
      >
        <button
          v-cloak
          class="xl:px-[20px] xl:w-[auto] w-[480px] h-[88px] leading-88 bg-update text-white text-lg text-center xl:rounded-[12px] rounded-[20px] xl:mx-20"
          @click="handlerUpdate"
        >
          {{ $t('StartUpdate') }}
        </button>
      </div>
    </div>
    <!--二维码 数币 银联卡-->
    <div
      v-else-if="
        cardResult.mediumType == 3 ||
        cardResult.mediumType == 4 ||
        cardResult.mediumType == 8 ||
        cardResult.mediumType == 9
      "
    >
      <div class="wrapper mode-wrapper display-flex-center pt-[60px]">
        <button
          v-cloak
          class="xl:px-[20px] xl:w-[auto] w-[480px] h-[88px] leading-88 bg-update text-white text-lg text-center xl:rounded-[12px] rounded-[20px] xl:mx-20"
          @click="handlerQrUpdate"
        >
          {{ $t('StartUpdate') }}
        </button>
      </div>
    </div>
  </div>
  <!--    选择站点-->
  <choose-station
    ref="chooseStation"
    v-model:visible="visible"
    class="display-center"
    @updateCheckData="updateCheckData"
  />
</template>

<script>
import { PayTypes } from '@/views/ticket/js/index.js';
import chooseStation from '@/views/ticketCard/components/ChooseStation.vue';
import { getAssetsFile } from '@/utils/tool';
import { mapGetters } from 'vuex';
import { payMethods } from '@/views/ticketCard/enum.ts';
// import { PayType } from '@/views/ticket/js/index.js';

export default {
  name: 'Update',
  components: {
    chooseStation
  },
  filters: {},
  props: {},
  data() {
    return {
      isPrint: false,
      visible: false,
      lang: window.localStorage.getItem('lang') === 'en' ? 'En' : 'Cn'
    };
  },
  computed: {
    ...mapGetters({
      getCardData: 'getCardData',
      processType: 'getCardProcessType',
      cardUpdate: 'getCardUpdate',
      cardResult: 'getCardResult',
      IsQrPayEnable: 'IsQrPayEnable',
      IsDigCashPayEnable: 'IsDigCashPayEnable',
      IsCoinPayEnable: 'IsCoinPayEnable',
      getIsPaymentArea: 'getIsPaymentArea'
    }),
    resStationName() {
      if (this.lang == 'En') {
        return this.$ChStationToEn(this.cardUpdate.stationName);
      } else {
        return this.cardUpdate.stationName;
      }
    },
    payTypeData() {
      const payTypes = [
        {
          imgUrl: getAssetsFile('icon_scan.png'),
          text: this.$t('scan'),
          code: payMethods['QRCodeMethod'],
          isUse: this.qrUse
        },
        {
          imgUrl: getAssetsFile('icon_cash.png'),
          text: this.$t('cash'),
          code: payMethods['cashMethod'],
          isUse: this.cashUse
        },
        {
          imgUrl: getAssetsFile('icon_cny.png'),
          text: this.$t('digitalrmb'),
          code: payMethods['numberMethod'],
          isUse: this.numberUse
        },
        {
          imgUrl: getAssetsFile('icon_card.png'),
          text: this.$t('Balance'),
          code: payMethods['remainder'],
          isUse: this.isCardPay
        }
      ];
      return payTypes;
    },
    // 获取票卡种类类型
    cardCategoryTypeRes() {
      if (
        this.cardResult.cardType == 1 ||
        this.cardResult.cardType == 3 ||
        this.cardResult.cardType == 7 ||
        this.cardResult.cardType == 8
      ) {
        return 'money';
      } else if (
        this.cardResult.cardType == 2 ||
        this.cardResult.cardType == 4 ||
        this.cardResult.cardType == 5 ||
        this.cardResult.cardType == 6
      ) {
        return 'frequency';
      } else {
        return null;
      }
    },
    cashUse() {
      let res = true;
      if (
        !this.IsCoinPayEnable ||
        this.cardResult.processInfo.amount % 100 != 0 ||
        (this.cardCategoryTypeRes === 'frequency' && !this.getIsPaymentArea)
      ) {
        res = false;
      }
      return res;
    },
    qrUse() {
      let res = true;
      if (
        !this.IsQrPayEnable ||
        (this.cardCategoryTypeRes === 'frequency' && !this.getIsPaymentArea)
      ) {
        res = false;
      }
      return res;
    },
    numberUse() {
      let res = true;
      if (
        !this.IsQrPayEnable ||
        (this.cardCategoryTypeRes === 'frequency' && !this.getIsPaymentArea)
      ) {
        res = false;
      }
      return res;
    },
    isCardPay() {
      let res = false;
      // 单程票不可以用卡扣
      // 卡内余额小于支付金额禁用卡扣
      // 卡内次数不足禁用卡扣
      // 付费区次卡
      // 超时时禁用卡扣
      if (
        this.cardResult.cardType === 1 ||
        (this.cardCategoryTypeRes == 'money' &&
          this.cardResult['cardBalance'] <
            this.cardResult.processInfo.amount) ||
        (this.cardCategoryTypeRes == 'frequency' &&
          this.cardResult['cardBalance'] < 1) ||
        (this.cardCategoryTypeRes == 'frequency' && this.getIsPaymentArea) ||
        this.cardResult.processInfo.adjustType == 'AdjustFareOverTime'
      ) {
        res = false;
      } else {
        res = true;
      }
      return res;
    },
    lastECarddata() {
      console.log(this.cardResult?.tripRecordList?.[0]);
      console.log(this.cardResult?.tripRecordList?.[0]?.inStationNameCn);
      return this.cardResult?.tripRecordList?.[0] || {};
    }
  },
  watch: {
    cardResult: {
      deep: true,
      handler: function (val) {
        if (val.sts == 301 || val.sts == 302) {
          this.$router.push({
            name: 'updatePayGuide'
          });
          // 不需要支付比如卡扣或者支付0元情况
        } else if (val.sts == 204) {
          this.$router.push({
            name: 'updatePayResult'
          });
        }
      }
    }
  },
  mounted() {
    console.log('makeUpTicket-lastECarddata', this.lastECarddata);
    console.log('makeUpTicket-lastECarddata', this.lang);
    window['onPay'] = type => {
      let pay = new PayTypes(type);
      this.choosePayType(pay.code);
    };
    // 单程票只有补进站默认是发售站，
    // 次卡不论是补出站还是补进站默认是本站不可选
    if (this.cardResult.cardType == 1) {
      this.$store.commit('setCardUpdate', {
        stationName: this.cardResult['startStationCn'],
        stationId: 0
      });
      window?.bridge?.triggerProcessCardBusiness(
        JSON.stringify({
          api: 'ProcessCardBusiness',
          param: { ...this.cardUpdate }
        })
      );
    } else if (
      this.cardCategoryTypeRes == 'frequency' &&
      !this.getIsPaymentArea
    ) {
      let currentSiteStr = window?.bridge?.getCurrentFounderStationInfo?.();
      let currentSite;
      if (currentSiteStr) {
        currentSite = JSON.parse(currentSiteStr);
      }
      this.$store.commit('setCardUpdate', {
        stationName: currentSite.stationName,
        stationId: currentSite.stationId
      });
      window?.bridge?.triggerProcessCardBusiness(
        JSON.stringify({
          api: 'ProcessCardBusiness',
          param: { ...this.cardUpdate }
        })
      );
    }
  },
  beforeUnmount() {
    window['onPay'] = () => null;
  },
  methods: {
    showDialog(val) {
      if (
        val == 'start' &&
        this.cardResult.processInfo.adjustType === 'AdjustEntryStation'
      ) {
        this.visible = true;
        this.$nextTick(() => {
          this.$refs.chooseStation.init();
        });
      } else if (
        val == 'end' &&
        this.cardResult.processInfo.adjustType === 'AdjustExitStation'
      ) {
        this.visible = true;
        this.$nextTick(() => {
          this.$refs.chooseStation.init();
        });
      }
    },
    updateCheckData(val) {
      this.$store.commit('setCardUpdate', {
        stationName: val.stationName,
        stationId: val.stationId
      });
      console.log('this.cardUpdate.value', this.cardUpdate);
      window?.bridge?.triggerProcessCardBusiness(
        JSON.stringify({
          api: 'ProcessCardBusiness',
          param: { ...this.cardUpdate }
        })
      );
    },
    // 补出站超时或者超程才需要选择支付方式，进站不需要
    choosePayType(code) {
      let isUse = false;
      if (code == payMethods['cashMethod']) {
        isUse = this.cashUse;
      } else if (code == payMethods['QRCodeMethod']) {
        isUse = this.qrUse;
      } else if (code == payMethods['numberMethod']) {
        isUse = this.numberUse;
      } else if (code == payMethods['remainder']) {
        isUse = this.isCardPay;
      }
      console.log('isUse--', isUse);
      if (!isUse) {
        return;
      }
      // <!--支付方式:不是补进站或者补超时需要付钱的-->
      if (
        (this.cardResult.processInfo.adjustType != 'AdjustEntryStation' &&
          this.cardResult.processInfo.adjustType != 'AdjustFareOverTime') ||
        (this.cardResult.processInfo.adjustType == 'AdjustFareOverTime' &&
          this.cardResult.processInfo.amount)
      ) {
        console.log('this.cardUpdate.stationName', this.cardUpdate.stationName);
        // 补出站才需要选站
        if (
          this.cardResult.processInfo.adjustType === 'AdjustExitStation' &&
          !this.cardUpdate.stationName
        ) {
          return this.$subwayInfo.normalInfo(
            this.lang == 'en'
              ? 'Please select a station first'
              : '请先选择站点！'
          );
        }
        this.$store.commit('setCardUpdate', {
          paymentType: code,
          isPrint: this.isPrint,
          amount: this.cardResult.processInfo.amount
        });
        console.log('this.cardUpdate.value', this.cardUpdate);
        // mediumType:0==实体票，2==电子票
        window?.bridge?.triggerProcessCardBusiness(
          JSON.stringify({
            api: 'ProcessCardBusiness',
            param: {
              ...this.cardUpdate,
              isConfirm: true
            }
          })
        );
      }
    },
    handlerUpdate() {
      // 这个是补进站和超时补0元可以免费更新， 注：补出站需要判断下是否选站
      if (
        !this.cardUpdate.stationName &&
        this.cardResult.processInfo.adjustType == 'AdjustEntryStation'
      ) {
        return this.$subwayInfo.normalInfo(
          this.lang == 'en' ? 'Please select a station first' : '请先选择站点！'
        );
      }
      // 补进站不需要付钱,默认使用现金支付直接更新
      window?.bridge?.triggerProcessCardBusiness(
        JSON.stringify({
          api: 'ProcessCardBusiness',
          param: {
            ...this.cardUpdate,
            paymentType: payMethods['cashMethod'],
            isConfirm: true
          }
        })
      );
    },
    handlerQrUpdate() {
      // 这个是二维码补票  补出站或者补进站需要选站 需要判断
      if (
        (this.cardResult.processInfo.adjustType === 'AdjustExitStation' &&
          !this.cardUpdate.stationName) ||
        (!this.cardUpdate.stationName &&
          this.cardResult.processInfo.adjustType == 'AdjustEntryStation')
      ) {
        return this.$subwayInfo.normalInfo(
          this.lang == 'en' ? 'Please select a station first' : '请先选择站点！'
        );
      }
      // 二维码补充站点,默认使用卡扣
      window?.bridge?.triggerProcessCardBusiness(
        JSON.stringify({
          api: 'ProcessCardBusiness',
          param: {
            ...this.cardUpdate,
            paymentType: payMethods['remainder'],
            isConfirm: true
          }
        })
      );
    }
  }
};
</script>

<style lang="scss" scoped>
// in-And-out
.card {
  height: 523px;
  width: 1140px;
  box-sizing: border-box;
  padding: 28px 30px;
  margin: auto;
  margin-top: 14px;
  background: url('../../../assets/card-bg.png') center no-repeat;
  background-size: cover;

  .card-title {
    display: flex;
    justify-content: space-between;
    font-size: 26px;
    color: #333333;
    padding: 30px;
    border-bottom: 1px solid #e4e4e4;
  }

  &-top {
    margin-top: 70px;

    &-center {
      width: 40px;
      height: 40px;
      margin-top: 12px;
    }

    &-name {
      width: 180px;
      height: 64px;
      background: #81c661;
      border-radius: 32px;
      line-height: 64px;
      margin: auto;
      font-size: 28px;
      font-weight: 400;
      color: #ffffff;
    }

    &-text {
      margin-top: 40px;
      height: 36px;
      line-height: 36px;
      font-size: 36px;
      font-weight: bold;
      color: #333333;
    }

    &-right {
      .card-top-name {
        background: #e35145;
      }
    }
  }

  &-bottom {
    font-size: 30px;
    font-weight: 400;
    color: #333333;
    margin-top: 50px;
    text-align: center;
  }
}

.color-orange {
  color: #e8730b;
}

.mode-wrapper {
  margin-top: -14px;

  .Payment {
    margin-left: 450px;
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
  margin: 0px auto 0px;
  display: flex;
  align-items: center;
}

@media screen and (max-width: 1180px) {
  .card {
    height: 500px;
    width: auto;
    box-sizing: border-box;
    padding: 28px 50px;
    margin-top: 258px;
    background: url('../../../assets/card-bg.png') center no-repeat;
    background-size: contain;

    &-bottom {
      font-size: 30px;
      font-weight: 400;
      color: #333333;
      margin-top: 26px;
      text-align: center;
    }
  }

  .mode-wrapper {
    margin-top: -14px;

    .Payment {
      margin-left: 30px;
      height: 30px;
      font-size: 30px;
      font-weight: 500;
      color: #4868c1;
      line-height: 30px;
      margin-top: 30px;
    }

    .mode-wrapper-cont {
      width: auto;
      margin: auto 26px;
      margin-top: 34px;

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

.bg-update {
  background: linear-gradient(360deg, #5687fc 0%, #6f99ff 100%);
  box-shadow: 0px 4px 5px 0px rgba(86, 135, 252, 0.4);
}
</style>
