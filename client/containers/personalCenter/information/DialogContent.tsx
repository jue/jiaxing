import { useState } from 'react';
import AntdDialog from '../../../components/AntdDialog';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { UnderlineInput } from '../../../components/Input/UnderlineInput';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import CancelIcon from '@material-ui/icons/Cancel';
import ChangePswSuccess from '../../../components/Svgs/authority/ChangePswSuccess';
import accountSvc from '../../../services/accountSvc';
import { StatusCode } from '../../../../constants/enums';
import { Divider } from '@material-ui/core';

const useStyles = makeStyles(() => {
  return createStyles({
    title: {
      textAlign: 'center',
    },
    formControl: {
      width: '100%',
      marginBottom: 20,
    },
    cancel: {
      cursor: 'pointer',
    },
    redTips: {
      color: '#FF3B30',
      fontSize: 12,
      marginTop: 12,
    },
    submitSuccess: {
      display: 'flex',
      justifyContent: 'center',
    },
    changeSuccess: {
      fontWeight: 600,
      marginTop: 26,
      textAlign: 'center',
    },
    content: {
      margin: '20px 20px 0',
    },
    qrimg: {
      width: 300,
      height: 300,
      margin: '0 auto',
    },
  });
});

export const ChangePasswordDialog = ({
  open,
  close,
  setChangePswSuccess,
  accountId,
}) => {
  const classes = useStyles({});
  const [oldPswError, setOldPswError] = useState<boolean>(false);
  const [passwordInfo, setPasswordInfo] = useState({
    password: '',
    newPassword: '',
    againNewPassword: '',
  });

  const onClose = () => {
    setPasswordInfo({
      password: '',
      newPassword: '',
      againNewPassword: '',
    });
    close();
  };

  const onConfirm = async () => {
    try {
      const updatePassword = await accountSvc.updatePassword({
        _id: accountId,
        password: passwordInfo.password,
        newPassword: passwordInfo.newPassword,
      });

      if (updatePassword._id) {
        onClose();
        setChangePswSuccess(true);
      } else if (
        updatePassword.status &&
        updatePassword.status === StatusCode.password_error
      ) {
        setOldPswError(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AntdDialog
      visible={open}
      onClose={onClose}
      hasClose={true}
      dialogTitle=""
      hasFooter={true}
      onConfirm={onConfirm}
      width={820}
    >
      <Typography variant="h5" className={classes.title}>
        修改密码
      </Typography>

      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="check-item-name">
          旧密码 *
        </InputLabel>
        <UnderlineInput
          placeholder="请输入旧密码"
          style={{ fontSize: 14 }}
          value={passwordInfo.password}
          type="password"
          endAdornment={
            <InputAdornment
              position="end"
              className={classes.cancel}
              onClick={() => {
                setPasswordInfo({ ...passwordInfo, password: '' });
              }}
            >
              <CancelIcon
                aria-label="toggle password visibility"
                color="primary"
              />
            </InputAdornment>
          }
          onChange={(e) => {
            const { value } = e.target;
            setPasswordInfo({ ...passwordInfo, password: value });
          }}
        />
        {oldPswError && (
          <span className={classes.redTips}>请输入正确的密码</span>
        )}
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="check-item-name">
          新密码 *
        </InputLabel>
        <UnderlineInput
          placeholder="请输入新密码"
          style={{ fontSize: 14 }}
          value={passwordInfo.newPassword}
          type="password"
          endAdornment={
            <InputAdornment
              position="end"
              className={classes.cancel}
              onClick={() =>
                setPasswordInfo({ ...passwordInfo, newPassword: '' })
              }
            >
              <CancelIcon
                aria-label="toggle password visibility"
                color="primary"
              />
            </InputAdornment>
          }
          onChange={(e) => {
            const { value } = e.target;
            setPasswordInfo({ ...passwordInfo, newPassword: value });
          }}
        />
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="check-item-name">
          确认密码 *
        </InputLabel>
        <UnderlineInput
          placeholder="请再次确认密码"
          style={{ fontSize: 14 }}
          value={passwordInfo.againNewPassword}
          type="password"
          endAdornment={
            <InputAdornment
              position="end"
              className={classes.cancel}
              onClick={() =>
                setPasswordInfo({ ...passwordInfo, againNewPassword: '' })
              }
            >
              <CancelIcon
                aria-label="toggle password visibility"
                color="primary"
              />
            </InputAdornment>
          }
          onChange={(e) => {
            const { value } = e.target;
            setPasswordInfo({ ...passwordInfo, againNewPassword: value });
          }}
        />
        {passwordInfo.newPassword !== passwordInfo.againNewPassword && (
          <span className={classes.redTips}>请确保两次输入的密码一致</span>
        )}
      </FormControl>
    </AntdDialog>
  );
};

export const ChangePasswordSuccess = ({ open, close }) => {
  const classes = useStyles({});

  return (
    <AntdDialog
      visible={open}
      onClose={close}
      hasClose={false}
      dialogTitle=""
      hasFooter={false}
      onConfirm={() => {
        close();
      }}
      width={380}
    >
      <div className={classes.submitSuccess}>
        <ChangePswSuccess />
      </div>

      <Typography className={classes.changeSuccess}>密码已修改成功</Typography>
    </AntdDialog>
  );
};
export const ChangeWxDialog = ({
  open,
  close,
  setChangePswSuccess,
  accountId,
}) => {
  const classes = useStyles({});

  const onClose = () => {
    // setPasswordInfo({
    //   password: '',
    //   newPassword: '',
    //   againNewPassword: '',
    // });
    close();
  };

  const onConfirm = async () => {
    try {
      // const updatePassword = await accountSvc.updatePassword({
      //   _id: accountId,
      // })
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AntdDialog
      visible={open}
      onClose={onClose}
      hasClose={true}
      dialogTitle=""
      hasFooter={false}
      onConfirm={onConfirm}
      width={700}
    >
      <Typography variant="h5" className={classes.title}>
        嘉兴有轨电车（公众号）
      </Typography>
      <Divider />
      <div className={classes.content}>
        <Typography variant="body1" color="error" style={{ marginLeft: '10%' }}>
          第一步：请打开微信，扫描下方二维码，关注此微信号；
        </Typography>
        <Typography variant="body1" color="error" style={{ marginLeft: '10%' }}>
          第二步：点击“绑定账号”菜单，输入BIM平台用户名及密码完成绑定。
        </Typography>
        <div
          style={{
            marginTop: 10,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src="/static/images/wx-qr-code.png"
            alt=""
            className={classes.qrimg}
          />
        </div>
      </div>
    </AntdDialog>
  );
};
