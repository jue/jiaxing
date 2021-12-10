import path from 'path';
import { Duplex, Stream } from 'stream';

import { Request, Response, NextFunction, Router } from 'express';
import { AxiosResponse } from 'axios';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

import wordToPdfService from '../services/WordToPdfService';
import auditingService from '../services/AuditingService';
import signatureService from '../services/SignatureService';
import redisService from '../services/RedisService';

let upload = multer();
const router = Router();

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    let buffers = [];
    stream.on('error', reject);
    stream.on('data', (data) => buffers.push(data));
    stream.on('end', () => resolve(Buffer.concat(buffers)));
  });
}

function bufferToStream(buffer) {
  let stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

async function getPdfStream(query: any): Promise<AxiosResponse<Stream>> {
  let params: any = query;
  const data: any = _.omit(params, ['tempId', 'fileName', 'idAuditing']);
  let fileStream = await auditingService.downloadResource(
    params.tempId as string
  );

  const options = {
    parser: function (tag: any) {
      return {
        get: function (scope: any) {
          return !scope || !scope[tag] ? '' : scope[tag];
        },
      };
    },
  };

  let fileBuf: any = await streamToBuffer(fileStream);
  let zip = new PizZip(fileBuf);
  let doc = new Docxtemplater(zip, options);

  doc.setData(data);
  doc.render();
  let buf = doc.getZip().generate({ type: 'nodebuffer' });
  let pdfStream = await wordToPdfService.transferStreamToPdf(
    bufferToStream(buf),
    params.fileName as string
  );

  return pdfStream;
}

class FileController {
  async uploadResource(req: Request, res: Response, next: NextFunction) {
    try {
      let data = await auditingService.uploadResource(req);
      if (data.code === 0) {
        res.json({
          code: 200,
          msg: 'SUCCESS',
          data: data.data,
        });
        return;
      } else {
        res.json({
          code: 4001,
          msg: '上传失败',
          data: data.msg,
        });
        return;
      }
    } catch (error) {
      res.status(200).json({
        code: 4001,
        msg: '上传失败',
        data: error.message,
      });
      next(error);
    }
  }

  async downloadResource(req: Request, res: Response, next: NextFunction) {
    const { idFile } = req.query;
    try {
      let data = await auditingService.downloadResource(idFile as string);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', data.headers['content-disposition']);
      data.pipe(res);
    } catch (error) {
      res.status(200).json({
        code: 4001,
        msg: '下载失败',
        data: error.message,
      });
      next(error);
    }
  }

  async previewResource(req: Request, res: Response, next: NextFunction) {
    try {
      let { idFile, filename } = req.params;
      let supported = wordToPdfService.isSupport(filename);
      let extName = _.toLower(path.extname(filename));

      if (!supported && extName !== '.pdf') {
        let data = await auditingService.downloadResource(idFile as string);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader(
          'Content-Disposition',
          data.headers['content-disposition']
        );
        data.pipe(res);
      } else if (extName === '.pdf') {
        let data = await auditingService.downloadResource(
          idFile as string,
          true
        );
        data.pipe(res);
      } else {
        //获取资源信息
        let data = await auditingService.downloadResource(
          idFile as string,
          true
        );
        let pdfStream = await wordToPdfService.transferStreamToPdf(
          data,
          filename
        );
        pdfStream.data.pipe(res);
      }
    } catch (error) {
      res.status(200).json({
        code: 4001,
        msg: '预览失败',
        data: error.message,
      });
      next(error);
    }
  }

  async preview(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        query: { tempDataKey },
      } = req;
      let params = req.query;

      if (tempDataKey) {
        params = await redisService.getPreviewData(tempDataKey as string);
      }
      let pdfStream: AxiosResponse<Stream> = await getPdfStream(params);

      res.setHeader(
        'Content-Disposition',
        'inline; filename="' +
          encodeURIComponent(
            (params.fileName as string).replace(
              path.extname(params.fileName as string),
              '.pdf'
            )
          ) +
          '"'
      );

      if (params.idAuditing) {
        let signedStream: any;

        const idAuditing = params.idAuditing;
        const fileName: string = params.fileName as string;
        const tempId = params.tempId;

        signedStream = await signatureService.doSignature(
          pdfStream,
          fileName.split('.')[0] + '.pdf',
          idAuditing as string,
          tempId as string,
          { operatorId: req.user._id, operatorName: req.user.userName }
        );
        return signedStream.pipe(res);
      } else {
        return pdfStream.data.pipe(res);
      }
    } catch (error) {
      next(error);
    }
  }

  async tempSaveData(req: Request, res: Response, next: NextFunction) {
    try {
      const { body } = req;

      if (!body || !_.isObject(body)) {
        return next(new Error('body is an object and is required!'));
      }

      const tempDataKey = uuidv4();
      await redisService.setPreviewData(tempDataKey, body);

      res.json({
        code: 200,
        msg: 'SUCCESS',
        data: { tempDataKey },
      });
    } catch (error) {
      next(error);
    }
  }
}

const fileController = new FileController();

// 资源上传
router.post(
  '/api/file/upload',
  upload.fields([{ name: 'file', maxCount: 1 }]),
  fileController.uploadResource
);

// 资源下载
router.get('/api/file/download', fileController.downloadResource);

// 资源预览
router.get(
  '/api/file/preview/:idFile/:filename',
  fileController.previewResource
);

// 模版文件预览
router.get('/api/file/template/preview', fileController.preview);

// save temp preview data
router.post('/api/file/template/data', fileController.tempSaveData);
export default router;
