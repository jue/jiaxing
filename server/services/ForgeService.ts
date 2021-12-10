import {
  dev,
  FORGE_MODEL_SERVER_URI,
  FORGE_MODEL_EXTENAL_SERVER_URI,
} from '../config';
import BaseSvc from '../../client/services/BaseSvc';
import { Readable, Stream } from 'stream';
import FormData from 'form-data';
import { AxiosResponse } from 'axios';
import path from 'path';

export interface TokenInfo {
  clientId: string;
  clientSecret: string;
  scope: Array<string>;
}

export interface ValidatetokenInfo {
  token: string;
}

export interface ParmInfo {
  modelId: string;
  token: string;
}

export interface DiffInfo {
  primaryId: string;
  diffId: string;
  token: string;
}

class ForgeService extends BaseSvc {
  viewUrl = '';
  private getReadable(buffer: Buffer) {
    let readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    return readable;
  }

  constructor() {
    super();
    let domain = FORGE_MODEL_SERVER_URI || `http://forge-model-server`;
    if (dev) {
      domain = FORGE_MODEL_SERVER_URI || `http://127.0.0.1:29901`;
    }

    this.apiUrl = domain;
    this.viewUrl = FORGE_MODEL_EXTENAL_SERVER_URI || 'http://localhost:29901';
  }

  async getToken(tokenInfo: Partial<TokenInfo>) {
    let getTokenUrl = `/api/v2/oauth/gettoken`;
    const { data } = await this.api.post(getTokenUrl, tokenInfo);

    let validatetoken = null;
    if (data.access_token) {
      validatetoken = data.access_token;
    }

    return validatetoken;
  }

  async validatetoken(validatetokenInfo: Partial<ValidatetokenInfo>) {
    let getTokenUrl = `/api/v2/oauth/validatetoken`;
    const { data } = await this.api.post(getTokenUrl, validatetokenInfo);
    return data;
  }

  async create(
    buffer: Buffer,
    filename: string,
    contentType: string,
    token: string
  ): Promise<AxiosResponse<Stream>> {
    if (!this.isSupport(filename)) {
      throw new Error(`文件类型不支持: ${filename}`);
    }
    let readable = this.getReadable(buffer);

    let formData = new FormData();

    formData.append('model', readable, {
      contentType,
      filename,
    });

    let createUrl = `/api/v2/models/create`;

    const { data } = await this.api.post(createUrl, formData, {
      headers: {
        ...formData.getHeaders(),
        authorization: token,
      },
    });
    return data;
  }

  async search(searchInfo: Partial<ParmInfo>) {
    const { data } = await this.api.get(
      `/api/v2/models/${searchInfo.modelId}`,
      {
        headers: {
          authorization: searchInfo.token,
        },
      }
    );
    return data;
  }

  async view(viewInfo: Partial<ParmInfo>) {
    let url =
      this.viewUrl + `/view?id=${viewInfo.modelId}&token=${viewInfo.token}`;
    return url;
  }

  async modelDiff(modelDiffInfo: Partial<DiffInfo>) {
    let url =
      this.viewUrl +
      `/modelDiff?primaryId=${modelDiffInfo.primaryId}&diffId=${modelDiffInfo.diffId}&token=${modelDiffInfo.token}`;
    return url;
  }

  isSupport(filename: string): boolean {
    let ext = path.extname(filename).toLowerCase();
    return [
      '.zip',
      '.rvt',
      '.nwd',
      '.nwc',
      '.fbx',
      '.obj',
      '.dwg',
      '.prt',
      '.asm',
      '.3ds',
      '.skp',
      '.ifc',
      '.max',
    ].includes(ext);
  }
}

const forgeService = new ForgeService();
export default forgeService;
