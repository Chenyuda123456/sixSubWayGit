<template>
  <div class="stepPayguide display-flex-center van-row--align-center">
    <div>
      <div v-if="ticketStatus?.errorList?.length && ticketStatus.sts === 999">
        <div class="pay-result display-flex-center van-row--align-center">
          <img src="@/assets/icon_chupiao_error.png" />
          <div>
            <div>
              {{
                ticketStatus?.errorList?.length
                  ? ticketStatus.errorList[ticketStatus.errorList.length - 1][
                      'Descript' + lang + 'Detail'
                    ]
                  : ''
              }}
            </div>
            <div>
              {{
                ticketStatus?.errorList?.length
                  ? ticketStatus.errorList[ticketStatus.errorList.length - 1][
                      'Descript' + lang
                    ]
                  : ''
              }}
            </div>
          </div>
        </div>
        <p class="hint">{{ $t('RefundWillBeCompletedWithin13workingDays') }}</p>
        <div class="hint-gray">
          <div>
            {{
              $t(
                'IfYouEncounterARefundFailureOrOtherMalfunctionsPleaseContactStaffService'
              )
            }}
          </div>
          <div>(0512-xxxxxxxx)</div>
        </div>
      </div>
      <div v-else class="pay-ticketing">
        <div
          v-if="payResult == 'success' && !isIssueSuccess"
          class="pay-success pay-result display-flex-center van-row--align-center"
        >
          <img src="@/assets/icon_success.png" />
          <div>
            <div>{{ ticketStatus.loginSts == 1 ? '' : $t('paysuccess') }}</div>
            <div>{{ $t('waitforticket') }}</div>
          </div>
        </div>
        <div
          v-if="payResult == 'fail' && !isIssueSuccess"
          class="pay-fail pay-result display-flex-center van-row--align-center"
        >
          <img src="@/assets/icon_error.png" />
          <div>
            <div>{{ $t('PaymentFailedPleaseRepurchaseTheTicket') }}</div>
            <div>{{ $t('PleaseTakeTheCashFromTheChangeSlotBelow') }}</div>
          </div>
        </div>
        <div v-if="isIssueSuccess" class="pay-ticketing">
          <div class="pay-result display-flex-center van-row--align-center">
            <img src="@/assets/icon_chupiao.png" />
            <div class="text-box">
              <div>
                <div>{{ $t('ticketsuccess') }}</div>
                <div v-if="ticketStatus.outChanged == 0">
                  {{ $t('getticket') }}
                </div>
                <div v-else>{{ $t('getticketAndCoins') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-cloak
        v-if="
          ticketStatus.loginSts != 1 &&
          payCode == payMethods['cashMethod'] &&
          ticketStatus.qrPicInfo
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
          v-show="ticketStatus.qrPicInfo"
          class="qr"
          :src="'data:image/png;base64,' + ticketStatus.qrPicInfo"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { payMethods } from '@/views/ticketCard/enum.ts';
export default {
  name: 'StepPayresult',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      position: 'right',
      isIssueSuccess: false,
      payMethods,
      lang: window.localStorage.getItem('lang') === 'en' ? 'En' : 'Cn'
    };
  },
  computed: {
    ...mapGetters({
      endArrivalSite: 'endArrivalSite',
      ticketStatus: 'getTicketStatus',
      payResult: 'getPayResult',
      payCode: 'getPayCode'
    }),
    isPositionRight() {
      return this.position === 'right';
    }
  },
  watch: {
    ticketStatus: {
      immediate: true,
      deep: true,
      handler: function (val) {
        if (val && val.sts) {
          const { sts, substs } = val;
          if (sts === 999) {
            if (substs === 256 || substs === 257 || substs === 258) {
              this.isIssueSuccess = substs === 256;
              this.$store.commit('setPayResult', null);
              if (val.errorList && val.errorList.length) {
                window?.bridge?.stopTheWorld(true);
              } else {
                window?.bridge?.stopTheWorld(false);
                window?.bridge?.generateNLG('paid');
              }
            }
          }
        }
      }
    }
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.stepPayguide {
  text-align: center;
  box-sizing: border-box;
  margin: auto;
  width: 1080px;
  height: 758px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.1);
  border-radius: 30px;
  margin-top: 36px;
  .pay-result {
    > img {
      width: 160px;
      margin-right: 40px;
    }
    > div {
      text-align: left;
      :nth-child(1) {
        font-size: 40px;
        line-height: 40px;
      }
      :nth-child(2) {
        font-size: 28px;
        line-height: 28px;
        margin-top: 30px;
      }
    }
  }
  .pay-ticketing {
    > p {
      font-size: 28px;
      line-height: 28px;
      margin-top: 80px;
    }

    .qr {
      width: 240px;
      height: 240px;
      margin-top: 40px;
    }
    .hint-gray {
      margin-top: 40px;
      text-align: center;
      font-size: 26px;
      font-weight: 400;
      color: rgba(51, 51, 51, 0.6);
      line-height: 26px;
      box-sizing: border-box;
      > div {
        margin-bottom: 20px;
      }
    }
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
@media screen and (max-width: 1280px) {
  .stepPayguide {
    width: 1028px;
    margin-top: 288px;
  }
}
</style>
