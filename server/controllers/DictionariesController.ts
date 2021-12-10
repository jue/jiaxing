import express, { NextFunction, Request, Response } from 'express';

import { DictionariesModel } from '../services/mongoose-models/dictionaries';
import { success, failed, BaseCode } from './CommonResult';

const router = express.Router();

class DictionaryController {
  async create(req: Request, res: Response, next: NextFunction) {
    const planInfo = req.body;

    try {
      let dictModel = new DictionariesModel({
        dataType: planInfo.dataType,
        chnWd: planInfo.chnWd,
        usWd: planInfo.usWd,
        remark: planInfo.remark,
        dataValue: planInfo.dataValue,
      });

      await dictModel
        .save()
        .then((dictModel) => {
          return res.json(success(dictModel));
        })
        .catch((error) => {
          return res.json(failed(null, error.message));
        });
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    let {
      _id,
      page,
      limit,
      dataType,
      chnWd,
      usWd,
      dataValue,
    } = req.query as any;
    try {
      if (_id) {
        let data = await DictionariesModel.findOne({
          _id: _id,
        });
        return res.json(success(data));
      }
      let newLimit = +limit || 10;
      let skip = +page * newLimit;

      let searchInfo: any = {};
      if (dataType) {
        searchInfo.dataType = new RegExp(dataType as string);
      }
      if (chnWd) {
        searchInfo.chnWd = new RegExp(chnWd as string);
      }
      if (usWd) {
        searchInfo.usWd = new RegExp(usWd as string);
      }
      if (dataValue) {
        searchInfo.dataValue = new RegExp(dataValue as string);
      }

      let data = await DictionariesModel.find(searchInfo)
        .skip(skip)
        .limit(newLimit)
        .sort({ atCreated: -1 });

      let count = await DictionariesModel.countDocuments(searchInfo);
      return res.json(success({ data, count }));
    } catch (error) {
      res.json(failed(null, error.message));
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const dictInfo = req.body;

      let updateInfo: any = {};

      if (dictInfo.dataType) {
        updateInfo.dataType = dictInfo.dataType;
      }
      if (dictInfo.chnWd) {
        updateInfo.chnWd = dictInfo.chnWd;
      }
      if (dictInfo.usWd) {
        updateInfo.usWd = dictInfo.usWd;
      }
      if (dictInfo.dataValue) {
        updateInfo.dataValue = dictInfo.dataValue;
      }

      let data = await DictionariesModel.findByIdAndUpdate(
        dictInfo._id,
        updateInfo,
        { new: true }
      );
      return res.json(success(data));
    } catch (error) {
      res.json(failed(null, error.message));
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      let { _id } = req.params;
      if (!_id) {
        return res.json(failed(BaseCode.PARAM_FAILED, 'ID为空'));
      }

      let dictData = await DictionariesModel.findOne({
        _id,
      });
      if (dictData === null) {
        return res.json(failed(BaseCode.DICT_NOT_EXIST, '字典不存在'));
      }

      await DictionariesModel.deleteOne({ _id: _id });
      return res.json(success(null));
    } catch (error) {
      res.json(failed(null, error.message));
      next(error);
    }
  }
}

const dictionaryController = new DictionaryController();

router.post('/api/dict', dictionaryController.create);

router.get('/api/dict', dictionaryController.search);

router.put('/api/dict', dictionaryController.update);

router.delete('/api/dict/:_id', dictionaryController.delete);

export default router;
