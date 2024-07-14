<template>
  <div
    class="w-[1028px] m-[auto] mt-[156px] py-[120px] xl:mt-[50px] xl:py-[60px] box"
  >
    <div v-if="true" class="xl:h-[580px] h-[710px] px-[40px]">
      <div
        v-en="{
          fontSize: '42px',
          lineHeight: '42px'
        }"
        class="text-2xl font-bold text-blue text-center"
      >
        {{
          $t('PleaseSelectTheStartAndEndTimesOfTheTripYouWishToInquireAbout')
        }}
      </div>
      <div class="px-[160px]">
        <div class="mt-[80px] xl:mt-[50px]">
          <a-range-picker
            class="time"
            :value="hackValue || value"
            :disabled-date="disabledDate"
            @change="onChange"
            @openChange="onOpenChange"
            @calendarChange="onCalendarChange"
          />
        </div>
        <div class="text-box mt-[80px] text-[30px] xl:mt-[50px]">
          <!--银联卡和数币-->
          <div v-if="cardResult.mediumType == 8 || cardResult.mediumType == 9">
            <div class="flex">
              <div
                v-en="{
                  width: '250px'
                }"
                class="w-[160px] text-[rgba(51,51,51,0.6)] text-right mb-[30px]"
              >
                {{ $t('TicketNumber') }}：
              </div>
              <div class="text-[#333]">{{ cardResult?.userInfo?.userId }}</div>
            </div>
            <div class="flex">
              <div
                v-en="{
                  width: '250px'
                }"
                class="w-[160px] text-[rgba(51,51,51,0.6)] text-right mb-[30px]"
              >
                {{ $t('TicketType') }}：
              </div>
              <div class="text-[#333]">
                {{
                  cardResult.mediumType == 9
                    ? $t('ERMBElectronicTicket')
                    : $t('UnionPayCardElectronicTicket')
                }}
              </div>
            </div>
          </div>
          <!--二维码或者输入查询-->
          <div v-else>
            <div class="flex">
              <div
                v-en="{
                  width: '250px'
                }"
                class="w-[160px] text-[rgba(51,51,51,0.6)] text-right mb-[30px]"
              >
                {{ $t('UserID') }}：
              </div>
              <div class="text-[#333]">{{ cardResult?.userInfo?.userId }}</div>
            </div>
            <div class="flex">
              <div
                v-en="{
                  width: '250px'
                }"
                class="w-[160px] text-[rgba(51,51,51,0.6)] text-right mb-[30px]"
              >
                {{ $t('ApplicationID') }}：
              </div>
              <div class="text-[#333]">{{ cardResult?.userInfo?.appId }}</div>
            </div>
            <div class="flex">
              <div
                v-en="{
                  width: '250px'
                }"
                class="w-[160px] text-[rgba(51,51,51,0.6)] text-right"
              >
                {{ $t('BusinessID') }}：
              </div>
              <!--<div class="text-[#333]">{{ cardResult?.userInfo?.bussinessId }}</div>-->
              <div class="text-[#333]">{{ $t('Subway') }}</div>
            </div>
          </div>
          <button
            class="px-[80px] mt-[120px] xl:mt-[50px] w-[100%] h-[88px] leading-88 bg-update text-white text-lg text-center xl:rounded-[12px] rounded-[20px]"
            :class="{
              grayScale: data.isConfirm
            }"
            @click="handlerConfirm"
          >
            {{ $t('ItineraryQuery') }}
          </button>
        </div>
      </div>
    </div>
    <div v-else class="xl:h-[580px] h-[710px] flex justify-center items-center">
      <img src="@/assets/icons/icon_waiting.gif" alt="" class="w-[160px]" />
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  computed,
  watch,
  onUnmounted,
  getCurrentInstance
} from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import dayjs, { Dayjs } from 'dayjs';

const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();
import { useStore } from 'vuex';

const store = useStore();
const data = reactive({
  cardType: route.query.cardType,
  backTimer: null,
  isConfirm: false
});
const cardUpdate = computed(() => store.state.card.cardUpdate);
const dates = ref();
let today = dayjs().format('YYYY-MM-DD');
const value = ref([dayjs(), dayjs()]);
const hackValue = ref();
const disabledDate = current => {
  if (!dates.value || dates.value.length === 0) {
    return current > dayjs().endOf('day');
  }
  const tooLate = dates.value[0] && current.diff(dates.value[0], 'days') > 10;
  const tooEarly = dates.value[1] && dates.value[1].diff(current, 'days') > 10;
  return tooEarly || tooLate || current > dayjs().endOf('day');
};

const onOpenChange = open => {
  if (open) {
    dates.value = [];
    hackValue.value = [];
  } else {
    hackValue.value = undefined;
  }
};

const onChange = val => {
  console.log('onChange', val);
  value.value = val;
};

const onCalendarChange = val => {
  dates.value = val;
  console.log('onCalendarChange', val);
};

const cardResult = computed(() => store.state.card.cardResult);
// 如果有行程信息就正常流转，没有行程信息就取消时序
watch(
  cardResult,
  newValue => {
    console.log(newValue);
    if (newValue.tripRecordList) {
      store.commit('setCardUpdate', {
        tripNo:
          cardResult?.value?.tripRecordList?.[0]?.tripNo || '0000000000000000'
      });
      router.push({ name: 'console' });
    }
  },
  { deep: true }
);
const handlerConfirm = () => {
  console.log(value.value);
  if (data.isConfirm) {
    return;
  }
  if (!value.value) {
    proxy.$subwayInfo.normalInfo('请选择日期！');
  } else {
    data.isConfirm = true;
    let start = value.value[0].format('YYYY-MM-DD');
    let end = value.value[1].format('YYYY-MM-DD');
    console.log(start, end);
    store.commit('setCardUpdate', {
      processType: 'UpdateCard',
      // 行程查询方式，1、手动输入查询 2、基于扫码查询  3、基于读到卡号查询
      beginTime: start + ' 00:00:00',
      endTime: end + ' 23:59:59',
      // 2 是前面开启扫码头获取用户信息的，现在3 是获取行程，闪付卡和数币不动的
      mediumType:
        cardResult.value.mediumType == 2 ? 3 : cardResult.value.mediumType,
      appId: cardResult.value.userInfo?.appId,
      userId: cardResult.value.userInfo?.userId,
      bussinessId: cardResult.value.userInfo?.bussinessId
    });
    window?.bridge?.triggerProcessCardBusiness(
      JSON.stringify({
        api: 'ProcessCardBusiness',
        param: { ...cardUpdate.value }
      })
    );
  }
};
onMounted(() => {});
onUnmounted(() => {
  data.backTimer && clearTimeout(data.backTimer);
});
</script>

<style lang="scss" scoped>
.bg-update {
  background: linear-gradient(360deg, #5687fc 0%, #6f99ff 100%);
  box-shadow: 0px 4px 5px 0px rgba(86, 135, 252, 0.4);
}

.box {
  background: #ffffff;
  box-shadow: 0px 0px 32px 0px rgba(0, 0, 0, 0.12);
  border-radius: 20px;

  .time {
    width: 100%;
    height: 80px;

    :deep {
      .anticon-swap-right {
        svg {
          margin-top: -10px;
        }
      }

      svg {
        height: 30px;
        width: 30px;
      }

      input {
        text-indent: 20px;
        font-size: 30px;
      }
    }
  }
}
</style>
