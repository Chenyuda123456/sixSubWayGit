<template>
  <div>
    <div class="lost-row">
      <div class="title display-flex-between">
        <div class="title-l">{{ $t('lostthings') }}</div>
        <div class="title-r">
          <div v-if="page.total == 0">
            {{ $t('nosearchresult') }}
          </div>
          <div v-else>
            {{ $t('lostthing') }} {{ $t('amount', { x: page.total }) }}
          </div>
        </div>
      </div>
      <div class="date-box flex items-center">
        <div class="self-pick">
          <a-range-picker
            v-model:value="searchInfo.rangeTime"
            :value-format="'YYYY-MM-DD'"
          />
        </div>
        <!--        <a-date-picker-->
        <!--          v-model:value="searchInfo.rangeTime"-->
        <!--          :show-today="false"-->
        <!--          :input-read-only="true"-->
        <!--          :placeholder="$t('SelectThePickupTime')"-->
        <!--        />-->
        <!--        <a-input-->
        <!--          id="stationName"-->
        <!--          v-model:value="searchInfo.stationName"-->
        <!--          class="input"-->
        <!--          :placeholder="$t('enterTheLocation')"-->
        <!--          readonly-->
        <!--          @click="openKeyBoard"-->
        <!--        />-->
        <div class="self-cascader">
          <a-cascader
            v-model:value="searchInfo.stationName"
            :placeholder="$t('SelectAStation')"
            :options="options"
            readonly
            :field-names="{
              label: lang == 'En' ? 'eName' : 'name',
              value: 'name',
              children: 'station'
            }"
            style="width: 100%"
          >
            <template #displayRender="{ labels, selectedOptions }">
              <div
                v-for="(label, index) in labels"
                :key="selectedOptions[index].value"
              >
                <div v-if="index === labels.length - 1">
                  {{ label }}
                </div>
              </div>
            </template>
          </a-cascader>
        </div>

        <a-input
          id="lostOverview"
          v-model:value="searchInfo.lostOverview"
          class="input"
          :placeholder="$t('itemDescription')"
          readonly
          @click="openKeyBoard"
        />
        <button
          class="w-[128px] h-[60px] leading-[60px] bg-update text-white text-[26px] text-center rounded-[12px] ml-[24px]"
          @click="handleClick"
        >
          {{ $t('search') }}
        </button>
      </div>
      <van-list
        v-if="lostList && lostList.length"
        v-model:loading="lostLoading"
        :finished="page.isNoData"
        finished-text=""
        class="lost-box-wrapper list"
        :class="isWidthScreen ? 'display-flex-between' : ''"
        @load="handleLoadStart"
      >
        <div v-for="(p, index) in lostList" :key="index">
          <lost-box
            :is-width-screen="isWidthScreen"
            :lost-obj="p"
            class="lost-box-margin"
          ></lost-box>
        </div>
      </van-list>
      <div v-else class="search-none">{{ $t('nosearchresult') }}</div>
      <div class="line-lost-tel">
        {{ $t('hotline') }}：{{ tel }}，{{ $t('takeresource') }}
      </div>
    </div>

    <div
      v-show="isShowKeyboard"
      class="simple-keyboard"
      style="
        position: fixed;
        bottom: 174px;
        width: 50%;
        right: 30px;
        z-index: 9999;
        background: #fff;
        overflow: auto !important;
      "
      @click="cancelEvent"
    ></div>
  </div>
</template>
<script>
import index from './index.js';
export default {
  ...index
};
</script>

<style lang="scss" scoped>
@import 'src/styles/common';
@import 'src/styles/mixins';
.lost-row {
  margin: auto;
  width: 1860px;
  height: 758px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
  border-radius: 30px;

  box-sizing: border-box;

  .title {
    padding: 0px 30px;
    border-bottom: 2px solid #e4e4e4;

    .title-l {
      font-size: 36px;
      font-weight: bold;
      color: #4868c1;
      line-height: 84px;
    }

    .title-r {
      font-size: 28px;
      font-weight: 500;
      color: #333333;
      line-height: 84px;
    }
  }

  .list {
    padding: 0 30px;
    overflow: auto;
    height: 476px;

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
  }

  .lost-box-wrapper {
    flex-wrap: wrap;

    .lost-box-margin {
      margin-top: 24px;
    }
  }

  // 咨询电话
  .line-lost-tel {
    width: 100%;
    display: block;
    color: rgba(227, 114, 26, 1);
    font-size: 22px;
    line-height: 22px;
    text-align: center;
    margin-top: 30px;
  }

  .search-none {
    height: 476px;
    font-size: 30px;
    text-align: center;
    padding-top: 140px;
  }
}
.date-box {
  margin-top: 40px;
  margin-bottom: 16px;
  margin-left: 30px;
  display: flex;
  .bg-update {
    background: linear-gradient(360deg, #5687fc 0%, #6f99ff 100%);
    box-shadow: 0px 4px 5px 0px rgba(86, 135, 252, 0.4);
  }

  // 时间选择框
  .self-pick {
    :deep(.ant-picker) {
      height: 60px;
      border-radius: 8px;
      border: 1px solid #999999;
    }
    :deep(input) {
      font-size: 26px !important;
      text-align: center;
    }
    :deep(svg) {
      font-size: 26px !important;
      text-align: center;
    }
  }

  // 联级选择
  .self-cascader {
    :deep(.ant-select-selector) {
      width: 260px;
      height: 60px;
      border-radius: 8px;
      border: 1px solid #999999;
      margin-left: 20px;
      span {
        display: inline-block;
        line-height: 60px;
        font-size: 26px !important;
      }
    }
    :deep(.ant-select-clear) {
      opacity: 1;
    }
  }
  :deep(.ant-input) {
    font-size: 26px !important;
    width: 260px;
    height: 60px;
    border-radius: 8px;
    border: 1px solid #999999;
    margin-left: 20px;
  }
}

:deep(.hg-theme-default) {
  padding: 0;
}
:deep(.hg-theme-default .hg-button) {
  height: 50px;
}
:deep(.hg-rows) {
  background: #ececec;
  padding: 5px;
}
:deep(.hg-candidate-box) {
  position: sticky;
  margin-top: auto;
  transform: none;
}
</style>
