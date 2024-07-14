/*
 *@description: 线路图渲染
 */

import './utils/hammer.min';
import $ from 'jquery';
import svgPanZoom from 'svg-pan-zoom';
import EventEmitter from './event';
import LineData from './lineData';
import BrowserType from './browser';
import { templateSvg, templateSvgStyle, getImgSrc } from './svgBg';
const addLMapStyle = function () {
  var ele = document.createElement('style');
  ele.class = 'LMap.css';
  let eleStyle = templateSvgStyle;
  ele.innerHTML = eleStyle;
  document.getElementsByTagName('head').item(0).appendChild(ele);
};

const getMapTemplate = lang => {
  return templateSvg;
};

/**
 * @description 线路图...
 * @param { Boolean } name description...
 * @return { Boolean } description...
 */
export default class LMapBase {
  constructor(id, options) {
    this.lineData = new LineData(); // 数据对象
    this.event = new EventEmitter(); // 事件系统
    this.id = id; // 容器id
    this.mapId = 'LineMap1';
    this.data = this.lineData.data;
    this.initZoom = options.zoom; // 初始缩放值
    this.language = options.language || 'Chinese'; //线路图语言  Chinese  English
    this.mode = options.mode || 'path'; // line线路图模式,text站点支持自定义信息
    this.default_scale = null; // 相对窗口缩放

    this.width = 500; //SVG窗体宽度
    this.height = 500; //SVG窗体高度
    this.lineWidth = 22; //线条宽度
    this.stationStrokeWidth = 8; //站点圆圈环半径
    this.stationSelectedStrokeWidth = 15; //站点圆圈环半径（选中）
    this.normalStationWidth = 40; //站点圆圈宽度
    this.transferStationHeight = 60; //换乘站点圆圈宽度
    this.animationSteps = 30; //动画总帧数
    this.animationSpeed = 10; //动画速度，帧之间的间隔时间，单位：毫秒（间隔时间可能会受浏览器的执行速度影响而导致实际无法达到）
    this.minZoom = 0.5; //最小缩放比例，基于初始窗体大小
    this.maxZoom = 1; //最大放大比例，基于SVG原始尺寸
    this.path_display_percentage = 0.7; //路径显示时占窗口的比例，0~1之间
    this.zoomLevel = new Array(8); //缩放比例，可以通过改变数组元素个数调整缩放级数
    this.stationArr = []; // 存储所有站点
    this.panZoom = null;
    this.panZoomAnimationIntervalID = null;
    this.pathAnimationInte;
    this.isShowNav = options.isShowNav; // 是否展示线路导航
    this.isNeedClick = options.isNeedClick; // 是否支持页面点击效果
    // 浏览器支持
    if (BrowserType() == '0') {
      alert('您的浏览器不支持，请使用IE9以上版本浏览。');
      return;
    }
    // 初始化线路图DOM, style
    addLMapStyle();
    $(`#${this.id}`).html(getMapTemplate(this.language));

    this.init();
    this.initZoom && this.zoomBy(this.initZoom);
  }

