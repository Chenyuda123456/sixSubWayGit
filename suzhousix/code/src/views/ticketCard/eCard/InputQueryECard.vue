<template>
  <div class="wrap xl:flex xl:items-center xl:justify-center xl:mt-[80px]">
    <div
      class="w-[1028px] m-[auto] mt-[156px] px-[160px] py-[80px] xl:m-[0px] xl:mr-[80px] xl:py-[60px] box"
    >
      <div class="form">
        <div class="form-item-box">
          <div class="flex items-center mb-[60px]">
            <div
              v-en="{
                width: '280px'
              }"
              class="text-[30px] w-[160px] text-[#333333] text-right"
            >
              {{ $t('APPApplication') }}：
            </div>
            <div
              v-en="{
                width: '430px'
              }"
              class="input-box"
            >
              <a-select v-model:value="data.appId">
                <a-select-option
                  v-for="item in data.ChannelRecordList"
                  :key="item.appId"
                  :value="item.appId"
                >
                  {{ item.ChannelNameCn }}
                </a-select-option>
              </a-select>
            </div>
          </div>
          <div v-if="data.isApp" class="error">
            {{ $t('PleaseSelectTheAppApplication') }}
          </div>
        </div>
        <div class="form-item-box">
          <div class="flex items-center mb-[50px]">
            <div
              v-en="{
                width: '280px'
              }"
              class="text-[30px] w-[160px] text-[#333333] text-right"
            >
              {{ $t('ContactNumber') }}：
            </div>
            <div
              v-en="{
                width: '430px'
              }"
              class="input-box"
            >
              <a-input
                ref="phoneNumberRef"
                v-model:value="data.phoneNumber"
                :placeholder="$t('YouCanEnterEitherThePhoneNumberOrTheIDCard')"
                :class="data.currentInput == 'phoneNumber' ? 'te' : ''"
                @click="inputClick($event, 'phoneNumber')"
                @change="phoneNumberChange()"
              />
            </div>
          </div>
          <div v-if="data.isPhone" class="error">
            {{ $t('PleaseEnterTheCorrectMobilePhoneNumber') }}
          </div>
        </div>
        <div class="form-item-box">
          <div class="flex items-center mb-[50px]">
            <div
              v-en="{
                width: '280px'
              }"
              class="text-[30px] w-[160px] text-[#333333] text-right"
            >
              {{ $t('IDCardNumber') }}：
            </div>
            <div
              v-en="{
                width: '430px'
              }"
              class="input-box"
            >
              <a-input
                ref="userIdRef"
                v-model:value="data.userId"
                :placeholder="$t('YouCanEnterEitherThePhoneNumberOrTheIDCard')"
                :class="data.currentInput == 'userId' ? 'te' : ''"
                @click="inputClick($event, 'userId')"
                @change="userIdChange"
              />
            </div>
          </div>
          <div v-if="data.isId" class="error">
            {{ $t('PleaseEnterTheCorrectIDCardNumber') }}
          </div>
        </div>
        <button
          class="px-[80px] xl:mt-[50px] w-[100%] h-[88px] leading-88 bg-update text-white text-lg text-center xl:rounded-[12px] rounded-[20px] xl:mx-20"
          :class="{
            grayScale: data.isConfirm
          }"
          @click="handlerConfirm"
        >
          {{ $t('OK') }}
        </button>
      </div>
    </div>
    <div
      class="xl:m-[0px] mt-[80px] grid grid-cols-3 gap-[20px] w-[700px] m-auto number-btn-box"
    >
      <div
        class="numberBtn"
        @touchend.stop="inputNumber($event, '1')"
        @click.stop="inputNumber($event, '1')"
      >
        1
      </div>
      <div
        class="numberBtn"
        @touchend.stop="inputNumber($event, '2')"
        @click.stop="inputNumber($event, '2')"
      >
        2
      </div>
      <div
        class="numberBtn"
        @touchend.stop="inputNumber($event, '3')"
        @click.stop="inputNumber($event, '3')"
      >
        3
      </div>
      <div
        class="numberBtn"
        @touchend.stop="inputNumber($event, '4')"
        @click.stop="inputNumber($event, '4')"
      >
        4
      </div>
      <div
        class="numberBtn"
        @touchend.stop="inputNumber($event, '5')"
        @click.stop="inputNumber($event, '5')"
      >
        5
      </div>
      <div
        class="numberBtn"
        @touchend.stop="inputNumber($event, '6')"
        @click.stop="inputNumber($event, '6')"
      >
        6
      </div>
      <div
        class="numberBtn"
        @touchend.stop="inputNumber($event, '7')"
        @click.stop="inputNumber($event, '7')"
      >
        7
      </div>
      <div
        class="numberBtn"
        @touchend.stop="inputNumber($event, '8')"
        @click.stop="inputNumber($event, '8')"
      >
        8
      </div>
      <div
        class="numberBtn"
        @touchend.stop="inputNumber($event, '9')"
        @click.stop="inputNumber($event, '9')"
      >
        9
      </div>
      <div
        class="flex justify-center items-center numberBtn"
        @touchend.stop="inputNumber($event, null)"
        @click.stop="inputNumber($event, null)"
      >
        <img class="w-[42px]" src="@/assets/icons/icon_delete@2x.png" />
      </div>
      <div
        class="numberBtn"
        @touchend.stop="inputNumber($event, '0')"
        @click.stop="inputNumber($event, '0')"
      >
        0
      </div>
      <div
        class="numberBtn"
        @touchend.stop="inputNumber($event, 'x')"
        @click.stop="inputNumber($event, 'x')"
      >
        x
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, nextTick, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

