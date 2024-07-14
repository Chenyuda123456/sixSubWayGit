<template>
  <div>
    <div class="lost-row">
      <div class="title display-flex-between">
        <div class="title-l">{{ $t('lostthings') }}</div>
      </div>
      <div class="date-box flex items-center">
        <div class="self-pick">
          <a-range-picker
            v-model:value="searchInfo.rangeTime"
            :value-format="'YYYY-MM-DD'"
          />
        </div>
        <div class="self-cascader">
          <a-cascader
            v-model:value="searchInfo.stationName"
            :placeholder="$t('SelectAStation')"
            :options="options"
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
          class="w-[128px] h-[60px] leading-[60px] bg-update text-white text-[26px] text-center rounded-[12px] ml-[10px]"
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
      <div class="content-card-lost-total-wrapper">
        <div class="content-card-lost-total">
          {{ $t('lostthing') }} {{ $t('amount', { x: page.total }) }}
        </div>
      </div>
      <div class="line-lost-tel">
        {{ $t('hotline') }}：{{ tel }}，{{ $t('takeresource') }}
      </div>
    </div>

    <div
      v-show="isShowKeyboard"
      class="simple-keyboard"
      style="
        position: fixed;
        bottom: 176px;
        left: 0;
        right: 0;
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
  margin: 0 46px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
  border-radius: 30px;
  box-sizing: border-box;
  height: 1238px;
  .title {
    padding: 36px 0px;
    border-bottom: 2px solid #e4e4e4;
    margin: 0 30px;
    line-height: 1;
    position: relative;
    .title-l {
      font-size: 36px;
      font-weight: bold;
      color: #2c3e50;
    }

    .title-r {
      font-size: 28px;
      font-weight: 500;
      color: #333333;
    }
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 1;
      width: 58px;
      height: 8px;
      background: #ff4718;
    }
  }

  .list {
    padding: 0 30px;
    overflow: auto;
    height: 846px;

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
    margin-top: 30px;
    .lost-box-margin {
      margin-top: 14px;
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
    margin-top: 20px;
    padding-bottom: 30px;
  }

  .search-none {
    margin-top: 26px;
    font-size: 30px;
    text-align: center;
    padding-top: 140px;
    height: 846px;
    box-sizing: border-box;
  }
}
// 失物统计
.content-card-lost-total-wrapper {
  @include flexStyle();
  margin: 20px 30px;
  .content-card-lost-total {
    @include flexStyle();
    @include fontStyle(30, bold);
    width: 968px;
    height: 60px;
    background: #f8f8f8;
    border-radius: 20px;
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
    width: 380px;
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
      width: 224px;
      height: 60px;
      border-radius: 8px;
      border: 1px solid #999999;
      margin-left: 10px;
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
    width: 172px;
    height: 60px;
    border-radius: 8px;
    border: 1px solid #999999;
    margin-left: 10px;
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