  init() {
    this.width = document.getElementById(this.id).offsetWidth;
    this.height = document.getElementById(this.id).offsetHeight;
    //记录初始窗体的大小
    this.initWidth = this.width;
    this.initHeight = this.height;
    //记录之前窗体的大小
    this.widthBefore = this.width;
    this.heightBefore = this.height;
    this.draw();
    //获取SVG原始图像的尺寸
    this.image_width = document.getElementById(this.mapId).getBBox().width;
    this.image_height = document.getElementById(this.mapId).getBBox().height;
    //计算默认缩放比例，即当SvgPanZoom缩放比例为1的时候，与实际图像大小的比例
    this.default_scale = this.image_width / this.width;
    if (this.default_scale < this.image_height / this.height) {
      this.default_scale = this.image_height / this.height;
    }
    //计算放大比例
    this.maxZoom *= this.default_scale;
    var scale = Math.pow(
      this.maxZoom / this.minZoom,
      1 / this.zoomLevel.length
    );
    this.zoomLevel[0] = this.minZoom;
    for (var i = 1; i < this.zoomLevel.length - 1; i++) {
      this.zoomLevel[i] = this.zoomLevel[i - 1] * scale;
    }
    this.zoomLevel[this.zoomLevel.length - 1] = this.maxZoom;

    this.createSvg(this.mapId);
    let _lineMap = this;
    // 绑定点击站点事件
    if (this.isNeedClick) {
      if (_lineMap.mode === 'path') {
        $(`#${this.id} .svg-station`).on('click', function (e) {
          _lineMap.clickStation(this);
          const ele = $('#' + e.currentTarget.id).prev()[0];
          _lineMap.event.emit('clickStation', {
            position: [e.offsetX, e.offsetY],
            siteCoord: [
              e.currentTarget.attributes.cx
                ? e.currentTarget.attributes.cx.nodeValue
                : ele.attributes.cx.nodeValue,
              e.currentTarget.attributes.cy
                ? e.currentTarget.attributes.cy.nodeValue
                : ele.attributes.cy.nodeValue
            ],
            id: e.currentTarget.id,
            name: e.currentTarget.attributes.name.nodeValue,
            eName: e.currentTarget.attributes.eName.nodeValue.replace('/', '')
          }); // 当前注册了才触发
        });
        $(`#${this.id} .svg-station-name`).on('click', function (e) {
          _lineMap.clickStation(this);
          let prevEle = $(this).prev()[0];
          console.log(prevEle.attributes);
          _lineMap.event.emit('clickStation', {
            position: [e.offsetX, e.offsetY],
            siteCoord: [
              prevEle.attributes.x.nodeValue,
              prevEle.attributes.y.nodeValue
            ],
            id: prevEle.id,
            name: prevEle.attributes.name.nodeValue,
            eName: prevEle.attributes.name.eName.nodeValue.replace('/', '')
          }); // 当前注册了才触发
        });
      }
      if (_lineMap.mode === 'text') {
        $(`#${this.id} .svg-station-r`).on('click', function (e) {
          _lineMap.clickStation(this);
          _lineMap.event.emit('clickStation', {
            position: [e.offsetX, e.offsetY],
            siteCoord: [
              e.currentTarget.attributes.x.nodeValue,
              e.currentTarget.attributes.y.nodeValue
            ],
            id: e.currentTarget.id,
            name: e.currentTarget.attributes.name.nodeValue,
            eName: e.currentTarget.attributes.eName.nodeValue.replace('/', '')
          }); // 当前注册了才触发
        });
        $(`#${this.id} .svg-station-name`).on('click', function (e) {
          _lineMap.clickStation(this);
          console.log('点击了站点 svg-station-name');
          let prevEle =
            $(this).prev().prop('tagName') === 'rect'
              ? $(this).prev()[0]
              : $(this).prev().prev()[0];
          console.log(prevEle.attributes.x.nodeValue);

          _lineMap.event.emit('clickStation', {
            position: [e.offsetX, e.offsetY],
            siteCoord: [
              prevEle.attributes.x.nodeValue,
              prevEle.attributes.y.nodeValue
            ],
            id: prevEle.id,
            name: prevEle.attributes.name.nodeValue,
            eName: prevEle.attributes.eName.nodeValue.replace('/', '')
          }); // 当前注册了才触发
        });
      }
    }
  }

