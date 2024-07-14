/*
 *@description: 地铁线路图数据
 */
import { szmtr } from './szmtr.js';

export default class LineData {
  constructor() {
    this.data = szmtr;
    Object.freeze(this.data);
  }

  // 生成line，path的 id
  static generatePathId(sid1, sid2) {
    return sid1 < sid2
      ? 'line' + sid1 + 'to' + sid2
      : 'line' + sid2 + 'to' + sid1;
  }

  // 获取换乘站点数据
  getTranferStations(pathData) {
    let result = this._getDrawPathData(pathData);
    result.forEach(item => {
      item.station = item.station.filter(station => {
        return station.isStation;
      });
    });
    return result;
  }

  // 获取绘制线路id数据
  getDrawData(pathData) {
    console.log(pathData);
    let result = this._getDrawPathData(pathData);
    console.log(result);
    result.forEach(line => {
      line.station = line.station.map(station => {
        return station.id;
      });
    });
    return {
      line: result
    };
  }

  /**
   * @description 获取渲染起始点线路数据
   * @param { Array } result 线路图起点终点换乘点数据 @example [{sLine, sPath, sId},...]
   * @return { Object } path @example {line: [{id, name, isStation}],...}
   */
  _getDrawPathData(result) {
    let line = [];
    //循环遍历换乘结果
    for (var i = 0; i < result.paths.length - 1; i++) {
      //获取每条路线的ID和名称
      for (var m = 0; m < this.data.line.length; m++) {
        if (this.data.line[m].id == result.paths[i].lineId) {
          line[i] = {
            index: m,
            name: result.paths[i].sLine,
            direction: result.paths[i].sPath
          };
          break;
        }
      }
      //找到对应线路中的起始点下标和结束点下标
      let iStartIndex = this._getStationIndex(m, result.paths[i].sName);
      let iEndIndex = this._getStationIndex(m, result.paths[i + 1].sName);
      console.log(m, iStartIndex, result.paths[i].sId);
      console.log(m, iEndIndex, result.paths[i + 1].sId);
      //创建当前线路的途经点
      line[i].station = [];
      if (iEndIndex > iStartIndex) {
        for (let k = iStartIndex; k <= iEndIndex; k++) {
          if (this.data.line[m].station[k]) {
            let { id, name, type } = this.data.line[m].station[k];
            line[i].station.push({
              id,
              name,
              isStation: type === 'normal' || type === 'transfer'
            });
          }
        }
      } else {
        for (let k = iStartIndex; k >= iEndIndex; k--) {
          if (this.data.line[m].station[k]) {
            let { id, name, type } = this.data.line[m].station[k];
            line[i].station.push({
              id,
              name,
              isStation: type === 'normal' || type === 'transfer'
            });
          }
        }
      }
    }
    return line;
  }

  // 获取站点在当前线路Index
  _getStationIndex(lineIndex, sName) {
    for (var m = 0; m < this.data.line[lineIndex].station.length; m++) {
      if (sName == this.data.line[lineIndex].station[m].name.replace('/', '')) {
        return m;
      }
    }
  }

  // 获取线路数据
  getLineById(lineId) {
    return this.data.line.find(line => line.id === lineId) || {};
  }

  // 获取线路数据
  getLineByRemark(lineRemark) {
    return this.data.line.find(line => line.lineRemark === lineRemark) || {};
  }

  // 获取站点数据
  getStationByName(name) {
    let data = this.data;
    for (var i = 0; i < data.line.length; i++) {
      for (var j = 0; j < data.line[i].station.length; j++) {
        if (
          name == data.line[i].station[j].name.replace('/', '') ||
          (data.line[i].station[j].eName &&
            name?.toLowerCase?.() ==
              data.line[i].station[j].eName?.toLowerCase?.())
        ) {
          return {
            id: data.line[i].station[j].id,
            name: data.line[i].station[j].name,
            eName: data.line[i].station[j].eName
          };
        }
      }
    }
  }

  // 根据line获取站点数据
  getLineStationByName(i, name) {
    let data = this.data;
    for (var j = 0; j < data.line[i].station.length; j++) {
      if (
        name == data.line[i].station[j].name.replace('/', '') ||
        (data.line[i].station[j].eName &&
          name?.toLowerCase?.() ==
            data.line[i].station[j].eName?.toLowerCase?.())
      ) {
        return {
          id: data.line[i].station[j].id,
          name: data.line[i].station[j].name,
          eName: data.line[i].station[j].eName
        };
      }
    }
  }

  getFormatStationId(id) {
    let result = id.replace('s', '').replace('r', '');
    if (result.indexOf('_') > -1) {
      result = result.split('_')[1];
    }
    return result;
  }

  // 获取站点数据
  getSiteById(sId, lineId, directionId) {
    let data = this.data;
    let sName = '';
    let sLine = '';
    let sPath = '';
    let sStart = '';
    let sEnd = '';
    for (var i = 0; i < data.line.length; i++) {
      if (Number(lineId) === data.line[i].id) {
        sLine = data.line[i].name;
      }
      for (var j = 0; j < data.line[i].station.length; j++) {
        if (
          sId === data.line[i].station[j].id ||
          sId === data.line[i].station[j].id.split('_')[1]
        ) {
          sName = data.line[i].station[j].name;
        }
      }
    }
    if (data.metroTimeArray[sId]) {
      let siteData = data.metroTimeArray[sId].find(item => {
        return item.lineID === lineId;
      });
      let directionSite;
      if (data.metroTimeArray[directionId]) {
        directionSite = data.metroTimeArray[directionId].find(i => {
          return i.lineID === lineId;
        });
      }
      if (siteData && siteData.Time && directionSite) {
        sStart = siteData.Time.up_begintime;
        sEnd = siteData.Time.up_endtime.split('#')[0];
        sPath = siteData.Time.upDirection;
        if (sPath !== directionSite.stationName) {
          sStart = siteData.Time.down_begintime;
          sEnd = siteData.Time.down_endtime.split('#')[0];
          sPath = siteData.Time.downDirection;
        }
      }
    }
    return {
      sName, // 站点名称
      sLine, // 几号线
      sPath, // 方向
      sStart, // 首班车时间
      sEnd // 末班车时间
    };
  }
}
