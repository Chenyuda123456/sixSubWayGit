<template>
  <div v-if="data.cardType == 2" style="text-align: center">
    <div class="text-2xl font-bold text-blue mt-[288px] xl:mt-[20px]">
      {{ $t('MethodOne') }}
    </div>
    <img
      src="@/assets/img_code@2x.png"
      alt=""
      class="block m-auto mt-[120px] xl:mt-[30px] xl:w-[600px] w-[760px]"
    />
    <div
      class="color-gray text-base text-gray mt-40 text-opacity-60 xl:mt-[30px]"
    >
      {{ $t('ReadingQR') }}
    </div>
    <div class="text-2xl font-bold text-blue mt-[40px]">
      {{ $t('MethodTwo') }}
    </div>
    <button
      :class="{
        grayScale: data.isInputSearch
      }"
      class="px-[80px] mt-[30px] w-[auto] h-[88px] leading-88 bg-update text-white text-lg text-center xl:rounded-[12px] rounded-[20px] xl:mx-20"
      @click="handlerInput"
    >
      {{ $t('InquireByEnteringThePhoneNumberAndIDCardNumber') }}
    </button>
  </div>
  <div v-else style="text-align: center">
    <div class="text-2xl font-bold text-blue mt-[288px] xl:mt-[20px]">
      {{ $t('PleasePlaceYourTicketOnTheCardReader') }}
    </div>
    <img
      src="@/assets/img_card@2x.png"
      alt=""
      class="block m-auto mt-[120px] xl:mt-[80px] xl:w-[600px] w-[760px]"
    />
    <div class="color-gray text-base text-gray mt-40 text-opacity-60">
      {{ $t('ReadingCard') }}
    </div>
    <div class="mt-60 text-blue text-base">
      {{ $t('PleaseDoNotMoveYourCardFromTheCardReadingArea') }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
import { useStore } from 'vuex';
const store = useStore();
const data = reactive({
  cardType: route.query.cardType,
  backTimer: null,
  isInputSearch: false
});
const cardResult = computed(() => store.state.card.cardResult);
const cardUpdate = computed(() => store.state.card.cardUpdate);
watch(
  cardResult,
  newValue => {
    if (newValue.userInfo && newValue.userInfo.userId) {
      router.push({ name: 'baseInfoECard' });
    }
    if (newValue.sts == 999 && newValue.substs == 258 && data.isInputSearch) {
      // 扫码结束后去获取输入查询app列表
      setTimeout(() => {
        store.commit('setCardUpdate', {
          processType: 'UpdateCard',
          // 行程查询方式，1、手动输入查询 2、基于扫码查询  3、基于读到卡号查询
          queryMethod: 1,
          mediumType: 4,
          isConfirm: false
        });
        console.log(cardUpdate.value);
        window?.bridge?.triggerProcessCardBusiness(
          JSON.stringify({
            api: 'ProcessCardBusiness',
            param: { ...cardUpdate.value }
          })
        );
      }, 100);
    }
    // 已经获取到app列表
    if (newValue.ChannelRecordList && newValue.ChannelRecordList.length) {
      router.push({ name: 'inputQueryECard' });
    }
  },
  { deep: true }
);
const handlerInput = () => {
  if (!data.isInputSearch) {
    data.isInputSearch = true;
    window?.bridge?.triggerCancelBusiness(true, true);
  }
};
onMounted(() => {
  console.log(data.cardType);
  if (data.cardType == 2) {
    // 二维码查询卡 mediumType是2, 后面确认行程查询是3
    store.commit('setCardUpdate', {
      processType: 'UpdateCard',
      // 行程查询方式，1、手动输入查询 2、基于扫码查询  3、基于读到卡号查询
      queryMethod: 2,
      mediumType: Number(data.cardType),
      isConfirm: false
    });
    window?.bridge?.triggerProcessCardBusiness(
      JSON.stringify({
        api: 'ProcessCardBusiness',
        param: { ...cardUpdate.value }
      })
    );
  } else {
    // 银联卡8也叫闪付卡和数币卡9查询（实体卡）
    store.commit('setCardUpdate', {
      processType: 'UpdateCard',
      // 行程查询方式，1、手动输入查询 2、基于扫码查询  3、基于读到卡号查询
      queryMethod: 3,
      mediumType: Number(data.cardType),
      isConfirm: false
    });
    window?.bridge?.triggerProcessCardBusiness(
      JSON.stringify({
        api: 'ProcessCardBusiness',
        param: { ...cardUpdate.value }
      })
    );
  }

  // data.backTimer = setTimeout(() => {
  //   router.push({
  //     name: 'console'
  //   });
  // }, 2000);
});
onUnmounted(() => {
  data.backTimer && clearTimeout(data.backTimer);
});
</script>

<style lang="scss" scoped>
.bg-update {
  background: linear-gradient(360deg, #5687fc 0%, #6f99ff 100%);
  box-shadow: 0px 4px 5px 0px rgba(86, 135, 252, 0.4);
}
</style>
