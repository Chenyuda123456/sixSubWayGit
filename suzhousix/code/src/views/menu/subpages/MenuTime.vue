<template>
  <div class="map-box display-flex-between">
    <div id="map" style="height: 100%"></div>
    <map-info-box
      v-show="store.arrivalSite"
      ref="mapInfoBox"
      :top-info="title"
      class="map-content-dialog"
    >
      <!-- / 路线信息 -->
      <a-row class="line-container">
        <a-row
          align="middle"
          class="line-point-box"
          justify="center"
          style="width: 100%"
          type="flex"
        >
          <a-col style="display: flex; align-content: center">
            <span
              v-chStationToEn="store.departSite"
              class="f22 color-white start-station"
            >
              {{ store.departSite }}
            </span>
          </a-col>
          <a-col :span="3" class="text-center">
            <i class="icon icon-line-menuChange-arrow"></i>
          </a-col>
          <a-col style="display: flex; align-items: center">
            <span
              v-chStationToEn="store.arrivalSite"
              class="f26 color-white terminal-station"
            >
              {{ store.arrivalSite }}
            </span>
          </a-col>
        </a-row>
        <div class="ticket-price display-flex-center">
          <i class="icon icon-money" style="margin-top: -3px"></i>
          {{ $t('traveltime') }}:<span class="line-text"
            >{{ time }}{{ $t('minutes') }}</span
          >
        </div>
      </a-row>
    </map-info-box>
  </div>
</template>

