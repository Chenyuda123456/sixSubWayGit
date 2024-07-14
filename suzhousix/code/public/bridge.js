// const host = '172.71.48.171';
const host = '127.0.0.1';
const webSocketInit = () => {
  //判断当前浏览器是否支持WebSocket, 主要此处要更换为自己的地址
  if ('WebSocket' in window) {
    window.ws_client = new WebSocket('ws://' + host + ':8888');
  } else {
    window.console.log('Not support websocket');
    return;
  }

  //连接成功建立的回调方法
  window.ws_client.onopen = function (event) {
    window.console.log('[ws] open');
  };

  //接收到消息的回调方法
  window.ws_client.onmessage = function (event) {
    // window.console.log('ws receive:' + event.data);
    let data = JSON.parse(event.data);
    // window.console.log('JSON.parse:' , data);
    switch (data.method) {
      case 'executeScript': // 执行脚本
        // console.log(data.data)
        window.eval(data.data);
        break;
      case 'refresh': // 跳转到首页
        window.location.href = window.location.href.split('#')[0];
        break;
      case 'close': // 关闭页面
        window.close();
        break;
      case 'dds.msg':
        window.parent.postMessage(data.data, '*');
        break;
      default:
        break;
    }
  };

  //连接关闭的回调方法
  window.ws_client.onclose = function () {
    window.console.log('[ws] close,reconnect...');

    window.ws_client = null;
    setTimeout(function () {
      webSocketInit();
    }, 5000);
  };

  //连接发生错误的回调方法
  window.ws_client.onerror = function () {
    // window.console.log("[ws] error");
  };
};

const init = () => {
  if (window.ws_client && window.bridge) return;
  window.console.log('----------------------bridge load----------------------');

  webSocketInit();

  //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
  window.onbeforeunload = function () {
    window.ws_client && window.ws_client.close();
  };

  //发送消息
  function send(message) {
    window.console.log('[ws] send:' + JSON.stringify(message));
    if (window.ws_client && window.ws_client.readyState == 1) {
      window.ws_client.send(JSON.stringify(message));
    }
  }
  function doPost(json) {
    if (!window.ws_client || window.ws_client.readyState != 1) return null;
    window.console.log('[http] send:' + JSON.stringify(json));
    let result;
    window.$.ajax({
      type: 'POST',
      // url: 'http://' + host + ':8890', // test
      url: 'http://' + host + ':8889', // product
      contentType: 'application/json',
      data: JSON.stringify(json),
      dataType: 'json',
      async: false,
      success: function (response) {
        result = response.data;
      },
      error: function (msg) {
        window.console.log(msg);
      }
    });
    window.console.log('[http] receive:' + result);
    return result;
  }

  // 发送消息到全链路
  window?.bridge?.sendText = function (msg) {
    send({
      method: 'sendText',
      args: [msg]
    });
  };
  // 改变对话状态
  window?.bridge?.clickToWakeup = function (needWakeup) {
    send({
      method: 'clickToWakeup',
      args: [needWakeup]
    });
  };
  // 获取默认站点
  window?.bridge?.getDefaultSite = function () {
    return doPost({
      method: 'getDefaultSite',
      args: []
    });
  };
  // 获取当前站点信息
  window?.bridge?.getCurrentInfo = function () {
    return doPost({
      method: 'getCurrentInfo',
      args: []
    });
  };
  // 获取站点英文名
  window?.bridge?.getSiteEnName = function () {
    return doPost({
      method: 'getSiteEnName',
      args: []
    });
  };
  // 获取当前站经纬度
  window?.bridge?.getSiteLocation = function () {
    return doPost({
      method: 'getSiteLocation',
      args: []
    });
  };
  // 获取默认推荐反问
  window?.bridge?.getDefaultRecommendations = function () {
    return doPost({
      method: 'getDefaultRecommendations',
      args: []
    });
  };
  // 生成NLG并播报
  window?.bridge?.generateNLG = function (
    type,
    departSite,
    arrivalSite,
    num,
    payType,
    poi,
    destination,
    port,
    distance
  ) {
    send({
      method: 'generateNLG',
      args: [
        type,
        departSite,
        arrivalSite,
        num,
        payType,
        poi,
        destination,
        port,
        distance
      ]
    });
  };
  // 选择目的地
  window?.bridge?.selectDestination = function (isNear, name, lon, lat) {
    send({
      method: 'selectDestination',
      args: [isNear, name, lon, lat]
    });
  };
  // 切换语言
  window?.bridge?.changeLanguage = function (language) {
    send({
      method: 'changeLanguage',
      args: [language]
    });
  };
  // 切换技能
  window?.bridge?.changeSkill = function (name) {
    send({
      method: 'changeSkill',
      args: [name]
    });
  };

  // 按钮点击事件
  window?.bridge?.onButtonClick = function (btnName) {
    send({
      method: 'onButtonClick',
      args: [btnName]
    });
  };

  // 线网图点击
  window?.bridge?.onMapClick = function (x, y, mapName) {
    send({
      method: 'onMapClick',
      args: [x, y, mapName]
    });
  };

  // 关闭对话
  window?.bridge?.keepSilence = function (flag) {
    send({
      method: 'keepSilence',
      args: [flag]
    });
  };

  // 拨打电话
  window?.bridge?.makeCall = function () {
    doPost({
      method: 'makeCall',
      args: []
    });
  };

  // 挂掉电话
  window?.bridge?.hangUp = function () {
    send({
      method: 'hangUp',
      args: []
    });
  };
  // 摄像头
  window?.bridge?.releaseCamera = function (val) {
    send({
      method: 'releaseCamera',
      args: [val]
    });
  };
};

init();
