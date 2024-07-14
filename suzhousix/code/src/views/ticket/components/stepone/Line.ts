import { useStore } from 'vuex';
const store = useStore();
interface poiformate {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}
// 地图坐标数据
export const DATA = {
  LinePoiData: {},
  lineImg: [],
  siteArea: {
    x1: 31,
    y1: 129,
    x2: 1074,
    y2: 928
  }
};

export class Poi {
  x = 0;
  y = 0;
  imgName = '';
  imgUrl = '';
  lineIndex = 0;
  poiData: {};
  lineImg = {};
  siteArea: poiformate = DATA.siteArea;
  type: string = 'lineAll';
  store: store;
  constructor(store) {
    this.store = store;
    this.imgName = 'AllLines-CN.jpg';
    let getLineBtnsRes = window?.bridge?.getLineBtns();
    DATA.LinePoiData = getLineBtnsRes ? JSON.parse(getLineBtnsRes) : [];
    this.poiData = DATA.LinePoiData;
    let getLineImgRes = window?.bridge?.getLineImgUrls();
    DATA.lineImg = getLineImgRes ? JSON.parse(getLineImgRes) : [];
    this.lineImg = DATA.lineImg;
    this.imgUrl = DATA.lineImg['lineAll'] || {};
  }
  setType(type) {
    this.type = type;
  }
  getFormatXY(offsetX: number, offsetY: number) {
    console.log(offsetX, offsetY);
    const imgWidth = document.body.clientWidth >= 1920 ? 1080 : 988;
    const scale: number = Number.parseFloat((1280 / imgWidth).toFixed(5));
    return {
      x: Math.round(offsetX * scale),
      y: Math.round(offsetY * scale)
    };
  }
  asrChange(x, y) {
    const data = this.poiData;
    let isLang = false;
    for (const item in data) {
      const { x1, y1, x2, y2 } = data[item];
      if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
        if (item == 'lang') {
          isLang = true;
        } else {
          this.type = item;
        }
        break;
      }
    }
    if (isLang) {
      // 切换语言
      let lang = this.store.getters.getLang;
      if (lang && lang == 'en') {
        window['onLanguageChanged']('chinese');
      } else {
        window['onLanguageChanged']('english');
      }
    }
    if (this.type === 'lineAll') {
      // 切换首页地图
      this.imgUrl = DATA.lineImg['lineAll'];
    } else if (this.type.indexOf('line') > -1) {
      // 切换线路图
      this.imgUrl = DATA.lineImg[this.type];
    }
  }
  clickMap(offsetX: number, offsetY: number) {
    let isLang = false;
    const { x, y } = this.getFormatXY(offsetX, offsetY);
    const sitePoi = this.siteArea;
    if (x > sitePoi.x1 && y > this.siteArea.y2) {
      const data = this.poiData;
      for (const item in data) {
        const { x1, y1, x2, y2 } = data[item];
        if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
          if (item == 'lang') {
            isLang = true;
          } else {
            this.type = item;
          }
          break;
        }
      }
      if (isLang) {
        // 切换语言
        let lang = window.localStorage.getItem('lang');
        if (lang && lang == 'en') {
          window['onLanguageChanged']('chinese');
        } else {
          window['onLanguageChanged']('english');
        }
      }
      const lanSuffix = this.store.getters.getLang === 'ch' ? 'CN' : 'EN';
      if (this.type === 'lineAll') {
        // 切换首页地图
        this.imgName = `AllLines-${lanSuffix}.jpg`;
        this.imgUrl = DATA.lineImg['lineAll'];
      } else if (this.type.indexOf('line') > -1) {
        // 切换线路图
        const lineIndex = this.type.split('line')[1];
        this.imgName = `TVM-${lineIndex}-${lanSuffix}.jpg`;
        this.imgUrl = DATA.lineImg[this.type];
      }
    } else if (
      x > sitePoi.x1 &&
      x < sitePoi.x2 &&
      y > sitePoi.y1 &&
      y < sitePoi.y2 &&
      this.type &&
      this.type !== 'lineAll'
    ) {
      console.log('station');
      window?.bridge?.onMapClick(x, y, this.imgName.split('.')[0]);
      this.type = 'station';
    }
  }
}
