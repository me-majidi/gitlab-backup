const fetch = require("node-fetch");

class Request {
  constructor(baseUrl, token) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  get(endpoint, params = {}) {
    const query = new URLSearchParams();
    for (const [key, val] of Object.entries(params)) {
      query.append(key, val);
    }
    return fetch(
      `${this.baseUrl}/${endpoint}${
        query.toString() ? "?" + query.toString() : ""
      }`,
      {
        headers: {
          "PRIVATE-TOKEN": this.token,
        },
      }
    ).then((res) => res.json());
  }
}

module.exports = Request;