  /**
   * @description 创建可缩放的svg
   * @param { String } id svgid
   */
  createSvg(id) {
    let hammer = null;
    var options = {
      panEnabled: true,
      controlIconsEnabled: false,
      zoomEnabled: true,
      // dblClickZoomEnabled: false,
      // mouseWheelZoomEnabled: false,
      // preventMouseEventsDefault: true,
      zoomScaleSensitivity: 0.5,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      fit: true,
      contain: false,
      center: true,
      refreshRate: 'auto',
      beforeZoom: function () {},
      onZoom: function () {},
      beforePan: function () {},
      onPan: function () {
        /*console.log(pan.x + ", " + pan.y + ", " + panZoom.getZoom()); */
      },
      onUpdatedCTM: function () {},
      eventsListenerElement: null,
      customEventsHandler: {
        // Halt all touch events
        haltEventListeners: [
          'touchstart',
          'touchend',
          'touchmove',
          'touchleave',
          'touchcancel'
        ],

        // Init custom events handler
        init: function (options) {
          var instance = options.instance,
            initialScale = 1,
            pannedX = 0,
            pannedY = 0;

          // Init Hammer
          // Listen only for pointer and touch events
          hammer = window.Hammer(options.svgElement, {
            inputClass: window.Hammer.SUPPORT_POINTER_EVENTS
              ? window.Hammer.PointerEventInput
              : window.Hammer.TouchInput
          });

          // Enable pinch
          hammer.get('pinch').set({ enable: true });

          // Handle double tap
          hammer.on('doubletap', function () {
            instance.zoomIn();
          });

          // Handle pan
          hammer.on('panstart panmove', function (ev) {
            // On pan start reset panned variables
            if (ev.type === 'panstart') {
              pannedX = 0;
              pannedY = 0;
            }

            // Pan only the difference
            instance.panBy({ x: ev.deltaX - pannedX, y: ev.deltaY - pannedY });
            pannedX = ev.deltaX;
            pannedY = ev.deltaY;
          });

          // Handle pinch
          hammer.on('pinchstart pinchmove', function (ev) {
            // On pinch start remember initial zoom
            if (ev.type === 'pinchstart') {
              initialScale = instance.getZoom();
              instance.zoom(initialScale * ev.scale);
            }

            instance.zoom(initialScale * ev.scale);
          });

          // Prevent moving the page on some devices when panning over SVG
          options.svgElement.addEventListener('touchmove', function (e) {
            e.preventDefault();
          });
        },

        destroy: function () {
          this.hammer.destroy();
        }
      }
    };
    this.panZoom = svgPanZoom('#' + id, options);
    // todo: 保证缩放时计算markers位置
    this.panZoom.setOnPan(() => {
      this._setMarkerStyle();
    });
    this.panZoom.setOnZoom(() => {
      this._setMarkerStyle();
    });
  }

