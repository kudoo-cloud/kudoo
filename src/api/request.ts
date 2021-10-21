import { AxiosInstance, AxiosRequestConfig, default as BaseAxios } from 'axios';

class RequestClass {
  axios: AxiosInstance;

  constructor() {
    this.axios = BaseAxios.create({ timeout: 60000 });
  }

  async call(config: AxiosRequestConfig) {
    try {
      let headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      // TODO: once auth system gets implemented then add token to header here
      // const user = get(store.getState(), 'auth.user', null);
      // if (user && user.auth_token) {
      //   headers = {
      //     ...headers,
      //     Authorization: `Bearer ${user.auth_token}`,
      //   };
      // }
      const res = await this.axios.request({
        headers,
        ...config,
      });
      return { ...res.data, status: 1 };
    } catch (error) {
      const errorStatus = error?.response?.status || null;
      const data = error?.response?.data || null;

      return {
        status: 0,
        errorStatus,
        message: error.message,
        data,
      };
    }
  }
}

const Request = new RequestClass();
export { Request };
