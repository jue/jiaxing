import { Request, Response, NextFunction, Router } from 'express';

const router = Router();
class SignatureController {
  async preview(req: Request, res: Response, next: NextFunction) {
    // let { nodeId, approvalId } = req.body;

    try {
      res.json({
        code: 200,
        msg: 'SUCCESS',
        data: {
          fileId: '4d2c19f8-c4d3-4a42-b6b6-3599ced0302f',
          fileName: 'preview.pdf',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async sign(req: Request, res: Response, next: NextFunction) {
    // let { nodeId, approvalId } = req.body;

    try {
      res.json({
        code: 200,
        msg: 'SUCCESS',
        data: {
          fileId: '4d2c19f8-c4d3-4a42-b6b6-3599ced0302f',
          fileName: 'signed.pdf',
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

const signatureController = new SignatureController();

router.post('/api/signature/preview', signatureController.preview);
router.post('/api/signature', signatureController.sign);

export default router;
