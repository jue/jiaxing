import { useContext, useEffect, useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Button, Box, Typography } from '@material-ui/core';
import { useRouter, withRouter } from 'next/router';
import clsx from 'clsx';

import HiddenDangerSunject from './Subject';
import HiddenDangerProblem from './Problem';
import { inspectStyles } from '../../../../styles/resetStyles';
import { HiddenDangerContext } from '../../context/HiddenDangerContext';
import { FlowContext } from '../../../../contexts/FlowContext';
import { AuthContextI, AuthContext } from '../../../../contexts/AuthContext';
import CommonAuditModal from '../../../../components/CommonAuditModal';
import flowSvc from '../../../../services/flowSvc';
import { message } from 'antd';
import PreViewFile from '../../../../components/FilePreview/temPreView';

const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
    dangerContanier: {
      position: 'relative',
    },
    submitButton: {
      width: 88,
    },
    cancleButton: {
      width: 88,
      marginRight: spacing(8),
      '& .MuiButton-label': {
        color: 'rgba(0,0,0,0.3)',
      },
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'flex-end',
      position: 'absolute',
      bottom: 16,
      right: 16,
      // width: '100%',
      // backgroundColor: '#fff',
      paddingTop: 20,
      '& button': { width: 88 },
      '& .MuiButton-label': {
        fontSize: 14,
        fontWeight: 400,
      },
    },
  })
);
const ViewPage = () => {
  const classes = useStyles({});
  const router = useRouter();
  const { action, _id } = router.query;

  const {
    hiddenDangerSubject,
    handleQuery,
    handleUpdateQuality,
    handleReply,
    hiddenDangerProblem,
  } = useContext(HiddenDangerContext);
  const {
    updateAuditFlow,
    saveFiles,
    queryAuditMap,
    setDetailInfos,
    currentNode,
    queryFileFillData,
  } = useContext(FlowContext);
  const { account } = useContext<AuthContextI>(AuthContext);
  const classesReset = inspectStyles({});
  const [visible, setVisible] = useState(false);
  const [preViewFile, setPreViewFile] = useState<any>();

  useEffect(() => {
    handleQuery({ _id });
  }, []);

  useEffect(() => {
    // if (JSON.stringify(hiddenDangerSubject) === '{}') {
    //   handleQuery({ _id });
    // }
    queryAuditMap(hiddenDangerSubject, 'SECURITY_RISK');

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
          approvalId: hiddenDangerSubject.idAuditing,
          flowData: {
            ...event.data.auditInfos,
            operatorId: account._id,
            attachments: attachments,
          },
          action: data.updateApprovalAction,
          attchmentFile: data.attchmentFile,
          _id: data._id,
          handleUpdate: handleUpdateQuality,
        });
        setVisible(false);
      }
      if (data.close) {
        setVisible(false);
      }
      if (data.attchment) {
        saveFiles(data.attchment, hiddenDangerSubject);
      }
      if (data.modelFiles) {
        const file = data.modelFiles;
        queryFileFillData(
          hiddenDangerSubject,
          file._id,
          file.originalname,
          setPreViewFile
        );
      }
    };
    // }
    setDetailInfos(hiddenDangerSubject);
  }, [hiddenDangerSubject]);
  const FlowUpload = ({ approvalId, flowData, handleUpdate }) => {
    flowSvc
      .update({ approvalId, flowData })
      .then(data => {
        if (data.code === 200) {
          const status = data.data.approvalStatus;
          handleUpdate(status, _id);
          message.info('审批成功！');
        }
      })
      .catch(() => console.log('审批失败！'));
  };

  return (
    <Box className={clsx([classes.dangerContanier, 'container'])}>
      <Typography variant="h6">
        <img
          src="/static/images/titleIcon.png"
          style={{ width: 20, marginBottom: 4, marginRight: 4 }}
        />
        隐患排查详情
      </Typography>

      <Box className={classesReset.createdInspectionPlan} mb={6}>
        <HiddenDangerSunject />
        <HiddenDangerProblem />
      </Box>

      <Box className={classes.buttonGroup}>
        <Button
          variant="outlined"
          onClick={() => {
            // handleQuery();
            router.push('/safety/hiddenDanger');
            setDetailInfos({});
          }}
          className={classes.cancleButton}
        >
          取消
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            const checkoutItem = hiddenDangerProblem.filter(
              item => item.replyContent === ''
            );

            if (
              account &&
              hiddenDangerSubject.accountExecutor &&
              account.company._id ===
                hiddenDangerSubject.accountExecutor.company._id &&
              checkoutItem.length !== 0
            ) {
              return message.error(`请回复所有问题项`);
            }
            account &&
            account.company._id ===
              hiddenDangerSubject.accountExecutor.company._id
              ? FlowUpload({
                  approvalId: hiddenDangerSubject.idAuditing,
                  flowData: {
                    action: 'pass',
                    operatorId: account._id,
                    nodeId: currentNode.nodeId,
                  },
                  handleUpdate: handleReply(status, _id),
                })
              : setVisible(true);
          }}
          className={classes.submitButton}
        >
          {hiddenDangerSubject.isAuth
            ? account.company &&
              hiddenDangerSubject.accountExecutor &&
              account.company._id ===
                hiddenDangerSubject.accountExecutor.company._id
              ? '回复'
              : '审批'
            : '查看'}
        </Button>
      </Box>
      <CommonAuditModal
        visible={visible}
        setVisible={setVisible}
        info={hiddenDangerSubject}
      />
      <PreViewFile preViewFile={preViewFile} setPreViewFile={setPreViewFile} />
    </Box>
  );
};
export default ViewPage;
