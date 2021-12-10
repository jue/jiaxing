import React, { useContext, useState, useEffect } from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Grid, Button, Box, FormControl } from '@material-ui/core';

import { ConstructionContext } from '../../context/ConstructionContext';
import AntdDialog from '../../../../components/AntdDialog';
import FileList from '../../../../components/FilePreview/FileLists';

import { SchemeTypeDesc } from '../../../../../constants/enums';
import CommonAuditModal from '../../../../components/CommonAuditModal';
import { FlowContext } from '../../../../contexts/FlowContext';
import { AuthContextI, AuthContext } from '../../../../contexts/AuthContext';
import PreViewFile from '../../../../components/FilePreview/temPreView';

const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
    title: {
      fontSize: 16,
      fontFamily: 'PingFangSC-Medium,PingFang SC',
      fontWeight: 500,
      color: 'rgba(0,0,0,0.85)',
      borderBottom: '1px solid rgba(0,0,0,0.09)',
      paddingBottom: spacing(2),
    },
    formControl: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: spacing(2.5),
    },
    button: {
      width: 106,
      marginBottom: spacing(1),
      marginLeft: spacing(14),
      border: '1px dashed rgba(143, 194, 32, 0.5)',
      '& .MuiButton-label': {
        fontWeight: 400,
        color: palette.primary.main,
      },
    },
    buttonGroup: {
      marginTop: spacing(6),
      textAlign: 'right',
      '& button': {
        width: 65,
        height: 32,
        boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.1)',
      },
      '& button:nth-of-type(1)': {
        marginRight: spacing(2),
        '& .MuiButton-label': {
          fontWeight: 400,
          color: 'rgba(0,0,0,0.3)',
        },
      },
    },

    inputLabel: {
      color: 'rgba(0,0,0,0.45)',
      // fontSize: 14,
      // lineHeight: '32px',
      width: spacing(14),
      textAlign: 'right',
    },
  })
);
const ConstructionView = ({ open, setOpen, taskInfos }) => {
  const { account } = useContext<AuthContextI>(AuthContext);

  const { constructionInfo, setConstructionInfo, handleUpdate } = useContext(
    ConstructionContext
  );
  const classes = useStyles({});
  const [visible, setVisible] = useState(false);
  const [preViewFile, setPreViewFile] = useState<any>();

  const {
    updateAuditFlow,
    saveFiles,
    setDetailInfos,
    queryFileFillData,
  } = useContext(FlowContext);

  useEffect(() => {
    // if (constructionInfo) {
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
          approvalId: constructionInfo.idAuditing,
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
      }
      if (data.close) {
        setVisible(false);
      }
      if (data.attchment) {
        saveFiles(data.attchment, constructionInfo);
      }
      if (data.modelFiles) {
        const file = data.modelFiles;
        queryFileFillData(
          constructionInfo,
          file._id,
          file.originalname,
          setPreViewFile
        );
      }
    };
    setDetailInfos(constructionInfo);
  }, [constructionInfo]);
  useEffect(() => {
    Boolean(visible === false) && setOpen(false);
  }, [visible]);

  return (
    <AntdDialog
      visible={open}
      hasClose={true}
      dialogTitle={<p className={classes.title}>施工方案</p>}
      hasFooter={false}
      onClose={() => {
        setOpen(false);
        setConstructionInfo({});
      }}
      onConfirm
      width={600}
    >
      <FormControl className={classes.formControl}>
        <Box className={classes.inputLabel}>施工方案名称：</Box>
        <Box>{constructionInfo.name}</Box>
      </FormControl>

      <FormControl className={classes.formControl} style={{ width: '100%' }}>
        <Box className={classes.inputLabel}>方案类型：</Box>
        <Box>{SchemeTypeDesc[constructionInfo.type]}</Box>
      </FormControl>

      <FormControl className={classes.formControl}>
        <Box className={classes.inputLabel}>所属项目：</Box>
        <Box>{constructionInfo.projectName}</Box>
      </FormControl>
      {/* <FormControl className={classes.formControl}>
        <Box className={classes.inputLabel}>项目负责人：</Box>
        <Box>{constructionInfo.projectName}</Box>
      </FormControl> */}
      <FormControl className={classes.formControl}>
        <Box className={classes.inputLabel}>创建人：</Box>
        <Box>
          {constructionInfo.account && constructionInfo.account.userName}
        </Box>
      </FormControl>
      {taskInfos.attachmentTypes &&
        taskInfos.attachmentTypes.map(item => {
          // window.localStorage.setItem('attachmentType', item.attachmentType);
          return (
            <React.Fragment key={item}>
              <Box display="flex" mb={2}>
                <Box className={classes.inputLabel}>
                  {item.attachmentName}：
                </Box>
                <Box flex="1" display="flex" flexDirection="column">
                  {constructionInfo.nodeFiles &&
                    constructionInfo.nodeFiles.length !== 0 && (
                      <FileList
                        list={constructionInfo.nodeFiles}
                        type="view"
                        info={constructionInfo}
                        setInfo={setConstructionInfo}
                        typeForm={item}
                      />
                    )}
                </Box>
              </Box>
            </React.Fragment>
          );
        })}
      {/* <FormControl className={classes.formControl}>
        <Box className={classes.inputLabel}>表单模版下载：</Box>
        {constructionInfo.modelFile &&
          constructionInfo.modelFile.map((file) => (
            <Box
              onClick={() => {
                setModelFiles(file);
                setIframeTemSrc(constructionInfo);
              }}
            >
              {file.bizFormName}
            </Box>
          ))}
      </FormControl> */}

      <PreViewFile preViewFile={preViewFile} setPreViewFile={setPreViewFile} />

      <Grid className={classes.buttonGroup}>
        <Button
          onClick={() => {
            setOpen(false);
            setConstructionInfo({});
          }}
        >
          取消
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            // setOpen(false);
            setVisible(true);
            // setConstructionInfo({});

            // if (url.includes(testJxUrl)) {
            //   setIframeUrl(testGAUrl);
            // } else if (url.includes(prodJxUrl)) {
            //   setIframeUrl(prodGAUrl);
            // } else {
            //   setIframeUrl('http://localhost:3003');
            // }
            // // setIframeUrl('http://localhost:3003');
          }}
        >
          {constructionInfo.isAuth ? '审批' : '查看'}
        </Button>
      </Grid>
      <CommonAuditModal
        visible={visible}
        setVisible={setVisible}
        info={constructionInfo}
      />
    </AntdDialog>
  );
};
export default ConstructionView;
