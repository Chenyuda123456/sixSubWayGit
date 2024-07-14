import axios from 'axios';

let instance = axios.create({
  timeout: 30000
});
// 最后的数据请求
let httpRequest = function (resolve, reject, config) {
  axios(config)
    .then(response => {
      resolve(response.data);
    })
    .catch(error => {
      reject(error);
    });
};

// 不同消息的数据拼接
instance.ajax = function (url, method, params, form = false) {
  return new Promise((resolve, reject) => {
    let config = null;
    // 1，是否是form数据（添加请求头）
    if (form) {
      config = {
        url: url,
        method: method,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
    } else {
      config = {
        url: url,
        method: method
      };
      config.headers = {
        'Content-type': 'application/json;charset=utf-8'
      };
    }
    // 2，判断是何种请求格式
    if (method && method.toLowerCase() === 'get') {
      config.params = params;
    } else {
      config.data = params;
    }
    httpRequest(resolve, reject, config);
  });
};

instance.ajax0 = function (url, method, params, form = false) {
  return instance.ajax(url, method, params, form);
};

export default instance;
