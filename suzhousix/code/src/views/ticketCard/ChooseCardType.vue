<template>
  <div class="outer-wrapper m-auto">
    <div class="text-2xl font-bold leading-66 text-center text-blue pt-80">
      {{ $t('PleaseSelectTicketType') }}
    </div>
    <div class="flex flex-wrap items-center justify-center mt-80 container-box">
      <div
        v-if="isCardProcess"
        class="container container-l"
        @click="jumpReadCard(0)"
      >
        <div class="font-bold text-2xl">{{ $t('PhysicalTicket') }}</div>
        <img src="@/assets/icon_ticket@2x.png" alt="" />
        <div class="text-base mt-44">{{ $t('SayTicket') }}</div>
      </div>
      <div
        v-if="isCardProcess"
        class="container container-r"
        @click="jumpReadCard(1)"
      >
        <div class="font-bold text-2xl">{{ $t('QRCodeTicket') }}</div>
        <img src="@/assets/icon_e_ticket@2x.png" alt="" />
        <div class="text-base mt-44">{{ $t('SayQRCode') }}</div>
      </div>
      <div v-if="(isBuyOutFare || freeFare) && isPaymentArea">
        <div
          v-if="store.state.isWidthScreen"
          class="container container-FareAdjustment"
          @click="jumpReadCard(2)"
        >
          <div
            v-en="{
              lineHeight: '46px',
              marginTop: '-30px'
            }"
            class="font-bold text-2xl"
          >
            {{ $t('IHaveLostMyCardINeedAReplacementTicket') }}
          </div>
          <img src="@/assets/icon_FareAdjustment.png" alt="" />
          <div class="text-base mt-44">
            {{ $t('YouCanSayToMeIHaveLostMyCardAndINeedAReplacementTicket') }}
          </div>
        </div>
        <div v-else class="container-FareAdjustment" @click="jumpReadCard(2)">
          <img src="@/assets/icon_FareAdjustment.png" alt="" />
          <div class="container-FareAdjustment-r">
            <div class="font-bold text-2xl">
              {{ $t('IHaveLostMyCardINeedAReplacementTicket') }}
            </div>
            <div class="text-base">
              {{ $t('YouCanSayToMeIHaveLostMyCardAndINeedAReplacementTicket') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { computed } from 'vue';
const router = useRouter();
const store = useStore();
let isBuyOutFare = computed(() => store.getters.isBuyOutFare);
let freeFare = computed(() => store.getters.freeFare);
let isCardProcess = computed(() => store.getters.isCardProcess);
let isPaymentArea = computed(() => store.getters.getIsPaymentArea);
// 读卡之前重置本地的票卡信息
store.commit('cardReset');
// 0 实体票
// 1 电子票
const jumpReadCard = cardType => {
  if (cardType == 0) {
    if (isCardProcess.value) {
      router.push({
        name: 'readCard'
      });
    }
  } else if (cardType == 1) {
    if (isCardProcess.value) {
      router.push({
        name: 'chooseECardType',
        query: {
          cardType
        }
      });
    }
  } else if (cardType == 2) {
    router.push({
      name: 'chooseExitType',
      query: {
        cardType
      }
    });
  }
};
</script>
<style scoped lang="scss">
@media screen and (min-width: 1180px) {
  .outer-wrapper {
  }
  .container {
    margin: 0 40px;
    width: 480px;
    height: 520px;
    border-radius: 32px;
    @apply text-white text-center pt-60;
    img {
      @apply inline-block;
      width: 240px;
    }
    &.container-l {
      background: linear-gradient(180deg, #5adfb9 0%, #10c29a 100%);
    }
    &.container-r {
      background: linear-gradient(180deg, #76a3ff 0%, #4c86fb 100%);
    }
    &.container-FareAdjustment {
      background: linear-gradient(360deg, #86a6cf 0%, #a9c5ee 100%);
    }
  }
}

@media screen and (max-width: 1080px) {
  .outer-wrapper {
    margin-top: 122px;
    width: auto;
  }
  .container-box {
    margin-top: 120px;
  }
  .container {
    width: 480px;
    height: 574px;
    border-radius: 32px;
    margin: 0 20px;
    @apply text-white text-center pt-60;
    img {
      @apply inline-block;
      width: 240px;
      margin-top: 40px;
    }
    &.container-l {
      background: linear-gradient(180deg, #5adfb9 0%, #10c29a 100%);
    }
    &.container-r {
      background: linear-gradient(180deg, #76a3ff 0%, #4c86fb 100%);
    }
  }
  .container-FareAdjustment {
    margin-top: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1000px;
    height: 224px;
    background: linear-gradient(360deg, #86a6cf 0%, #a9c5ee 100%);
    border-radius: 32px;
    color: #fff;
    img {
      width: 144px;
      height: 144px;
      margin-right: 40px;
    }
    .container-FareAdjustment-r {
    }
  }
}
</style>
