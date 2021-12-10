import React, { useEffect, useContext, useState } from 'react';
import { withRouter, useRouter } from 'next/router';
import { LayoutPageContext } from '../../layout/context/LayoutPageContext';
import debounce from 'lodash/debounce';

import clsx from 'clsx';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Box, Button } from '@material-ui/core';

import { Empty, ConfigProvider, Steps, Result } from 'antd';

import EngineeringContextProvider, {
  EngineeringContext,
} from '../context/EngineeringContext';
import { AuthContext, AuthContextI } from '../../../contexts/AuthContext';

import { commonStyles } from '../../../styles/resetStyles';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import BIMCompared from '../components/BIMCompared';
import ChangeNode from './ChangeNode';
import Remind from '../RemindModel';
import FlowContextProvider, {
  FlowContext,
} from '../../../contexts/FlowContext';
import companySvc from '../../../services/companySvc';

const { Step } = Steps;

const useStyles = makeStyles(({ palette, spacing, transitions }) => {
  return createStyles({
    form: {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      position: 'relative',
    },
    submitButton: {
      width: 92,
      height: 32,
    },
    cancleButton: {
      width: 92,
      height: 32,
      marginRight: spacing(3),
      '& .MuiButton-label': {
        color: 'rgba(0,0,0,0.3)',
      },
    },
    node: {
      boxShadow: '0px -2px 4px 0px rgba(63,146,220,0.2)',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      bottom: 0,
      padding: spacing(2, 6),
      backgroundColor: '#fff',
    },
    steps: {
      padding: spacing(2),
    },
    select: {
      width: 120,
      borderRadius: 4,
      position: 'relative',
      backgroundColor: palette.common.white,
      border: '1px solid rgba(217,217,217,1)',
      fontSize: 14,
      height: 30,
      transition: transitions.create(['border-color', 'box-shadow']),
      fontFamily: [].join(','),
      '&:focus': {
        borderColor: '#8FC220',
      },
    },
    opinion: {
      position: 'absolute',
      fontSize: 10,
      transform: 'scale(0.8)',
      color: '#FA6400',
    },
    success: {
      width: '100%',
      height: '100%',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      '& .ant-result-title': {
        fontSize: 14,
      },
      '& .ant-result-extra': {
        marginTop: spacing(2),
      },
    },
  });
});
const ChangeCreate = () => {
  const classes = useStyles({});
  const classesReset = commonStyles({});
  const [step, setTep] = useState(0);
  const [step1, setStep1] = useState<boolean>(false);
  const [step2, setStep2] = useState<boolean>(false);
  const router = useRouter();
  const {
    queryProjects,
    queryAuditing,
    nextAuditing,
    engineeringInfo,
    setEngineeringInfo,
    handleConfirm,
    successDialog,
    openBIM,
  } = useContext(EngineeringContext);
  const { account } = useContext<AuthContextI>(AuthContext);
  const { bizDatasFlow } = useContext(FlowContext);
  const [companys, setCompanys] = useState<any>([]);
  const queryCompany = async () => {
    const data = await companySvc.query({});
    setCompanys(data);
  };

  useEffect(() => {
    //自定义字段
    let bizData: any = bizDatasFlow.find((item) => item.name == '监理单位');
    let request =
      !bizData || (bizData && engineeringInfo.constructionControlUnit);

    let stepOne =
      engineeringInfo.engineeringName &&
      engineeringInfo.contractName &&
      engineeringInfo.constructionUnit &&
      engineeringInfo.constructionExectionUnit &&
      request &&
      engineeringInfo.designUnit;

    let stepTwo =
      engineeringInfo.changeName &&
      engineeringInfo.changeLevel &&
      engineeringInfo.changeType &&
      engineeringInfo.estimateAmountChange !== undefined &&
      engineeringInfo.endTime &&
      engineeringInfo.contractorUnit &&
      engineeringInfo.changeOwner &&
      engineeringInfo.changeReason &&
      engineeringInfo.changeDesc &&
      engineeringInfo.changeAccordingFile.length > 0;

    if (stepOne) {
      setTep(1);
      setStep1(Boolean(stepOne));
    } else {
      setTep(0);
    }
    if (stepOne && stepTwo) {
      setTep(2);
      setStep2(Boolean(stepTwo));
    }
  }, [engineeringInfo, bizDatasFlow]);

  useEffect(() => {
    queryProjects();
    queryCompany();
  }, []);
  useEffect(() => {
    if (account && account.company) {
      queryAuditing(account, 'create');
    }
  }, [account && account.company]);

  const onReset = () => {
    setEngineeringInfo({});
  };

  const customizeRenderEmpty = () => (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
  );
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const onChange = (current) => {
    setTep(step);
  };

  return (
    <>
      <ConfigProvider renderEmpty={customizeRenderEmpty}>
        {successDialog ? (
          <Result
            status="success"
            title="变更申请创建成功!"
            className={classes.success}
            extra={[
              <Button
                variant="outlined"
                color="primary"
                className={classes.cancleButton}
                onClick={() => router.push('/engineering/changeList')}
              >
                返回列表
              </Button>,
            ]}
          />
        ) : openBIM ? (
          <BIMCompared />
        ) : (
          <div className={clsx(classes.form, classesReset.stepCommon)}>
            <div style={{ height: 'calc(100% - 67px)', overflow: 'auto' }}>
              <Steps
                current={step}
                onChange={() => onChange}
                direction="vertical"
                className={classes.steps}
              >
                <Step
                  title="项目信息"
                  description={<StepOne companys={companys} />}
                />
                <Step
                  title="变更信息"
                  description={<StepTwo companys={companys} />}
                />
                <Step title="附件上传" description={<StepThree />} />
              </Steps>
            </div>
            <Box className={classes.node}>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <Button
                  onClick={onReset}
                  variant="outlined"
                  color="primary"
                  className={classes.cancleButton}
                >
                  重新输入
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    const title = '请填写完整表单信息';

                    if (!Boolean(step1)) {
                      Remind(title, '需要填写完整项目信息,才可以保存。');
                      return;
                    }
                    if (!Boolean(step2)) {
                      Remind(title, '需要填写完整变更信息,才可以保存。');
                      return;
                    }
                    handleConfirm(account);
                  }}
                  className={classes.submitButton}
                >
                  保存
                </Button>
              </div>
            </Box>
          </div>
        )}
      </ConfigProvider>
    </>
  );
};
export default withRouter(({ router }) => {
  const { setParts } = useContext(LayoutPageContext);
  useEffect(() => {
    setParts(['工程管理', '新建变更']);
  }, [router.query]);
  return (
    <EngineeringContextProvider>
      <FlowContextProvider>
        <ChangeCreate />
      </FlowContextProvider>
    </EngineeringContextProvider>
  );
});
