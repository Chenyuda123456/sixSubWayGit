<template>
  <div class="ticket-info-box p-20 pt-24">
    <div class="flex justify-between items-center pb-24 text-blue h-[78px]">
      <span class="text-lg font-bold">{{
        cardResult['cardType' + lang] || $t('ElectronicTicket')
      }}</span>
      <span class="text-[28px]">{{
        cardResult['cardLogicId'] || lastECarddata['userId']
      }}</span>
    </div>
    <div
      class="p-20 rounded-[20px] border-2 border-dashed border-[#B3C5FF] h-[474px]"
    >
      <div v-if="cardResult.mediumType == 0" v-cloak class="list">
        <div>
          <div class="flex flex-wrap">
            <div class="flex text-[28px] mb-[22px]">
              <span class="text-gray text-opacity-60 w-[180px] mr-6">{{
                $t('usedBus')
              }}</span>
              <span
                v-en="{
                  bigScreen: {
                    width: cardResult['cardType'] == 1 ? '216px' : 'auto'
                  },
                  smallScreen: {
                    width: cardResult['cardType'] == 1 ? '280px' : 'auto'
                  }
                }"
                class="text-gray font-bold station-name"
                >{{
                  cardResult['lastStation' + lang] || $t('NotObtained')
                }}</span
              >
            </div>
            <!--只有单程票显示-->
            <div
              v-if="cardResult['cardType'] == 1"
              class="flex text-[28px] mb-[22px]"
            >
              <span class="text-gray text-opacity-60 w-[180px] mr-6">{{
                $t('Departure')
              }}</span>
              <span
                v-en="{
                  bigScreen: {
                    width: cardResult['cardType'] == 1 ? '216px' : 'auto'
                  },
                  smallScreen: {
                    width: cardResult['cardType'] == 1 ? '280px' : 'auto'
                  }
                }"
                class="text-gray font-bold station-name"
                >{{
                  cardResult['startStation' + lang] || $t('NotObtained')
                }}</span
              >
            </div>
            <div v-else></div>
            <div class="flex text-[28px] mb-[22px]">
              <span class="text-gray text-opacity-60 w-[180px] mr-6">{{
                cardCategoryTypeRes == 'money'
                  ? $t('remainMoney')
                  : cardCategoryTypeRes == 'frequency'
                  ? $t('remainTimes')
                  : cardCategoryTypeRes == 'day'
                  ? $t('remainDay')
                  : $t('NotObtained')
              }}</span>
              <span class="text-gray font-bold">{{
                cardCategoryTypeRes == 'unclear'
                  ? $t('NotObtained')
                  : cardCategoryTypeRes == 'money'
                  ? cardResult['cardBalance'] / 100 + $t('yuan')
                  : cardCategoryTypeRes == 'frequency'
                  ? cardResult['cardBalance'] + $t('times')
                  : $t('NotObtained')
              }}</span>
            </div>
            <div class="flex text-[28px] mb-[22px]">
              <span class="text-gray text-opacity-60 w-[180px] mr-6">{{
                $t('MonthlyRideCount')
              }}</span>
              <span class="text-gray font-bold">{{
                cardResult['monthlyRideTimes'] + $t('times')
              }}</span>
            </div>
            <div class="flex text-[28px] mb-[22px]">
              <!--车票状态-->
              <span class="text-gray text-opacity-60 w-[180px] mr-6">{{
                $t('ticketStatus')
              }}</span>
              <span class="text-orange font-bold">{{
                cardSts ? cardSts : $t('NotObtained')
              }}</span>
            </div>
            <div class="flex text-[28px]">
              <span class="text-gray text-opacity-60 w-[180px] mr-6">{{
                $t('travelStatus')
              }}</span>
              <span class="text-gray font-bold">{{
                cardResult['journeyStatus'] == 1
                  ? $t('NoCheckIn')
                  : cardResult['journeyStatus'] == 2
                  ? $t('CheckIn')
                  : cardResult['journeyStatus'] == 3
                  ? $t('updated')
                  : $t('NotObtained')
              }}</span>
            </div>
            <div class="flex text-[28px] mb-[22px]">
              <span class="text-gray text-opacity-60 w-[180px] mr-6">{{
                $t('expireDate')
              }}</span>
              <span class="text-gray font-bold">{{
                cardResult['validity']?.length
                  ? cardResult['validity'].slice(0, 10)
                  : $t('NotObtained')
              }}</span>
            </div>
          </div>
          <div class="flex text-[28px] mb-[22px]">
            <span class="text-gray text-opacity-60 w-[180px] mr-6">{{
              $t('usedTime')
            }}</span>
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
          <div class="flex text-[28px] mb-[22px]">
            <span class="text-gray text-opacity-60 w-[180px] mr-6">{{
              $t('RefusalInformation')
            }}</span>
            <span class="text-gray font-bold" style="flex: 1">{{
              cardResult['refuseCauseInfo' + lang] || $t('NotObtained')
            }}</span>
          </div>
          <div v-if="props.isShowInfo" class="flex text-[28px]">
            <span class="text-gray text-opacity-60 w-[180px] mr-6">{{
              $t('PromptInformation')
            }}</span>
            <span class="text-gray font-bold" style="flex: 1">{{
              cardResult['promptInfo' + lang] || $t('NotObtained')
            }}</span>
          </div>
        </div>
      </div>
      <div v-cloak v-else class="list">
        <div>
          <div class="flex flex-wrap">
            <div class="flex text-[28px] mb-[22px]">
              <span class="text-gray text-opacity-60 w-[180px] mr-6">{{
                $t('EntryStatus')
              }}</span>
              <span class="text-gray font-bold">
                {{
                  lastECarddata['inStatus'] == '00'
                    ? $t('NotEntered')
                    : lastECarddata['inStatus'] == '01'
                    ? $t('HasEntered')
                    : $t('NotObtained')
                }}
              </span>
            </div>
            <div class="flex text-[28px] mb-[22px]">
              <span class="text-gray text-opacity-60 w-[180px] mr-6">{{
                $t('EntryStation')
              }}</span>
              <span
                v-en="{
                  bigScreen: {
                    width: cardResult['cardType'] == 1 ? '216px' : 'auto'
                  },
                  smallScreen: {
                    width: cardResult['cardType'] == 1 ? '280px' : 'auto'
                  }
                }"
                class="text-gray font-bold station-name"
              >
                {{ lastECarddata['inStationName' + lang] || $t('NotObtained') }}
              </span>
            </div>
            <div class="flex text-[28px] mb-[22px]">
              <span class="text-gray text-opacity-60 w-[180px] mr-6">{{
                $t('EntryLine')
              }}</span>
              <span class="text-gray font-bold">
                {{ lastECarddata['inLineName' + lang] || $t('NotObtained') }}
              </span>
            </div>

            <div class="flex text-[28px] mb-[22px]">
              <span class="text-gray text-opacity-60 w-[180px] mr-6">{{
                $t('ExitStatus')
              }}</span>
              <span class="text-gray font-bold">
                {{
                  lastECarddata['outStatus'] == '00'
                    ? $t('NotExited')
                    : lastECarddata['outStatus'] == '01'
                    ? $t('HasExited')
                    : $t('NotObtained')
                }}
              </span>
            </div>

            <div class="flex text-[28px] mb-[22px]">
              <span class="text-gray text-opacity-60 w-[180px] mr-6">{{
                $t('ExitStation')
              }}</span>
              <span
                v-en="{
                  bigScreen: {
                    width: cardResult['cardType'] == 1 ? '216px' : 'auto'
                  },
                  smallScreen: {
                    width: cardResult['cardType'] == 1 ? '280px' : 'auto'
                  }
                }"
                class="text-gray font-bold station-name"
              >
                {{
                  lastECarddata['outStationName' + lang] || $t('NotObtained')
                }}
              </span>
            </div>

            <div class="flex text-[28px] mb-[22px]">
              <span class="text-gray text-opacity-60 w-[180px] mr-6">{{
                $t('ExitLine')
              }}</span>
              <span class="text-gray font-bold">
                {{ lastECarddata['outLineName' + lang] || $t('NotObtained') }}
              </span>
            </div>

            <div class="flex text-[28px] mb-[22px]">
              <span class="text-gray text-opacity-60 w-[180px] mr-6">{{
                $t('EntryReEntry')
              }}</span>
              <span class="text-gray font-bold">{{
                lastECarddata['canClaimIn'] === 0
                  ? $t('NotAllowed')
                  : lastECarddata['canClaimIn'] === 1
                  ? $t('Allowed')
                  : $t('NotObtained')
              }}</span>
            </div>
            <div class="flex text-[28px] mb-[22px]">
              <span class="text-gray text-opacity-60 w-[180px] mr-6">{{
                $t('EntryCancellation')
              }}</span>
              <span class="text-gray font-bold">{{
                lastECarddata['canCancelIn'] === 0
                  ? $t('NotAllowed')
                  : lastECarddata['canCancelIn'] === 1
                  ? $t('Allowed')
                  : $t('NotObtained')
              }}</span>
            </div>
            <div class="flex text-[28px] mb-[22px]">
              <span class="text-gray text-opacity-60 w-[180px] mr-6">{{
                $t('ExitReEntry')
              }}</span>
              <span class="text-gray font-bold">{{
                lastECarddata['canClaimOut'] === 0
                  ? $t('NotAllowed')
                  : lastECarddata['canClaimOut'] === 1
                  ? $t('Allowed')
                  : $t('NotObtained')
              }}</span>
            </div>
            <div class="flex text-[28px] mb-[22px]">
              <span class="text-gray text-opacity-60 w-[180px] mr-6">{{
                $t('ExitCancellation')
              }}</span>
              <span class="text-gray font-bold">{{
                lastECarddata['canCancelOut'] === 0
                  ? $t('NotAllowed')
                  : lastECarddata['canCancelOut'] === 1
                  ? $t('Allowed')
                  : $t('NotObtained')
              }}</span>
            </div>
            <div class="flex text-[28px] mb-[22px]">
              <!--车票状态-->
              <span class="text-gray text-opacity-60 w-[180px] mr-6">{{
                $t('ticketStatus')
              }}</span>
              <span class="text-orange font-bold">{{
                lastECarddata['tripSts'] === 0
                  ? $t('notEntered')
                  : lastECarddata['tripSts'] === 1
                  ? $t('Entered')
                  : lastECarddata['tripSts'] === 2
                  ? $t('TripEnd')
                  : lastECarddata['tripSts'] === 3
                  ? $t('TripCancellation')
                  : $t('NotObtained')
              }}</span>
            </div>
          </div>

          <div class="flex text-[28px] mb-[22px]">
            <span class="text-gray text-opacity-60 w-[180px] mr-6">{{
              $t('EntryTime')
            }}</span>
            <span class="text-gray font-bold">
              {{
                lastECarddata['inTime']
                  ? lastECarddata['inTime'].substring(0, 10) +
                    ' ' +
                    lastECarddata['inTime'].substring(10)
                  : $t('NotObtained')
              }}
            </span>
          </div>
          <div class="flex text-[28px] mb-[22px]">
            <span class="text-gray text-opacity-60 w-[180px] mr-6">{{
              $t('ExitTime')
            }}</span>
            <span class="text-gray font-bold">
              {{
                lastECarddata['outTime']
                  ? lastECarddata['outTime'].substring(0, 10) +
                    ' ' +
                    lastECarddata['outTime'].substring(10)
                  : $t('NotObtained')
              }}
            </span>
          </div>

          <div class="flex text-[28px] mb-[22px]">
            <span class="text-gray text-opacity-60 w-[180px] mr-6">{{
              $t('RefusalInformation')
            }}</span>
            <span class="text-gray font-bold" style="flex: 1">{{
              lastECarddata['unconfirmableReason'] || $t('NotObtained')
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const store = useStore();
const route = useRoute();
const lang = window.localStorage.getItem('lang') === 'en' ? 'En' : 'Cn';
const props = defineProps({
  isShowInfo: {
    default: false,
    type: Boolean
  }
});
const cardResult = computed(() => store.state.card.cardResult);
const lastECarddata = computed(
  () => cardResult?.value?.tripRecordList?.[0] || {}
);
// 获取票卡种类类型
const cardCategoryTypeRes = computed(() => {
  if (
    cardResult.value.cardType == 2 ||
    cardResult.value.cardType == 1 ||
    cardResult.value.cardType == 3 ||
    cardResult.value.cardType == 7 ||
    cardResult.value.cardType == 8
  ) {
    return 'money';
  } else if (
    cardResult.value.cardType == 4 ||
    cardResult.value.cardType == 5 ||
    cardResult.value.cardType == 6
  ) {
    return 'frequency';
  } else {
    return '';
  }
});
// 获取票卡状态 具体意思可以看 enum.ts->cardSts
const cardSts = computed(() => {
  if (cardResult.value.cardSts == 0) {
    return t('Uninitialized');
  } else if (cardResult.value.cardSts == 1) {
    return t('ForSale');
  } else if (cardResult.value.cardSts == 2) {
    return t('Sold');
  } else if (cardResult.value.cardSts == 3) {
    return t('Reclaimed');
  } else if (cardResult.value.cardSts == 4) {
    return t('BlacklistedAndLockedCard');
  } else if (cardResult.value.cardSts == 5) {
    return t('BlacklistedCardNotAllowedToEnterOrExitTheStation');
  } else if (cardResult.value.cardSts == 6) {
    return t('BlacklistedCardNotAllowedToEnterTheStation');
  } else if (cardResult.value.cardSts == 7) {
    return t('BlacklistedCardAllowedToEnterButNotExitTheStation');
  } else if (cardResult.value.cardSts == 8) {
    return t('BlacklistedCardAllowedToEnterAndExitTheStation');
  } else {
    return t('NotObtained');
  }
});
</script>

<style scoped lang="scss">
.ticket-info-box {
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
  border-radius: 30px;
}

.btn-box {
  width: 255px;
  height: 170px;
  box-shadow: 0px 6px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  @apply flex flex-col items-center justify-center text-base text-white;
  &.btn-xingcheng {
    background: linear-gradient(270deg, #3c76ff 0%, #719bff 100%);
  }

  &.btn-chongzhi {
    background: linear-gradient(90deg, #4ade8a 0%, #39c788 100%);
  }

  &.btn-gengxin {
    background: linear-gradient(270deg, #41a9fe 0%, #71c3ff 100%);
  }

  &.btn-tuipiao {
    background: linear-gradient(270deg, #3665bf 0%, #6389d9 100%);
  }
}

.flex-wrap > div {
  width: 50%;
}
.list {
  height: 100%;
  overflow: auto;
  //display: flex;
  //align-items: center;
  &::-webkit-scrollbar {
    width: 6px;
    background: #ffffff;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  &::-webkit-scrollbar-track {
    background: #ffffff;
  }

  /*定义滑块 内阴影+圆角*/
  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.2);
  }

  :deep .van-list__finished-text {
    margin: auto;
  }
  .station-name {
    white-space: normal;
    word-break: keep-all;
    overflow-wrap: break-word;
  }
}
</style>
