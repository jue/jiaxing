import { Request, Response, NextFunction, Router } from 'express';
import forgeService from '../services/ForgeService';
import { CONFIG_FORGE } from '../config';
import mongodbGridfsService from '../services/MongodbGridfsService';

const router = Router();

class ForgeController {
  async getToken(req: Request, res: Response, next: NextFunction) {
    const { scope } = req.body;

    let clientId = CONFIG_FORGE.clientId;
    let clientSecret = CONFIG_FORGE.clientSecret;
    try {
      let token = await forgeService.getToken({
        clientId: clientId,
        clientSecret: clientSecret,
        scope: scope as Array<string>,
      });

      res.json({ token: token });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const uploadfile = req.file;

      if (!uploadfile) {
        throw new Error('没有上传文件');
      }
      let idFile = uploadfile.id.toString();
      let fileName = uploadfile.originalname;
      let contentType = uploadfile.contentType;

      // 获取token;
      let clientId = CONFIG_FORGE.clientId;
      let clientSecret = CONFIG_FORGE.clientSecret;
      let token = await forgeService.getToken({
        clientId: clientId,
        clientSecret: clientSecret,
        scope: ['data:create', 'data:read'],
      });

      if (token === null) {
        throw new Error('token获取失败');
      }

      let buffer = await mongodbGridfsService.getFileButter(idFile);

      let data = (await forgeService.create(
        buffer,
        fileName,
        contentType,
        token
      )) as any;

      data.idFile = idFile;

      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    try {
      let { modelId } = req.query;

      if (!modelId) {
        throw new Error('模型ID为空');
      }

      // 获取token;
      let clientId = CONFIG_FORGE.clientId;
      let clientSecret = CONFIG_FORGE.clientSecret;
      let token = await forgeService.getToken({
        clientId: clientId,
        clientSecret: clientSecret,
        scope: ['data:read'],
      });

      if (token === null) {
        throw new Error('token获取失败');
      }

      let data = await forgeService.search({
        modelId: modelId as string,
        token: token,
      });
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async view(req: Request, res: Response, next: NextFunction) {
    try {
      let { modelId } = req.query;

      if (!modelId) {
        throw new Error('模型ID为空');
      }

      // 获取token;
      let clientId = CONFIG_FORGE.clientId;
      let clientSecret = CONFIG_FORGE.clientSecret;
      let token = await forgeService.getToken({
        clientId: clientId,
        clientSecret: clientSecret,
        scope: ['data:read'],
      });

      if (token === null) {
        throw new Error('token获取失败');
      }

      let data = await forgeService.view({
        modelId: modelId as string,
        token: token,
      });
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async modelDiff(req: Request, res: Response, next: NextFunction) {
    try {
      let { primaryId, diffId } = req.query;

      if (!primaryId || !diffId) {
        throw new Error('模型ID为空');
      }

      // 获取token;
      let clientId = CONFIG_FORGE.clientId;
      let clientSecret = CONFIG_FORGE.clientSecret;
      let token = await forgeService.getToken({
        clientId: clientId,
        clientSecret: clientSecret,
        scope: ['data:read'],
      });

      if (token === null) {
        throw new Error('token获取失败');
      }

      let data = await forgeService.modelDiff({
        primaryId: primaryId as string,
        diffId: diffId as string,
        token: token,
      });
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}

const forgeController = new ForgeController();

// 获取Token
//router.post('/api/forge/getToken', forgeController.getToken);

// 模型文件上传
router.post(
  '/api/forge/create',
  mongodbGridfsService.getMulterStorage().single('file'),
  forgeController.create
);

// 模型文件查询
router.get('/api/forge/search', forgeController.search);

// 模型文件预览
router.get('/api/forge/view', forgeController.view);

// 模型文件对比
router.get('/api/forge/modelDiff', forgeController.modelDiff);

export default router;
