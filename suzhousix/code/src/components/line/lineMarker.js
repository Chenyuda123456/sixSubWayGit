import $ from 'jquery';
/**
 * @description 线路图标记
 * @param { String } mapId 添加的线路图容器id
 * @param { Array } position [offsetx, offsetY]
 * @param { String } content 自定义标记内容
 * @param { Array } siteCoord [x, y] 站点绝对坐标值
 *
 */

export default class LMapMarker {
  constructor({ mapId, position, content, siteCoord, markerId }) {
    this.mapId = mapId;
    this.markerId = markerId;
    this.position = position;
    this.content = content;
    this.siteCoord = siteCoord;
    this._add({ content, markerId, position, siteCoord });
  }

  _add({ content, markerId, position, siteCoord }) {
    let ele = `<div class="lmap-marker" id=${markerId}>${content}</div>`;
    $(`#${this.mapId} #lineMapMarkers`).append(ele);
    let marker = $(`#lineMapMarkers #${markerId}`);
    let left = position[0] - marker.width() / 2 + 'px';
    let top = position[1] - marker.height() + 'px';
    marker.css('position', 'absolute');
    marker.css('left', left);
    marker.css('top', top);
    marker.attr('x', siteCoord[0]);
    marker.attr('y', siteCoord[1]);
  }

  //清除所有
  static clear(mapId) {
    $(`#${mapId} #lineMapMarkers`).html('');
  }

  // 清除单个
  remove() {
    $(`#${this.mapId} #lineMapMarkers #${this.markerId}`).remove();
  }
  // 隐藏
  hide() {
    $(`#${this.mapId} #lineMapMarkers #${this.markerId}`).hide();
  }

  show() {
    $(`#${this.mapId} #lineMapMarkers #${this.markerId}`).show();
  }
}
