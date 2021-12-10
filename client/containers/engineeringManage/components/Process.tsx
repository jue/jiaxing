import React, { useContext } from 'react';
import { Divider } from 'antd';
import moment from 'moment';
import clsx from 'clsx';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

import { CaretDownOutlined } from '@ant-design/icons';

import Guide from '../../../components/Svgs/Process/guide';
import { EngineeringContext } from '../context/EngineeringContext';

import RejectGuide from '../../../components/Svgs/Process/rejectGuide';
import DoingGuide from '../../../components/Svgs/Process/doingGuide';
import { EngineeringLevelTypeDesc } from '../../../../constants/enums';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    '@global': {
      '::-webkit-scrollbar': {
        display: 'none',
      },
    },

    process: {
      backgroundColor: '#ffffff',
      width: 'auto',
      padding: '26px 18px',
      marginLeft: theme.spacing(1.5),
      display: 'flex',
      justifyContent: 'center',
      // paddingBottom: 0,
      overflow: 'auto',
      flexDirection: 'column',
      height: '100%',
    },
    title: {
      fontSize: 16,
      fontFamily: 'PingFangSC-Medium,PingFang SC',
      fontWeight: 500,
      color: '#000000',
      opacity: 0.85,
      position: 'relative',
      width: '100%',
    },
    closeIcon: {
      position: 'absolute',
      right: 0,
      top: 0,
      color: '#DCDEE0',
    },
    dept: {
      width: 112,
      minHeight: 40,
      borderRadius: 4,
      border: '2px solid rgba(202,214,226,1)',
      backgroundColor: 'rgba(237,241,244,1)',
      textAlign: 'center',
      fontSize: 12,
      color: '#003169',
      fontWeight: 400,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    detWidth: {
      fontSize: '12px!important',
    },
    contanier: {
      marginTop: 42,
      marginLeft: 24,
      height: 613,
      overflow: 'auto',
      flex: 1,
    },
    item: {
      overflow: 'hidden',
      paddingBottom: 10,
    },
    divider: {
      width: 3,
      borderColor: '#89969F',
      margin: '0 55px',
    },
    guide: {
      display: 'flex',
      flexDirection: 'column',
      width: 112,
      alignItems: 'center',
      marginTop: 4,
    },
    result: {
      fontSize: 12,
      fontFamily: 'PingFangSC-Regular,PingFang SC',
      fontWeight: 400,
      color: 'rgba(0,49,105,1)',
      marginLeft: 6,
      width: '83%',
      display: 'inline-flex',
      marginTop: theme.spacing(6),
    },
    downArrow: {
      color: '#89969F',
      fontSize: 14,
      marginRight: 2.3,
    },
    firstResult: {
      marginTop: -59,
      marginLeft: -2.5,
    },
    endResult: {
      marginTop: -56,
    },
    otherResult: {
      marginTop: -35,
      marginLeft: -2,
    },
    rejectDept: {
      border: '2px solid rgba(250,85,85,1)!important',
      backgroundColor: '#FFA2A2!important',
      color: '#fff!important',
    },
    rejectColor: {
      fontSize: 12,
      color: '#FA5555',
    },
    changeReason: {
      fontSize: 12,
      fontFamily: 'PingFangSC-Regular,PingFang SC',
      fontWeight: 400,
      color: '#FA6400',
      marginLeft: 6,
    },
    stamp: {
      width: 148,
      position: 'relative',
      zIndex: 9,
    },
    stampChoose: {
      width: 148,
      position: 'relative',
      zIndex: 9,
      color: '#fff',
      backgroundColor: '#8FC320',
      border: '2px solid #8FC320',
    },
    stampResult: {
      overflow: 'hidden',
      position: 'relative',
      zIndex: 1,
      marginTop: '-44px',
    },
    choose: {
      color: '#fff',
      backgroundColor: '#8FC320',
      border: '2px solid #8FC320',
    },
    chooseColor: {
      color: '#8FC320',
    },
    name: {
      marginBottom: 0,
      fontSize: 14,
    },
    secondName: {
      fontSize: 10,
    },
  });
});

