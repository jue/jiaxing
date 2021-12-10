import { Request, Response, NextFunction, Router } from 'express';
import { DocumentCategoryModel } from '../services/mongoose-models/document_category';
import { DocumentModel } from '../services/mongoose-models/document';
import { DocumentCategory } from '../../typings/document';

const router = Router();

class DocumentCategoryController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id: idCreatedBy } = req.user;
      let {
        body: { name, idParent },
      } = req;
      const creator: Partial<DocumentCategory> = {
        name,
        idParent,

        atCreated: new Date(),
        idCreatedBy,
      };
      let documentCategoryModel = new DocumentCategoryModel(creator);
      documentCategoryModel = await documentCategoryModel.save();
      res.json(documentCategoryModel);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      let {
        body: { _id, name, idParent },
      } = req;
      let documentCategoryModel = await DocumentCategoryModel.findOne({
        _id,
      });

      if (name) {
        documentCategoryModel.name = name;
      }

      if (idParent) {
        documentCategoryModel.idParent = idParent;
      }

      let data = await documentCategoryModel.save();
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

      let documentCategoryData = await DocumentCategoryModel.findOne({
        _id,
      });

      if (documentCategoryData === null) {
        res.status(500).json({ msg: '文件夹不存在' });
        return;
      }

      let searchInfo: any = {};
      searchInfo.idCategory = _id;

      const documentLists = await DocumentModel.find(searchInfo);

      for (let document of documentLists) {
        await DocumentModel.deleteOne({ _id: document._id });
      }

      const data = await DocumentCategoryModel.deleteOne({
        _id,
      });
      res.json(data);

      res.json({});
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    let data = [];
    let { _id, idParent } = req.query;

    try {
      if (_id) {
        let data = await DocumentCategoryModel.findOne({
          _id,
        });
        res.json(data);
        return;
      }

      let searchInfo: any = {};
      if (idParent) {
        searchInfo.idParent = idParent;
      }

      data = await DocumentCategoryModel.find(searchInfo).sort({
        atCreated: -1,
      });

      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}

const documentCategoryController = new DocumentCategoryController();

// 档案管理文件夹-创建
router.post('/api/documentCategory/create', documentCategoryController.create);

// 档案管理文件夹-更新
router.post('/api/documentCategory/update', documentCategoryController.update);

// 档案管理文件夹-删除
router.delete(
  '/api/documentCategory/delete',
  documentCategoryController.delete
);

// 档案管理文件夹-查询
router.get('/api/documentCategory/search', documentCategoryController.search);

export default router;
