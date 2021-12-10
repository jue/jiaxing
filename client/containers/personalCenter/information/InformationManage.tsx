import { useContext, useEffect, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useRouter, withRouter } from 'next/router';
import clsx from 'clsx';

import Typography from '@material-ui/core/Typography';

import { AuthContext, AuthContextI } from '../../../contexts/AuthContext';
import {
  ChangePasswordDialog,
  ChangePasswordSuccess,
  ChangeWxDialog,
} from './DialogContent';

import EditIcon from '../../../components/Svgs/authority/EditIcon';
import { LayoutPageContext } from '../../layout/context/LayoutPageContext';
import PersonImage from '../../../components/Svgs/authority/PersonImage';
import UpdateInformation from './UpdateInformation';
import { isEmpty } from 'lodash';
import accountSvc from '../../../services/accountSvc';

const useStyles = makeStyles(() => {
  return createStyles({
    paper: {
      display: 'flex',
      height: '85vh',
    },
    selfImage: {
      width: 345,
      display: 'flex',
      justifyContent: 'center',
      paddingTop: 120,
      borderRight: '1px solid #E6E9EC',
    },
    avator: {
      width: 100,
      height: 100,
      overflow: 'hidden',
      borderRadius: '50%',
      display: 'flex',
      flexDirection: 'column-reverse',
      position: 'relative',
    },
    edit: {
      textAlign: 'center',
      width: '100%',
      height: '38%',
      background: 'rgba(0,0,0,0.19)',
      color: '#fff',
      lineHeight: '38px',
      position: 'absolute',
      bottom: 0,
      left: 0,
      // fontSize: 18
    },
    selfInfo: {
      marginTop: '19vh',
      marginLeft: '6vw',
      width: '20vw',
    },
    editInfo: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 'calc(100% - 345px)',
    },
    baseInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #E6E9EC',
      paddingBottom: 10,
    },
    editIcon: {
      background: '#fff',
      border: 'none',
      outline: 'none',
      cursor: 'pointer',
    },
    infomation: {
      marginTop: 40,
      '&>div': {
        display: 'flex',
        alignItems: 'center',
        lineHeight: '45px',
      },
    },
    title: {
      display: 'block',
      width: 58,
      color: '#9B9B9B',
    },
    changePsw: {
      background: 'rgba(143,194,32,0.1)',
      color: '#8FC220',
      border: '1px solid rgba(143,194,32,1)',
      outline: 'none',
      cursor: 'pointer',
      width: 80,
      lineHeight: '28px',
      marginLeft: 40,
      borderRadius: 4,
    },
    changeBtn: {
      marginLeft: 47,
    },
    etc: {
      display: 'flex',
      alignItems: 'center',
    },
    img: {
      display: 'flex',
      alignItems: 'center',
      width: '45%',
      // paddingLeft: 10,
      height: 45,
    },
  });
});

const InformationManage = () => {
  const classes = useStyles({});
  const router = useRouter();
  const { account, logout, setAccount, setEditAccount } = useContext<
    AuthContextI
  >(AuthContext);
  const [edit, setEdit] = useState<boolean>(false);

  const [changePsw, setChangePsw] = useState<boolean>(false);
  const [changePswSuccess, setChangePswSuccess] = useState<boolean>(false);
  const [changeWx, setChangeWX] = useState<boolean>(false);

  useEffect(() => {
    if (changePswSuccess) {
      setTimeout(() => {
        setChangePswSuccess(false);
        logout();
        router.push(`/login`);
      }, 1000);
    }
  }, [changePswSuccess]);

  let signIdS: any = !isEmpty(account) && account.signId.split('/');

  return (
    <>
      <div className={classes.paper}>
        <div className={classes.selfImage}>
          <div className={classes.avator}>
            <div style={{ position: 'absolute', top: 0, left: 0 }}>
              <PersonImage />
            </div>
            {edit && <div className={classes.edit}>编辑</div>}
          </div>
        </div>

        {!edit ? (
          <div className={classes.selfInfo}>
            <div className={classes.baseInfo}>
              <Typography>基本信息</Typography>
              <button
                className={classes.editIcon}
                onClick={() => setEdit(true)}
              >
                <EditIcon />
              </button>
            </div>

            <div className={classes.infomation}>
              <div>
                <span className={classes.title}>姓名</span>
                <span>{account.userName}</span>
              </div>

              <div>
                <span className={classes.title}>手机</span>
                <span>{account.phone}</span>
              </div>

              <div>
                <span className={classes.title}>邮箱</span>
                <span>{account.email}</span>
              </div>

              <div>
                <span className={classes.title}>密码</span>
                <div className={classes.etc}>
                  <span style={{ fontSize: 30 }}>••••••</span>
                  <button
                    className={classes.changePsw}
                    onClick={() => setChangePsw(true)}
                  >
                    更改
                  </button>
                </div>
              </div>
              <div style={{ position: 'relative' }}>
                <span
                  className={classes.title}
                  style={{ position: 'absolute', left: '-65px', width: 115 }}
                >
                  绑定微信公众号
                </span>
                <div style={{ marginLeft: 58 }}>
                  {!isEmpty(account) && account.bind == null ? (
                    <>
                      <span style={{ width: '10%' }}>暂未绑定</span>
                      <button
                        className={clsx(classes.changePsw, classes.changeBtn)}
                        onClick={() => setChangeWX(true)}
                      >
                        绑定
                      </button>
                    </>
                  ) : (
                    <span style={{ width: '10%' }}>已绑定</span>
                  )}
                </div>
              </div>
              <div>
                <span className={classes.title}>签名</span>
                <div className={classes.img}>
                  {signIdS && signIdS.length !== 2 && account.signId !== '' ? (
                    <img
                      src={
                        account.signId !== '' ? `/api/${account.signId}` : ''
                      }
                      alt=""
                      style={{ width: '95%', height: '100%', marginTop: 10 }}
                    />
                  ) : (
                    <span style={{ color: 'rgba(0,0,0,0.87)' }}>暂无签名</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={classes.editInfo}>
            <UpdateInformation
              setChangePsw={setChangePsw}
              setEdit={setEdit}
              signIdS={signIdS}
              setChangeWX={setChangeWX}
            />
          </div>
        )}

        <ChangePasswordDialog
          open={changePsw}
          close={() => setChangePsw(false)}
          setChangePswSuccess={() => setChangePswSuccess(true)}
          accountId={account._id}
        />

        <ChangePasswordSuccess
          open={changePswSuccess}
          close={() => setChangePswSuccess(false)}
        />
        <ChangeWxDialog
          open={changeWx}
          close={() => {
            accountSvc
              .self()
              .then((data) => {
                setAccount(data);
                setEditAccount(data);
              })
              .catch((err) => console.log(err));
            setChangeWX(false);
          }}
          setChangePswSuccess={() => setChangePswSuccess(true)}
          accountId={account._id}
        />
      </div>
    </>
  );
};

export default withRouter(({ router }) => {
  const { setParts } = useContext(LayoutPageContext);

  useEffect(() => {
    setParts(['个人中心', '个人信息']);
  }, [router.query]);

  return <InformationManage />;
});
