import { Request, Response, NextFunction, Router } from 'express';
import { QualityInspectTaskModel } from '../services/mongoose-models/quality_inspect_task';
import moment from 'moment';

const router = Router();
class WorkBenchController {
  async search(req: Request, res: Response, next: NextFunction) {
    let userId = req.user._id;

    let { page, limit, level, status, action } = req.query;

    try {
      let searchInfo: any = {};
      if (status) {
        if (status === 'outdate') {
          let d1 = new Date(moment(new Date()).format('YYYY-MM-DD'));
          searchInfo.endTime = {
            $gt: d1,
          };
        } else {
          searchInfo.status = status;
        }
      }
      if (level) {
        searchInfo.level = level;
      }
      if (action === 'todo') {
        searchInfo.idExecutive = userId;
        searchInfo.progress = 0;
      }
      if (action === 'done') {
        searchInfo.idExecutive = userId;
        searchInfo.progress = 100;
      }
      if (action === 'create') {
        searchInfo.idCreator = userId;
      }
      if (action === 'participation') {
        searchInfo.idsCC = { $in: [userId] };
        searchInfo.idParticipate = { $in: [userId] };
      }
      let newLimit = +limit || 10;
      let skip = +page * newLimit;

      let data = await QualityInspectTaskModel.find(searchInfo)
        .select(['name', 'level', 'progress', 'status', 'idCreator', 'endTime'])
        .populate({
          path: 'account',
          select: ['userName'],
        })
        .skip(skip)
        .limit(newLimit)
        .sort({ atCreated: -1 });

      let count = await QualityInspectTaskModel.countDocuments(searchInfo);
      res.json({
        data,
        count,
      });
    } catch (error) {
      next(error);
    }
  }
}

const workBenchController = new WorkBenchController();

router.get('/api/workbench/search', workBenchController.search);

export default router;
