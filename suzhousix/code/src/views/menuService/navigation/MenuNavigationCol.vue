<template>
  <div>
    <div id="map" style="position: relative">
      <template v-for="(location, index) in locationArr" :key="index">
        <img
          v-if="location.name == '当前设备'"
          :style="
            'position:absolute;' +
            'left:' +
            (location.position.x * 0.8 - 30) +
            'px;' +
            'top:' +
            (location.position.y * 0.8 - 68) +
            'px'
          "
          src="@/assets/icon_loc3.png"
          class="map-icon"
        />
        <img
          v-else-if="location.name.includes(currentName) || !currentName"
          :style="
            'position:absolute;' +
            'left:' +
            (location.position.x * 0.8 - 30) +
            'px;' +
            'top:' +
            (location.position.y * 0.8 - 68) +
            'px'
          "
          class="map-icon"
          src="@/assets/icon_loc2.png"
        />
      </template>
      <img
        v-for="(item, index) in list"
        v-show="item.isLocated"
        :key="index"
        class="map-icon"
        src="@/assets/icon_loc3.png"
      />
      <div
        id="map-content"
        :style="{
          background: `url(${bgImg}) no-repeat`,
          backgroundSize: 'cover'
        }"
      ></div>
      <div id="map-content-cover"></div>
    </div>
    <div class="device-list">
      <div class="list-title">{{ $t('StationFacilities') }}</div>
      <div class="list-content">
        <div
          v-for="(item, index) in list"
          :key="index"
          :class="currentName === item.name ? 'act' : ''"
          class="item flex items-center w-[300px] h-[84px] mb-[20px] mr-[20px]"
          @click="perClick(item, index)"
        >
          <img class="mr-[20px] ml-[16px]" :src="item.icon" />
          <div>
            <div class="ch mb-[8px]">{{ item.name }}</div>
            <div class="en">{{ item.enName }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import index from './index.js';
export default {
  ...index
};
</script>
<style lang="scss" scoped>
@import '../../menu/subpages/menumap';
#map {
  position: relative;
  overflow: visible !important;
  .map-icon {
    width: 80px;
    height: 83px;
    position: absolute;
    z-index: 9;
  }
  #map-content {
    height: 520px;
    width: 960px;
    margin: auto;
  }
  #map-content-cover {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 2;
    top: 0;
  }
}

.device-list {
  position: absolute;
  width: 1028px;
  transform: translate(-30px, 0px);
  height: 518px;
  background: #ffffff;
  box-shadow: 0px 0px 22px 0px #5d8eff;
  border-radius: 30px;
  bottom: -538px;
  .list-title {
    font-size: 26px;
    font-weight: 500;
    color: #4868c1;
    line-height: 26px;
    padding: 30px;
  }
  .list-content {
    margin: 0 40px;
    display: flex;
    flex-wrap: wrap;
    max-height: 400px;
    overflow-y: auto;
    // S 滚动条样式
    &::-webkit-scrollbar {
      width: 4px; // 滚动条宽度
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(0, 0, 0, 0.2);
    }

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.1);
    }
    :nth-child(3n) {
      margin-right: 0px;
    }
    .item {
      box-sizing: border-box;
      background: #f2f4f6;
      border: 3px solid #f2f4f6;
      color: #333;
      border-radius: 10px;

      img {
        width: 52px;
        height: 52px;
      }

      .ch {
        font-size: 24px;
        font-weight: 400;
        line-height: 24px;
      }

      .en {
        font-size: 20px;
        font-weight: 400;
        line-height: 20px;
      }
    }
    .act {
      background: linear-gradient(360deg, #6f99ff 0%, #5687fc 100%);
      color: #6f99ff;
      border-color: #6f99ff;
      background: #fff;
      box-shadow: 0px 4px 5px 0px rgba(86, 135, 252, 0.4);
    }
  }
}
</style>
