import React, { useState, useContext, useEffect } from 'react';
import shortid from 'shortid';
import moment from 'moment';
import { useRouter } from 'next/router';
import clsx from 'clsx';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  FormControl,
  InputLabel,
  InputAdornment,
  Grid,
  Input,
  Button,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';

import AntdDialog from '../../../../components/AntdDialog';
import { UnderlineInput } from '../../../../components/Input/UnderlineInput';
import { InspectReportContext } from '../../context/InspectReportContext';
import Datepicker from '../../../../components/Datepicker';
import { InspectPlanStatusContext } from '../../context/InspectPlanStatusContext';
import { AuthContext, AuthContextI } from '../../../../contexts/AuthContext';
import inspectTaskSvc from '../../../../services/InspectTaskSvc';

import { Select } from 'antd';

const { Option } = Select;

const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
    title: {
      fontSize: 24,
      fontFamily: 'PingFangSC-Medium,PingFang SC',
      fontWeight: 500,
      color: 'rgba(0,0,0,0.8)',
      lineHeight: '33px',
      textAlign: 'center',
    },
    formControl: {
      width: '100%',
      marginBottom: 20,
    },
    select: {
      width: '100%',
      borderBottom: '1px solid #b2b2b2',
      marginTop: 1,
    },
    idCCSelect: {
      marginTop: spacing(2),
    },
    gridDatePicker: {
      '& .ant-picker': {
        width: '100%',
      },
      '& .ant-picker.ant-picker-borderless': {
        borderBottom: '1px solid #b2b2b2 !important',
      },
    },
    button: {
      width: 100,
      height: 34,
      borderRadius: 4,
      border: '1px solid rgba(143,194,32,1)',

      '& .MuiButton-label': {
        fontWeight: 400,
        color: '#555',
        fontSize: 14,
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
    required: {
      color: '#FF3B30',
      marginLeft: 5,
    },
  })
);
const RectificationDialog = () => {
  const {
    inspectRectification,
    setInspectRectifition,
    setInspectReportCreated,
    inspectReportCreated,
    handleUpdateRectification,
    inspectTaskInfos,
    getTaskList,
  } = useContext(InspectReportContext);
  const { rectificationDialog, setRectificationDialog } = useContext(
    InspectPlanStatusContext
  );

  const router = useRouter();
  const { action } = router.query as {
    action: 'create' | 'edit' | 'view';
  };
  const { _id } = router.query as { _id: string };
  const { account } = useContext<AuthContextI>(AuthContext);

  const classes = useStyles({});

  return (
    <AntdDialog
      visible={Boolean(rectificationDialog)}
      hasClose={true}
      dialogTitle={
        <p className={classes.title}>
          {rectificationDialog === 'created' ? '新增' : '编辑'}整改安排
        </p>
      }
      hasFooter={false}
      onClose={() => setRectificationDialog('')}
      onConfirm
      width={820}
    >
      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="rectification-name">
          整改任务名称
          <span className={classes.required}>*</span>
        </InputLabel>
        <UnderlineInput
          value={inspectRectification?.name || ''}
          placeholder="请输入整改任务"
          endAdornment={
            <InputAdornment position="end" onClick={() => {}}>
              <CancelIcon
                aria-label="toggle password visibility"
                color="primary"
              />
            </InputAdornment>
          }
          onChange={(e) => {
            const { value } = e.target;
            setInspectRectifition({
              ...inspectRectification,
              name: value,
            });
          }}
        />
      </FormControl>

      <Grid container className={classes.formControl}>
        <Grid item md={5}>
          <InputLabel shrink htmlFor="rectification-result">
            整改执行人
            <span className={classes.required}>*</span>
          </InputLabel>
          <Select
            id="rectification-result"
            className={classes.select}
            bordered={null}
            value={inspectRectification?.idExecutive || ''}
            placeholder="请选择整改执行人"
            onChange={(value) => {
              setInspectRectifition({
                ...inspectRectification,
                idExecutive: value,
              });
            }}
          >
            <Option value="loudanru">罗丹茹</Option>
          </Select>
        </Grid>
        <Grid item md={2} />
        <Grid item md={5} className={classes.gridDatePicker}>
          <InputLabel shrink htmlFor="rectification-remark">
            截止日期
            <span className={classes.required}>*</span>
          </InputLabel>
          <Datepicker
            data-subject-picker="start-time"
            bordered={false}
            placeholder="请选择时间"
            value={moment(inspectRectification?.endTime) || ''}
            onChange={(d) => {
              setInspectRectifition({
                ...inspectRectification,
                endTime: moment(d).format('YYYY-MM-DD'),
              });
            }}
          />
        </Grid>
      </Grid>

      <FormControl fullWidth className={classes.formControl}>
        <InputLabel shrink htmlFor="rectification-remark">
          抄送
        </InputLabel>

        <Select
          id="rectification-idsCC"
          className={clsx(classes.select, classes.idCCSelect)}
          bordered={null}
          mode="multiple"
          value={inspectRectification?.idsCC || []}
          placeholder="请输入抄送人员名字"
          onChange={(value) => {
            setInspectRectifition({
              ...inspectRectification,
              idsCC: value,
            });
          }}
        >
          <Option value="loudanru">罗丹茹</Option>
          <Option value="haungshun">黄舜</Option>
        </Select>
      </FormControl>

      <Grid className={classes.buttonGroup}>
        <Button
          onClick={() => {
            setRectificationDialog('');
          }}
        >
          取消
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={async () => {
            if (action === 'view') {
              const taskContent = {
                userId: account._id,
                userName: account.userName,
                atCreated: new Date(),
                content: `修改了${inspectRectification.name}计划`,
              };
              handleUpdateRectification(_id);
              await inspectTaskSvc.update({
                _id: inspectTaskInfos._id,
                progress: inspectTaskInfos.progress,
                content: taskContent,
                status: 'todo',
              });
              getTaskList(_id);
            } else {
              const idReport = shortid.generate();

              setInspectReportCreated({
                ...inspectReportCreated,
                _id: idReport,
                idsRectification: inspectRectification,
              });
            }
            setRectificationDialog('');
          }}
        >
          确认
        </Button>
      </Grid>
    </AntdDialog>
  );
};
export default RectificationDialog;
