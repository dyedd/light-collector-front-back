const axios = require('axios');


const instance = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 8000,
});


instance.interceptors.request.use(
  (config) => {
    config.headers.accept = 'application/json';
    return config;
  },
  // request error
  (error) => Promise.reject(error),
);

axios.interceptors.response.use(
  function (response) {
    
    return response;
  },
  function (error) {

    return Promise.reject(error);
  },
);

/**
 * core function of request
 * @param {*} options request config
 */
const request = (options) => {
  options.method = options.method || 'get';
  if (options.method.toLowerCase() === 'get') {
    // uniform request parameter
    options.params = options.data;
  }
  return instance(options);
};

['get', 'post', 'put', 'delete', 'patch'].forEach((item) => {
  request[item] = (url, data, options) =>
    request({
      url,
      data,
      method: item,
      ...options,
    });
});

module.exports = request;