  /**
   * @description 线路图渲染
   */
  draw() {
    console.log('draw----');
    var data = this.data;
    var svgElement;
    var g = document.getElementById('g1');
    svgElement = this._makeSVG('rect', {
      fill: 'none',
      width: data.width,
      height: data.height
    });
    g.appendChild(svgElement);
    //加载线路
    this._loadMapLine();
    //遍历线路
    for (var i = 0; i < data.line.length; i++) {
      var line = data.line[i];
      //在起点画线路名称
      if (line.x1 > 0) {
        svgElement = this._makeSVG('rect', {
          fill: line.color,
          width: line.w,
          height: 90,
          x: line.x1,
          y: line.y1,
          rx: 10,
          ry: 10
        });
        g.appendChild(svgElement);
        svgElement = this._makeSVG('text', {
          id: 'lineName' + line.id,
          class: '',
          'font-size': '60',
          'font-weight': 'bold',
          style: 'font-family: Helvetica, Arial, sans-serif;',
          fill: '#FFFFFF',
          x: line.lineName.length > 1 ? line.x1 + 13 : line.x1 + 27,
          y: line.y1 + 66
        });
        svgElement.textContent = line.lineName;
        g.appendChild(svgElement);
      }
      //在终点画线路名称
      if (line.x2 > 0) {
        svgElement = this._makeSVG('rect', {
          fill: line.color,
          width: line.w,
          height: 90,
          x: line.x2,
          y: line.y2,
          rx: 10,
          ry: 10
        });
        g.appendChild(svgElement);
        svgElement = this._makeSVG('text', {
          id: 'lineName' + line.id,
          class: '',
          'font-size': '60',
          'font-weight': 'bold',
          style: 'font-family: Helvetica, Arial, sans-serif;',
          fill: '#FFFFFF',
          x: line.lineName.length > 1 ? line.x2 + 13 : line.x2 + 27,
          y: line.y2 + 66
        });
        svgElement.textContent = line.lineName;
        g.appendChild(svgElement);
        if (line.name.indexOf('支线') > 0) {
          svgElement = this._makeSVG('text', {
            id: 'lineName' + line.id,
            class: '',
            'font-size': '60',
            'font-weight': 'bold',
            style: 'font-family: Helvetica, Arial, sans-serif;',
            fill: '#666666',
            x: line.x2 + 110,
            y: line.y2 + 66
          });
          svgElement.textContent =
            this.language == 'Chinese' ? '支线' : 'Branch line';
          g.appendChild(svgElement);
        }
      }
      //画站点
      for (var j = 0; j < line.station.length; j++) {
        if (line.station[j].id.indexOf('_') > 0) {
          this.stationArr[
            's' + line.station[j].id.substr(line.station[j].id.indexOf('_') + 1)
          ] = line.station[j]; //在遍历中将所有的站点存到数组中
        }
        this.stationArr['s' + line.station[j].id] = line.station[j]; //在遍历中将所有的站点存到数组中
        //判断只有换乘点和普通站点进行生成
        if (
          line.station[j].type == 'transfer' ||
          line.station[j].type == 'normal'
        ) {
          var temp = line.station[j].id.split('_');
          //生成站点
          if (this.mode === 'path') {
            //线路图模式
            if (line.station[j].type == 'transfer') {
              //生成换乘点
              svgElement = this._makeSVG('ellipse', {
                id: 's' + line.station[j].id,
                name: line.station[j].name,
                eName: line.station[j].eName,
                class: 'svg-station line' + i + ' trans_' + temp[0],
                fill: 'white',
                stroke: line.color,
                'stroke-width': this.stationStrokeWidth,
                cx: line.station[j].x,
                cy: line.station[j].y,
                rx: this.normalStationWidth / 2,
                ry: this.normalStationWidth / 2
              });
              g.appendChild(svgElement);
              // console.log(line.station[j].image);
              // console.log(transformImg[line.station[j].image]);
              svgElement = this._makeSVG('image', {
                id: 'i' + line.station[j].id,
                name: line.station[j].name,
                eName: line.station[j].eName,
                class: 'svg-station svg-station-transfer trans_' + temp[0],
                cx: line.station[j].x,
                cy: line.station[j].y,
                x:
                  line.station[j].rotateX -
                  line.station[j].transferStationWidth / 2,
                y: line.station[j].rotateY - this.transferStationHeight / 2,
                width: line.station[j].transferStationWidth,
                height: this.transferStationHeight,
                transform: line.station[j].rotateDeg
                  ? `rotate(${line.station[j].rotateDeg} ${line.station[j].rotateX} ${line.station[j].rotateY})`
                  : '',
                href: getImgSrc(line.station[j].image)
              });
            } else if (line.station[j].type == 'normal') {
              //生成普通站点
              svgElement = this._makeSVG('ellipse', {
                id: 's' + line.station[j].id,
                name: line.station[j].name,
                eName: line.station[j].eName,
                class: 'svg-station line' + i,
                fill: 'white',
                stroke: line.color,
                'stroke-width': this.stationStrokeWidth,
                cx: line.station[j].x,
                cy: line.station[j].y,
                rx: this.normalStationWidth / 2,
                ry: this.normalStationWidth / 2
              });
            }
          }
          if (this.mode === 'text') {
            //填文字模式 <rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)"/><text x="0" y="15" fill="red">A LINK</text></rect>
            var sid =
              line.station[j].id.indexOf('_') > 0
                ? line.station[j].id.substr(line.station[j].id.indexOf('_') + 1)
                : line.station[j].id;
            svgElement = this._makeSVG('rect', {
              id: 'r' + sid,
              name: line.station[j].name,
              eName: line.station[j].eName,
              class: 'svg-station-r',
              fill: 'white',
              stroke: line.color,
              'stroke-width': '6',
              x: line.station[j].rotateX
                ? line.station[j].rotateX - 45
                : line.station[j].x - 45,
              y: line.station[j].rotateY
                ? line.station[j].rotateY - 37
                : line.station[j].y - 37,
              width: '90',
              height: '74',
              rx: '15',
              ry: '15'
            });
            g.appendChild(svgElement);
            svgElement = this._makeSVG('text', {
              id: 'rt' + sid,
              class: 'svg-station-name',
              'font-size': '60',
              'font-weight': 'bold',
              style: 'font-family: Microsoft YaHei, SimHei;',
              fill: this.textColor,
              x: line.station[j].rotateX
                ? line.station[j].rotateX - 20
                : line.station[j].x - 20,
              y: line.station[j].rotateY
                ? line.station[j].rotateY + 22
                : line.station[j].y + 22
            });
            //svgElement.textContent = "1";
          }
          g.appendChild(svgElement);
          //生成站点名称
          if (this.language == 'Chinese' && line.station[j].name != '') {
            //中文文字
            if (line.station[j].type == 'transfer') {
              //生成换乘点文字
              svgElement = this._makeSVG('text', {
                id: 't' + line.station[j].id,
                class: 'svg-station-name trans_' + temp[0] + '_name',
                'font-size': '45',
                'font-weight': 'bold',
                style: 'font-family: Microsoft YaHei, SimHei;',
                fill: this.textColor,
                x: line.station[j].tx,
                y: line.station[j].ty
              });
            } else {
              //生成普通站点文字
              svgElement = this._makeSVG('text', {
                id: 't' + line.station[j].id,
                class: 'svg-station-name',
                'font-size': '45',
                'font-weight': 'bold',
                style: 'font-family: Microsoft YaHei, SimHei;',
                fill: this.textColor,
                x: line.station[j].tx,
                y: line.station[j].ty
              });
            }
            var name = line.station[j].name.split('/');
            svgElement.textContent = name[0];

            //在下面增加中文名称第2行显示
            if (name.length > 1) {
              // 计算第二行的偏移量
              let transitionNum = ((name[0].length - name[1].length) / 2) * 48;
              var tSpanElement = this._makeSVG('tspan', {
                x: line.station[j].tx + line.station[j].dx + transitionNum,
                y: line.station[j].ty + 60
              });
              tSpanElement.textContent = name[1];
              svgElement.appendChild(tSpanElement);
            }
            g.appendChild(svgElement);
            /*
                     //在中文下面增加英文名称显示
                     var tSpanElement = this._makeSVG('tspan', { "font-size": "30", "font-weight": "normal", style: "font-family: Microsoft YaHei, SimHei;", x: line.station[j].tx + line.station[j].dx, y: line.station[j].ty + 35 });
                     tSpanElement.textContent = line.station[j].eName;
                     svgElement.appendChild(tSpanElement);
                     */
          } else if (
            this.language == 'English' &&
            line.station[j].eName != ''
          ) {
            //英文文字
            if (line.station[j].type == 'transfer') {
              //生成换乘点文字
              svgElement = this._makeSVG('text', {
                id: 't' + line.station[j].id,
                class: 'svg-station-name trans_' + temp[0] + '_name',
                'font-size': '32',
                'font-weight': 'bold',
                style: 'font-family: Microsoft YaHei, SimHei;',
                fill: this.textColor,
                x: line.station[j].etx,
                y: line.station[j].ety
              });
            } else {
              //生成普通站点文字
              svgElement = this._makeSVG('text', {
                id: 't' + line.station[j].id,
                class: 'svg-station-name',
                'font-size': '32',
                'font-weight': 'bold',
                style: line.station[j].enTextVertical
                  ? 'font-family: Microsoft YaHei, SimHei; writing-mode: vertical-rl;'
                  : 'font-family: Microsoft YaHei, SimHei;',
                fill: this.textColor,
                x: line.station[j].etx,
                y: line.station[j].ety
              });
            }

            var eName = line.station[j].eName.split('/');
            svgElement.textContent = eName[0];

            //在下面增加英文名称第2行显示
            if (eName.length === 2) {
              tSpanElement = this._makeSVG('tspan', {
                x: line.station[j].etx + line.station[j].dx,
                y: line.station[j].ety + 45
              });
              tSpanElement.textContent = eName[1];
              svgElement.appendChild(tSpanElement);
            }
            if (eName.length > 2) {

              for (let i = 1; i < eName.length; i++) {
                tSpanElement = this._makeSVG('tspan', {
                  x: line.station[j].etx + line.station[j].dx,
                  y: line.station[j].ety + 45 * i
                });
                tSpanElement.textContent = eName[i];
                svgElement.appendChild(tSpanElement);
              }
            }

            g.appendChild(svgElement);
          }
        }
      }
    }
  }

