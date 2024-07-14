/*
 * @description: 时间补零
 * @param {string} time
 * @exmaple 4:55
 * @return 04:55
 * */
const formatTime = time => {
  if (typeof time === 'string') {
    let arr = time.split(':');
    return arr
      .map(item => {
        return Number(item) < 10 ? '0' + item : item;
      })
      .join(':');
  } else {
    throw new Error('ERR_TYPE, parameter time is expected to be string');
  }
};

// 倒计时
class SecCounter {
  constructor() {
    this.timer = undefined;
  }

  // 倒计时计算
  static getDate(second) {
    const days = Math.floor(second / 86400);
    const hours = Math.floor((second / 3600) % 24);
    const mins = Math.floor((second / 60) % 60);
    const sec = Math.floor(second % 60);
    return { days, hours, mins, sec };
  }

  // 启动倒计时
  countStart(second, resolve) {
    if (typeof second !== 'number') {
      throw new TypeError(
        'SecCounter: (second, resolve) second param is not a number'
      );
    }
    second = Math.max(parseInt(second), 0);
    // resolve(SecCounter.getDate(second))
    resolve(second);
    this.timer = setInterval(() => {
      if (second > 0) {
        second--;
        resolve(second);
        second === 0 && this.countStop();
      } else {
        this.countStop();
      }
    }, 1000);
  }

  // 关闭倒计时
  countStop() {
    this.timer && clearInterval(this.timer);
  }
}

// 计时
class SecTimer {
  constructor() {
    this.timer = undefined;
    this.second = 0;
    this.minute = 0;
    this.hour = 0;
  }

  get timeStr() {
    const format = val => {
      return val < 10 ? '0' + val : val;
    };
    return (
      format(this.hour) + ':' + format(this.minute) + ':' + format(this.second)
    );
  }

  countStart() {
    let second = 0;
    let minute = 0;
    let hour = 0;
    this.timer = setInterval(() => {
      second++;
      if (second === 60) {
        second = 0;
        minute++;
      }
      if (minute === 60) {
        minute = 0;
        hour++;
      }
      this.second = second;
      this.minute = minute;
      this.hour = hour;
    }, 1000);
  }

  countStop() {
    this.timer && clearInterval(this.timer);
    this.second = 0;
    this.minute = 0;
    this.hour = 0;
    this.timer = undefined;
  }
}

const pxToRem = val => {
  return (val / 108).toFixed(5) + 'rem';
};
// 获取assets图片
const getAssetsFile = url => {
  return new URL(`../assets/${url}`, import.meta.url).href;
};
export { formatTime, SecCounter, SecTimer, pxToRem, getAssetsFile };
