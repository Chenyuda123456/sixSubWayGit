<template>
  <div class="map-box display-flex-between-center">
    <div id="map" style="position: relative">
      <template v-for="(location, index) in locationArr" :key="index">
        <img
          v-if="location.name == '当前设备'"
          :style="
            'position:absolute;' +
            'left:' +
            (location.position.x + 2) +
            'px;' +
            'top:' +
            (location.position.y - 68) +
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
            (location.position.x + 2) +
            'px;' +
            'top:' +
            (location.position.y - 68) +
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
    <map-info-box
      ref="mapInfoBox"
      :top-info="[$t('StationFacilities')]"
      class="map-content-dialog"
    >
      <div class="list">
        <div class="flex flex-wrap justify-between">
          <div
            v-for="(item, index) in list"
            :key="index"
            :class="currentName === item.name ? 'act' : ''"
            class="item flex items-center w-[215px] h-[72px] mb-[20px]"
            @click="perClick(item, index)"
          >
            <img class="mr-[12px] ml-[16px]" :src="item.icon" />
            <div>
              <div class="ch mb-[8px]">{{ item.name }}</div>
              <div class="en">{{ item.enName }}</div>
            </div>
          </div>
        </div>
      </div>
    </map-info-box>
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
    position: absolute;
    width: 1210px;
    left: 0;
    right: 0;
    margin: auto;
    height: 100%;
  }
  //#map-content-cover {
  //  position: absolute;
  //  width: 100%;
  //  height: 100%;
  //  z-index: 2;
  //}
}

.list {
  width: 466px;
  background: #ffffff;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 20px 13px;
  flex-wrap: wrap;

  > div {
    flex-wrap: wrap;
  }

  .item {
    box-sizing: border-box;
    background: #f2f4f6;
    border: 3px solid #f2f4f6;
    color: #333;
    border-radius: 10px;

    img {
      width: 36px;
      height: 36px;
    }

    .ch {
      font-size: 20px;
      font-weight: 400;
      line-height: 20px;
    }

    .en {
      font-size: 14px;
      font-weight: 400;
      line-height: 12px;
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
</style>
