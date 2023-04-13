import axios, { AxiosResponse } from 'axios';
import { API_URL, MASTER_SECRET } from '../constants/config';

export class ResponseError extends Error {
  public response: AxiosResponse;

  constructor(response: AxiosResponse) {
    super(response.statusText);
    this.response = response;
  }
}

function parseJSON(response: AxiosResponse) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.data;
}

export function request(payload: any): any {
  return new Promise(function (resolve, reject) {
    const key = localStorage.getItem('auth');
    const auth: any = key && key !== '' ? JSON.parse(key) : undefined;
    const instance = axios.create({ baseURL: API_URL });
    instance.interceptors.request.use(
      function (config) {
        config.headers.Authorization = payload.url !== '/auth/login' ? `Bearer ${auth.token}` : `Bearer ${MASTER_SECRET}`;
        return config;
      },
      error => Promise.reject(error),
    );
    instance.interceptors.response.use(
      response => response,
      error => Promise.reject(error),
    );
    instance(payload)
      .then(r => {
        const res = parseJSON(r)
        resolve(res)
      })
      .catch(err => reject(err));
  })
}