import { useStore } from 'vuex';

const store = useStore();

const phoneNumberRef = ref();
const userIdRef = ref();
const data = reactive({
  selectionStart: 0,
  ChannelRecordList: [],
  currentInput: '',
  phoneNumber: '',
  userId: '',
  appId: '',
  isPhone: false,
  isId: false,
  isApp: false,
  isConfirm: false
});
const cardResult = computed(() => store.state.card.cardResult);
const cardUpdate = computed(() => store.state.card.cardUpdate);
console.log(store.getters.getCardResult);
watch(
  cardResult,
  newValue => {
    data.ChannelRecordList = newValue.ChannelRecordList || [];
    if (data.ChannelRecordList.length && !data.appId) {
      data.appId = data.ChannelRecordList[0].appId;
    }
    if (newValue.userInfo && newValue.userInfo.userId) {
      router.push({ name: 'baseInfoECard' });
    }
  },
  { deep: true, immediate: true }
);
const insertchar = (oldStr, newStr) => {
  return (
    oldStr.slice(0, data.selectionStart) +
    newStr +
    oldStr.slice(data.selectionStart)
  );
};

const inputClick = (event, val) => {
  data.selectionStart = event.target.selectionStart;
  data.currentInput = val;
  if (val == 'phoneNumber') {
    data.isPhone = false;
    if (!data.userId) {
      data.isId = false;
    }
  } else if (data.currentInput == 'userId') {
    data.isId = false;
    if (!data.phoneNumber) {
      data.isPhone = false;
    }
  }
};

const inputNumber = (e, val) => {
  e.preventDefault();
  if (val) {
    if (data.currentInput == 'phoneNumber') {
      data.phoneNumber = insertchar(data.phoneNumber, val);
    } else if (data.currentInput == 'userId') {
      data.userId = insertchar(data.userId, val);
    }
    data.selectionStart += 1;
  } else {
    if (data.selectionStart) {
      if (data.currentInput == 'phoneNumber') {
        data.phoneNumber =
          data.phoneNumber.slice(0, data.selectionStart - 1) +
          data.phoneNumber.slice(data.selectionStart);
      } else if (data.currentInput == 'userId') {
        data.userId =
          data.userId.slice(0, data.selectionStart - 1) +
          data.userId.slice(data.selectionStart);
      }
      data.selectionStart -= 1;
    }
  }
  nextTick(() => {
    setTimeout(() => {
      if (data.currentInput == 'phoneNumber') {
        phoneNumberRef.value.setSelectionRange(
          data.selectionStart,
          data.selectionStart
        );
      } else if (data.currentInput == 'userId') {
        userIdRef.value.setSelectionRange(
          data.selectionStart,
          data.selectionStart
        );
      }
      if (data.currentInput == 'phoneNumber') {
        phoneNumberRef.value.focus();
      } else if (data.currentInput == 'userId') {
        userIdRef.value.focus();
      }
    }, 10);
  });
};

const phoneNumberChange = () => {
  data.selectionStart = phoneNumberRef.value.input.selectionStart;
};

const userIdChange = () => {
  data.selectionStart = userIdRef.value.input.selectionStart;
};

const bodyEvent = () => {
  data.currentInput = '';
};
document.body.addEventListener('touchend', bodyEvent);

onUnmounted(() => {
  document.body.removeEventListener('touchend', bodyEvent);
});
const handlerConfirm = () => {
  if (data.isConfirm) {
    return;
  }
  if (!data.phoneNumber && !data.userId) {
    data.isPhone = true;
    data.isId = true;
  } else {
    if (data.phoneNumber) {
      if (!/^1[3|4|5|7|8][0-9]\d{8}$/.test(data.phoneNumber)) {
        data.isPhone = true;
      } else {
        data.isPhone = false;
      }
    }
    if (data.userId) {
      if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(data.userId)) {
        data.isId = true;
      } else {
        data.isId = false;
      }
    }
  }

  if (!data.isPhone && !data.isId) {
    data.isConfirm = true;
    console.log(' data.isConfirm', data.isConfirm);
    store.commit('setCardUpdate', {
      appId: data.appId,
      userId: data.userId,
      phoneNumber: data.phoneNumber,
      mediumType: 2
    });
    // 输入查询
    window?.bridge?.triggerProcessCardBusiness(
      JSON.stringify({
        api: 'ProcessCardBusiness',
        param: { ...cardUpdate.value }
      })
    );
  }
};
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

  .form-item-box {
    position: relative;
    .input-box {
      width: 540px;
    }
    :deep(.ant-input) {
      width: 100%;
      height: 80px;
      line-height: 80px;
      font-size: 30px;
    }

    .te {
      border-color: #40a9ff !important;
    }
    :deep(.ant-select) {
      width: 100%;
    }
    :deep(.ant-select-selector) {
      width: 100%;
      height: 80px;
      font-size: 30px;

      .ant-select-selection-item {
        line-height: 80px;
      }
    }

    :deep(.ant-select-clear) {
      display: none;
    }

    .error {
      font-size: 22px;
      color: #ee0a24;
      position: absolute;
      bottom: -38px;
      left: 24%;
    }
  }
}

.number-btn-box {
  div {
    width: 220px;
    text-align: center;
    background: linear-gradient(180deg, #ffffff 0%, #edf6ff 100%);
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    font-size: 40px;
    font-weight: 400;
    color: #333333;
    line-height: 100px;
  }
}
</style>
