import dayjs from 'dayjs';
import jquery from 'jquery';
import $i18n from '@/lang';
declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $dayjs: dayjs.Dayjs;
    $: 'jquery';
    'window.$': 'jquery';
    jQuery: 'jquery';
    'windows.jQuery': 'jquery';
    $i18n;
    $pxToRem: any;
    $enStationToCn: any;
    $ChStationToEn: any;
  }
}
declare module '*.ts';

declare global {
  interface Window {
    language: any;
    bridge: any;
    onAsrResult: any;
    onDMResult: any;
    browser: any;
    onShortcut: any;
    onSiteChanged: any;
    bwtHybrid: any;
    suggestStart: any;
    onWakeupChanged: any;
    onStatusChange: any;
    L: any;
    SuperMap: any;
    onSelectline: any;
    config: any;
    onProcessCardBusiness: any;
    timeObj: any;
    openTest: any;
    onCardAction: any;
    onWorkModeAbnormal: any;
    onModuleList: any;
    sendLog: any;
  }
}
