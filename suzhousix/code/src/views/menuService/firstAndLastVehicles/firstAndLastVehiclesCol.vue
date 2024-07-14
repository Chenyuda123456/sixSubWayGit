<template>
  <div>
    <div class="flex flex-wrap">
      <div
        v-for="(item, index) in data.lineList"
        :key="index"
        v-en="{
          fontSize: item.name == 'Branch Line Four' ? '18px' : '26px',
          lineHeight: item.name == 'Branch Line Four' ? '20px' : '26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }"
        class="mr-[16px] mb-[16px]"
        :class="[
          `line-name-color line-name${item.lineNo}`,
          index == data.currentIndex ? `current-line-name${item.lineNo}` : ''
        ]"
        @click="getList(item.value)"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="table-box">
      <div
        class="table-header border-[1px] border-solid border-light-[#E4E4E4] grid grid-cols-7 grid-rows-4 text-center leading-[38px] text-[18px]"
        style="border-left: 0; border-bottom: 0"
      >
        <div class="col-span-7 font-bold">
          {{ data.currentLineText }}{{ $t('TheFirstLastSubway') }}
        </div>
        <div class="col-span-1 row-span-3 flex items-center justify-center">
          {{ $t('stationName') }}
        </div>
        <div v-for="item in data.destList" :key="item" class="col-span-3">
          <div>
            {{ $t('changeTo') }}
            <span v-chStationToEn="item">{{ item }}</span>
          </div>
        </div>
        <div class="col-span-1 row-span-2">{{ $t('firstSubway') }}</div>
        <div class="col-span-1 row-span-2 leading-[28px]">
          <div>{{ $t('lastSubway') }}</div>
          <div>{{ $t('MondayToThursday') }}</div>
        </div>
        <div class="col-span-1 row-span-2 leading-[28px]">
          <div>{{ $t('lastSubway') }}</div>
          <div>{{ $t('FridayToSunday') }}</div>
        </div>
        <div class="col-span-1 row-span-2">{{ $t('firstSubway') }}</div>
        <div class="col-span-1 row-span-2 leading-[28px]">
          <div>{{ $t('lastSubway') }}</div>
          <div>{{ $t('MondayToThursday') }}</div>
        </div>
        <div class="col-span-1 row-span-2 leading-[28px]">
          <div>{{ $t('lastSubway') }}</div>
          <div>{{ $t('FridayToSunday') }}</div>
        </div>
      </div>
      <div class="table-body">
        <div
          v-for="(item, index) in data.currentList"
          :key="index"
          class="table-item border-[1px] border-solid border-light-[#E4E4E4] grid grid-cols-7 text-center leading-[38px] text-[18px]"
          style="border-left: 0; border-bottom: 0; border-top: 0"
        >
          <div
            v-chStationToEn="item.stationName"
            class="col-span-1 leading-[38px]"
          >
            {{ item.stationName }}
          </div>
          <div class="col-span-1 leading-[38px]">
            {{ item.start.startTime ? item.start.startTime : '--' }}
          </div>
          <div class="col-span-1 leading-[38px]">
            {{ item.start.endTime1 ? item.start.endTime1 : '--' }}
          </div>
          <div class="col-span-1 leading-[38px]">
            {{ item.start.endTime5 ? item.start.endTime5 : '--' }}
          </div>
          <div class="col-span-1 leading-[38px]">
            {{ item.end.startTime ? item.end.startTime : '--' }}
          </div>
          <div class="col-span-1 leading-[38px]">
            {{ item.end.endTime1 ? item.end.endTime1 : '--' }}
          </div>
          <div class="col-span-1 leading-[38px]">
            {{ item.end.endTime5 ? item.end.endTime5 : '--' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import pageVehicle from './index';
import { DATA } from '../../ticket/components/stepone/Line';
const { data, getList } = pageVehicle();
</script>
<style lang="scss" scoped>
@use 'sass:list';
@import 'src/styles/variable';
@import '../../menu/subpages/menumap.scss';
@import 'src/styles/mixins';

// 线路名称
.line-name-color {
  height: 48px;
  width: 148px;
  border-radius: 6px;
  color: #fff;
  font-size: 26px;
  line-height: 48px;
  box-sizing: border-box;
  border: 2px solid;
  text-align: center;
  // 区分线路颜色
  &.line-name1 {
    color: $--subway-color-line-1;
    border-color: $--subway-color-line-1;
  }
  &.current-line-name1 {
    color: #fff;
    background-color: $--subway-color-line-1;
  }
  &.line-name2 {
    color: $--subway-color-line-2;
    border-color: $--subway-color-line-2;
  }
  &.current-line-name2 {
    color: #fff;
    background-color: $--subway-color-line-2;
  }

  &.line-name3 {
    color: $--subway-color-line-3;
    border-color: $--subway-color-line-3;
  }

  &.current-line-name3 {
    color: #fff;
    background-color: $--subway-color-line-3;
  }

  &.line-name4 {
    color: $--subway-color-line-4;
    border-color: $--subway-color-line-4;
  }
  &.current-line-name4 {
    color: #fff;
    background-color: $--subway-color-line-4;
  }

  &.line-name5 {
    color: $--subway-color-line-5;
    border-color: $--subway-color-line-5;
    margin-right: 0;
  }
  &.line-name6 {
    color: $--subway-color-line-6;
    border-color: $--subway-color-line-6;
  }
  &.current-line-name6 {
    color: #fff;
    background-color: $--subway-color-line-6;
  }
  &.line-name11 {
    color: $--subway-color-line-11;
    border-color: $--subway-color-line-11;
    margin-right: 0;
  }
  &.line-name11 {
    color: $--subway-color-line-11;
    border-color: $--subway-color-line-11;
    margin-right: 0;
  }
  &.current-line-name5 {
    color: #fff;
    background-color: $--subway-color-line-5;
  }
  &.current-line-name11 {
    color: #fff;
    background-color: $--subway-color-line-11;
  }
}
.table-box {
  margin-top: 14px;
  color: #333;
  .table-header {
    background: rgba(241, 241, 241, 0.6);
    > div {
      border-left: 1px solid #e4e4e4;
      border-bottom: 1px solid #e4e4e4;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
  .table-body {
    height: 760px;
    overflow: auto;
  }
  .table-item {
    > div {
      border-left: 1px solid #e4e4e4;
      border-bottom: 1px solid #e4e4e4;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