  _loadMapLine() {
    var svgElement;
    var data = this.data;
    var g = document.getElementById('g1');
    for (var i = 0; i < data.line.length; i++) {
      var line = data.line[i];
      var lineId;
      for (var j = 1; j < line.station.length; j++) {
        //{ id: "t0001", name: "过渡点", x: 1291, y: 2629, rx: 45, ry: 45, "sweep-flag": 0, type: "temp" },
        //<path d="M0 0 L0 1000 A 1000 1000 0 0 0 293 1707" stroke="black" fill="none" stroke-width="12"/>
        if (line.station[j].type == 'temp') {
          //前置点b:x1,y1,过渡点a:x2,y2,后置点c:x3,y3
          var x1 = line.station[j - 1].x,
            y1 = line.station[j - 1].y,
            x2 = line.station[j].x,
            y2 = line.station[j].y,
            x3 = line.station[j + 1].x,
            y3 = line.station[j + 1].y,
            r = line.station[j].r;

          var ab = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)); //从过渡点到前置点的距离
          var ac = Math.sqrt((x3 - x2) * (x3 - x2) + (y3 - y2) * (y3 - y2)); //从过渡点到后置点的距离
          var bc = Math.sqrt((x3 - x1) * (x3 - x1) + (y3 - y1) * (y3 - y1)); //从前置点到后置点的距离
          var alpha =
            Math.acos((ab * ab + ac * ac - bc * bc) / (2 * ab * ac)) / 2; //假设弧线的圆心为d，计算出∠bac，再除2，连接ad，将∠bac平分为2，
          var l = r / Math.tan(alpha); //
          var cx1 = Math.round((x2 + ((x1 - x2) * l) / ab) * 10) / 10; //
          var cy1 = Math.round((y2 + ((y1 - y2) * l) / ab) * 10) / 10; //
          var cx2 = Math.round((x2 + ((x3 - x2) * l) / ac) * 10) / 10; //
          var cy2 = Math.round((y2 + ((y3 - y2) * l) / ac) * 10) / 10; //

          var scx1 = Math.round((x2 + ((x1 - x2) * (l - 2)) / ab) * 10) / 10; //
          var scy1 = Math.round((y2 + ((y1 - y2) * (l - 2)) / ab) * 10) / 10; //
          var scx2 = Math.round((x2 + ((x3 - x2) * (l - 2)) / ac) * 10) / 10; //
          var scy2 = Math.round((y2 + ((y3 - y2) * (l - 2)) / ac) * 10) / 10; //

          data.line[i].station[j].scx1 = scx1; //
          data.line[i].station[j].scy1 = scy1; //
          data.line[i].station[j].scx2 = scx2; //
          data.line[i].station[j].scy2 = scy2; //
          //前置线段
          lineId = LineData.generatePathId(
            line.station[j - 1].id,
            line.station[j].id
          );
          svgElement = this._makeSVG('line', {
            id: lineId,
            class: 'line' + i,
            x1:
              line.station?.[j - 1]?.type == 'temp'
                ? line.station[j - 1].scx2
                : x1,
            y1:
              line.station?.[j - 1]?.type == 'temp'
                ? line.station[j - 1].scy2
                : y1,
            x2: scx1,
            y2: scy1,
            sx2: scx1,
            sy2: scy1,
            style: 'stroke:' + line.color + ';stroke-width:' + this.lineWidth
          });
          g.appendChild(svgElement);
          //中间弧线
          svgElement = this._makeSVG('path', {
            id: 'templine' + line.station[j].id,
            class: 'line' + i,
            d:
              'M' +
              cx1 +
              ' ' +
              cy1 +
              ' A ' +
              r +
              ' ' +
              r +
              ' 0 0 ' +
              line.station[j].sweep +
              ' ' +
              cx2 +
              ' ' +
              cy2,
            stroke: line.color,
            fill: 'none',
            'stroke-width': this.lineWidth
          });
          g.appendChild(svgElement);
          //后置线段
          lineId = LineData.generatePathId(
            line.station[j].id,
            line.station[j + 1].id
          );
          if (line.station?.[j + 1]?.type !== 'temp') {
            svgElement = this._makeSVG('line', {
              id: lineId,
              class: 'line' + i,
              x1: scx2,
              y1: scy2,
              x2: x3,
              y2: y3,
              sx1: scx2,
              sy1: scy2,
              style: 'stroke:' + line.color + ';stroke-width:' + this.lineWidth
            });
            g.appendChild(svgElement);
          }
        } else if (line.station[j - 1].type !== 'temp') {
          lineId = LineData.generatePathId(
            line.station[j - 1].id,
            line.station[j].id
          );
          svgElement = this._makeSVG('line', {
            id: lineId,
            class: 'line' + i,
            x1: line.station[j - 1].x,
            y1: line.station[j - 1].y,
            x2: line.station[j].x,
            y2: line.station[j].y,
            style: 'stroke:' + line.color + ';stroke-width:' + this.lineWidth
          });
          g.appendChild(svgElement);
        }
      }
    }
  }

  _makeSVG(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }

  /**
   * @description 点击站点触发放大效果
   * @param { Boolean } name description...
   * @return { Boolean } description...
   */
  clickStation(e) {
    // 默认状态站点效果
    let _svgMap = this;
    if (e.nodeName == 'ellipse') {
      // let sb = e.parentNode.children;
      // for (let o = 0; o < sb.length; o++) {
      //   sb[o].setAttribute('rx', _svgMap.normalStationWidth / 2);
      //   sb[o].setAttribute('ry', _svgMap.normalStationWidth / 2);
      //   sb[o].setAttribute('stroke-width', '12');
      // }
      // e.setAttribute('rx', (_svgMap.normalStationWidth * 2) / 3);
      // e.setAttribute('ry', (_svgMap.normalStationWidth * 2) / 3);
      // e.setAttribute('stroke-width', '20');
    } else if (e.nodeName == 'image') {
      // e.setAttribute('width', (_svgMap.transferStationWidth * 4) / 3);
      // e.setAttribute('height', (_svgMap.transferStationWidth * 4) / 3);
      // e.setAttribute(
      //   'x',
      //   _svgMap.stationArr[e.id.replace('i', 's')].x -
      //     (_svgMap.transferStationWidth * 2) / 3
      // );
      // e.setAttribute(
      //   'y',
      //   _svgMap.stationArr[e.id.replace('i', 's')].y -
      //     (_svgMap.transferStationWidth * 2) / 3
      // );
    }
  }

  _setMarkerStyle() {
    let _svgMap = this;
    let markers = $('#lineMapMarkers .lmap-marker');
    markers.each((index, marker) => {
      var logoWidth = $(marker).width();
      var logoHeight = $(marker).height();
      var x, y; // 相对屏幕左上的坐标
      x =
        (Number($(marker).attr('x')) / _svgMap.default_scale) *
          _svgMap.panZoom.getZoom() +
        _svgMap.panZoom.getPan().x -
        logoWidth / 2;
      y =
        ($(marker).attr('y') / _svgMap.default_scale) *
          _svgMap.panZoom.getZoom() +
        _svgMap.panZoom.getPan().y -
        logoHeight;
      if (_svgMap.mode === 'text') {
        x += (90 / 2 / _svgMap.default_scale) * _svgMap.panZoom.getZoom();
        y += (72 / 2 / _svgMap.default_scale) * _svgMap.panZoom.getZoom();
      }
      $(marker).css('left', x);
      $(marker).css('top', y);
    });
  }

  // 获取站点position
  getStationPoi({ id, name }) {
    if (!id) {
      id = this.lineData.getStationByName(name).id;
    }
    let x =
      (this.stationArr['s' + id].x / this.default_scale) *
        this.panZoom.getZoom() +
      this.panZoom.getPan().x;
    let y =
      (this.stationArr['s' + id].y / this.default_scale) *
        this.panZoom.getZoom() +
      this.panZoom.getPan().y;
    return [x, y];
  }
  /**
   * @description 将地图缩放至指定级别
   * @param { Number } zoom_level
   */
  zoomBy(zoom_level) {
    let center_x, center_y;
    if (typeof arguments[1] != 'undefined') {
      center_x = arguments[1];
      center_y = arguments[2];
    } else {
      center_x = this.width / 2;
      center_y = this.height / 2;
    }
    this.playPanZoomAnimation(
      center_x,
      center_y,
      this.zoomLevel[zoom_level],
      true,
      false
    );
  }

  /**
   * @description 缩放平移svg
   * @param { Number } center_x 相对于窗口平移中心点x轴坐标
   * @param { Number } center_y 相对于窗口平移中心点y轴坐标
   * @param { Number } scale 相对于窗口缩放值
   */
  playPanZoomAnimation(center_x, center_y, scale) {
    var scale_before = this.panZoom.getZoom();
    var scale_after = scale;
    var move_x = this.width / 2 - center_x;
    var move_y = this.height / 2 - center_y;
    var move_x_sum = 0;
    var move_y_sum = 0;
    var percentage = 0;
    var panZoom = this.panZoom;
    var animationSteps = this.animationSteps;
    var animationSpeed = this.animationSpeed;

    //禁止动画
    if (arguments[3] == false) {
      animationSteps = 5;
      animationSpeed = 1;
    }
    //不需要按坐标center_x, center_y居中移动地图
    let move;
    if (arguments[4] == false) {
      move = false;
    } else {
      move = true;
    }

    var animationStep = 0; //当前帧
    // var scale; //动画过程中的当前缩放比例
    clearInterval(this.panZoomAnimationIntervalID);
    this.panZoomAnimationIntervalID = setInterval(function () {
      if (++animationStep <= animationSteps) {
        percentage =
          1 -
          ((animationSteps - animationStep) *
            (animationSteps - animationStep) *
            (animationSteps - animationStep)) /
            (animationSteps * animationSteps * animationSteps);
        scale = scale_before + (scale_after - scale_before) * percentage;
        panZoom.zoomAtPoint(scale, { x: center_x, y: center_y }); //以某个点为中心进行缩放，这个点的坐标是相对于窗体，而非SVG图片
        if (move) {
          panZoom.panBy({
            x: move_x * percentage - move_x_sum,
            y: move_y * percentage - move_y_sum
          }); //横向位移X像素，纵向位移Y像素
          center_x += move_x * percentage - move_x_sum;
          center_y += move_y * percentage - move_y_sum;
          move_x_sum = move_x * percentage;
          move_y_sum = move_y * percentage;
        }
      } else {
        // Cancel interval
        clearInterval(this.panZoomAnimationIntervalID);
      }
    }, animationSpeed);
  }

  /**
   * @description 根据线路起点终点屏幕适配
   * @param { Number } x1 线路起点x轴坐标
   * @param { Number } y1 线路起点y轴坐标
   * @param { Number } x2 线路终点x轴坐标
   * @param { Number } y2 线路终点y轴坐标
   * @param { Boolean } displayTextBox 是否在展示外部弹框，影响缩放位置，默认false
   */
  fitScreen(x1, y1, x2, y2, displayTextBox = false) {
    var scale_after;
    if (displayTextBox == true) {
      scale_after =
        this.path_display_percentage /
        ((x2 - x1) / this.default_scale / (this.width - 150));
    } else {
      scale_after =
        this.path_display_percentage /
        ((x2 - x1) / this.default_scale / this.width);
    }
    if (
      scale_after >
      this.path_display_percentage /
        ((y2 - y1) / this.default_scale / this.height)
    ) {
      scale_after =
        this.path_display_percentage /
        ((y2 - y1) / this.default_scale / this.height);
    }
    if (scale_after > this.zoomLevel[5]) {
      scale_after = this.zoomLevel[5];
    }
    var pan = this.panZoom.getPan();
    var center_x =
      ((x2 + x1) / 2 / this.default_scale) * this.panZoom.getZoom() + pan.x;
    var center_y =
      ((y2 + y1) / 2 / this.default_scale) * this.panZoom.getZoom() + pan.y;
    if (displayTextBox == true) {
      center_x -= (100 * this.panZoom.getZoom()) / scale_after;
    }
    this.playPanZoomAnimation(center_x, center_y, scale_after);
  }
  // changeLan (lang) {
  //   if (lang === 'en') {
  //   }
  //   if (lang === 'cn') {
  //   }
  // }
}
// 新增点，计算位置 addMarker方法
// fitscreen 去根据defaultscale 缩放回初始的比例
// 增加清除路线的回调
