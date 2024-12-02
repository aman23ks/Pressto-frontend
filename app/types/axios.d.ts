// types/axios.d.ts
import { AxiosRequestConfig } from 'axios';

declare module 'axios' {
  export interface InternalAxiosRequestConfig extends AxiosRequestConfig {
    headers: {
      Authorization?: string;
      'Content-Type': string;
      [key: string]: string | undefined;
    };
  }
}