import LMapBase from './lineMap.base';
import LineData from './lineData';
import LMapMarker from './lineMarker';
import $ from 'jquery';
const getMapNavTemplate = lang => {
  if (lang === 'Chinese') {
    return `<div class="linemap-nav"> <div class="line-name bg-color-line1" data-line-index="5"> 1号线 </div> <div class="line-name bg-color-line2" data-line-index="6"> 2号线 </div> <div class="line-name bg-color-line3" data-line-index="7"> 3号线 </div> <div class="line-name bg-color-line4" data-line-index="8"> 4号线 </div> <div class="line-name bg-color-line4" data-line-index="9"> 4号线支线 </div> <div class="line-name bg-color-line5" data-line-index="4"> 5号线 </div> <div class="line-name bg-color-line-disable">未开通</div> </div>`;
  }
  if (lang === 'English') {
    return `<div class="linemap-nav"> <div class="line-name bg-color-line1" data-line-index="5"> Line1 </div> <div class="line-name bg-color-line2" data-line-index="6"> Line2 </div> <div class="line-name bg-color-line3" data-line-index="7"> Line3 </div> <div class="line-name bg-color-line4" data-line-index="8"> Line4 </div> <div class="line-name bg-color-line4" data-line-index="9"> Line4 branch</div> <div class="line-name bg-color-line5" data-line-index="4"> Line5 </div> <div class="line-name bg-color-line-disable">Nonactivated</div> </div>`;
  }
};
// const MapNavTemplate = `<div class="linemap-nav"> <div class="line-name bg-color-line1" data-line-index="5"> 1号线 </div> <div class="line-name bg-color-line2" data-line-index="6"> 2号线 </div> <div class="line-name bg-color-line3" data-line-index="7"> 3号线 </div> <div class="line-name bg-color-line4" data-line-index="8"> 4号线 </div> <div class="line-name bg-color-line4" data-line-index="9"> 4号线支线 </div> <div class="line-name bg-color-line5" data-line-index="4"> 5号线 </div> <div class="line-name bg-color-line-disable">未开通</div> </div>`

export default class LMapPath extends LMapBase {
  constructor(id, options) {
    options = Object.assign(options, {
      mode: 'path'
    });
    super(id, options);
    if (this.isShowNav) {
      let navHtml = getMapNavTemplate(this.language);
      $(`#${this.id} .mapWrapper`)[0].append($(navHtml)[0]);
    }
    // 添加点击事件
    let map = this;
    $(`#${this.id} .line-name`).on('click', function (e) {
      let lineIndex = e.currentTarget.dataset.lineIndex;
      if (lineIndex) {
        map.showLine(lineIndex);
        map.event.emit('clickLineName');
      }
    });
  }

  // 线路置灰
  mask(isShow) {
    for (var i = 0; i < this.data.line.length; i++) {
      if (isShow == true) {
        $('.line' + i).css('stroke', this.data.line[i].maskColor);
      } else {
        $('.line' + i).css('stroke', this.data.line[i].color);
      }
    }
    if (isShow == true) {
      $('.svg-station-name').css('fill', '#d1d1d1');
      $('.svg-station-transfer').css('display', 'none');
    } else {
      $('.svg-station-name').css('fill', this.textColor);
      $('.svg-station-transfer').css('display', '');
    }
  }

