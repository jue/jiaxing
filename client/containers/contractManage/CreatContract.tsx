import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from 'next/router';
import { Steps, Button, Select } from 'antd';
import StepsOne from './steps/StepsOne';
import StepsTwo from './steps/StepsTwo';
import StepsThree from './steps/StepsThree';
import StepsFour from './steps/StepsFour';
import StepsFive from './steps/StepsFive';
import StepsSix from './steps/StepsSix';
import StepsSelfTwo from './steps/StepsSelfTwo';
import StepsSelfThree from './steps/StepsSelfThree';
import StepsContractType from './steps/StepsContractType';
import StepsSpecialTerms from './steps/StepsSpecialTerms';
import StepsRemunerationContract from './steps/StepsRemunerationContract';
import StepsPayeeInformation from './steps/StepsPayeeInformation';
import ContractManageContextProvider, {
  ContractManageContext,
  defaultContext,
} from './context/ContractManageContext';
import ReactTabs, { ReactTab } from './compontents/MuiTabs';
// import TermsComparison from './compontents/TermsComparison';
// import DesignDetailBack from '../../../components/Svgs/DesignDetailBack';
import Remind from './compontents/ContractRemindModel';
import { acceptanceStyles } from './style';
import ContractSpecialTerms from './ContractSpecialTerms';
import FlowContextProvider, { FlowContext } from '../../contexts/FlowContext';
import contractSvc from '../../services/ContractSvc';
import { LayoutPageContext } from '../layout/context/LayoutPageContext';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    createContract: {
      '& .ant-input:focus, .ant-input-focused': {
        borderColor: '#8fc220 !important',
        outline: 0,
        WebkitBoxShadow: 'none !important',
        boxShadow: 'none !important',
      },
      '& .ant-input:hover': {
        borderColor: '#8fc220 !important',
      },
      '& .ant-select:not(.ant-select-disabled):hover .ant-select-selector': {
        borderColor: '#8fc220 !important',
      },
      '& .ant-select-focused.ant-select-single:not(.ant-select-customize-input) .ant-select-selector': {
        WebkitBoxShadow: 'none !important',
        boxShadow: 'none !important',
        borderColor: '#8fc220 !important',
      },
    },
  });
});

const { Step } = Steps;
const { Option } = Select;
interface OptionData {
  children: string;
  key: string;
  value: string;
}

function CreatedSuccessPopver() {
  const classes = acceptanceStyles({});
  const { successsPopver } = useContext(ContractManageContext);
  return (
    <>
      {successsPopver && (
        <div className={classes.popver}>
          <div>
            <img src="/static/images/created_success.png" />
          </div>
          <div>合同创建成功</div>
        </div>
      )}
    </>
  );
}

