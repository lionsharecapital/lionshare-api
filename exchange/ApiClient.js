import _map from 'lodash/map';

class ApiClient {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl;
  }

  fetch = (path, method, data, headersData) => {
    let body;
    let modifiedPath;

    if (method === 'GET' &&
        data &&
        Object.keys(data).length !== 0) {
      modifiedPath = `${path}?${this.constructQueryString(data)}`;
    } else if (method === 'POST' || method === 'PUT') {
      body = JSON.stringify(data);
    }

    // Construct headers
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'lionshare',
      ...headersData
    };

    // Handle request promises and return a new promise
    let statusCode = null;
    let statusText = null;
    return new Promise((resolve, reject) => {
      fetch(this.baseUrl + (modifiedPath || path), {
        method,
        body,
        headers,
        redirect: 'follow',
      })
      .then((response) => {
        const json = response.json();
        statusCode = response.status;
        statusText = response.statusText;

        // Handle successful responses
        if (response.status >= 200 && response.status < 300) {
          return json;
        }

        return json.then(Promise.reject.bind(Promise));
      })
      .then((json) => {
        resolve(json);
      })
      .catch((err) => {
        reject(err);
      });
    });
  }

  get = (path, data, headers = {}) => {
    return this.fetch(path, 'GET', data, headers);
  }

  constructQueryString = (data) => {
    return _map(data, (v, k) => {
      return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
    }).join('&');
  };
}

export default ApiClient;
