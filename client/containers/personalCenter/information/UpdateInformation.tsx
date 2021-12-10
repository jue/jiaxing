import { useState, useContext, useEffect } from 'react';

import { InputLabel, Button } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import { UploadOutlined } from '@ant-design/icons';

import { OutlineInput } from '../../../components/Input/OutlineInput';
import Dropzone from '../../../components/Dropzone/DropzoneUploadContainer';
import { AuthContext, AuthContextI } from '../../../contexts/AuthContext';
import accountSvc from '../../../services/accountSvc';
import filesSvc from '../../../services/filesSvc';
import { isEmpty } from 'lodash';
import clsx from 'clsx';

const useStyles = makeStyles(({ spacing, palette }) => {
  return createStyles({
    formControl: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: 30,
    },
    label: {
      width: 110,
      fontSize: 14,
    },
    input: {
      width: '25vw',
      marginTop: '0 !important',
    },
    redTips: {
      color: '#FF3B30',
      marginLeft: 10,
      width: '9vw',
    },
    changePsw: {
      background: 'rgba(143,194,32,0.1)',
      color: '#8FC220',
      border: '1px solid rgba(143,194,32,1)',
      outline: 'none',
      cursor: 'pointer',
      width: 72,
      lineHeight: '28px',
      marginLeft: 40,
      borderRadius: 4,
    },
    bottom: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: 54,
    },
    cancelConfirm: {
      color: '#000000 !important',
      boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.1)',
      width: 88,
      height: 34,
      border: 0,
      background: '#fff',
      marginRight: 60,
      cursor: 'pointer',
      outline: 'none',
    },
    confirmBotton: {
      width: 88,
      height: 34,
    },
    button: {
      width: 100,
      marginBottom: spacing(1),
      '& .MuiButton-label': {
        fontWeight: 400,
        color: palette.primary.main,
      },
    },
  });
});

const UpdateInformation = ({ setChangePsw, setEdit, signIdS, setChangeWX }) => {
  const classes = useStyles({});
  const [activeInfo, setActiveInfo] = useState<string>('');
  const { editAccount, setEditAccount, setAccount, account } = useContext<
    AuthContextI
  >(AuthContext);
  const [openPhoneTips, setOpenPhoneTips] = useState<boolean>(false);
  const onConfirm = async () => {
    try {
      const data = await accountSvc.update({
        ...editAccount,
      });
      setAccount(data);
      setEdit(false);
    } catch (error) {
      console.log(error);
    }
  };

  const saveFiles = async (file, type) => {
    try {
      const data = await filesSvc.upload(file, type);
      setEditAccount({
        ...editAccount,
        signId:
          data.data[0].resourceId !== undefined
            ? `file/preview/${data.data[0].resourceId}/${data.data[0].resourceName}`
            : editAccount.signId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className={classes.formControl}>
        <InputLabel
          className={classes.label}
          style={{ color: activeInfo === 'userName' && '#8FC220' }}
        >
          姓名 *
        </InputLabel>
        <OutlineInput
          id="plan-name"
          className={classes.input}
          value={editAccount.userName}
          onChange={(e) => {
            const { value } = e.target;
            setEditAccount({ ...editAccount, userName: value });
          }}
          onFocus={() => setActiveInfo('userName')}
          onBlur={() => setActiveInfo('')}
        />
      </div>

      <div className={classes.formControl}>
        <InputLabel
          className={classes.label}
          style={{ color: activeInfo === 'phone' && '#8FC220' }}
        >
          手机
        </InputLabel>
        <OutlineInput
          id="plan-name"
          className={classes.input}
          value={editAccount.phone}
          onChange={(e) => {
            const { value } = e.target;
            setEditAccount({ ...editAccount, phone: value });
          }}
          onFocus={() => setActiveInfo('phone')}
          onBlur={(e) => {
            setActiveInfo('');
            let { value } = e.target;
            value = value.trim();
            if (value === '') {
              return;
            }
            if (
              !/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(
                value
              )
            ) {
              setOpenPhoneTips(true);
            } else {
              setOpenPhoneTips(false);
            }
          }}
        />
        <span className={classes.redTips}>
          {openPhoneTips && '请输入正确的手机号码'}
        </span>
      </div>

      <div className={classes.formControl}>
        <InputLabel
          className={classes.label}
          style={{ color: activeInfo === 'email' && '#8FC220' }}
        >
          邮箱
        </InputLabel>
        <OutlineInput
          id="plan-name"
          className={classes.input}
          value={editAccount.email}
          onChange={(e) => {
            const { value } = e.target;
            setEditAccount({ ...editAccount, email: value });
          }}
          onFocus={() => setActiveInfo('email')}
          onBlur={() => setActiveInfo('')}
        />
      </div>

      <div className={classes.formControl}>
        <InputLabel
          className={classes.label}
          style={{ color: activeInfo === 'password' && '#8FC220' }}
        >
          密码
        </InputLabel>
        <OutlineInput
          id="plan-name"
          className={classes.input}
          type="password"
          disabled
          value="••••••"
          onFocus={() => setActiveInfo('password')}
          onBlur={() => setActiveInfo('')}
        />
        <button
          className={classes.changePsw}
          onClick={() => setChangePsw(true)}
        >
          修改密码
        </button>
      </div>
      <div className={classes.formControl}>
        <InputLabel className={classes.label}>绑定微信公众号</InputLabel>
        <div
          style={{
            width: '88%',
            paddingLeft: 10,
            height: 34,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {!isEmpty(editAccount) && editAccount.bind == null ? (
            <>
              <span style={{ width: '30%' }}>暂未绑定</span>
              <Button
                className={classes.button}
                size="small"
                variant="outlined"
                color="primary"
                // startIcon={<UploadOutlined style={{ color: '#8FC220' }} />}
                onClick={() => setChangeWX(true)}
                style={{ width: 60 }}
              >
                绑定
              </Button>
            </>
          ) : (
            <span>已绑定</span>
          )}
        </div>
      </div>

      <div className={classes.formControl} style={{ marginBottom: 60 }}>
        <InputLabel
          className={classes.label}
          style={{ color: activeInfo === 'password' && '#8FC220' }}
        >
          签名
        </InputLabel>

        <div style={{ width: '25%', paddingLeft: 10, height: 45 }}>
          {signIdS && signIdS.length !== 2 && editAccount.signId !== '' ? (
            <img
              src={`/api/${editAccount.signId}`}
              alt=""
              style={{ width: '95%', height: '100%' }}
            />
          ) : (
            <span
              style={{
                height: 45,
                lineHeight: '45px',
                color: 'rgba(0,0,0,0,85)',
              }}
            >
              暂无数据
            </span>
          )}
        </div>
        <Dropzone
          files={[]}
          setFiles={(files) => {
            saveFiles(files, '1');
          }}
          accept="image/jpg,image/png"
          maxSize={10}
        >
          <Button
            className={classes.button}
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<UploadOutlined style={{ color: '#8FC220' }} />}
          >
            更换签名
          </Button>
        </Dropzone>
      </div>
      <div className={classes.bottom}>
        <button
          className={classes.cancelConfirm}
          onClick={() => {
            setEditAccount(
              // ...editAccount,
              // signId: '',
              account
            );
            setEdit(false);
          }}
        >
          取消
        </button>
        <Button
          color="primary"
          variant="contained"
          className={classes.confirmBotton}
          onClick={onConfirm}
        >
          确定
        </Button>
      </div>
    </div>
  );
};

export default UpdateInformation;
