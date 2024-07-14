<template>
  <div class="outer-wrapper m-auto">
    <div class="text-2xl font-bold leading-66 text-center text-blue pt-80">
      {{ $t('PleaseSelectTheMethodForElectronicTicketInquiry') }}
    </div>
    <div class="flex flex-wrap items-center justify-center mt-80 container-box">
      <div class="container container" @click="jumpReadCard(2)">
        <img src="@/assets/icon_mode_app.png" alt="" />
        <div
          v-en="{
            bigScreen: {
              paddingLeft: '20px',
              paddingRight: '20px'
            }
          }"
          class="text-[44px] xl:mt-[66px] mt-[0px] font-bold"
        >
          {{ $t('APPElectronicTicket') }}
        </div>
      </div>
      <div class="container container" @click="jumpReadCard(9)">
        <img src="@/assets/icon_mode_cny.png" alt="" />
        <div class="text-[44px] xl:mt-[66px] mt-[0px] font-bold">
          {{ $t('ERMBElectronicTicket') }}
        </div>
      </div>
      <div class="container container" @click="jumpReadCard(8)">
        <img src="@/assets/icon_mode_cup.png" alt="" />
        <div class="text-[44px] xl:mt-[66px] mt-[0px] font-bold">
          {{ $t('UnionPayCardElectronicTicket') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
const router = useRouter();
const store = useStore();
// 读卡之前重置本地的票卡信息
store.commit('cardReset');
// 0 二维码
// 1 实体票
const jumpReadCard = cardType => {
  router.push({
    name: 'readECard',
    query: {
      cardType
    }
  });
};
</script>
<style scoped lang="scss">
@media screen and (min-width: 1280px) {
  .outer-wrapper {
  }
  .container {
    margin: 0 40px;
    width: 480px;
    height: 520px;
    border-radius: 32px;
    padding-top: 120px;
    box-sizing: border-box;
    @apply text-white text-center;
    img {
      @apply inline-block;
      width: 140px;
    }
    &.container {
      color: #4868c1;
      background: linear-gradient(180deg, #ffffff 0%, #edf6ff 100%);
      box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.06);
      border-radius: 32px;
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
    flex-direction: column;
  }
  .container {
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
    align-items: center;
    width: 1000px;
    height: 200px;
    box-sizing: border-box;
    padding: 0 70px 0 80px;
    background: linear-gradient(180deg, #ffffff 0%, #edf6ff 100%);
    box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.06);
    border-radius: 32px;
    margin: auto;
    margin-bottom: 40px;

    color: #4868c1;
    img {
      width: 140px;
      height: 140px;
    }
  }
}
</style>
