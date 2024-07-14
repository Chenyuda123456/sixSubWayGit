export enum ChargeMethodEnum {
  CASH = '现金支付',
  ZFB = '支付宝支付',
  WX = '微信支付',
  DIGITAL = '数字人民币'
}

export enum ChargeMethodKeyCode {
  CASH = 0,
  ZFB = 1,
  WX = 2,
  DIGITAL = 3
}

export enum ChargeStatus {
  INIT,
  STARTED,
  ERROR
}

// 票卡种类类型 弃用
// export enum cardCategoryTypeEnum {
//   CardCategoryUnclear = '不确定类型',
//   CardCategorySingle = '单程票',
//   CardCategoryExit = '出站票',
//   CardCategoryCount = '计次类',
//   CardCategoryRegular = '定期类',
//   CardCategoryWallet = '钱包类',
//   CardCategoryQRCode = '二维码',
//   CardCategoryFace = '人脸支付'
// }
// 票卡种类类型
export enum ticketTypes {
  '单程票' = 1, // 钱包类
  '出站票', // 钱包类
  '计程票', // 钱包类 && 卡扣
  '计次类', // 计次类 && 卡扣
  '月票', // 计次类 && 卡扣
  '员工票', // 计次类 && 卡扣
  '一卡通', // 钱包类 && 卡扣
  '城市公共交通IC卡', // 钱包类 && 卡扣
  '闪付卡',
  '二维码'
}

// 票卡状态
export enum cardSts {
  '未初始化',
  '待出售',
  '已售',
  '已回收',
  '黑名单锁卡',
  '黑名单卡不允许进出站',
  '黑名单卡不允许进站',
  '黑名单卡允许进站不允许出站',
  '黑名单卡允许进出站'
}

// 票卡值类型
export enum cardValueType {
  money = 1,
  frequency,
  regular
}

// 车票介质类型
export enum eMediumType {
  '单程票',
  '出站票',
  '用户信息',
  '乘车码',
  '渠道',
  '人脸单程票',
  '人脸开通',
  '	人脸补登',
  '闪付卡',
  '数币'
}

//triggerProcessCardBusiness 票卡处理类型
export enum cardProcessTypeEnum {
  UpdateCard, // 票卡更新
  Refund, // 票卡退票
  RechargeCard, // 票卡充值
  CardDetailInfo, // 获取票卡详细信息
  ActiveCard, // 票卡激活（预留）
  DelayCard, // 票卡延期（预留）
  UnlockCard // 票卡解锁（预留）
}

//  票卡跟新处理类型
export enum cardAdjustActiveTypeEnum {
  AdjustNotReady, // 未准备好，未读到票卡
  AdjustNotice, // 仅显示提示语，无更新动作
  AdjustUncondition, //  无条件更新
  AdjustFareOverTime, // 超时补票更新
  AdjustFareOverTravel, // 超程补票更新
  AdjustEntryStation, // 补进站更新
  AdjustExitStation, //补出站更新
  AdjustRefundTicket, //退款退票
  AdjustReissue, //重新发卡  1先退票，2重新发卡
  AdjustAuthor, //授权更新  1.先让站员登陆；2.再补充信息；3.更新票卡
  AdjustReturnTicket, //票卡回收处理
  AdjustIssueExitCart, //发付费出站票
  AdjustIssueFreeExitCart, //发免费出站票
  AdjustFareOverTimeTravel //超时且超程补票
}

//triggerProcessCardBusiness 付款类型
export enum payMethods {
  pending = -1,
  cashMethod = 1001,
  QRCodeMethod = 1002,
  numberMethod = 1003,
  remainder = 1004
}

export enum QRCodeMethod {
  idle = 0, // 空闲状态
  open = 1, // 开启扫码头(设备主扫类型)
  obtainQRCode = 2, // 获取付款码（设备主扫类型）
  obtainQRCodeLink = 3, // 拉码，获取二维码数据（设备被扫类型）
  paymentSuccess = 4 // 付款成功
}

//onProcessCardBusiness sts
export enum unitLogicType {
  idle = 0, // 空闲状态
  findCard = 101, // 大读写器寻卡逻辑
  OneWayTicketRecycling = 201, // 单程票回收
  OneWayTicketIssuanceAndTransform = 203, // 单程票发行&找零逻辑
  writeCard = 204, // 大读写器写卡
  getInfo = 205, // 读写器信息取得逻辑
  cashPay = 301, // 现金付款逻辑
  QRCodePay = 302, // 二维码付款逻辑
  addInfo = 401, // 信息补充逻辑
  actionVerify = 500, // 模块动作验证逻辑
  allOver = 999 // 业务逻辑执行完毕单元逻辑状态
}

//onProcessCardBusiness substs
export enum unitLogicSts {
  idle = 0, // 空闲状态
  normalOver = 256, // 逻辑动作正常完毕
  overtimeOver = 257, // 逻辑动作超时完毕
  cancelOver = 258, // 逻辑动作取消完毕
  cancelProcess = 16 // 逻辑动作取消中
}