  /**
   * @description 播放线路图绘制动画
   * @param { Array } pathData
   */
  playPathAnimation(pathData) {
    // var sInterval = 8 //显示站点的间隔帧数
    var sFrames = 10; //显示站点的帧数
    var moveDistance = 30; //每帧画出的路径长度
    var rx1 = this.normalStationWidth / 2,
      ry1 = this.normalStationWidth / 2,
      stroke1 = 12,
      rx2 = this.normalStationWidth * 0.8,
      ry2 = this.normalStationWidth * 0.8,
      stroke2 = 20;
    if (++pathData.step <= pathData.startStep) {
      return;
    }
    //画线
    var s1, s2, t, tx, ty, lineId;
    if (pathData.endFlag2 == false) {
      pathData.tempDistance += moveDistance;
      //获取当前正在划线的两个站点
      s1 = pathData.stationArr[pathData.lineStationI];
      s2 = pathData.stationArr[pathData.lineStationI + 1];

      let s1x, s1y, s2x, s2y;
      if (s1.type == 'temp') {
        if (
          (s2.x >= s1.scx2 && s1.scx2 >= s1.scx1) ||
          (s2.y >= s1.scy2 && s1.scy2 >= s1.scy1)
        ) {
          s1x = s1.scx2;
          s1y = s1.scy2;
          s2x = s2.x;
          s2y = s2.y;
        } else {
          s1x = s1.scx1;
          s1y = s1.scy1;
          s2x = s2.x;
          s2y = s2.y;
        }
      } else if (s2.type == 'temp') {
        if (
          (s1.x <= s2.scx1 && s2.scx1 <= s2.scx2) ||
          (s1.y <= s2.scy1 && s2.scy1 <= s2.scy2)
        ) {
          s1x = s1.x;
          s1y = s1.y;
          s2x = s2.scx1;
          s2y = s2.scy1;
        } else {
          s1x = s1.x;
          s1y = s1.y;
          s2x = s2.scx2;
          s2y = s2.scy2;
        }
      } else {
        s1x = s1.x;
        s1y = s1.y;
        s2x = s2.x;
        s2y = s2.y;
      }
      //计算两个站点间的距离t
      t = Math.sqrt((s2x - s1x) * (s2x - s1x) + (s2y - s1y) * (s2y - s1y));
      //如果距离为0，说明这两个站点是重合的（一般指两条线路共同的换乘点）时，计算下一条路径
      if (t == 0) {
        pathData.lineStationI++;
        //获取当前正在划线的两个站点
        s1 = pathData.stationArr[pathData.lineStationI];
        s2 = pathData.stationArr[pathData.lineStationI + 1];
        let s1x, s1y, s2x, s2y;
        if (s1.type == 'temp') {
          if (
            (s2.x >= s1.scx2 && s1.scx2 >= s1.scx1) ||
            (s2.y >= s1.scy2 && s1.scy2 >= s1.scy1)
          ) {
            s1x = s1.scx2;
            s1y = s1.scy2;
            s2x = s2.x;
            s2y = s2.y;
          } else {
            s1x = s1.scx1;
            s1y = s1.scy1;
            s2x = s2.x;
            s2y = s2.y;
          }
        } else if (s2.type == 'temp') {
          if (
            (s1.x <= s2.scx1 && s2.scx1 <= s2.scx2) ||
            (s1.y <= s2.scy1 && s2.scy1 <= s2.scy2)
          ) {
            s1x = s1.x;
            s1y = s1.y;
            s2x = s2.scx1;
            s2y = s2.scy1;
          } else {
            s1x = s1.x;
            s1y = s1.y;
            s2x = s2.scx2;
            s2y = s2.scy2;
          }
        } else {
          s1x = s1.x;
          s1y = s1.y;
          s2x = s2.x;
          s2y = s2.y;
        }
        //计算两个站点间的距离t
        t = Math.sqrt((s2x - s1x) * (s2x - s1x) + (s2y - s1y) * (s2y - s1y));
      }
      //获取线段ID
      lineId = LineData.generatePathId(s1.id, s2.id);
      var lineElement = document.getElementById(lineId);
      //如果当前划线行进的距离大于线段长度，则直接将线段划完，否则计算要划到哪里
      if (pathData.tempDistance >= t) {
        pathData.tempDistance -= t;
        tx = s2x;
        ty = s2y;
        if (s2.type == 'temp') {
          $('#templine' + s2.id).css('stroke', s1.color);
          pathData.tempDistance = 0;
        }
        pathData.lineStationI++;
        if (pathData.lineStationI == pathData.stationArr.length - 1) {
          pathData.endFlag2 = true;
        }
      } else {
        tx = s1x + ((s2x - s1x) * pathData.tempDistance) / t;
        ty = s1y + ((s2y - s1y) * pathData.tempDistance) / t;
      }
      //正向线路改变的终点坐标，反向线段改变起点坐标
      if (
        lineElement &&
        lineElement.getAttribute('x1') == s1x &&
        lineElement.getAttribute('y1') == s1y
      ) {
        lineElement.setAttribute('x2', tx);
        lineElement.setAttribute('y2', ty);
      } else {
        lineElement.setAttribute('x1', tx);
        lineElement.setAttribute('y1', ty);
      }
      $('#' + lineId).css('stroke', s1.color);
    }
    //画点
    if (pathData.endFlag1 == false) {
      for (
        var i = 0;
        i <= pathData.lineStationI + 2 && i < pathData.stationArr.length;
        i++
      ) {
        if (this.stationArr['s' + pathData.stationArr[i].id].type == 'temp') {
          i++;
        }
        let stationElement;
        let stationText = document.getElementById(
          't' + pathData.stationArr[i].id
        );
        if (stationText) {
          stationText.style.fill = '';
        }
        if (pathData.stationArr[i].transferFlag == false) {
          stationElement = document.getElementById(
            's' + pathData.stationArr[i].id
          );
        } else {
          stationElement = document.getElementById(
            'i' + pathData.stationArr[i].id
          );
        }
        // var stationNameElement = document.getElementById(
        //   't' + pathData.stationArr[i].id
        // )
        if (pathData.stationArr[i].frame < sFrames) {
          pathData.stationArr[i].frame++;
          if (pathData.stationArr[i].frame == 1) {
            if (pathData.stationArr[i].transferFlag == false) {
              $('#s' + pathData.stationArr[i].id).css(
                'stroke',
                pathData.stationArr[i].color
              );
            } else {
              let temp = pathData.stationArr[i].id.split('_');
              $('.trans_' + temp[0]).css('display', '');
            }
          }
          if (stationElement && stationElement.nodeName == 'ellipse') {
            stationElement.setAttribute(
              'rx',
              rx2 - ((rx2 - rx1) * pathData.stationArr[i].frame) / sFrames
            );
            stationElement.setAttribute(
              'ry',
              ry2 - ((ry2 - ry1) * pathData.stationArr[i].frame) / sFrames
            );
            stationElement.setAttribute(
              'stroke-width',
              stroke2 -
                ((stroke2 - stroke1) * pathData.stationArr[i].frame) / sFrames
            );
          } else if (stationElement && stationElement.nodeName == 'image') {
            var iw1 = pathData.stationArr[i].transferStationWidth,
              iw2 = (this.transferStationHeight * 4) / 3;
            var temp = pathData.stationArr[i].id.split('_');
            $('.trans_' + temp[0]).attr(
              'width',
              iw2 - ((iw2 - iw1) * pathData.stationArr[i].frame) / sFrames
            );
            $('.trans_' + temp[0]).attr(
              'height',
              iw2 - ((iw2 - iw1) * pathData.stationArr[i].frame) / sFrames
            );
            $('.trans_' + temp[0]).attr(
              'x',
              this.stationArr['s' + pathData.stationArr[i].id].rotateX -
                (iw2 - ((iw2 - iw1) * pathData.stationArr[i].frame) / sFrames) /
                  2
            );
            $('.trans_' + temp[0]).attr(
              'y',
              this.stationArr['s' + pathData.stationArr[i].id].rotateY -
                (iw2 - ((iw2 - iw1) * pathData.stationArr[i].frame) / sFrames) /
                  2
            );
          }
          if (pathData.stationArr[i].frame == sFrames) {
            $('#t' + pathData.stationArr[i].id).css('fill', this.textColor);
          }
        }
      }
      if (
        pathData.stationArr[pathData.stationArr.length - 1].frame == sFrames
      ) {
        pathData.endFlag1 = true;
      }
    }
  }

