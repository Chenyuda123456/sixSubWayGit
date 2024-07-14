<template>
  <div v-if="data.position">
    <img v-if="data.position" :src="imgUrl" alt="" @click="imgClick" />
  </div>
</template>
<script lang="ts">
import { reactive, onMounted, defineComponent, computed } from 'vue';

import { Poi, DATA } from './Line';
import { useStore } from 'vuex';
export default defineComponent({
  name: 'Line',
  setup() {
    console.log('1-开始创建组件-setup');
    let store = useStore();
    const data = reactive({
      lineIndex: 0,
      imgName: 'AllLines-CN',
      position: null
    });
    const imgUrl = computed(() => {
      console.log(data.position.imgUrl);
      console.log(data.position.imgUrl[store.getters.getLang]);
      return data.position.imgUrl[store.getters.getLang];
    });
    const lang = computed(() => {
      if (store.getters.getLang == 'cn') {
        return 'CN';
      } else {
        return 'EN';
      }
    });
    let MODULE_TIOM = computed(() => store.getters.MODULE_TIOM);
    onMounted(() => {
      data.position = new Poi(store);
    });
    const imgClick = event => {
      // if (MODULE_TIOM.value) {
      data.position.clickMap(event.offsetX, event.offsetY);
      // }
    };
    window.onSelectline = lineName => {
      console.log(lineName);
      console.log(DATA);
      let result;
      if (lineName == '线路图') {
        data.position.setType('lineAll');
      }
      result = DATA.LinePoiData;
      let offsetX, offsetY;
      if (lineName === '11号线') {
        offsetX = result.line11.x1;
        offsetY = result.line11.y1;
      }
      if (lineName === '线路图') {
        offsetX = result.lineAll.x1;
        offsetY = result.lineAll.y1;
      }
      if (lineName === '1号线') {
        offsetX = result.line1.x1;
        offsetY = result.line1.y1;
      }

      if (lineName === '2号线') {
        offsetX = result.line2.x1;
        offsetY = result.line2.y1;
      }
      if (lineName === '3号线') {
        offsetX = result.line3.x1;
        offsetY = result.line3.y1;
      }
      if (lineName === '4号线') {
        offsetX = result.line4.x1;
        offsetY = result.line4.y1;
      }
      if (lineName === '5号线') {
        offsetX = result.line5.x1;
        offsetY = result.line5.y1;
      }
      if (lineName === '6号线') {
        offsetX = result.line6.x1;
        offsetY = result.line6.y1;
      }
      data.position.asrChange(offsetX, offsetY);
    };
    return {
      data: data,
      imgClick,
      MODULE_TIOM,
      imgUrl
    };
  }
});
</script>
<style scoped lang="scss">
img {
  width: 100%;
  //height: 790px;
}
</style>
