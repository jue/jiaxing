import { useState, useContext } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import ChooseIcon from '../../../components/Svgs/authority/ChooseIcon';
import findIndex from 'lodash/findIndex';
import { PersonnelContext } from '../context/personnelContext';

const useStyles = makeStyles(() => {
  return createStyles({
    contanier: {
      width: '40%',
      height: '100%',
      overflow: 'auto',
    },
    setUpTitle: {
      fontSize: 14,
      fontWeight: 400,
      color: '#555',
      marginBottom: 30,
    },
    titleDesc: {
      fontSize: 12,
    },
    flex: {
      display: 'flex',
      flexWrap: 'wrap',
      width: '100%',
    },
    flexItem: {
      display: 'flex',
      justifyContent: 'center',
      boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.1)',
      borderRadius: 4,
      width: '47%',
      marginBottom: 20,
      height: 60,
      lineHeight: '60px',
      position: 'relative',
    },
    right: {
      marginRight: 30,
    },
    singleMenu: {},
    quarterCircle: {
      width: 40,
      height: 40,
      borderRadius: '0 0 100% 0 ',
      background: '#8FC220',
      boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.1)',
      fontSize: 14,
      fontFamily: 'PingFangSC-Medium,PingFang SC',
      fontWeight: 500,
      color: '#fff',
      lineHeight: '40px',
      textAlign: 'center',
      position: 'absolute',
      top: 0,
      left: 0,
    },
    menuItem: {
      textAlign: 'center',
    },
  });
});

export const AuthoritySetUp = () => {
  const classes = useStyles({});
  const { authorizes, personnelInfo, setPersonnelInfo } = useContext(
    PersonnelContext
  );
  console.warn(authorizes);

  return (
    <div className={classes.contanier}>
      <div className={classes.setUpTitle}>
        <span>权限设置</span>
        <span className={classes.titleDesc}>
          （ 被勾选模块对该人员提供编辑权限，未被勾选则仅可查看 ）
        </span>
      </div>
      <div className={classes.flex}>
        {authorizes.map((item, index) => {
          if (item.action === 'search') {
            return;
          }

          let newCheck = JSON.parse(JSON.stringify(personnelInfo.idsAuth));
          let checkedIndex = findIndex(newCheck, v => v === item._id);

          return (
            <div
              key={index}
              className={clsx([
                classes.flexItem,
                index % 2 === 0 ? classes.right : '',
              ])}
              onClick={() => {
                if (checkedIndex === -1) {
                  newCheck.push(item._id);
                } else {
                  newCheck.splice(checkedIndex, 1);
                }
                setPersonnelInfo({ ...personnelInfo, idsAuth: newCheck });
              }}
            >
              {checkedIndex !== -1 && (
                <div className={classes.quarterCircle}>
                  <ChooseIcon />
                </div>
              )}

              <div className={classes.menuItem}>{item.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
