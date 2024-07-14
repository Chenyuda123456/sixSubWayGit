<template>
  <div class="ticket">
    <subway-head />
    <step-index
      v-if="currentIndex === 1 && isWidthScreen"
      @changeCost="changeCost"
    />
    <step-index-column
      v-if="currentIndex === 1 && !isWidthScreen"
      @changeCost="changeCost"
    />
    <stepDestination v-if="currentIndex === 3" :destination="destination" />
    <!--   <step-site />-->
    <!--    <step-payguide />-->
    <!--    <step-payresult /> -->
    <!-- 存在目的站点 -->
    <step-container
      v-if="currentIndex > 1 && currentIndex !== 3"
      :end-site-name="endSiteName"
    >
      <step-site v-if="currentIndex === 2" @changeCost="changeCost" />
      <step-payguide
        v-if="currentIndex === 4"
        ref="stepPayGuide"
        @goBack="goBack"
      />
      <step-payresult v-if="currentIndex === 5" />
    </step-container>
    <!-- 买几元票 -->
    <subway-foot v-if="currentIndex === 1" />
    <div v-else class="speech-wrapper">
      <speech-card-row
        v-if="isWidthScreen"
        :guide-tip="$t('say')"
        :is-need-t-t-s="false"
        :recommends="asrRecommends"
        :show-title="false"
      />
      <speech-card-col
        v-else
        :guide-tip="$t('say')"
        :is-need-t-t-s="false"
        :recommends="asrRecommends"
        :show-title="false"
      />
      <!-- currentIndex === 4 && !endArrivalSite ? 'buyTicketBack-guide' : '', -->
      <div class="buy-ticket-back-btn-box">
        <buy-ticket-back-btn
          v-if="ticketStatus?.errorList?.length && currentIndex == 5"
          class="buyTicketBack"
          @click="human"
        >
          {{ $t('StaffService') }}
        </buy-ticket-back-btn>
        <buy-ticket-back-btn
          :class="[isWait ? 'disable' : '']"
          class="buyTicketBack"
          @click="goBack"
        >
          {{ timeSecondsText }}（{{ timeSeconds }}）
        </buy-ticket-back-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { inject, ref } from 'vue';
