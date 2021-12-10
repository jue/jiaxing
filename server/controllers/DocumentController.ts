import { Request, Response, NextFunction, Router } from 'express';
import { DocumentModel } from '../services/mongoose-models/document';
import { Documents } from '../../typings/document';
import sequenceService from '../services/SequenceService';

const router = Router();

class DocumentController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id: idCreatedBy } = req.user;
      let {
        body: {
          idCategory,
          idFile,
          name,
          isFavorite,
          size,
          dataStatus,
          fileType,
        },
      } = req;

      // const day = await sequenceService.getDayString();
      // const seq = await sequenceService.getNextSequence(
      //   day.slice(2),
      //   'document'
      // );
      const creator: Partial<Documents> = {
        idCategory,
        idFile,
        name,
        isFavorite,
        size,
        dataStatus,
        // documentNo: fileType.toLocaleUpperCase() + seq.seq,
        // documentNo: '1111',
        atCreated: new Date(),
        idCreatedBy,
      };
      let documentModel = new DocumentModel(creator);
      documentModel = await documentModel.save();
      res.json(DocumentModel);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id: idCreatedBy } = req.user;
      let {
        body: { _id, idCategory, idFile, name, isFavorite, size, dataStatus },
      } = req;

      let documentModel = await DocumentModel.findOne({
        _id,
      });

      if (idCategory) {
        documentModel.idCategory = idCategory;
      }

      if (idFile) {
        documentModel.idFile = idFile;
      }

      if (name) {
        documentModel.name = name;
      }

      documentModel.isFavorite = isFavorite;

      if (size) {
        documentModel.size = size;
      }

      if (dataStatus) {
        documentModel.dataStatus = dataStatus;
      }

      let data = await documentModel.save();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      let { _id } = req.query;
      if (!_id) {
        res.status(500).json({ msg: 'ID为空' });
        return;
      }

      let DocumentData = await DocumentModel.findOne({
        _id,
      });

      if (DocumentData === null) {
        res.status(500).json({ msg: '档案不存在' });
        return;
      }

      const data = await DocumentModel.deleteOne({
        _id,
      });
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    let data = [];
    let { _id, name, dataStatus, idCategory, page, limit } = req.query;

    try {
      if (_id) {
        let data = await DocumentModel.findOne({
          _id,
        });
        return res.json(data);
      }

      let searchInfo: any = {};
      if (name) {
        searchInfo.name = new RegExp(name as string);
      }

      if (dataStatus) {
        searchInfo.dataStatus = dataStatus;
      }

      if (idCategory) {
        searchInfo.idCategory = idCategory;
      }

      let newLimit = +limit || 10;
      let skip = +page * newLimit;

      data = await DocumentModel.find(searchInfo)
        .populate('account')
        .populate('category')
        .skip(skip)
        .limit(newLimit)
        .sort({
          atCreated: -1,
        });

      let count = await DocumentModel.countDocuments(searchInfo);
      res.json({ data, count });
    } catch (error) {
      next(error);
    }
  }
}

const documentController = new DocumentController();

// 档案管理-创建
router.post('/api/document/create', documentController.create);

// 档案管理-更新
router.post('/api/document/update', documentController.update);

// 档案管理-删除
router.delete('/api/document/delete', documentController.delete);

// 档案管理-查询
router.get('/api/document/search', documentController.search);

export default router;
