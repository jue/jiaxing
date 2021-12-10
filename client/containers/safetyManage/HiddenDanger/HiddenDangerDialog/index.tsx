import React, { useState, useContext } from 'react';
import shortid from 'shortid';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import { InputLabel, Grid, Button, Box, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Badge } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import { HiddenDangerContext } from '../../context/HiddenDangerContext';
import AntdDialog from '../../../../components/AntdDialog';
import Dropzone from '../../../../components/Dropzone/DropzoneUploadContainer';
import FormFiled from '../../../../components/FormFiled';
import { OutlineInput } from '../../../../styles/resetStylesV2';
import { CreateQualityInspectionDesc } from '../../../../../constants/enums';
import VedioImgCreateFile from '../../../../components/VedioImgCreateFile';
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
      width: '80%',
      marginBottom: spacing(2.5),
    },
    button: {
      width: 100,
      marginBottom: spacing(1),
      display: 'flex',
      flexDirection: 'row',
      border: '1px dashed rgba(143, 194, 32, 0.5)',
      '& .MuiButton-label': {
        fontWeight: 400,
        color: palette.primary.main,
        fontSize: 12,
        flexDirection: 'column',
      },
    },
    buttonGroup: {
      textAlign: 'center',
      '& button': {
        width: 88,
        height: 34,
        boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.1)',
      },
      '& button:nth-of-type(1)': {
        marginRight: 60,
        '& .MuiButton-label': {
          fontWeight: 400,
          color: 'rgba(0,0,0,0.3)',
        },
      },
    },
    img: {
      width: '90%',
      height: 56,
      borderRadius: 4,
      margin: 3,
    },
    closeCiycleIcon: {
      color: '#FF7474',
      width: 14,
      height: 14,
    },

    inputLabel: {
      color: 'rgba(0,0,0,0.45)',
      fontSize: 14,
      lineHeight: '32px',
      width: spacing(10),
      textAlign: 'right',
    },
  })
);
const HiddenDangerDialog = ({ hiddenDialog, setHiddenDialog }) => {
  const {
    hiddenDangerProblem,
    setHiddenDangerProblem,
    problemData,
    setProblemData,
    saveFiles,
    relusTrue,
    setRelusTrue,
  } = useContext(HiddenDangerContext);

  const classes = useStyles({});

  return (
    <AntdDialog
      visible={Boolean(hiddenDialog)}
      hasClose={true}
      dialogTitle={<p className={classes.title}>添加问题项</p>}
      hasFooter={false}
      onClose={() => setHiddenDialog('')}
      onConfirm
      width={534}
    >
      <Box position="relative">
        <FormFiled
          classes={classes.formControl}
          title="问题说明"
          type={
            <OutlineInput
              style={{ marginLeft: 80 }}
              id="problemData-name"
              value={problemData.name || ''}
              placeholder="请输入问题说明"
              onChange={(e) => {
                const { value } = e.target;
                setProblemData({
                  ...problemData,
                  name: value,
                });
                if (value === '') {
                  setRelusTrue({
                    ...relusTrue,
                    problemName: CreateQualityInspectionDesc.ProblemName,
                  });
                } else {
                  setRelusTrue({ ...relusTrue, problemName: '' });
                }
              }}
            />
          }
          relusRequired={relusTrue.problemName}
          createRelus={CreateQualityInspectionDesc.ProblemName}
        />
      </Box>
      <Box position="relative">
        <FormFiled
          classes={classes.formControl}
          title="整改意见"
          type={
            <OutlineInput
              multiline
              rows={4}
              style={{ marginLeft: 80 }}
              id="problemData-remark"
              value={problemData.remark || ''}
              onChange={(e) => {
                const { value } = e.target;
                setProblemData({
                  ...problemData,
                  remark: value,
                });
                if (value === '') {
                  setRelusTrue({
                    ...relusTrue,
                    remark: CreateQualityInspectionDesc.Remark,
                  });
                } else {
                  setRelusTrue({ ...relusTrue, remark: '' });
                }
              }}
              placeholder="请输入整改意见"
            />
          }
          relusRequired={relusTrue.remark}
          createRelus={CreateQualityInspectionDesc.Remark}
        />
      </Box>
      <Box mb={5} display="flex">
        <InputLabel shrink htmlFor="end-files" className={classes.inputLabel}>
          上传附件
        </InputLabel>
        <Dropzone
          files={[]}
          setFiles={(files) => {
            saveFiles('problem', files, '1');
          }}
          accept="image/jpg,image/png,video/*"
          maxSize={10}
        >
          <Button
            className={classes.button}
            size="small"
            variant="outlined"
            color="primary"
          >
            <AddIcon style={{ color: '#8FC220' }} />
            上传图片
          </Button>
          <Typography style={{ marginLeft: 5, fontSize: 12 }}>
            支持PNG、JPG
          </Typography>
        </Dropzone>
      </Box>
      <Box
        ml={10}
        display="flex"
        style={{
          flexWrap: 'wrap',
        }}
      >
        {Boolean(problemData.nodeFiles && problemData.nodeFiles.length) &&
          problemData.nodeFiles.map((item) => (
            <VedioImgCreateFile
              list={item}
              classes={classes}
              info={problemData.nodeFiles}
              onClick={(replyFiles) =>
                setProblemData({
                  ...problemData,
                  nodeFiles: replyFiles,
                })
              }
            />
          ))}
      </Box>

      <Grid className={classes.buttonGroup}>
        <Button
          onClick={() => {
            setHiddenDialog('');
          }}
        >
          取消
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            let newRelusTrue: any = relusTrue;

            if (!problemData.name || !problemData.remark) {
              if (!problemData.name) {
                newRelusTrue.problemName =
                  CreateQualityInspectionDesc.ProblemName;
              }
              if (!problemData.remark) {
                newRelusTrue.remark = CreateQualityInspectionDesc.Remark;
              }
              setRelusTrue({ ...relusTrue, ...newRelusTrue });

              return;
            }
            const idProblem = shortid.generate();
            const _id = problemData._id || shortid.generate();
            let newHiddenDangerProblem = JSON.parse(
              JSON.stringify(hiddenDangerProblem)
            );

            if (hiddenDialog === 'edit') {
              newHiddenDangerProblem.map((item, index) => {
                if (item._id === problemData._id) {
                  newHiddenDangerProblem[index] = problemData;
                }
              });
              setHiddenDangerProblem([...newHiddenDangerProblem]);
            } else {
              setHiddenDangerProblem([
                ...hiddenDangerProblem,
                { ...problemData, _id: idProblem },
              ]);
            }
            setHiddenDialog('');
            setProblemData({});
          }}
        >
          确认
        </Button>
      </Grid>
    </AntdDialog>
  );
};
export default HiddenDangerDialog;
