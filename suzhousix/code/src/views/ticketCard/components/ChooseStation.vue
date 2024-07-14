<template>
  <div v-if="visible" class="back-wrapper-box">
    <div class="back-wrapper">
      <!--      <a-row class="f60 color-lightblue back-title">-->
      <!--        <a-col :span="12">{{ $t('chooseSite') }}</a-col>-->
      <!--        <a-col :span="12" class="text-right">-->
      <!--          <i class="icon icon-close" @click="close"></i>-->
      <!--        </a-col>-->
      <!--      </a-row>-->
      <div class="back-cont">
        <div class="tab-title">
          <div>
            <div v-for="line in szmtr" :key="line.id">
              <div
                :class="[line.id === lineId ? 'active' : '']"
                class="line-item"
                @click="changeLine(line)"
              >
                {{ lang == 'En' ? line.eName : line.name }}
              </div>
            </div>
          </div>
        </div>
        <div class="tab-cont">
          <van-list>
            <template v-for="(line, index) in szmtr" :key="index">
              <ul v-show="lineId === line.id">
                <li
                  v-for="(station, index) in line.station"
                  v-show="station.type !== 'hide' && station.type !== 'temp'"
                  :key="index"
                  class="station-item"
                  :class="[station.name === nccStation ? 'active' : '']"
                  @click="choose(station)"
                >
                  {{ lang == 'En' ? station.eName : station.name }}
                </li>
              </ul>
            </template>
          </van-list>
        </div>
      </div>
      <buy-ticket-back-btn class="buyTicketBack" @click="close">
        {{ timeSecondsText }}（{{ timeSeconds }}）
      </buy-ticket-back-btn>
    </div>
  </div>
</template>

<script>
import BuyTicketBackBtn from '@/components/BuyTicketBackBtn.vue';
import { SecCounter } from '@/utils/tool';
import { mapState } from 'vuex';
import { szmtr } from '@/components/line/szmtr.js';
export default {
  name: 'ChooseStation',
  components: {
    BuyTicketBackBtn
  },
  filters: {},
  mixins: [],
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      szmtr: [],
      lineId: '',
      nccStation: '',
      timer: '',
      lang: window.localStorage.getItem('lang') === 'en' ? 'En' : 'Cn',
      timeSeconds: 60, // 倒计时秒数
      timeSecondsText: this.$t('Cancel') // 倒计时文字
    };
  },
  mounted() {
    // 获取所有站点
    this.szmtr =
      window?.bridge?.getSubwayData() &&
      JSON.parse(window?.bridge?.getSubwayData());
  },
  beforeUnmount() {
    this.timer && this.timer.countStop();
  },
  methods: {
    init() {
      this.returnBtnInit();
      this.lineId = this.lineId || this?.szmtr?.[0].id;
    },
    changeLine(line) {
      this.lineId = line.id;
      this.lineName = line.name;
    },
    choose(item) {
      this.timer && this.timer.countStop();
      this.nccStation = item.name;
      this.$emit('updateCheckData', {
        lineId: this.lineId,
        lineName: this.lineName,
        stationId: item.id,
        stationName: item.name
      });
      this.close();
    },
    close() {
      this.timer && this.timer.countStop();
      this.timeSeconds = 60;
      this.$emit('update:visible', false);
    },
    // 返回按钮倒计时
    returnBtnInit() {
      this.timer && this.timer.countStop();
      this.timer = new SecCounter();
      this.timer.countStart(this.timeSeconds, time => {
        if (time === 0) {
          this.close();
        }
        this.timeSeconds = time;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@media screen and (min-width: 1180px) {
  .back-wrapper-box {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.4);
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .back-wrapper {
    width: 1280px;
    height: 758px;
    background: #edf3ff;
    border-radius: 30px;
    position: relative;

    .back-cont {
      display: flex;
      height: 618px;
      font-size: 30px;
      font-weight: 400;
      color: #333333;
      overflow: hidden;

      .tab-title {
        height: 588px;
        box-sizing: border-box;
        margin-top: 30px;
        padding-top: 10px;
        padding-left: 30px;
        padding-right: 30px;
        overflow: auto;

        &::-webkit-scrollbar {
          width: 0px;
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

        .line-item {
          margin-bottom: 30px;
          text-align: center;
          line-height: 80px;
          width: 250px;
          height: 80px;
          background: rgba(255, 255, 255, 0.6);
          box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
          border-radius: 20px;
        }

        .line-item.active {
          background: linear-gradient(270deg, #6f99ff 0%, #5687fc 100%);
          box-shadow: 0px 8px 10px 0px rgba(86, 135, 252, 0.4);
          color: #fff;
        }
      }

      .tab-cont {
        overflow: auto;
        margin-top: 30px;
        border-radius: 20px;
        padding-top: 10px;
        height: 588px;
        background: #fff;

        &::-webkit-scrollbar {
          width: 12px;
        }

        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
          background: rgba(0, 0, 0, 0.2);
        }

        &::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
        }

        .station-item {
          width: 940px;
          line-height: 70px;
          text-indent: 60px;
          font-size: 30px;
          font-weight: 400;
          color: #333333;
        }

        .station-item.active {
          background: linear-gradient(270deg, #6f99ff 0%, #5687fc 100%);
          box-shadow: 0px 8px 10px 0px rgba(86, 135, 252, 0.4);
          color: #fff;
        }
      }
    }
  }

  .buyTicketBack {
    position: absolute;
    right: 30px;
    bottom: 30px;
    margin: auto;
    z-index: 999;

    &.disable {
      background: #ccc;
    }
  }
}

@media screen and (max-width: 1180px) {
  .back-wrapper-box {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.4);
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .back-wrapper {
    width: 944px;
    height: 758px;
    background: #edf3ff;
    border-radius: 30px;
    position: relative;

    .back-cont {
      display: flex;
      height: 618px;
      font-size: 30px;
      font-weight: 400;
      color: #333333;
      overflow: hidden;

      .tab-title {
        height: 588px;
        box-sizing: border-box;
        margin-top: 30px;
        padding-top: 10px;
        padding-left: 30px;
        padding-right: 30px;
        overflow: auto;

        &::-webkit-scrollbar {
          width: 0px;
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

        .line-item {
          margin-bottom: 30px;
          text-align: center;
          line-height: 80px;
          width: 240px;
          height: 80px;
          background: rgba(255, 255, 255, 0.6);
          box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
          border-radius: 20px;
        }

        .line-item.active {
          background: linear-gradient(270deg, #6f99ff 0%, #5687fc 100%);
          box-shadow: 0px 8px 10px 0px rgba(86, 135, 252, 0.4);
          color: #fff;
        }
      }

      .tab-cont {
        flex: 1;
        margin-right: 30px;
        overflow: auto;
        margin-top: 30px;
        border-radius: 20px;
        padding-top: 10px;
        height: 588px;
        background: #fff;

        &::-webkit-scrollbar {
          width: 12px;
        }

        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
          background: rgba(0, 0, 0, 0.2);
        }

        &::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
        }

        .station-item {
          height: 100px;
          line-height: 100px;
          text-indent: 60px;
          font-size: 30px;
          font-weight: 400;
          color: #333333;
        }

        .station-item.active {
          background: linear-gradient(270deg, #6f99ff 0%, #5687fc 100%);
          box-shadow: 0px 8px 10px 0px rgba(86, 135, 252, 0.4);
          color: #fff;
        }
      }
    }
  }

  .buyTicketBack {
    position: absolute;
    right: 30px;
    bottom: 30px;
    margin: auto;
    z-index: 999;

    &.disable {
      background: #ccc;
    }
  }
}
</style>