  /**
   * @description 展示单条线路
   * @param { Number } lineIndex
   */
  showLine(lineIndex) {
    this.mask(false);
    // 清除页面所有标记点
    LMapMarker.clear(this.id);
    // 获取展示的线路数据
    var path = {};
    path.line = new Array({
      index: lineIndex,
      name: this.data.line[lineIndex].name
    });
    path.line[0].station = [];
    for (var i = 0; i < this.data.line[lineIndex].station.length; i++) {
      path.line[0].station.push(this.data.line[lineIndex].station[i].id);
    }
    this.showPath(path, false);
  }

  // 根据起点终点换乘点绘制线路图
  showPath(path, displayTextBox) {
    console.log(path);
    var transferFlag;
    this.mask(true);
    var x1 = 100000,
      x2 = 0,
      y1 = 100000,
      y2 = 0;
    var animationSpeed = this.animationSpeed;
    //
    var pathData = {
      step: 0,
      startStep: 30,
      tempDistance: 0,
      lineStationI: 0,
      endFlag1: false,
      endFlag2: false
    };
    pathData.stationArr = [];
    for (var i = 0; i < path.line.length; i++) {
      var line = path.line[i];
      var color = this.data.line[line.index].color;
      for (var j = 0; j < line.station.length; j++) {
        var stationId = line.station[j];
        if (stationId.indexOf('_') >= 0) {
          var temp = stationId.split('_');
          $('.trans_' + temp[0]).css('display', 'none');
          $('.trans_' + temp[0] + '_name').css('display', 'none');
          $('#s' + stationId).css('display', '');
          $('#t' + stationId).css('display', '');
        }
        if (i > 0 && j == 0) {
          transferFlag = true;
        } else {
          transferFlag = false;
        }
        if (this.stationArr['s' + stationId].type == 'temp') {
          pathData.stationArr.push({
            id: stationId,
            color: color,
            type: this.stationArr['s' + stationId].type,
            transferFlag: transferFlag,
            x: parseFloat(this.stationArr['s' + stationId].x),
            y: parseFloat(this.stationArr['s' + stationId].y),
            scx1: this.stationArr['s' + stationId].scx1,
            scy1: this.stationArr['s' + stationId].scy1,
            scx2: this.stationArr['s' + stationId].scx2,
            scy2: this.stationArr['s' + stationId].scy2,
            frame: 0
          });
        } else {
          console.log(this.stationArr['s' + stationId]);
          pathData.stationArr.push({
            id: stationId,
            color: color,
            transferFlag: transferFlag,
            x: parseFloat(this.stationArr['s' + stationId].x),
            y: parseFloat(this.stationArr['s' + stationId].y),
            image: this.stationArr['s' + stationId].image,
            rotateDeg: this.stationArr['s' + stationId].rotateDeg,
            rotateX: this.stationArr['s' + stationId].rotateX,
            rotateY: this.stationArr['s' + stationId].rotateY,
            transferStationWidth:
              this.stationArr['s' + stationId].transferStationWidth,
            frame: 0
          });
        }
        x1 =
          x1 < this.stationArr['s' + stationId].x
            ? x1
            : this.stationArr['s' + stationId].x;
        y1 =
          y1 < this.stationArr['s' + stationId].y
            ? y1
            : this.stationArr['s' + stationId].y;
        x2 =
          x2 > this.stationArr['s' + stationId].x
            ? x2
            : this.stationArr['s' + stationId].x;
        y2 =
          y2 > this.stationArr['s' + stationId].y
            ? y2
            : this.stationArr['s' + stationId].y;
      }
    }
    console.log(x1, y1, x2, y2);
    clearInterval(this.pathAnimationIntervalID);
    let vm = this;
    this.pathAnimationIntervalID = setInterval(function () {
      if (pathData.endFlag1 && pathData.endFlag2) {
        clearInterval(vm.pathAnimationIntervalID);
      } else {
        vm.playPathAnimation(pathData);
      }
    }, animationSpeed);
    // if (path.displayTextBox == true) {
    //   this.fitScreen(x1, y1, x2, y2, true)
    // } else {
    //   this.fitScreen(x1, y1, x2, y2, false)
    // }
    this.fitScreen(x1, y1, x2, y2, displayTextBox);
  }
}