const Content = ({ dept }) => {
  return (
    <>
      {dept.data.changeData !== undefined && (
        <div
          style={{
            width: '100%',
            height: 50,
            overflowY: 'auto',
            fontSize: 12,
            fontFamily: 'PingFangSC-Regular,PingFang SC',
            fontWeight: 400,
            color: '#FA6400',
          }}
        >
          {dept.data.changeData.changeLevel && (
            <span>{`${moment(dept.data.atCreated).format(
              'YYYY-MM-DD HH:mm'
            )} 将变更级别由“${
              EngineeringLevelTypeDesc[dept.data.changeData.changeLevel[0]]
            }”改为“${
              EngineeringLevelTypeDesc[dept.data.changeData.changeLevel[1]]
            }”`}</span>
          )}
        </div>
      )}
    </>
  );
};
const Process = ({ account, setOpenProcess }) => {
  const classes = useStyles({});
  const { engineeringProcess, engineeringInfo } = useContext(
    EngineeringContext
  );
  const allAuditing = engineeringProcess.allAuditing || [];
  const datas = engineeringProcess.datas || [];

  return (
    <div className={classes.process}>
      <div className={classes.title}>
        流程图
        <span className={classes.closeIcon} onClick={() => setOpenProcess()}>
          <CloseIcon />
        </span>
      </div>
      <div className={classes.contanier}>
        {allAuditing.map((item, index) => {
          const depts = datas.filter((d) => {
            return d.data.deptName === item;
          });
          const d = depts.filter((d) => d.type === 'EC_reject');
          const dcType = d.length && d[0].type === 'EC_reject';

          // 如果没有_id则是新建
          let curExecutiveDept = '';
          if (account.company && account.company.name === '建设单位') {
            curExecutiveDept = account.dept && account.dept.name;
          } else {
            curExecutiveDept = account.company && account.company.name;
          }
          const isChoose = engineeringInfo._id
            ? item === engineeringInfo.executiveDept
            : item === curExecutiveDept;

          const isBracket = item.includes('（');
          const nameList = item.includes('（') && item.split('（');
          const FirstName = nameList.length ? nameList[0] : '';
          const SecondName = nameList.length ? nameList[1] : '';
          return (
            <div className={classes.item} key={`${item}${index}`}>
              <div
                className={clsx([
                  classes.dept,
                  isChoose && classes.choose,
                  dcType && isChoose && classes.rejectDept,
                  // ? classes.rejectDept
                  // : isDirector && isChoose
                  // ? classes.stampChoose
                  // : isDirector
                  // ? classes.stamp
                  // : isChoose
                  // ? classes.choose
                  // : '',
                ])}
                style={{
                  wordBreak: isBracket ? 'keep-all' : 'break-all',
                }}
              >
                {!isBracket && (
                  <p
                    className={clsx(
                      classes.name,
                      !isBracket && classes.detWidth
                    )}
                  >
                    {item}
                  </p>
                )}
                {isBracket && (
                  <>
                    <p className={classes.name}>{FirstName}</p>
                    <p
                      className={clsx(classes.name, classes.secondName)}
                    >{`（${SecondName}`}</p>
                  </>
                )}
              </div>
              <div style={{ display: 'flex' }}>
                <div className={classes.guide}>
                  {index !== allAuditing.length - 1 && (
                    <>
                      <Divider
                        dashed={true}
                        type="vertical"
                        orientation="center"
                        className={classes.divider}
                        style={{
                          height:
                            depts.length && depts.length > 1 ? '100%' : 45,
                        }}
                      />
                      <CaretDownOutlined className={classes.downArrow} />
                    </>
                  )}
                </div>
                <div style={{ width: '100%' }}>
                  {depts.map((dept, key) => {
                    const data = dept.data;
                    const executiveName = dept.executiveName;
                    const rejectType = dept.type === 'EC_reject';
                    const changeReason = dept.type === 'EC_update';
                    if (rejectType || changeReason) {
                      status = dept.type;
                    }

                    return (
                      <div
                        className={clsx([
                          classes.firstResult,
                          // isDirector && key === 0
                          //   ? classes.stampResult
                          //   : isEnd && key === 0
                          //   ? classes.endResult
                          key !== 0 && classes.otherResult,
                        ])}
                        key={key}
                        style={{
                          //   marginLeft: isDirector ? 0 : '-2px',
                          display: 'flex',
                        }}
                      >
                        {rejectType && data.deptName !== '合同管理部' ? (
                          <RejectGuide />
                        ) : isChoose ? (
                          <DoingGuide />
                        ) : (
                          <Guide />
                        )}
                        <span
                          className={clsx([
                            classes.result,
                            // rejectType
                            //   ? classes.rejectColor
                            //   : changeReason
                            //   ? classes.changeReason
                            //   : isChoose
                            //   ? classes.chooseColor
                            //   : '',
                          ])}
                        >
                          {dept.type === 'EC_reject' ? (
                            <div
                              style={{
                                color: '#FA5555',
                                fontSize: 12,
                                fontWeight: 400,
                              }}
                            >
                              {`${moment(data.atCreated).format(
                                'YYYY-MM-DD HH:mm'
                              )} ${data.deptName} 退回申请`}
                            </div>
                          ) : (
                            <>
                              {data.executiveDept === item ? (
                                dept.type === 'EC_update' ? (
                                  <Content dept={dept} />
                                ) : (
                                  `${moment(data.atCreated).format(
                                    'YYYY-MM-DD HH:mm'
                                  )} ${data.executiveDept} 审批通过`
                                )
                              ) : (
                                `${moment(data.atCreated).format(
                                  'YYYY-MM-DD HH:mm'
                                )} @${data.executiveDept} 审批`
                              )}
                            </>
                          )}
                        </span>
                        {/* {data.opinion && rejectType && (
                          <div
                            style={{
                              marginLeft: 37,
                              color: '#FA5555',
                              fontSize: 12,
                              fontWeight: 400,
                            }}
                          >
                            驳回意见：{data.opinion}
                          </div>
                        )} */}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Process;
