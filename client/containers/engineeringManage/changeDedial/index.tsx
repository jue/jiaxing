import React, { useContext, useState, useEffect } from 'react';
import clsx from 'clsx';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Box, Button, Drawer, Fab } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import ArrowBack from '@material-ui/icons/ArrowBack';

import { Form, Empty, ConfigProvider, Steps, Select } from 'antd';

import { commonStyles } from '../../../styles/resetStyles';
import StepOneDedial from './StepOneDetial';
import StepTwoDetial from './StepTwoDetial';
import StepThreeDetial from './StepThreeDetial';
import StepFourDetial from './StepFourDetial';
import { AuthContext, AuthContextI } from '../../../contexts/AuthContext';
import { EngineeringContext } from '../context/EngineeringContext';
import BIMCompared from '../components/BIMCompared';
import Precess from '../components/Process';
import CommonAuditModal from '../../../components/CommonAuditModal';
import { FlowContext } from '../../../contexts/FlowContext';

import Dialog from '@material-ui/core/Dialog';
import signatureSvc from '../../../services/signatureSvc';
import StepTemplate from './StepTemplate';
import PreViewFile from '../../../components/FilePreview/temPreView';

const { Step } = Steps;

const useStyles = makeStyles(({ palette, spacing, transitions }) => {
  return createStyles({
    content: {
      height: 'calc(100% - 200px)!important',
    },

    reject: {
      height: 'calc(100% - 50px)',
    },
    form: {
      width: '100%',
      height: '100%',
      position: 'relative',
    },
    submitButton: {
      width: 106,
      height: 36,
    },
    cancleButton: {
      width: 106,
      height: 36,
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
      height: '100%',
      // overflow: 'auto',
    },
    opinion: {
      position: 'absolute',
      fontSize: 12,
      transform: 'scale(0.8)',
      color: '#FA6400',
    },
    example: {
      fontSize: 12,
      color: palette.primary.main,
      transform: 'scale(0.8)',
      marginLeft: 10,
    },
    tip: {
      width: 60,
      background: 'rgba(143,195,32,0.2)',
      borderRadius: 4,
      border: '1px solid rgba(143,195,32,1)',
      fontSize: 12,
      color: palette.primary.main,
      textAlign: 'center',
      cursor: 'pointer',
      transform: 'scale(0.8)',
    },
    select: {
      width: 160,
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
    processIcon: {
      position: 'absolute',
      right: spacing(1.5),
      top: 142,
      width: 48,
      height: 40,
      padding: spacing(1, 1.5),
      background: 'rgba(253,255,249,1)',
      boxShadow: '0px 0px 4px 0px rgba(143,194,32,1)',
      borderRadius: '100px 0px 0px 100px',
      textAlign: 'center',
      zIndex: 999999,
    },
    fab: {
      position: 'absolute',
      bottom: spacing(26),
      right: spacing(2),
      zIndex: 999999,
      backgroundColor: 'rgba(143, 195, 32, 0.2)',
      '&:hover': {
        backgroundColor: 'rgba(143, 195, 32, 0.3)',
      },
    },

    dialogTitle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 40,
      borderBottom: '1px solid rgba(217,217,217,1)',
    },
    dialogFooter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 20,
      paddingRight: 20,
    },
    dialogButton: {
      marginRight: 15,
    },
  });
});

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const ChangeDetial = ({ setOpen }) => {
  const classes = useStyles({});
  const classesReset = commonStyles({});
  const {
    engineeringInfo,
    openBIM,
    QueryEngineeringProcess,
    handleUpdate,
    setEngineeringInfo,
  } = useContext(EngineeringContext);
  const {
    flows,
    currentNode,
    queryAuditNode,
    updateAuditFlow,
    saveFiles,
    setDetailInfos,
    queryFileFillData,
  } = useContext(FlowContext);
  const { account } = useContext<AuthContextI>(AuthContext);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [step, setTep] = useState(0);
  const [customize, setCustomize] = useState({});
  const [preViewFile, setPreViewFile] = useState<any>();

  const [form] = Form.useForm();

  useEffect(() => {
    QueryEngineeringProcess(account);
  }, [account && account.company]);

  useEffect(() => {
    setDetailInfos(engineeringInfo);
  }, [engineeringInfo]);

  useEffect(() => {
    ['1', '2'].map(item => {
      queryAuditNode({
        idAuditing: engineeringInfo.idAuditing,
        queryType: item,
      });
    });
  }, [engineeringInfo.idAuditing]);

  useEffect(() => {
    let customizeI = {};
    flows.map(item => {
      if (item.bizData) {
        customizeI = { ...customizeI, ...item.bizData };
      }
    });
    setCustomize({ ...customizeI });
  }, [flows]);

  useEffect(() => {
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
          approvalId: engineeringInfo.idAuditing,
          flowData: {
            ...event.data.auditInfos,
            operatorId: account._id,
            attachments: attachments,
          },
          action: data.updateApprovalAction,
          attchmentFile: data.attchmentFile,
          _id: data._id,
          handleUpdate: handleUpdate,
        });
        setVisible(false);
        // handleUpdate(data.auditInfos.action, data.attchmentFile);
      }
      if (data.close) {
        setVisible(false);
      }
      if (data.attchment) {
        saveFiles(data.attchment, engineeringInfo);
      }
      if (data.modelFiles) {
        const file = data.modelFiles;
        queryFileFillData(
          engineeringInfo,
          file._id,
          file.originalname,
          setPreViewFile
        );
      }
    };
  }, []);

  const customizeRenderEmpty = () => (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
  );
  const [approvalOption, setApprovalOption] = useState('');
  const [openProcess, setOpenProcess] = useState(false);
  const onChange = current => {
    setTep(step);
  };

  const isOpinion = (status, opinion) => {
    setApprovalOption(`请输入${opinion}意见`);
  };

  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  interface MessageQueryI {
    approvalId: string;
    nodeId: string;
  }
  interface SignatureDataI {
    fileId: string;
    fileName: string;
  }
  const signatureRes: SignatureDataI = {
    fileName: '',
    fileId: '',
  };
  const [signatureData, setSignatureData] = useState(signatureRes);
  const [signatureVisible, setSignatureVisible] = useState(false);
  const handleAudit = async () => {
    setVisible(true);
    // if (!currentNode.electronicSignature) {
    //   // electronicSignature 有值代表需要签章
    //   const messageQuery: MessageQueryI = {
    //     approvalId: flows[0].approvalDetailId,
    //     nodeId: currentNode.nodeId,
    //   };
    //   const res = await signatureSvc.preview(messageQuery);
    //   setSignatureData(res.data);
    //   setSignatureVisible(true);
    // } else {
    //   setVisible(true);
    // }
  };

  return (
    <ConfigProvider renderEmpty={customizeRenderEmpty}>
      {openBIM ? (
        <BIMCompared />
      ) : (
        <>
          {/* <div
            className={classes.processIcon}
            onClick={() => setOpenProcess(true)}
            style={{ display: openProcess ? 'none' : 'block' }}
          >
            <ReadProcess />
          </div> */}
          <Fab
            color="secondary"
            className={classes.fab}
            onClick={() => {
              setOpen(false);
            }}
          >
            <ArrowBack />
          </Fab>

          <Form
            form={form}
            name="add-engineering"
            className={clsx(classes.form, classesReset.stepCommon)}
          >
            <div>
              <Steps
                current={step}
                onChange={() => onChange}
                direction="vertical"
                className={classes.steps}
              >
                <Step title="项目信息" description={<StepOneDedial />} />
                <Step title="变更信息" description={<StepTwoDetial />} />
                <Step title="附件上传" description={<StepThreeDetial />} />
                <Step title="表单模版下载" description={<StepTemplate />} />
                {engineeringInfo.SFGWFile &&
                  engineeringInfo.SFGWFile.length !== 0 && (
                    <Step title="相关资料" description={<StepFourDetial />} />
                  )}
              </Steps>
              <Drawer
                anchor="right"
                open={openProcess}
                onClose={() => setOpenProcess(false)}
              >
                <Precess account={account} setOpenProcess={setOpenProcess} />
              </Drawer>
            </div>
            {/* {engineeringInfo.isAuth && ( */}
            <div
              onClick={() => handleAudit()}
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                margin: '0 16px 16px 0',
              }}
            >
              <Button color="primary" variant="contained">
                {engineeringInfo.isAuth && engineeringInfo.status === 1
                  ? '审核'
                  : '查看'}
              </Button>
            </div>
            {/* )} */}
          </Form>
        </>
      )}
      <Snackbar
        open={openAlert}
        autoHideDuration={2000}
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Alert severity="error">请上传相关资料!</Alert>
      </Snackbar>
      <CommonAuditModal
        visible={visible}
        setVisible={setVisible}
        info={engineeringInfo}
      />
      {/* <Previewfile
        preViewFile={modelPreView}
        setPreViewFile={setModelPreView}
      /> */}
      {/* 模版表单预览 */}
      <PreViewFile preViewFile={preViewFile} setPreViewFile={setPreViewFile} />

      <Dialog
        aria-labelledby="customized-dialog-title"
        open={signatureVisible}
        maxWidth="md"
        fullWidth
      >
        <div className={classes.dialogTitle}>{signatureData.fileName}</div>
        <div>预览部分</div>
        <div className={classes.dialogFooter}>
          <div>审批-签字盖章（涉及表单：1/2）</div>
          <div>
            <Button
              className={classes.dialogButton}
              variant="contained"
              onClick={() => setSignatureVisible(false)}
            >
              取消
            </Button>
            <Button
              className={classes.dialogButton}
              color="primary"
              variant="contained"
            >
              发起签章
            </Button>
          </div>
        </div>
      </Dialog>
    </ConfigProvider>
  );
};
export default ChangeDetial;
