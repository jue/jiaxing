import axios, { AxiosInstance } from 'axios';
import debounce from 'lodash/debounce';

const tokenExpiresIn = 3600 * 1000;

class BaseSvc {
  apiUrl = '/';
  baseUrl = '';
  private _api!: AxiosInstance;

  static tokenTime: number = 0;

  static addNotification = (
    message: any,
    options: { key?: string; variant: 'success' | 'error' | 'warning' | 'info' }
  ) => void 0;

  static removeNotification = (key: string) => void 0;

  get api() {
    if (!this._api) {
      this._api = axios.create({
        baseURL: `${this.baseUrl}${this.apiUrl}`,
        maxContentLength: Infinity,
      });
    }
    return this._api;
  }

  notifyError(message: string, error: Error = null) {
    BaseSvc.addNotification(message, {
      variant: 'error',
    });
    if (error) {
      throw error;
    }
  }

  notifySuccess(message: string) {
    BaseSvc.addNotification(message, {
      variant: 'success',
    });
  }
}

export default BaseSvc;
