import LMapBase from './lineMap.base';

/*
 *@description: 方形站点svg图，点击站点修改站点值
 */
export default class LMapText extends LMapBase {
  constructor(id, options) {
    options = Object.assign(options, {
      mode: 'text'
    });
    super(id, options);
  }

  updateText({ data, startSiteId }) {
    let el = document.getElementById('rt' + startSiteId);
    this._writeText(el, '');
    for (var i = 0; i < data.length; i++) {
      this._writeText(document.getElementById('rt' + data[i].id), data[i].text);
    }
    var x1 = 100000,
      x2 = 0,
      y1 = 100000,
      y2 = 0;
    x1 =
      x1 < el.attributes.x.nodeValue * 1 ? x1 : el.attributes.x.nodeValue * 1;
    y1 =
      y1 < el.attributes.y.nodeValue * 1 ? y1 : el.attributes.y.nodeValue * 1;
    x2 =
      x2 > el.attributes.x.nodeValue * 1 ? x2 : el.attributes.x.nodeValue * 1;
    y2 =
      y2 > el.attributes.y.nodeValue * 1 ? y2 : el.attributes.y.nodeValue * 1;
    clearInterval(this.pathAnimationIntervalID);
    this.fitScreen(x1, y1, x2, y2, false);
  }

  /**
   *（考虑到不同的文字宽度，对文字的坐标进行转换）
   * @method _writeText 在站点框中写入文字
   * @param {Object} 写入的TEXT文本元素对象
   * @param {string} 写入的数字
   * @return
   */
  _writeText(text_element, value) {
    //控制第1位数或第2位数字是1时，调整文字坐标，恢复文字坐标位置
    if (!text_element) return;
    if (text_element.textContent.substr(0, 1) == '1') {
      text_element.attributes.x.value =
        Number(text_element.attributes.x.value) + 3;
    }
    if (text_element.textContent.substr(1, 1) == '1') {
      text_element.attributes.x.value =
        Number(text_element.attributes.x.value) - 2;
    }

    //当文字位数发生变化时，调整文字坐标，使得文字居中
    if (value.toString().length == 2 && text_element.textContent.length < 2) {
      text_element.attributes.x.value =
        Number(text_element.attributes.x.value) - 17;
    } else if (
      value.toString().length < 2 &&
      text_element.textContent.length == 2
    ) {
      text_element.attributes.x.value =
        Number(text_element.attributes.x.value) + 17;
    }

    //控制第1位数或第2位数字是1时，调整文字坐标，调整文字坐标位置
    if (value.toString().substr(0, 1) == '1') {
      text_element.attributes.x.value =
        Number(text_element.attributes.x.value) - 3;
    }
    if (value.toString().substr(1, 1) == '1') {
      text_element.attributes.x.value =
        Number(text_element.attributes.x.value) + 2;
    }
    text_element.textContent = value;
  }
}