<script>
import axios from 'axios';
import LMap from '@/components/line';
import Protocol from '@/mixins/protocol.ts';
import MapInfoBox from '@/components/MapInfoBox.vue';
export default {
  name: 'MenuTime',
  components: { MapInfoBox },
  data() {
    return {
      lineMap: null,
      startMarker: null,
      store: {},
      isFirstLoad: true,
      siteChangeFn: null,
      time: 0
    };
  },
  computed: {
    title() {
      return [this.$t('traveltime')];
    },
    currentSite() {
      return window?.bridge?.getDefaultSite();
    }
  },
  watch: {
    '$i18n.locale': {
      handler: function (val) {
        if (val && !this.isFirstLoad) {
          // 重新初始化地图
          this.init();
          this.$nextTick(() => {
            if (this.store.departSite) {
              this.updateTimeMap({
                departSite: this.store.departSite,
                arrivalSite: this.store.arrivalSite
              });
            }
          });
        }
      },
      immediate: true
    }
  },
  mounted() {
    const { firstLoad, onSiteChanged } = Protocol();
    firstLoad(['onSiteChanged']);
    this.siteChangeFn = onSiteChanged;
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      this.lineMap = new LMap.Text('map', {
        zoom: 4,
        isNeedClick: true,
        language:
          window.localStorage.getItem('lang') === 'en' ? 'English' : 'Chinese'
      });
      // 绑定站点点击事件
      this.lineMap.event.on('clickStation', async e => {
        // 点击站点获取站点位置
        // 新增自定义图标
        let { position, id, siteCoord, name } = e;
        this.store.departSite = name;
        this.startMarker && this.startMarker.remove();
        this.startMarker = new LMap.Marker({
          mapId: 'map',
          markerId: 'logoStart',
          content:
            window.localStorage.getItem('lang') === 'en'
              ? '<div class="btn-set start-en"></div> '
              : '<div class="btn-set start-cn"></div>',
          position,
          siteCoord
        });
        let res = await this.getTickets(this.getStationId(id));
        let ticketData = res.map(item => {
          return {
            id: item.id,
            text: item.time
          };
        });
        //  写入票价数据
        this.lineMap.updateText({
          data: ticketData,
          startSiteId: this.getStationId(id)
        });
        if (this.store.arrivalSite) {
          // 获取目标站点时长
          let arrivalSiteId = this.lineMap.lineData.getStationByName(
            this.store.arrivalSite
          ).id;
          this.time = ticketData.find(item => {
            return item.id === this.getStationId(arrivalSiteId);
          }).text;
        }
      });

      // 监听站点事件
      window['onSiteChanged'] = (
        type,
        departSite,
        arrivalSite,
        destination,
        exitPort,
        distance,
        walkingTime,
        poiType
      ) => {
        this.onSiteChanged({
          type,
          departSite,
          arrivalSite,
          destination,
          exitPort,
          distance,
          walkingTime,
          poiType
        });
      };

      // 外部跳转
      if (this.$route.query && !window.$.isEmptyObject(this.$route.query)) {
        let {
          type,
          departSite,
          arrivalSite,
          destination,
          exitPort,
          distance,
          walkingTime,
          poiType
        } = this.$route.query;
        this.onSiteChanged({
          type,
          departSite,
          arrivalSite,
          destination,
          exitPort,
          distance,
          walkingTime,
          poiType
        });
      } else if (window.bridge && this.isFirstLoad) {
        this.store.departSite = this.currentSite;
        this.updateTimeMap({ departSite: this.currentSite });
      }
      this.isFirstLoad = false;
    },
    onSiteChanged({
      type,
      departSite,
      arrivalSite,
      destination,
      exitPort,
      distance,
      walkingTime,
      poiType
    }) {
      if (type === 'time') {
        // 英文转中文
        departSite = this.$enStationToCn(departSite);
        arrivalSite = this.$enStationToCn(arrivalSite);
        this.store.departSite = departSite;
        this.store.arrivalSite = arrivalSite;
        this.updateTimeMap({ departSite, arrivalSite });
        return;
      }
      this.siteChangeFn(
        type,
        departSite,
        arrivalSite,
        destination,
        exitPort,
        distance,
        walkingTime,
        poiType
      );
    },
    getStationId(id) {
      let result = id.replace('s', '').replace('r', '');
      if (result.indexOf('_') > -1) {
        result = result.split('_')[1];
      }
      return result;
    },
    // 获取当前站点到其他站点票价&乘车时长
    getTickets(sid) {
      // const ipUrl = 'http://121.43.37.62:8894/'
      // return axios({
      //   method: 'get',
      //   url: `${ipUrl}admin/getTransTickets.do?sid=${sid}`,
      //   headers: {
      //     'Content-Type': 'application/json;charset=UTF-8', //将表单数据传递转化为form-data类型
      //   },
      // }).then((res) => {
      //   return res.data
      // })
      const ipUrl = window.config.apiUrl;
      return axios({
        method: 'get',
        url: `${ipUrl}/subway/api/station_fare/${sid}`,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then(res => {
        return res.data.result;
      });
    },
    /**
     * @description 根据站点名查询票价图
     * @param { String } departSite 当前站点
     * @return { String } arrivalSite 目的站点
     */
    async updateTimeMap({ departSite = '', arrivalSite = '' }) {
      let id = this.getStationId(
        this.lineMap.lineData.getStationByName(departSite).id
      );
      let position = this.lineMap.getStationPoi({
        id
      });
      let site = window.$(`#r${id}`);
      // 获取当前站点数据
      this.startMarker && this.startMarker.remove();
      this.startMarker = new LMap.Marker({
        mapId: 'map',
        markerId: 'logoStart',
        content:
          window.localStorage.getItem('lang') === 'en'
            ? '<div class="btn-set start-en"></div> '
            : '<div class="btn-set start-cn"></div>',
        position,
        siteCoord: [
          site.attr('cx') || site.attr('x'),
          site.attr('cy') || site.attr('y')
        ]
      });
      let res = await this.getTickets(id);
      let ticketData = res.map(item => {
        return {
          id: item.id,
          text: item.time
        };
      });
      //  写入票价数据
      this.lineMap.updateText({
        data: ticketData,
        startSiteId: id
      });
      let num = 0;
      if (arrivalSite) {
        // 获取目标站点票价
        let arrivalSiteId =
          this.lineMap.lineData.getStationByName(arrivalSite).id;
        num = ticketData.find(item => {
          return item.id === this.getStationId(arrivalSiteId);
        }).text;
        this.time = num;
      }
      window?.bridge?.generateNLG('time', departSite, arrivalSite, num, '', '');
    }
  }
};
</script>
<style lang="scss" scoped>
@import './menumap.scss';

.map-content-dialog .line-container .ticket-price {
  height: 466px;
  width: 100%;
  background: #ffffff;
  border-radius: 10px;
}

.ticket-price {
  font-size: 30px;
  font-weight: 400;
  color: #333333;
  line-height: 30px;

  .icon-money {
    margin-right: 12px;
    height: 32px;
    width: 32px;
  }

  span {
    font-size: 30px;
    font-weight: 400;
    color: #333333;
    line-height: 30px;
    color: #e8730b;
  }
}
</style>
