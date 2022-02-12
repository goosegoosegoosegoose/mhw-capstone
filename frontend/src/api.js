import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

class MhwApi {
  static token = localStorage.getItem("token");

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${MhwApi.token}` };
    const params = (method === "get") ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // user/auth

  static async login(data) {
    let res = await this.request('auth/token', data, "post");
    return res;
  }

  static async getUser(username) {
    let res = await this.request(`users/${username}`);
    return res;
  }

  static async register(data) {
    let res = await this.request(`auth/register`, data, "post");
    return res;
  }

  static async profileEdit(data ,username) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res;
  }

  static refreshToken() {
    this.token = localStorage.getItem("token");
  }

  static async getOne(type, id) {
    let res = await this.request(`${type}/${id}`);
    return res;
  }

  static async search(type, header, handle) {
    if (handle === "") {
      let res = await this.request(`${type}`);
      return res;
    }
    let res = await this.request(`${type}/?${header}=${handle}`);
    return res;
  }

  static async add(type, username, itemId) {
    let res = await this.request(`${type}/${itemId}/user/${username}`, {}, "post")
    return res;
  }

  static async remove(type, username, itemId) {
    let res = await this.request(`${type}/${itemId}/user/${username}`, {}, "delete")
    return res;
  }
}

export default MhwApi;