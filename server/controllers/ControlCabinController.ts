/**
 * @ Author: xcs
 * @ Create Time: 2020-10-19 18:25:14
 * @ Modified by: xcs
 * @ Modified time: 2020-10-26 16:49:04
 * @ Description:驾驶舱
 */
import moment from 'moment';
import { Request, Response, NextFunction, Router } from 'express';
const router = Router();
class ControlCabinController {
  /**
   * 基础信息
   * @returns {distance_test_run:距离试运行,distance_begin_construction:已安全试运行天数}
   */
  getInfo(req: Request, res: Response, next: NextFunction): void {
    const test_run_date = new Date('2021-2-28'); //试运行日期
    const begin_construction_date = new Date('2020-5-18'); //开工日期
    try {
      const distance_test_run: number = moment(test_run_date).diff(
        moment(new Date()),
        'days'
      );
      const distance_begin_construction: number = moment(new Date()).diff(
        moment(begin_construction_date),
        'days'
      );
      res.json({
        data: {
          distance_test_run: Math.max(distance_test_run, 0),
          distance_begin_construction,
        },
        status: 'ok',
      });
    } catch (error) {
      next(error);
    }
  }
}

const controlCabinController = new ControlCabinController();
//驾驶舱信息
router.get('/api/controlCabin/info', controlCabinController.getInfo);

export default router;
