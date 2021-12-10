import { ObjectId } from 'mongodb';

import { CONFIG_FORGE } from '../config';
import forgeService from './ForgeService';
import { ModelModel } from './mongoose-models/model';
import { DBModelI } from '../../typings/model';

class ModelService {
  getModelByModelId = async (modelId: string) => {
    // 获取token;
    let { clientId, clientSecret } = CONFIG_FORGE;
    let token = await forgeService.getToken({
      clientId: clientId,
      clientSecret: clientSecret,
      scope: ['data:read'],
    });
    const model = await forgeService.search({
      modelId,
      token,
    });

    return model;
  };

  updateModelStatus = async (data: DBModelI[]) => {
    try {
      for (let i = 0; i < data.length; i++) {
        if (!data[i].files.status || data[i].files.status === 'doing') {
          const forgeModel = await this.getModelByModelId(data[i].files._id);

          if (forgeModel && forgeModel.status) {
            data[i].files.status = forgeModel.status;
            await ModelModel.updateOne(
              { _id: new ObjectId(data[i]._id) },
              {
                files: data[i].files,
              }
            );
          }
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      return data;
    }
  };
}

const modelService = new ModelService();
export default modelService;