import $ from 'jquery';
import SubwayHead from '@/components/pagehead/SubwayHead.vue';
import SubwayFoot from '@/components/SubwayFoot.vue';
import SpeechCardRow from '@/components/pageSpeech/SpeechCardRow.vue';
import SpeechCardCol from '@/components/pageSpeech/SpeechCardCol.vue';
import StepIndex from './components/stepone/Index.vue';
import StepIndexColumn from './components/stepone/IndexColumn.vue';
import StepDestination from './components/stepDestination.vue';
import StepSite from './components/stepSite.vue';
import StepPayguide from './components/stepPayguide.vue';
import StepPayresult from './components/stepPayresult.vue';
import BuyTicketBackBtn from '@/components/BuyTicketBackBtn.vue';
import StepContainer from './components/StepContainer.vue';
import Protocol from '@/mixins/protocol.ts';
import { mapGetters } from 'vuex';
import { PayTypes, Ticket } from './js/index.js';
import { SecCounter } from '@/utils/tool';
import { getCurrentInstance } from '@vue/runtime-core';
import subwayInfo from '@/components/buyTicket/BuyTicketMessages.js';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { payMethods } from '@/views/ticketCard/enum.ts';
export default {
  name: 'Index',
  components: {
    SubwayHead,
    SubwayFoot,
    SpeechCardRow,
    SpeechCardCol,
    StepIndex,
    StepIndexColumn,
    StepDestination,
    StepSite,
    StepPayguide,
    StepPayresult,
    BuyTicketBackBtn,
    StepContainer
  },
  data() {
    const store = useStore();
    const { t } = useI18n();
    return {
      t: t,
      language: window.language,
      spinning: true,
      endSiteName: '', // 到达站点名称
      destination: '',
      subwayMapShow: true, // 地铁线路显示
      timeSeconds: 120, // 倒计时秒数
      timeSecondsText: t('goBack'), // 倒计时文字
      timer: null,
      isWait: false,
      isWidthScreen: store.state.isWidthScreen
    };
  },
  computed: {
    siteName() {
      if (window.bridge && this.language) {
        return this.language === 'chinese'
          ? window?.bridge?.getDefaultSite()
          : window?.bridge?.getSiteEnName();
      } else {
        return window?.bridge?.getDefaultSite?.() || '东方之门';
      }
    },
    asrRecommends() {
      if (this.currentIndex === 2) {
        return [this.$t('scan'), this.$t('wxpay')];
      } else if (this.currentIndex === 3) {
        return [this.$t('first'), this.$t('second')];
      } else {
        return [];
      }
    },
    ...mapGetters({
      ticketStatus: 'getTicketStatus',
      currentIndex: 'getCurrentIndex',
      endArrivalSite: 'endArrivalSite',
      count: 'getCount',
      price: 'getPrice',
      meetingStatus: 'humanMeetingStatus',
      isBuyFare: 'isBuyFare',
      isBuyOutFare: 'isBuyOutFare',
      IsQrPayEnable: 'IsQrPayEnable',
      IsDigCashPayEnable: 'IsDigCashPayEnable',
      IsCoinPayEnable: 'IsCoinPayEnable',
      payCode: 'getPayCode'
    })
  },
  watch: {
    '$i18n.locale': {
      handler: function () {
        this['goBack']({ isOverTime: false, isReset: true });
      }
    },
    currentIndex: {
      immediate: true,
      handler: function (val, oldVal) {
        console.log('currentIndex', val);
        this.timeSeconds = 120;
        this.timeSecondsText = this.t('goback');
        this.timer && this.timer.countStop();
        if (val && this.spinning) {
          // 关闭loading
          this.spinning = false;
        }
        if (val > 1) {
          this.$nextTick(() => {
            this.returnBtnInit();
          });
          if (val === 4) {
            this.timeSecondsText = this.t('Cancel');
          }
        }
        if (val === 5) {
          this.timeSeconds = window?.config?.electronicInvoice || 120;
          this.returnBtnInit();
        }
        if (oldVal !== 1 && val === 1) {
          // 允许对话
          window?.bridge?.stopTheWorld(false);
          // 出票成功后地铁线路清空
          this.endSiteName = '';
          this.subwayMapShow = false;
          this.$nextTick(() => {
            this.subwayMapShow = true;
          });
        }
        // 界面切换 未打通的情况下 隐藏人工客服
        if (this.meetingStatus == 0) {
          this.$store.commit('setHumanShow', false);
        }
      }
    }
  },
  async mounted() {
    // 清除买票数据
    this.$store.dispatch('clearData');
    this.$store.commit('setCurrentIndex', 1);
    const reload = inject('reload');
    window?.bridge?.onButtonClick('返回');
    const { firstLoad, onShortcut } = Protocol();
    firstLoad(['onShortcut', 'onPay', 'onBuyTicket', 'onWakeupChanged']);

    window['onShortcut'] = words => {
      if (words === '返回' || words === '返回首页') {
        this['goBack']({ isOverTime: false });
      } else {
        onShortcut(words);
      }
    };
    window['onWakeupChanged'] = isWakeup => {
      if (!isWakeup) {
        this['goBack']({ isOverTime: false, isReset: true });
        reload();
      }
    };
    window?.bridge?.changeSkill?.('BuyTickets');
    // let { arrivalSite, destination, count, price, payType, arrivalSiteId } = this.$route.query;
    if (this.$route.query && !$.isEmptyObject(this.$route.query)) {
      this.$route.query.price = this.$route.query.price * 1;
      this.onBuyTickets(this.$route.query);
    } else {
      this.$store.commit('setCurrentIndex', 1);
    }

    window['onBuyTickets'] = options => {
      const json = JSON.parse(options);
      json.price = json.fare;
      let {
        arrivalSite,
        destination,
        count,
        price,
        payType,
        ticketType,
        arrivalSiteId
      } = json;
      console.log(json);
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
        if (this.$store.getters.getIsPaymentArea) {
          this.$router.push({
            name: 'moneyExitFare',
            query: {
              arrivalSite: this.$enStationToCn(arrivalSite), // 到达站点
              destination, // 目的地
              count, // 票数
              price, // 单价
              payType
            }
          });
        } else {
          return window?.bridge?.tts(
            this.$t('ThisDeviceDoesNotSupportCompensationFare')
          );
        }
      } else {
        if (this.$store.getters.getIsPaymentArea) {
          return window?.bridge?.tts(
            this.$t('ThisDeviceDoesNotSupportTicketPurchasing')
          );
        } else {
          this.arrivalSite = this.$enStationToCn(arrivalSite);
          this.onBuyTickets(json);
        }
      }
    };

    // 后端返回的票价 sts 0==初始 999==成功 !999==失败
    window['onTicketPriceGet'] = (arrivalSite, sts, ticketPrice) => {
      console.log('onTicketPriceGet', arrivalSite);
      console.log('onTicketPriceGet', ticketPrice);
      console.log('onTicketPriceGet', sts);
      if (sts == 999) {
        if (
          this.$store.getters['getTicketData']('arrivalSite') == arrivalSite &&
          ticketPrice > 0
        ) {
          this.$store.commit('setTicketData', { price: ticketPrice / 100 });
          if (this.payCode) {
            setTimeout(() => {
              this.$store.commit('setCurrentIndex', 4);
            }, 1000);
          }
        } else {
          this.reload();
          this.$subwayInfo.normalInfo('获取' + arrivalSite + '票价失败！');
        }
      }
    };
  },
  beforeUnmount() {
    // 清除买票数据
    this.clearData();
  },
  methods: {
    // 买票流程（不带支付方式）
    // 1. 根据地铁站或目的地名称获取经纬度
    // 2. 根据筛选后数据个数判断直接进入购票页 or 进入选择终点地图页
    // 3. 根据终点经纬度，计算公交路线，下车步行距离
    // 4. 选择买票数，买票价格，买票方式 -> menupay
    // 买票流程 （带支付方式）
    // 去除步骤三四，直接跳转menupay（默认购买一张）

    // 可能场景：
    // 1. 外部完整指令，然后-> 直接去到后面的操作页. （可能有3）知道目的地后准备票价数据(如果展示2就取出transit数据，加上计算步行距离) ->menupay
    // 2. 按照流程来，逻辑一步一步执行
    // 3. 中间页面发生变化，执行的是onBuyTickets逻辑（最后理）

    async onBuyTickets({
      arrivalSite,
      destination,
      count,
      price,
      payType,
      arrivalSiteId,
      noNLG = false
    }) {
      if (arrivalSite && arrivalSite === this.siteName) {
        window?.bridge?.generateNLG('notsupportlocalticket');
        // subwayInfo.normalInfo('不支持购买本站票');
        return;
      }
      console.log('onBuyTickets--', arrivalSite, destination, count, price);
      let payCode = new PayTypes(payType).code;
      // 0 参数处理
      if (count) {
        if (count > 10) {
          count = 10;
        }
      } // 0 参数处理
      if (price * 1) {
        if (price > this.$store.getters['getMostPrice']) {
          price = this.$store.getters['getMostPrice'];
        }
      }
      if (
        (typeof arrivalSite === 'string' && arrivalSite) ||
        (count && price)
      ) {
        this.$nextTick(() => {
          this.endSiteName = arrivalSite;
        });
      }
      // 带支付方式直接跳转支付页 or 直接进入下一步骤
      // 2:选择张数和支付方式  3:获取目的地的附近地铁站  4：投币或扫码付钱指引
      // 这里是票价购票有price且有支付方式跳转4
      const goNextStep = ({ stepIndex, params, isSkip = !!payCode }) => {
        if (isSkip && params && stepIndex !== 3) {
          this.$store.commit('setTicketData', {
            price: params.price,
            origin: params.origin,
            count: params.count,
            payCode: params.payCode
          });
          if (this.price) {
            this.$nextTick(() => {
              this.$store.commit('setCurrentIndex', 4);
            });
          } else {
            this.$store.commit('setCurrentIndex', stepIndex);
          }
        } else {
          this.$nextTick(() => {
            this.$store.commit('setCurrentIndex', stepIndex);
          });
        }
      };
      // 步骤二:更改买票数据模板
      if (
        this.currentIndex === 2 &&
        this.$store.getters['getTicketData'] &&
        !price &&
        !destination &&
        !arrivalSite &&
        count
      ) {
        this.$store.commit('setTicketData', { count });
        console.log(`购票主界面：步骤二:更改买票数据模板 count=${count}`);
        return;
      }
      let ticket = new Ticket({
        arrivalSite: arrivalSite,
        destination: destination,
        count,
        price: arrivalSite ? 0 : price === 0 ? this.price : price,
        // price: price === 0 ? this.price : price,
        payCode,
        arrivalSiteId: arrivalSiteId
      });
      this.$store.commit('setTicketData', ticket);
      if (destination) {
        this.destination = destination;
        goNextStep({
          params: ticket,
          stepIndex: 3
        });
      } else if (arrivalSite) {
        // 有终点有买票张数
        goNextStep({
          params: { ...ticket, price: 0 },
          stepIndex: 2
        });
        window?.bridge?.trigggerGetPrice(arrivalSite);
      } else if (count) {
        console.log('count', price);
        // 无终点 有买票张数
        this.$store.commit('setTicketData', ticket);
        this.$store.commit('setTransitData', []);
        goNextStep({
          params: ticket,
          stepIndex: 2
        });
        // 内容播报：买票
        console.log(ticket.origin, ticket.count);
        try {
          if (window.bridge && this.currentIndex === 2 && !noNLG) {
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
      }
      // 1
    },
    endSiteNameChange(arrivalSite) {
      this.endSiteName = arrivalSite;
    },
    clearData() {
      window?.bridge?.triggerCancelBusiness(true, true);
      this.$store.commit('setCurrentIndex', 1);
      this.$store.dispatch('clearData');
      this.endSiteName = null;
      this.isWait = false;
      // 清空url上串联数据
      let query = this.$route.query;
      if (query && !$.isEmptyObject(query)) {
        for (let key in query) {
          delete query[key];
        }
      }
    },
    goBack({ isOverTime = false, isReset = false }) {
      console.log('goback--this.currentIndex', this.currentIndex);
      // 超时就直接返回
      if (isOverTime) {
        return this.clearData();
      }
      // 203,204逻辑不让点返回
      if (
        this.isWait ||
        this.ticketStatus.sts == 204 ||
        this.ticketStatus.sts == 203
      ) {
        return;
      }
      // 投钱界面返回提示交易取消
      if (this.currentIndex === 4 && this.ticketStatus.sts) {
        subwayInfo.normalInfo('交易取消!');
      }
      // 投钱界面取消交易
      if (
        (this.currentIndex === 3 && this.arrivalSite && this.price == 0) ||
        (this.currentIndex === 4 && this.ticketStatus.sts) ||
        (this.currentIndex === 5 &&
          this.$store.getters.getPayResult === 'success')
      ) {
        this.isWait = true;
        window?.bridge?.triggerCancelBusiness(true, isOverTime);
        let timer = setInterval(() => {
          if (this.$store.getters.getTicketSts == 999) {
            isOverTime
              ? console.log('触发超时取消')
              : console.log('主动点击取消');
            this.clearData();
            clearInterval(timer);
          }
        }, 200);
      } else if (this.currentIndex === 1 && !isReset) {
        // this.$router.go(-1);
      } else {
        this.clearData();
      }
    },
    human() {
      this.$store.commit('setHumanShow', true);
    },
    reload() {
      this.$store.commit('setCurrentIndex', 1);
      this.$store.dispatch('clearData');
      this.endSiteName = null;
      // 清空url上串联数据
      let query = this.$route.query;
      console.log(`query=`, query);
      if (query && !$.isEmptyObject(query)) {
        for (let key in query) {
          delete query[key];
        }
      }
    },
    changeCost(cost) {
      this.onBuyTickets({ count: 1, price: cost });
    },
    // 返回按钮倒计时
    returnBtnInit() {
      this.timer && this.timer.countStop();
      this.timer = new SecCounter();
      this.timer.countStart(this.timeSeconds, time => {
        this.timeSeconds = time;
        if (time === 0) {
          this.timeSeconds = '';
          // 超时取消
          this.goBack({
            isOverTime: true
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.buy-ticket-back-btn-box {
  position: fixed;
  right: 30px;
  bottom: 30px;
  margin: auto;
  z-index: 999;
  display: flex;
  justify-content: center;
  .buyTicketBack {
    margin: 0 10px;
    &.disable {
      :deep(div) {
        background: #ccc;
      }
    }
  }
}

.buyTicketBack-guide {
  left: 0;
  right: 0;
  bottom: 220px;
}

@media screen and (max-width: 1180px) {
  .buy-ticket-back-btn-box {
    position: fixed;
    right: 0px;
    left: 0;
    bottom: 240px;
    margin: auto;
    z-index: 999;
    display: flex;
    justify-content: center;
    .buyTicketBack {
      margin: 0 10px;
    }
  }
}
</style>
<style>
.selfModal {
  transform: scale(1.6);
  top: 30%;
}
</style>
