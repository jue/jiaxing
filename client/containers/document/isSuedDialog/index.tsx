import React, { useState, useContext } from 'react';
import axios from 'axios';
import { message } from 'antd';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  Grid,
  Button,
  Box,
  Typography,
  FormControl,
  Divider,
  RadioGroup,
  Radio,
  FormControlLabel,
} from '@material-ui/core';
import AntdDialog from '../../../components/AntdDialog';
import { OutlineInput } from '../../../components/Input/OutlineInput';
import AccountCascader from './AccountCascader';
import {
  DocumentFileType,
  DocumentFileDesc,
} from '../../../../constants/enums';
import RadioFilesView from './RadioFilesView';
import { DBDepartmentI } from '../../../../typings/department';
import { DocumentContextI, DocumentContext } from '../DocumentContext';
import { AuthContextI, AuthContext } from '../../../contexts/AuthContext';

const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
    '@global': {
      '.ant-select:not(.ant-select-disabled):hover .ant-select-selector': {
        borderColor: '#8fc220 !important',
        borderRadius: '4px !important',
        height: '34px !important',
      },
      '.ant-select-selector': {
        borderColor: '#d9d9d9 !important',
        borderRadius: '4px !important',
        height: '34px !important',
      },
      '.ant-select-focused.ant-select-single:not(.ant-select-customize-input) .ant-select-selector': {
        boxShadow: 'none',
        WebkitBoxShadow: 'none',
        height: '34px !important',
      },
      '.MuiFormControlLabel-label': {
        color: 'rgba(0,0,0,0.65)!important',
      },
      '.ant-modal-body, .ant-modal-content': {
        overflow: 'auto',
      },
    },
    title: {
      fontSize: 16,
      fontFamily: 'PingFangSC-Medium,PingFang SC',
      fontWeight: 500,
      color: 'rgba(0,0,0,0.85)',
      borderBottom: '1px solid rgba(0,0,0,0.09)',
      paddingBottom: spacing(2),
    },
    formControlLabel: {
      flex: 1,
    },
    formControl: {
      // width: '80%',
      marginBottom: spacing(2.5),
      display: 'flex',
      flexDirection: 'row',
    },
    inputLabel: {
      width: 110,
      color: 'rgba(0,0,0,0.45)',
      fontSize: 14,
      lineHeight: '32px',
      textAlign: 'right',
    },
    input: {
      width: '85%',
      height: 34,
    },
    addButton: {
      height: 34,
      '& .MuiButton-label': {
        fontWeight: 400,
        color: palette.primary.main,
        fontSize: 12,
      },
      startIcon: {
        marginRight: 4,
      },
    },
    tagButton: {
      height: 26,
      paddingTop: 2,
      margin: '0 10px',
      background: 'rgba(143,195,32,0.13)',
      '& .MuiButton-label': {
        fontWeight: 400,
        color: 'rgba(143,195,32,1)',
        fontSize: 12,
      },
    },
    radioGroup: {
      width: '52%',
      display: 'flex',
      flexDirection: 'row',
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
  })
);
const IsSuedDialog = ({ open, setOpen }) => {
  const {
    messageInfo,
    setMessageInfo,
    setMessageFiles,
    setSelectCategory,
  } = useContext<DocumentContextI>(DocumentContext);
  const classes = useStyles({});
  const [openRadio, setOpenRadio] = useState('');
  const [noticeDept, setNoticeDept] = useState<DBDepartmentI[]>([]);
  const [cCDept, setCCDept] = useState<DBDepartmentI[]>([]);
  const [noticeAccounts, setNoticeAccounts] = useState([]);
  const [cCAccounts, setAccounts] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const [cc, setCc] = useState([]);
  const { account } = useContext<AuthContextI>(AuthContext);

  const handleCreate = () => {
    messageInfo.operatorId = account && account._id;
    messageInfo.operatorName = account && account.userName;
    axios
      .post('/tylinsh/approval/message', messageInfo)
      .then((data) =>
        message.success({
          content: '消息发送成功',
          style: {
            marginTop: '40%',
          },
        })
      )
      .catch((error) =>
        message.error({
          content: '创建发送失败',
          style: {
            marginTop: '40%',
          },
        })
      );
  };

  return (
    <AntdDialog
      visible={open}
      hasClose={true}
      dialogTitle={<p className={classes.title}>文档下发</p>}
      hasFooter={false}
      onClose={() => {
        setOpen(false);
      }}
      onConfirm
      width="60%"
    >
      <FormControl className={classes.formControl}>
        <Typography className={classes.inputLabel}>消息主题：</Typography>
        <Box flex="1" ml={1}>
          <OutlineInput
            className={classes.input}
            id="problemData-name"
            value={messageInfo.title || ''}
            placeholder="请输入消息主题"
            onChange={(e) => {
              const { value } = e.target;
              setMessageInfo({
                ...messageInfo,
                title: value,
              });
            }}
          />
        </Box>
      </FormControl>

      <AccountCascader
        classes={classes}
        label="通知对象："
        newDept={noticeDept}
        setNewDept={setNoticeDept}
        newAccounts={noticeAccounts}
        setAccounts={setNoticeAccounts}
        object="receivers"
        personInfos={receivers}
        setPersonInfos={setReceivers}
        companies="companies"
        departments="departments"
      />
      <AccountCascader
        classes={classes}
        label="抄送对象："
        newDept={cCDept}
        setNewDept={setCCDept}
        newAccounts={cCAccounts}
        setAccounts={setAccounts}
        object="cc"
        personInfos={cc}
        setPersonInfos={setCc}
        companies="ccCompanies"
        departments="ccDepartments"
      />
      <Divider />
      <FormControl className={classes.formControl}>
        <Typography className={classes.inputLabel}>内容：</Typography>
        <Box flex="1" ml={1}>
          <OutlineInput
            id="hidden-desc"
            // className={classes.input}
            style={{ width: '85%' }}
            value={messageInfo.content || ''}
            multiline
            rows={4}
            placeholder="请输入内容"
            onChange={(e) => {
              const { value } = e.target;
              setMessageInfo({
                ...messageInfo,
                content: value,
              });
            }}
          />
        </Box>
      </FormControl>
      <FormControl className={classes.formControl}>
        <Typography className={classes.inputLabel}>附件：</Typography>
        <Box flex="1" ml={1}>
          <RadioGroup
            aria-label="hidden-result"
            name="hidden-result"
            // defaultValue="newFile"
            onChange={(e) => {
              const { value } = e.target;
              setOpenRadio(value);
              // setMessageFiles([]);
            }}
            className={classes.radioGroup}
          >
            {Object.keys(DocumentFileType).map((item) => (
              <FormControlLabel
                key={item}
                className={classes.formControlLabel}
                value={DocumentFileType[item]}
                control={
                  <Radio
                    size="small"
                    color="primary"
                    style={{ height: 32, lineHeight: '32px' }}
                  />
                }
                label={DocumentFileDesc[DocumentFileType[item]]}
              />
            ))}
          </RadioGroup>
          <RadioFilesView open={openRadio} />
        </Box>
      </FormControl>
      <Grid className={classes.buttonGroup}>
        <Button
          onClick={() => {
            setOpen(false);
            setMessageInfo({
              attachments: [],
            });
            setReceivers([]);
            setCc([]);
            setMessageFiles([]);
          }}
        >
          取消
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            if (!messageInfo.title) {
              return message.error('请输入消息主题！');
            }
            if (!messageInfo.companies) {
              return message.error('请添加通知对象！');
            }
            if (!messageInfo.content) {
              return message.error('请输入内容！');
            }
            if (
              !messageInfo.attachments ||
              messageInfo.attachments.length == 0
            ) {
              return message.error('请选择附件！');
            }

            handleCreate();
            setOpen(false);
            setMessageInfo({
              attachments: [],
            });
            setReceivers([]);
            setCc([]);
            setMessageFiles([]);
            setSelectCategory({});
          }}
        >
          确认
        </Button>
      </Grid>
    </AntdDialog>
  );
};
export default IsSuedDialog;
