import React, { useState, useContext } from 'react';
import { Input, Row, Col, Button } from 'antd';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { componentsStyles } from '../style';
import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import { ContractManageContext } from '../context/ContractManageContext';
import Datepicker from '../../../components/Datepicker';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    row: {
      marginTop: 20,
    },
    label: {
      fontSize: 14,
      color: 'rgba(0,0,0,0.45)',
      fontWeight: 400,
      widtth: '30%',
      display: 'inline-block',
      position: 'relative',
      '& span:nth-of-type(1)': {
        color: 'rgb(250, 85, 85)',
        fontSize: 22,
        opacity: 1,
        position: 'relative',
        top: 7,
      },
    },
    planDateLabel: {
      fontSize: 14,
      color: 'rgba(0,0,0,0.45)',
      fontWeight: 400,
      lineHeight: '20px',
      position: 'relative',
      '& span span:nth-of-type(1)': {
        color: 'rgb(250, 85, 85)',
        fontSize: 22,
        opacity: 1,
        position: 'relative',
        top: 7,
      },
    },
    tenderRow: {
      margin: '48px 0',
    },
    amount: {
      margin: '48px 0',
    },
    subTitle: {
      fontSize: 10,
      display: 'block',
      marginTop: -6,
      color: '#000000',
      opacity: 0.45,
      fontWeight: 400,
      width: 110,
    },
    dateRow: {
      display: 'flex',
      alignItems: 'flex-end',
    },
  });
});

function StepsThree() {
  const componentsClasses = componentsStyles({});
  const classes = useStyles({});
  const { contractMsg, setContractMsg } = useContext(ContractManageContext);

  return (
    <div>
      <Row
        gutter={{ xs: 12, md: 24 }}
        className={classes.dateRow}
        style={{ alignItems: 'center' }}
      >
        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span className={classes.planDateLabel}>
              <span>
                <span></span>
                计划开工日期:
              </span>
            </span>
            <Datepicker
              locale={locale}
              className={componentsClasses.datePicker}
              allowClear={false}
              value={
                contractMsg.planStartDate &&
                moment(contractMsg.planStartDate, 'YYYY-MM-DD')
              }
              onChange={d => {
                setContractMsg({
                  ...contractMsg,
                  planStartDate: moment(d).format('YYYY-MM-DD'),
                });
              }}
            />
          </div>
        </Col>
        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span className={classes.planDateLabel}>
              <span>
                <span></span>
                计划竣工日期:
              </span>
            </span>
            <Datepicker
              locale={locale}
              allowClear={false}
              className={componentsClasses.datePicker}
              value={
                contractMsg.planEndDate &&
                moment(contractMsg.planEndDate, 'YYYY-MM-DD')
              }
              onChange={d => {
                setContractMsg({
                  ...contractMsg,
                  planEndDate: moment(d).format('YYYY-MM-DD'),
                });
              }}
            />
          </div>
        </Col>
        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span className={classes.label}>
              <span></span> 合同工期:
            </span>
            <Input
              placeholder="请填写合同工期"
              type="number"
              className={componentsClasses.input}
              value={contractMsg.contractTime}
              onChange={e => {
                const { value } = e.target;
                setContractMsg({
                  ...contractMsg,
                  contractTime: value,
                });
              }}
            />
          </div>
        </Col>
      </Row>
      <Row
        gutter={{ xs: 12, md: 24 }}
        className={classes.row}
        style={{ alignItems: 'center' }}
      >
        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span className={classes.planDateLabel}>
              <span>
                <span></span>
                招标工期:
              </span>
            </span>
            <Input
              placeholder="请填写招标工期"
              type="number"
              className={componentsClasses.input}
              value={contractMsg.tenderTime}
              onChange={e => {
                const { value } = e.target;
                setContractMsg({
                  ...contractMsg,
                  tenderTime: value,
                });
              }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default StepsThree;
