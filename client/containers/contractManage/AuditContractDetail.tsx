import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from 'next/router';
import { LayoutPageContext } from '../layout/context/LayoutPageContext';
import { Steps, Button } from 'antd';
import StepsOneDetail from './stepsDetail/StepsOneDetail';
import StepsTwoDetail from './stepsDetail/StepsTwoDetail';
import StepsThreeDetail from './stepsDetail/StepsThreeDetail';
import StepsFourDetail from './stepsDetail/StepsFourDetail';
import StepsFiveDetail from './stepsDetail/StepsFiveDetail';
import StepsSixDetail from './stepsDetail/StepsSixDetail';
import StepsSelfThreeDetail from './stepsDetail/StepsSelfThreeDetail';
import { ContractManageContext } from './context/ContractManageContext';
import { detailStyles } from './style';
import StepsContractTypeDetail from './stepsDetail/StepsContractTypeDetail';
import StepsRemunerationContractDetail from './stepsDetail/StepsRemunerationContractDetail';
import StepsSpecialTermsDetail from './stepsDetail/StepsSpecialTermsDetail';
import StepsPayeeInformationDetail from './stepsDetail/StepsPayeeInformationDetail';
import ContractSpecialTermsDetail from './stepsDetail/ContractSpecialTermsDetail';
import CommonAuditModal from '../../components/CommonAuditModal';
import { FlowContext } from '../../contexts/FlowContext';
import { AuthContextI, AuthContext } from '../../contexts/AuthContext';
import StepsModelFilesDetail from './stepsDetail/StepsModelFilesDetail';
import { commonStyles } from '../../styles/resetStyles';
import PreViewFile from '../../components/FilePreview/temPreView';

const { Step } = Steps;

function AuditContractDetail() {
  const classes = detailStyles({});
  const {
    handleContractUpdate,
    setContractStatus,
    auditContractDetail,
    setAuditContractDetail,
    query,
    setQuery,
  } = useContext(ContractManageContext);

  const {
    updateAuditFlow,
    saveFiles,
    queryAuditMap,
    setDetailInfos,
    queryFileFillData,
  } = useContext(FlowContext);

  const tendertype = auditContractDetail.tendertype;

  const { account } = useContext<AuthContextI>(AuthContext);

  const [visible, setVisible] = useState(false);

  const [preViewFile, setPreViewFile] = useState<any>();

  const classesReset = commonStyles({});

  useEffect(() => {
    setContractStatus('pass');
  }, []);

  const doing = auditContractDetail.status === 'doing';
  const done = auditContractDetail.status === 'done';
  const noAuth = auditContractDetail.isAuth;
  const reject = auditContractDetail.status === 'reject';

  const backToTable = () => {
    setAuditContractDetail({});
    setQuery({ ...query, page: 0 });
  };

  useEffect(() => {
    // if (JSON.stringify(contractDetail) === '{}') {
    //   handleQuery({ _id });
    //   // setDetailInfos(hiddenDangerSubject);
    // }
    queryAuditMap(auditContractDetail, 'CONTRACT_MANAGE');
    // if (hiddenDangerSubject) {
    //接受子级返回的值
    window.onmessage = function(event) {
      const data = event.data;
      let attachments = [];
      if (data.attchmentFile) {
        data.attchmentFile.map(file => {
          attachments.push({
            typeId: file.attachmentType,
            attachmentId: file.resourceId,
          });
        });
      }
      if (data.update) {
        updateAuditFlow({
          approvalId: auditContractDetail.idAuditing,
          flowData: {
            ...event.data.auditInfos,
            operatorId: account._id,
            attachments: attachments,
          },
          action: data.updateApprovalAction,
          attchmentFile: data.attchmentFile,
          _id: data._id,
          handleUpdate: handleContractUpdate,
        });
        setVisible(false);
      }
      if (data.close) {
        setVisible(false);
      }
      if (data.attchment) {
        saveFiles(data.attchment, auditContractDetail);
      }
      if (data.modelFiles) {
        const file = data.modelFiles;
        queryFileFillData(
          auditContractDetail,
          file._id,
          file.originalname,
          setPreViewFile
        );
      }
    };

    setDetailInfos(auditContractDetail);
  }, [auditContractDetail]);

  return (
    <div className={classes.contanier}>
      <div className={classesReset.stepCommon}>
        <Steps direction="vertical" current={10}>
          <StepsContractTypeDetail />
          {auditContractDetail.tendertype !== 'public' &&
            auditContractDetail.contractType !== 'other' && (
              <Step title="项目概况" description={<StepsOneDetail />} />
            )}
          <Step title="合同基本信息" description={<StepsTwoDetail />} />
          {auditContractDetail.contractType === 'construction' && (
            <Step title="合同工期" description={<StepsThreeDetail />} />
          )}
          {auditContractDetail.contractType === 'construction' && (
            <Step title="签约合同价" description={<StepsFourDetail />} />
          )}
          {auditContractDetail.contractType === 'supervision' && (
            <Step
              title="酬金合同价"
              description={<StepsRemunerationContractDetail />}
            />
          )}
          {(auditContractDetail.contractType === 'other' ||
            tendertype === 'private') && (
            <Step title="签约合同价" description={<StepsSelfThreeDetail />} />
          )}
          <Step title="支付条款" description={<StepsFiveDetail />} />
          <Step title="专用条款" description={<StepsSpecialTermsDetail />} />
          <Step
            title="收款人信息"
            description={<StepsPayeeInformationDetail />}
          />
          <Step title="附件信息" description={<StepsSixDetail />} />
          {auditContractDetail.modelFile &&
            auditContractDetail.modelFile.length && (
              <Step title="资料" description={<StepsModelFilesDetail />} />
            )}
        </Steps>
      </div>
      <div style={{ height: 161 }} />
      <div
        className={classes.node}
        style={{
          height: done || !noAuth ? 100 : doing ? 160 : 120,
        }}
      >
        <div className="btn-group">
          <Button
            className="creat"
            onClick={() => setVisible(true)}
            style={{ marginTop: noAuth ? 0 : 15, marginRight: 20 }}
          >
            {auditContractDetail.isAuth ? '审批' : '查看审批流'}
          </Button>
          <Button
            className="creat"
            onClick={backToTable}
            style={{ marginTop: noAuth ? 0 : 15 }}
          >
            确定
          </Button>

          <CommonAuditModal
            visible={visible}
            setVisible={setVisible}
            info={auditContractDetail}
          />
          {/* 模版表单预览 */}
          <PreViewFile
            preViewFile={preViewFile}
            setPreViewFile={setPreViewFile}
          />
        </div>
      </div>
    </div>
  );
}

function Content() {
  const { openTermsComparison, specialTerms } = useContext(
    ContractManageContext
  );

  return (
    <>
      {!openTermsComparison && !specialTerms && <AuditContractDetail />}
      {/* {openTermsComparison && !specialTerms && <TermsComparisonView />} */}
      {specialTerms && <ContractSpecialTermsDetail />}
    </>
  );
}

export default withRouter(({ router }) => {
  const { setParts } = useContext(LayoutPageContext);

  useEffect(() => {
    setParts(['合同管理', '查看合同']);
  }, [router.query]);

  return <Content />;
});
