<template>
  <div
    :class="isPositionRight ? 'stepSite-style-right' : 'stepSite-style-bottom'"
    class="stepSite"
  >
    <div class="hint">
      <img src="@/assets/icon_tips.png" />
      <div class="hint-text">{{ $t('FreeExitTicketsAreBeingIssued') }}</div>
    </div>
    <div class="stepSite-t">
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
          <div class="c-b">0.00</div>
        </div>
        <div class="stepSite-t-r">
          <div class="r-t">{{ $t('payval') }}</div>
          <div class="r-b">0.00</div>
        </div>
      </div>
    </div>
    <div class="stepSite-c">
      <div class="stepSite-c-t display-flex-between">
        <div class="stepSite-c-t-l">{{ $t('IssuedQuantity') }}</div>
      </div>
      <div class="stepSite-c-main">1{{ $t('Ticket') }}</div>
    </div>
    <button
      class="px-[80px] mt-[50px] w-[600px] h-[88px] leading-88 bg-update text-white text-lg text-center xl:rounded-[12px] rounded-[20px] xl:mx-20"
      :class="{
        grayScale: isConfirm
      }"
      @click="handlerConfirm"
    >
      {{ $t('ConfirmIssue') }}
    </button>
  </div>
</template>

<script>
import { mapGetters, useStore } from 'vuex';
export default {
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
      styleRight: true,
      position: 'right',
      date: year + '-' + month + '-' + day,
      userName: '',
      password: '',
      isConfirm: false
    };
  },
  computed: {
    isPositionRight() {
      let store = useStore();
      return store.state.isWidthScreen ? true : false;
    },
    ...mapGetters({
      ticketStatus: 'getTicketStatus'
    })
  },

  mounted() {},
  methods: {
    handlerConfirm() {
      if (!this.isConfirm) {
        this.isConfirm = true;
        window?.bridge?.triggerBuyTickets(
          JSON.stringify({
            specifyType: 1,
            paymentType: 1001,
            srcStationName: window?.bridge?.getDefaultSite(),
            dstStationName: '',
            price: 0,
            number: 1,
            mediumType: 1, // 发售出站票
            isConfirm: true,
            userName: this.$route.query.userName,
            password: this.$route.query.password
          })
        );
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.bg-update {
  background: linear-gradient(360deg, #5687fc 0%, #6f99ff 100%);
  box-shadow: 0px 4px 5px 0px rgba(86, 135, 252, 0.4);
}
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
    height: 266px;
    box-sizing: border-box;
    background: #fff;
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
    }
    .stepSite-c-main {
      line-height: 140px;
      background: #f4f5f9;
      border-radius: 20px;
      text-align: center;
      font-weight: 500;
      font-size: 36px;
      color: #333333;
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
  }
}
</style>
