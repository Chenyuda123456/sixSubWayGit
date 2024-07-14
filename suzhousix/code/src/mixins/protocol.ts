import {useRoute, useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n';
import {getCurrentInstance} from 'vue';
import {useStore} from 'vuex';
import {PayTypes} from '@/views/ticket/js/index.js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {payMethods} from '@/views/ticketCard/enum.ts';

export default function Protocol() {
  const {locale, t} = useI18n();
  const $route = useRoute();
  const $router = useRouter();
  const {proxy} = getCurrentInstance();
  const store = useStore();
  const onSiteChanged = (
    type,
    departSite,
    arrivalSite,
    destination,
    exitPort,
    distance,
    walkingTime,
    poiType
  ) => {
    const getNextRouteName = type => {
      let routeName = null;
      if (type === 'price') {
        routeName = 'menuticket';
      }
      if (type === 'time') {
        routeName = 'menutime';
      }
      if (
        type === 'mapSearch' ||
        type === 'busSearch' ||
        type === 'nearbySearch'
      ) {
        routeName = 'menunearby';
      }
      return routeName;
    };
    const nextRouteName = getNextRouteName(type);
    if ($route.name === nextRouteName) {
      // 执行对应逻辑
      // typeof callback === 'function' && callback();
    } else {
      const query = {
        type,
        departSite: proxy.$enStationToCn(departSite),
        arrivalSite: proxy.$enStationToCn(arrivalSite) // 当类型是首末班车时候这个参数代表了班次时间或者是列车时刻呢
      };
      if (nextRouteName === 'menunearby' || nextRouteName === 'menuchange') {
        Object.assign(query, {
          destination,
          exitPort,
          distance,
          walkingTime,
          poiType
        });
      }
      $router.push({name: nextRouteName, query});
    }
  };
  const onShortcut = words => {
    console.log(words);
    const routeName = $route.name;
    if (words === '返回') {
      if (routeName === 'ttschat') {
        $router.go(-1);
        return;
      } else {
        $router.push({
          name: 'menubuy'
        });
        return;
      }
    }
    const pageNameList = {
      返回首页: 'menubuy',
      咨询: 'welcome2',
      换乘查询: 'menuchange',
      出行查询: 'menuchange',
      票价查询: 'menuticket',
      乘车时长: 'menutime',
      首末班车: 'menufirsttrain',
      周边查询: 'menunearby',
      失物查询: 'menulost',
      站内查询: 'menunavigation',
      // 城市景点: 'menuscenic',
      购票查询: 'menubuy',
      票卡业务: 'card',
      实体票: 'readCard',
      电子票: 'chooseECardType',
      乘车政策: 'policy',
      便民服务: 'service',
      地铁公告: 'announcement',
      // 建议反馈: 'feedback',
      智能服务: 'ttschat'
    };
    if (window.config.isHuman && words == '人工服务') {
      store.commit('setHumanShow', true);
      return;
    }
    const nextRouteName = pageNameList[words];
    console.log(pageNameList[words]);
    console.log(words);
    if (nextRouteName && nextRouteName !== routeName) {
      // isCardProcess
      if (words == '实体票' || words == '电子票') {
        if (store.getters.isCardProcess) {
          $router.push({
            name: pageNameList[words],
            query: {
              cardType: 0
            }
          });
        } else {
          window?.bridge?.tts('暂不支持票卡业务');
        }
      } else {
        $router.push({
          name: pageNameList[words]
        });
      }
    } else if (store.getters.getServiceKeywords.includes(words)) {
      const index = store.getters.getServiceKeywords.findIndex(i => {
        return i === words;
      });
      $router.push({
        name: 'service',
        query: {
          index
        }
      });
    }
  };
  const onCityIntro = (title, category) => {
    // $router.push({
    //   name: 'menuscenic',
    //   query: {
    //     title,
    //     category
    //   }
    // });
  };
  const onLost = options => {
    const {description, site, startTime, endTime, lineId} =
      JSON.parse(options);
    $router.push({
      name: 'menulost',
      query: {
        description,
        site,
        startTime,
        endTime,
        lineId
      }
    });
  };
  const onStationSearch = poi => {
    $router.push({
      name: 'menunavigation',
      query: {poi}
    });
  };
  const onPay = () => {
    $router.push({
      name: 'menubuy'
    });
  };
  const onBuyTickets = options => {
    const json = JSON.parse(options);
    json.price = json.fare;
    // ticketType == 0 是单程票
    // ticketType == 1 是出站票
    const {
      arrivalSite,
      destination,
      count,
      price,
      payType,
      ticketType,
      arrivalSiteId
    } = json;
    console.log(
      'protocol',
      arrivalSite,
      destination,
      count,
      price,
      payType,
      ticketType,
      arrivalSiteId
    );
    const payCode = new PayTypes(payType).code;
    if (!store.getters.isBuyOutFare && ticketType) {
      return window?.bridge?.tts(
        t('ThisDeviceDoesNotSupportThePurchaseOfExitTickets')
      );
    }
    if (!store.getters.isBuyFare && !ticketType) {
      return window?.bridge?.tts(
        t('ThisDeviceDoesNotSupportThePurchaseOfSingleTripTickets')
      );
    }
    if (
      !store.getters.IsDigCashPayEnable &&
      payCode == payMethods['numberMethod']
    ) {
      return window?.bridge?.tts(
        t('ThisDeviceDoesNotSupportThePurchaseOfTicketsWithDigitalRMB')
      );
    } else if (
      !store.getters.IsQrPayEnable &&
      payCode == payMethods['QRCodeMethod']
    ) {
      return window?.bridge?.tts(t('ThisDeviceDoesNotSupportQRCodeTicketing'));
    } else if (
      !store.getters.IsCoinPayEnable &&
      payCode == payMethods['cashMethod']
    ) {
      return window?.bridge?.tts(t('ThisDeviceDoesNotSupportCashTicketing'));
    }
    if (ticketType) {
      if (store.getters.getIsPaymentArea) {
        $router.push({
          name: 'moneyExitFare',
          query: {
            arrivalSite: proxy.$enStationToCn(arrivalSite), // 到达站点
            destination, // 目的地
            count, // 票数
            price, // 单价
            payType,
            arrivalSiteId // 站点id
          }
        });
      } else {
        return window?.bridge?.tts(
          t('ThisDeviceDoesNotSupportCompensationFare')
        );
      }
    } else {
      if (store.getters.getIsPaymentArea) {
        return window?.bridge?.tts(
          t(t('ThisDeviceDoesNotSupportTicketPurchasing'))
        );
      } else {
        $router.push({
          name: 'menubuy',
          query: {
            arrivalSite: proxy.$enStationToCn(arrivalSite), // 到达站点
            destination, // 目的地
            count, // 票数
            price, // 单价
            payType,
            arrivalSiteId // 站点id
          }
        });
      }
    }
  };
  const onLanguageChange = lang => {
    if (
      lang !==
      (window.localStorage.getItem('lang') === 'en' ? 'english' : 'chinese')
    ) {
      if (lang === 'english') {
        window.language = lang;
        locale.value = 'en';
        store.commit('setLanguage', 'en');
        window.localStorage.setItem('lang', 'en');
        window?.bridge?.changeLanguage('english');
      } else {
        window.language = lang;
        locale.value = 'cn';
        store.commit('setLanguage', 'cn');
        window.localStorage.setItem('lang', 'cn');
        window?.bridge?.changeLanguage('chinese');
      }
      $router.push({name: 'menubuy'});
    }
  };
  const onWakeupChanged = isWakeup => {
    if (!isWakeup) {
      $router.push({
        name: 'menubuy'
      });
    }
  };
  // window.onLineSETime({
  //   "line": "1号线",
  //   "type": "线路首末车"
  // })
  const onLineSETime = option => {
    $router.push({name: 'menuFirstAndLastVehicles', query: option});
  };
  //   type：首末班车 列车时刻  班次时间
  //   附加属性： departSite
  const onDriveTime = option => {
    $router.push({name: 'menufirsttrain', query: option});
  };
  const onRoute = option => {
    $router.push({name: 'menuchange', query: option});
  };
  // 根据当前页面需要添加默认跳转
  const firstLoad = (noLoadList = []) => {
    if (!noLoadList.includes('onBuyTickets')) {
      window['onBuyTickets'] = onBuyTickets;
    }
    if (!noLoadList.includes('onPay')) {
      window['onPay'] = () => onPay;
    }
    if (!noLoadList.includes('menuscene')) {
      window['onCityIntro'] = onCityIntro;
    }
    if (!noLoadList.includes('onLost')) {
      window['onLost'] = onLost;
    }
    if (!noLoadList.includes('onStationSearch')) {
      window['onStationSearch'] = onStationSearch;
    }
    if (!noLoadList.includes('onSiteChanged')) {
      window['onSiteChanged'] = onSiteChanged;
    }
    if (!noLoadList.includes('onShortcut')) {
      window['onShortcut'] = onShortcut;
    }
    if (!noLoadList.includes('onLanguageChanged')) {
      window['onLanguageChanged'] = onLanguageChange;
    }
    if (!noLoadList.includes('onWakeupChanged')) {
      window['onWakeupChanged'] = onWakeupChanged;
    }
    if (!noLoadList.includes('onLineSETime')) {
      window['onLineSETime'] = onLineSETime;
    }
    if (!noLoadList.includes('onDriveTime')) {
      window['onDriveTime'] = onDriveTime;
    }
    if (!noLoadList.includes('onRoute')) {
      window['onRoute'] = onRoute;
    }
  };

  return {
    onSiteChanged,
    onShortcut,
    onCityIntro,
    onLost,
    onStationSearch,
    onPay,
    onBuyTickets,
    onLanguageChange,
    onWakeupChanged,
    onLineSETime,
    onDriveTime,
    onRoute,
    firstLoad
  };
}
