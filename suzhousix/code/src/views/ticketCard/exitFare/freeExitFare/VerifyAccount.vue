<template>
  <div class="wrap xl:flex xl:items-center xl:justify-center xl:mt-[20px]">
    <div>
      <div
        class="w-[1028px] m-[auto] mt-[156px] px-[160px] py-[80px] xl:m-[0px] xl:mr-[80px] xl:py-[60px] box"
      >
        <div class="hint mb-[50px]">
          <img src="@/assets/icon_tips.png" />
          <div class="hint-text">
            {{ $t('PleaseHaveTheStationStaffEnterTheAccountPassword') }}
          </div>
        </div>
        <div class="form">
          <div class="form-item-box">
            <div class="flex items-center mb-[50px]">
              <div class="text-[30px] w-[160px] text-[#333333] text-right">
                {{ $t('Account') }}：
              </div>

              <div class="input-box">
                <a-input
                  ref="accountRef"
                  v-model:value="data.account"
                  type="password"
                  :maxlength="8"
                  :placeholder="$t('PleaseEnterTheStaffAccountNumber')"
                  :class="data.currentInput == 'account' ? 'te' : ''"
                  @change="accountChange()"
                  @click="inputClick($event, 'account')"
                />
              </div>
            </div>
            <div v-if="data.isAccount" class="error">
              {{ $t('PleaseEnterAnEightDigitStaffAccountNumber') }}
            </div>
          </div>
          <div class="form-item-box">
            <div class="flex items-center mb-[50px]">
              <div class="text-[30px] w-[160px] text-[#333333] text-right">
                {{ $t('Password') }}：
              </div>
              <div class="input-box">
                <a-input
                  ref="passwordRef"
                  v-model:value="data.password"
                  type="password"
                  :maxlength="8"
                  :placeholder="$t('PleaseEnterTheStaffPassword')"
                  :class="data.currentInput == 'password' ? 'te' : ''"
                  @click="inputClick($event, 'password')"
                  @change="passwordChange()"
                />
              </div>
            </div>
            <div v-if="data.ispassword" class="error">
              {{ $t('PleaseEnterAnEightDigitStaffPassword') }}
            </div>
          </div>
          <button
            class="px-[80px] xl:mt-[50px] w-[100%] h-[88px] leading-88 bg-update text-white text-lg text-center xl:rounded-[12px] rounded-[20px] xl:mx-20"
            :class="{
              grayScale: data.isConfirm
            }"
            @click="handlerConfirm"
          >
            {{ $t('Verification') }}
          </button>
        </div>
      </div>
      <div class="xl:m-[10px] mt-[80px] grid grid-cols-3 m-auto number-btn-box">
        <div
          @touchstart.stop="inputNumber($event, '1')"
          @click="inputNumber($event, '1')"
        >
          1
        </div>
        <div
          @touchstart="inputNumber($event, '2')"
          @click="inputNumber($event, '2')"
        >
          2
        </div>
        <div
          @touchstart="inputNumber($event, '3')"
          @click="inputNumber($event, '3')"
        >
          3
        </div>
        <div
          @touchstart="inputNumber($event, '4')"
          @click="inputNumber($event, '4')"
        >
          4
        </div>
        <div
          @touchstart="inputNumber($event, '5')"
          @click="inputNumber($event, '5')"
        >
          5
        </div>
        <div
          @touchstart="inputNumber($event, '6')"
          @click="inputNumber($event, '6')"
        >
          6
        </div>
        <div
          @touchstart="inputNumber($event, '7')"
          @click="inputNumber($event, '7')"
        >
          7
        </div>
        <div
          @touchstart="inputNumber($event, '8')"
          @click="inputNumber($event, '8')"
        >
          8
        </div>
        <div
          @touchstart="inputNumber($event, '9')"
          @click="inputNumber($event, '9')"
        >
          9
        </div>
        <div
          class="flex justify-center items-center"
          @touchstart="inputNumber($event, null)"
          @click="inputNumber($event, null)"
        >
          <img class="" src="@/assets/icons/icon_delete@2x.png" />
        </div>
        <div
          @touchstart="inputNumber($event, '0')"
          @click="inputNumber($event, '0')"
        >
          0
        </div>
        <div
          class="clear"
          @touchstart="inputNumber($event, 'clear')"
          @click="inputNumber($event, 'clear')"
        >
          {{ $t('Clear') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  reactive,
  computed,
  watch,
  getCurrentInstance,
  nextTick,
  ref
} from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

import { useStore } from 'vuex';
import $ from 'jquery';
const { proxy } = getCurrentInstance();
const store = useStore();

const accountRef = ref();
const passwordRef = ref();
store.dispatch('clearData');
const data = reactive({
  selectionStart: 0,
  currentInput: 'account',
  account: '',
  password: '',
  isAccount: false,
  ispassword: false,
  isConfirm: false
});
const ticketStatus = computed(() => store.getters.getTicketStatus);
watch(
  () => ticketStatus.value,
  newValue => {
    console.log('newValue', newValue);
    if (newValue.loginSts === 1) {
      router.push({
        name: 'freeExitFare',
        query: {
          userName: data.account,
          password: data.password
        }
      });
    } else if (newValue.loginSts === 0) {
      // 验证码密码错误
      proxy.$subwayInfo.normalInfo('请输入正确的账号和密码！');
      data.isConfirm = false;
      window.onSellTicketBusiness({
        status: {
          loginSts: -1
        }
      });
    }
  },
  { deep: true }
);
const inputClick = (event, val) => {
  data.selectionStart = event.target.selectionStart;
  data.currentInput = val;
};
const insertchar = (oldStr, newStr) => {
  return (
    oldStr.slice(0, data.selectionStart) +
    newStr +
    oldStr.slice(data.selectionStart)
  );
};
const inputNumber = (e, val) => {
  e.preventDefault();
  if (val === 'clear') {
    if (data.currentInput == 'account') {
      data.account = '';
    } else if (data.currentInput == 'password') {
      data.password = '';
    }
  } else {
    if (val) {
      if (data.currentInput == 'account') {
        if (data.account && data.account.length == 8) {
          console.log('forbid');
        } else {
          data.account = insertchar(data.account, val);
        }
      } else if (data.currentInput == 'password') {
        if (data.password && data.password.length == 8) {
          console.log('forbid');
        } else {
          data.password = insertchar(data.password, val);
        }
      }
      data.selectionStart += 1;
    } else {
      if (data.selectionStart) {
        if (data.currentInput == 'account') {
          data.account =
            data.account.slice(0, data.selectionStart - 1) +
            data.account.slice(data.selectionStart);
        } else if (data.currentInput == 'password') {
          data.password =
            data.password.slice(0, data.selectionStart - 1) +
            data.password.slice(data.selectionStart);
        }
        data.selectionStart -= 1;
      }
    }
  }
  nextTick(() => {
    setTimeout(() => {
      if (data.currentInput == 'account') {
        accountRef.value.setSelectionRange(
          data.selectionStart,
          data.selectionStart
        );
      } else if (data.currentInput == 'password') {
        passwordRef.value.setSelectionRange(
          data.selectionStart,
          data.selectionStart
        );
      }
      if (data.currentInput == 'account') {
        accountRef.value.focus();
      } else if (data.currentInput == 'password') {
        passwordRef.value.focus();
      }
    }, 10);
  });
};
const accountChange = () => {
  data.selectionStart = accountRef.value.input.selectionStart;
};

const passwordChange = () => {
  data.selectionStart = accountRef.value.input.selectionStart;
};
const handlerConfirm = () => {
  if (data.account) {
    data.isAccount = false;
    console.log(data.account);
    if (data.account.length == 8) {
      data.isAccount = false;
    } else {
      data.isAccount = true;
    }
  } else {
    data.isAccount = true;
  }
  if (data.password) {
    data.ispassword = false;
    if (data.password.length == 8) {
      data.ispassword = false;
    } else {
      data.ispassword = true;
    }
  } else {
    data.ispassword = true;
  }
  if (data.isConfirm) {
    return;
  }
  if (data.account && !data.isAccount && data.password && !data.ispassword) {
    data.isConfirm = true;
    // 校验
    window?.bridge?.triggerBuyTickets(
      JSON.stringify({
        specifyType: 1,
        paymentType: 1001,
        srcStationName: window?.bridge?.getDefaultSite(),
        dstStationName: '',
        price: 0,
        number: 1,
        mediumType: 1, // 发售出站票
        isConfirm: false,
        userName: data.account,
        password: data.password
      })
    );
  }
};
</script>

<style lang="scss" scoped>
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

    :deep(.ant-input) {
      width: 540px;
      height: 80px;
      line-height: 80px;
      font-size: 30px;
    }

    .te {
      border-color: #40a9ff !important;
    }

    :deep(.ant-select-selector) {
      width: 540px;
      height: 80px;
      font-size: 30px;

      .ant-select-selection-item {
        line-height: 80px;
      }
    }

    :deep(svg) {
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
  width: 100px;
  gap: 10px;
  div {
    width: 30px;
    text-align: center;
    background: linear-gradient(180deg, #ffffff 0%, #edf6ff 100%);
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
    img {
      width: 16px;
    }
    //&:active {
    //  box-shadow: 0 0 4px 2px #cfcfcf59;
    //}
  }
  .clear {
    font-size: 12px;
  }
}
</style>
