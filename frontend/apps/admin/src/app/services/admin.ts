import { serialize, request } from '@its/common';

export const query = (url: string, filters?: any) =>
  request({ url: filters ? `${url}?${serialize(filters)}` : url, method: 'GET' })
    .then((response: any) => response.response)
    .catch((response: any) => response.error);

export const mutation = (url: string, data: any, method = 'POST') =>
  request({ url, method, data })
    .then((response: any) => response.response)
    .catch((response: any) => response.error);
