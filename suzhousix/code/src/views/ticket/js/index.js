import i18n from '@/lang';
import { payMethods } from '@/views/ticketCard/enum.ts';
// 支付方式(郑州地铁)
const PAYCODE = {
  ZFB: 1,
  WX: 2
};

// 买票信息
class Ticket {
  constructor({
    arrivalSite = '',
    destination = '',
    destnLAL = '',
    payCode,
    count = 1,
    price = 2,
    exitPort = '',
    straightDistance = '',
    arrivalSiteId = ''
  }) {
    this.origin = window?.bridge?.getDefaultSite() || '东方之门'; // 起点名称
    this.originLAL =
      (window.bridge && window?.bridge?.getSiteLocation()) ||
      '120.679748,31.317007'; // 起点坐标
    this.initArrivalSite = arrivalSite; // 目的地地铁站初始值
    this.destination = destination; // 目的地名称
    this.destnLAL = destnLAL; // 目的地坐标
    this.payCode = payCode; // 支付方式 1支付宝 2微信
    this.count = count; // 票数
    this.price = price; // 票价
    this.arrivalSite = arrivalSite;
    this.exitPort = exitPort;
    this.straightDistance = straightDistance;
    this.arrivalSiteId = arrivalSiteId;
  }

  get endName() {
    // 终点名称
    return this.arrivalSite || this.destination;
  }

  get endArrivalSite() {
    // 目的地车站补全地铁站名称
    let arrivalSite;
    const SPECNOUN = '地铁站';
    if (this.initArrivalSite && this.initArrivalSite.indexOf(SPECNOUN) < 0) {
      arrivalSite = this.initArrivalSite + SPECNOUN;
    }
    return arrivalSite;
  }

  set endArrivalSite(val) {
    this.arrivalSite = val;
  }
}

// 支付方式（苏州地铁）
class PayTypes {
  constructor(value) {
    this.type = value;
    this.code = null;
    switch (this.type) {
      case '现金':
        this.code = payMethods['cashMethod'];
        break;
      case '扫码支付':
        this.code = payMethods['QRCodeMethod'];
        break;
      case '扫码付':
        this.code = payMethods['QRCodeMethod'];
        break;
      case '二维码付':
        this.code = payMethods['QRCodeMethod'];
        break;
      case '数字人民币':
        this.code = payMethods['numberMethod'];
        break;
      case '卡扣':
        this.code = payMethods['remainder'];
        break;
      default:
        console.log(this.type);
    }
  }
}

class TicketStatus {
  constructor({
    sts,
    substs,
    shouldIssued,
    issued,
    paied,
    shouldPaied,
    outChanged,
    qrType,
    qrInfo,
    errorList,
    loginSts,
    qrPicInfo
  }) {
    this.sts = sts;
    this.substs = substs;
    this.shouldIssued = shouldIssued;
    this.issued = issued;
    this.paied = paied || 0;
    this.shouldPaied = shouldPaied || 0;
    this.outChanged = outChanged;
    this.qrType = qrType;
    this.qrInfo = qrInfo;
    this.errorList = errorList;
    this.loginSts = loginSts;
    this.qrPicInfo = qrPicInfo;
  }
}
export { PAYCODE, Ticket, PayTypes, TicketStatus };
