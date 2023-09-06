import { serialize, request } from '@its/common';

export const query = (url: string, filters?: any) =>
  request({ url: filters ? `${url}?${serialize(filters)}` : url, method: 'GET' })

export const mutation = (url: string, data: any, method = 'POST') =>
  request({ url, method, data })

export const upload = (url: string, data: FormData) =>
  request({ url, method: 'POST', data, headers: { 'Content-Type': 'multipart/form-data' } })