function StepsContanier() {
  const classes = acceptanceStyles({});
  const useClasses = useStyles({});
  const {
    handleContractCreate,
    setFfileLists,
    query,
    setQuery,
    setContractStatus,
    contractMsg,
    setContractMsg,
    nextContractAuditing,
    nextNode,
    setNextNode,
    tabIndex,
    setTabIndex,
    setEngiName,
    handleHistoryCreate,
    handleHistorySearch,
  } = useContext(ContractManageContext);

  const { queryTask } = useContext(FlowContext);
  const [current, setCurrent] = useState<number>(0);
  const [visible, setVisible] = useState(false);
  const type = {
    0: 'public',
    1: 'private',
  };

  useEffect(() => {
    setContractStatus('create');
    setQuery({ ...query, tendertype: type[tabIndex] });
    queryTask('CONTRACT_MANAGE');
    handleHistorySearch(type[tabIndex]);
  }, [tabIndex]);

  const tabQueryHistory = tabIndex => {
    contractSvc.historySearch().then(data => {
      if (data.code === 200) {
        if (data.data) {
          if (
            (data.data.tendertype === 'public' && tabIndex === 0) ||
            (data.data.tendertype === 'private' && tabIndex === 1)
          ) {
            setContractMsg(data.data);
          } else if (tabIndex === 0 && data.data.tendertype === 'private') {
            setContractMsg({ ...defaultContext.contractMsg });
          } else if (tabIndex === 1 && data.data.tendertype === 'public') {
            setContractMsg({
              ...defaultContext.contractMsg,
              contractType: 'other',
            });
          }
        }
      }
    });
  };

  const is_steps_one = contractMsg && contractMsg.contractType;

  useEffect(() => {}, [contractMsg]);

  const title = '请填写完整表单信息';
  const content = '需要填写完整信息列表以及处理人,才可以保存。';

  return (
    <div className={clsx([classes.contanier])}>
      <ReactTabs
        value={tabIndex}
        onChange={(_, value) => {
          setTabIndex(value);
          setCurrent(0);
          setEngiName('');
          // setEngineeringsToolbar({
          //   ...engineeringsToolbar,
          //   engineering: { name: '', id: '' },
          // });
          tabQueryHistory(value);
        }}
        style={{ alignItems: 'center' }}
      >
        <ReactTab label="公开招标" style={{ minWidth: 100 }} />
        <ReactTab label="自行采购" style={{ minWidth: 100, marginLeft: 32 }} />
      </ReactTabs>
      <div>
        {/* <Steps direction="vertical" current={current}> */}
        <StepsContractType />

        <Steps direction="vertical" current={-1}>
          {/* {tabIndex === 0 && <Step description={<StepsContractType />} />} */}
          {contractMsg &&
            contractMsg.contractType !== 'other' &&
            tabIndex === 0 && (
              <Step
                title="项目概况"
                description={
                  <StepsOne visible={visible} setVisible={setVisible} />
                }
              />
            )}
          <Step
            title="合同基本信息"
            description={
              tabIndex === 0 && contractMsg.contractType !== 'other' ? (
                <StepsTwo />
              ) : (
                <StepsSelfTwo />
              )
            }
          />
          {contractMsg && contractMsg.contractType === 'construction' && (
            <Step title="合同工期" description={<StepsThree />} />
          )}
          {contractMsg && contractMsg.contractType === 'construction' && (
            <Step title="签约合同价" description={<StepsFour />} />
          )}
          {contractMsg && contractMsg.contractType === 'supervision' && (
            <Step
              title="酬金合同价"
              description={<StepsRemunerationContract />}
            />
          )}
          {((contractMsg && contractMsg.contractType === 'other') ||
            tabIndex === 1) && (
            <Step title="签约合同价" description={<StepsSelfThree />} />
          )}

          <Step title="支付条款" description={<StepsFive />} />
          <Step title="专用条款" description={<StepsSpecialTerms />} />
          <Step title="收款人信息" description={<StepsPayeeInformation />} />
          <Step title="附件信息" description={<StepsSix />} />
        </Steps>
      </div>
      <div style={{ height: 100 }} />
      <div className={classes.node}>
        <div className="btn-group">
          {/* <Button
            className="reset"
            onClick={() => {
              setContractMsg({ ...defaultContext.contractMsg });
              setFfileLists([]);
              setEngineeringsToolbar({
                ...engineeringsToolbar,
                engineering: { name: '', id: '' },
              });
              setCurrent(0);
              setEngiName('');
            }}
          >
            重新输入
          </Button> */}
          {contractMsg.contractType === 'construction' && tabIndex === 0 && (
            <button
              className="creat"
              style={{
                marginRight: 10,
                background: '#d9d9d9',
                border: 'none',
                borderRadius: 4,
                color: '#fff',
              }}
            >
              模型查看
            </button>
          )}
          <Button
            className="creat"
            onClick={() => {
              handleHistoryCreate();
            }}
            style={{ marginRight: 10 }}
          >
            暂存
          </Button>
          <Button
            className="creat"
            onClick={() => {
              // if (!Boolean(tabIndex)) {
              //   if (
              //     !Boolean(
              //       is_steps_one &&
              //         contractMsg.contractTime &&
              //         contractMsg.planStartTime &&
              //         contractMsg.projectApprovalNumber &&
              //         contractMsg.projectSite &&
              //         contractMsg.capitalSource &&
              //         contractMsg.biddingPrice &&
              //         contractMsg.partyA &&
              //         contractMsg.partyB &&
              //         contractMsg.amount &&
              //         nextNode.idExecutive
              //     )
              //   ) {
              //     Remind(title, content);
              //     return;
              //   }
              // } else {
              //   if (
              //     !Boolean(
              //       is_steps_one &&
              //         contractMsg.partyA &&
              //         contractMsg.partyB &&
              //         contractMsg.partyALegalPerson &&
              //         contractMsg.partyBLegalPerson &&
              //         contractMsg.sitePlace &&
              //         contractMsg.amount &&
              //         contractMsg.termsPayment &&
              //         contractMsg.deliveryTime &&
              //         contractMsg.capitalSource &&
              //         nextNode.idExecutive
              //     )
              //   ) {
              //     Remind(title, content);
              //     return;
              //   }
              // }

              handleContractCreate(nextContractAuditing.nextState);
            }}
          >
            确定创建
          </Button>
        </div>
      </div>
    </div>
  );
}

function Contract() {
  const {
    openTermsComparison,
    setOpenTermsComparison,
    contractMsg,
    setContractMsg,
    setEngiName,
    engiName,
    specialTerms,
  } = useContext(ContractManageContext);

  const classes = acceptanceStyles({});

  return (
    <>
      {/* {!openTermsComparison && <TitleCommon title="合同创建" content="" />} */}
      {openTermsComparison && (
        <div className={classes.title}>
          <div
            onClick={() => {
              setOpenTermsComparison(false);
              setContractMsg({
                ...contractMsg,
                exclusiveTerms: [...contractMsg.exclusiveTerms],
              });
              setEngiName(engiName);
              // setEngineeringsToolbar({
              //   ...engineeringsToolbar,
              //   engineering: {
              //     name: engiName || engineeringsToolbar.engineering.name,
              //     _id:
              //       contractMsg.idEngineering ||
              //       engineeringsToolbar.engineering._id,
              //   },
              // });
            }}
          >
            {/* <DesignDetailBack /> */}
          </div>
          {/* <TitleCommon title="合同创建" content="" /> */}
        </div>
      )}

      {!openTermsComparison && (
        <>
          <StepsContanier />
          <CreatedSuccessPopver />
        </>
      )}
      {/* {openTermsComparison && <TermsComparison />} */}
    </>
  );
}

function ContractContanier() {
  const { specialTerms } = useContext(ContractManageContext);
  const useClasses = useStyles({});

  return (
    <div className={useClasses.createContract}>
      {!specialTerms ? <Contract /> : <ContractSpecialTerms />}
    </div>
  );
}

export default withRouter(({ router }) => {
  const { setParts } = useContext(LayoutPageContext);

  useEffect(() => {
    setParts(['合同管理', '合同创建']);
  }, [router.query]);

  return (
    <ContractManageContextProvider>
      <FlowContextProvider>
        <ContractContanier />
      </FlowContextProvider>
    </ContractManageContextProvider>
  );
});
