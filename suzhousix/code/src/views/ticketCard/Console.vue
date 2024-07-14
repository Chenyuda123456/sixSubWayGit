<template>
  <div>
    <!--基本信息-->
    <div v-if="!data.isClick" class="mt-[288px] xl:mt-[36px]">
      <div class="w-[1080px] xl:m-auto">
        <BaseInfo
          class="xl:mx-[auto] mx-[26px]"
          :is-show-info="true"
        ></BaseInfo>
      </div>
      <div
        class="mt-60 flex justify-between m-auto mx-[26px] xl:mx-[auto] xl:w-[1080px] xl:mt-30"
      >
        <!--行程查询-->
        <button
          :style="{
            width: cardResult.mediumType == 0 ? '24%' : '49%'
          }"
          :class="
            !cardResult.isHistory &&
            !cardResult?.tripRecordList?.length &&
            'grayScale'
          "
          class="btn-box btn-xingcheng"
          @click="chooseCardProcessType('CardDetailInfo')"
        >
          <i class="icon icon_xingcheng"></i>
          <span class="mt-10">{{
            cardResult.mediumType == 0
              ? $t('TransactionRecord')
              : $t('TripRecord')
          }}</span>
        </button>
        <!--充值-->
        <button
          v-if="cardResult.mediumType == 0"
          style="width: 24%"
          :class="!cardResult.isRecharge && 'grayScale'"
          class="btn-box btn-chongzhi"
          @click="chooseCardProcessType('RechargeCard')"
        >
          <i class="icon icon_chongzhi"></i>
          <span class="mt-10">{{ $t('RechargeService') }}</span>
        </button>
        <!--更新-->
        <button
          :style="{
            width: cardResult.mediumType == 0 ? '24%' : '49%'
          }"
          :class="!cardResult.isAdjust && 'grayScale'"
          class="btn-box btn-gengxin"
          @click="chooseCardProcessType('UpdateCard')"
        >
          <i class="icon icon_gengxin"></i
          ><span class="mt-10">{{ $t('TicketUpdate') }}</span>
        </button>
        <!--退票-->
        <button
          v-if="cardResult.mediumType == 0"
          style="width: 24%"
          :class="!cardResult.isReturn && 'grayScale'"
          class="btn-box btn-tuipiao"
          @click="chooseCardProcessType('RefundCard')"
        >
          <i class="icon icon_tuipiao"></i
          ><span class="mt-10">{{ $t('TicketRefund') }}</span>
        </button>
      </div>
    </div>
    <!--更新再次读卡-->
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
  </div>
</template>

<script setup>
import BaseInfo from '@/views/ticketCard/components/BaseInfo.vue';

import { useRouter } from 'vue-router';
import { computed, onUnmounted, watch, reactive } from 'vue';
import { useStore } from 'vuex';
const store = useStore();
const router = useRouter();
const data = reactive({
  isClick: false
});
const cardUpdate = computed(() => store.state.card.cardUpdate);
const cardResult = computed(() => store.state.card.cardResult);

window['onCardAction'] = val => {
  console.log('cardAction---' + val);
  cardAction(val);
};
const cardAction = val => {
  if (val == '行程查询') {
    chooseCardProcessType('CardDetailInfo');
  } else if (val == '充值') {
    chooseCardProcessType('RechargeCard');
  } else if (val == '更新') {
    chooseCardProcessType('UpdateCard');
  } else if (val == '退票') {
    chooseCardProcessType('RefundCard');
  }
};

const chooseCardProcessType = type => {
  if (data.isClick) return;
  if (
    type === 'CardDetailInfo' &&
    (cardResult.value?.tripRecordList?.length || cardResult.value.isHistory)
  ) {
    store.commit('setCardProcessType', type);
    router.push({
      name: 'journey'
    });
  } else if (type === 'RechargeCard' && cardResult.value.isRecharge) {
    console.log('执行 -- triggerProcessCardBusiness-RechargeCard ');
    store.commit('setCardProcessType', type);
    data.isClick = true;
    watch(
      () => cardResult.value.cardCategory,
      val => {
        if (val && val !== 'CardCategoryUnclear') {
          router.push({
            name: 'charge'
          });
        }
      },
      { deep: true }
    );
    window?.bridge?.triggerProcessCardBusiness(
      JSON.stringify({
        api: 'ProcessCardBusiness',
        param: {
          processType: 'RechargeCard',
          isConfirm: false
        }
      })
    );
  } else if (type == 'UpdateCard' && cardResult.value.isAdjust) {
    const jumpUpdate = () => {
      store.commit('setCardProcessType', type);
      store.commit('setCardUpdate', {
        processType: type,
        mediumType: cardResult.value.mediumType
      });
      window?.bridge?.triggerProcessCardBusiness(
        JSON.stringify({
          api: 'ProcessCardBusiness',
          param: { ...cardUpdate.value }
        })
      );
    };
    // 实体卡 银联卡 数币 需要二次读卡
    if (
      cardResult.value.mediumType == 0 ||
      cardResult.value.mediumType == 8 ||
      cardResult.value.mediumType == 9
    ) {
      data.isClick = true;
      watch(
        () => cardResult.value.cardCategory,
        val => {
          if (val && val !== 'CardCategoryUnclear') {
            router.push({
              name: 'update'
            });
          }
        },
        { deep: true }
      );
      jumpUpdate();
    } else {
      jumpUpdate();
      router.push({
        name: 'update'
      });
    }
  } else if (type === 'RefundCard' && cardResult.value.isReturn) {
    console.log('执行 -- triggerProcessCardBusiness-RefundCard ');
    store.commit('setCardProcessType', type);
    window?.bridge?.triggerProcessCardBusiness(
      JSON.stringify({
        api: 'ProcessCardBusiness',
        param: {
          processType: 'RefundCard',
          isConfirm: false
        }
      })
    );
    router.push({
      name: 'refundTicket'
    });
  }
};
onUnmounted(() => {
  window['onCardAction'] = () => {
    return;
  };
});
</script>

<style scoped lang="scss">
@media screen and (max-width: 1080px) {
  .btn-box {
    height: 194px;
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

  .hint-box {
    width: 915px;
    // height: 534px;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
    border-radius: 30px;
  }
  .bg-update {
    background: linear-gradient(360deg, #5687fc 0%, #6f99ff 100%);
    box-shadow: 0px 4px 5px 0px rgba(86, 135, 252, 0.4);
  }
}
@media screen and (min-width: 1180px) {
  .btn-box {
    height: 150px;
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

  .hint-box {
    width: 915px;
    // height: 534px;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
    border-radius: 30px;
  }
  .bg-update {
    background: linear-gradient(360deg, #5687fc 0%, #6f99ff 100%);
    box-shadow: 0px 4px 5px 0px rgba(86, 135, 252, 0.4);
  }
}
</style>
