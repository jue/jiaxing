import EngineeringIcon from '../../components/Svgs/WorkBench/EngineeringIcon';
import QualityIcon from '../../components/Svgs/WorkBench/QualityIcon';
import HiddenDangerIcon from '../../components/Svgs/WorkBench/HiddenDangerIcon';
import DocumentIcon from '../../components/Svgs/WorkBench/DocumentIcon';
import ConstructIcon from '../../components/Svgs/WorkBench/ConstructIcon';
import ProgressIcon from '../../components/Svgs/WorkBench/ProgressIcon';
import ConstructionIcon from '../../components/Svgs/WorkBench/ConstructionIcon';
import PerSonalIcon from '../../components/Svgs/WorkBench/PerSonalIcon';
import ModelIcon from '../../components/Svgs/WorkBench/ModelIcon';

export const routData = [
  {
    id: '1',
    name: '工程变更',
    icon: <EngineeringIcon />,
    router: '/engineering/changeList',
  },
  {
    id: '2',
    name: '质量检查',
    icon: <QualityIcon />,
    router: '/quality/v2/inspection',
  },
  {
    id: '3',
    name: '隐患排查',
    icon: <HiddenDangerIcon />,
    router: '/safety/hiddenDanger',
  },
  {
    id: '4',
    name: '文档管理',
    icon: <DocumentIcon />,
    router: '/document',
  },
  {
    id: '5',
    name: '合同创建',
    icon: <ConstructIcon />,
    router: '/contract/create',
  },
  {
    id: '6',
    name: '工程进度',
    icon: <ProgressIcon />,
    router: '/progress',
  },
  {
    id: '7',
    name: '施工方案',
    icon: <ConstructionIcon />,
    router: '/quality/v2/construction',
  },
  {
    id: '8',
    name: '模型管理',
    icon: <ModelIcon />,
    router: '/model/upload',
  },
  {
    id: '9',
    name: '个人中心',
    icon: <PerSonalIcon />,
    router: '/personalCenter/information',
  },
];
