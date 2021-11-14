"use strict";

import axios from "axios";
// import store from '@/store'

const hostname = window.location.hostname
let baseURL = process.env.VUE_APP_BASE_URL

if (hostname.startsWith('localhost') || hostname.startsWith('192.168')) {
  baseURL = "http://localhost:9000/api"
}

const config = { baseURL }

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function(config) {
    // const token = localStorage.getItem("access_token");
    // if (token) {
    //   config.headers["Authorization"] = `Bearer ${token}`;
    // }
    return config;
  },

  function(error) {
    localStorage.clear()
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  
  function(error) {
    const originalRequest = error.config;
    if (error.response.status === 401) {
      return Promise.reject("Credenciales expiradas");
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");

      return axios.post("auth/token/", {
        grant_type:'refresh_token',
        client_id: process.env.VUE_APP_CLIENT_ID,
        client_secret: process.env.VUE_APP_CLIENT_SECRET,
        refresh_token: refreshToken
      }).then(response => {
        response
        // if (response.status === 201) {
          // const access_token = response.data
          // localStorage.setItem("access_token", response.data.access);
          // axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
          return axios(originalRequest);
        // }
      });
    }
    return Promise.reject(error);
  }
);

export default _axios;