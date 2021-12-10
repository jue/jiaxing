import { AuthModel } from '../../services/mongoose-models/auth';
import { AuthAction, AuthModuleType } from '../../../constants/enums';

async function beforeAuth() {
  try {
    let auths: any = [
      {
        name: '质量管理',
        action: AuthAction.search,
        moduleType: AuthModuleType.qualityManagement,
      },
      {
        name: '质量管理',
        action: AuthAction.update,
        moduleType: AuthModuleType.qualityManagement,
      },
      {
        name: '安全管理',
        action: AuthAction.search,
        moduleType: AuthModuleType.securityManagement,
      },
      {
        name: '安全管理',
        action: AuthAction.update,
        moduleType: AuthModuleType.securityManagement,
      },
      {
        name: '设计变更管理',
        action: AuthAction.search,
        moduleType: AuthModuleType.designChangesManagement,
      },
      {
        name: '设计变更管理',
        action: AuthAction.update,
        moduleType: AuthModuleType.designChangesManagement,
      },
      {
        name: '进度管理',
        action: AuthAction.search,
        moduleType: AuthModuleType.progressManagement,
      },
      {
        name: '进度管理',
        action: AuthAction.update,
        moduleType: AuthModuleType.progressManagement,
      },
      {
        name: '合同管理',
        action: AuthAction.search,
        moduleType: AuthModuleType.contractManegement,
      },
      {
        name: '合同管理',
        action: AuthAction.update,
        moduleType: AuthModuleType.contractManegement,
      },
      {
        name: '模型管理',
        action: AuthAction.search,
        moduleType: AuthModuleType.modelManegement,
      },
      {
        name: '模型管理',
        action: AuthAction.update,
        moduleType: AuthModuleType.modelManegement,
      },
      {
        name: '风险管理',
        action: AuthAction.search,
        moduleType: AuthModuleType.riskManagement,
      },
      {
        name: '风险管理',
        action: AuthAction.update,
        moduleType: AuthModuleType.riskManagement,
      },
      {
        name: '文档管理',
        action: AuthAction.search,
        moduleType: AuthModuleType.documentManagement,
      },
      {
        name: '文档管理',
        action: AuthAction.update,
        moduleType: AuthModuleType.documentManagement,
      },
    ];
    let data = await AuthModel.find({});
    if (data.length === 0) {
      await AuthModel.insertMany(auths);
    }
  } catch (error) {}
}

export default async () => {
  await beforeAuth();
};
