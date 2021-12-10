import React, { useState, useContext } from 'react';
import { Input, Row, Col } from 'antd';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { componentsStyles } from '../style';
import { ContractManageContext } from '../context/ContractManageContext';

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
    },
    button: {
      margin: '47px 0 47px',
    },
  });
});

function StepsFour() {
  const componentsClasses = componentsStyles({});
  const classes = useStyles({});
  const [open, setOpen] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const { contractMsg, setContractMsg } = useContext(ContractManageContext);

  return (
    <div>
      <Row gutter={{ xs: 12, md: 24 }}>
        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span className={classes.label}>
              <span>*</span> 合同总金额:
            </span>
            <Input
              placeholder="请填写合同总金额"
              type="number"
              // defaultValue={Number(contractMsg.amount)}
              value={contractMsg.amount && Number(contractMsg.amount) / 10000}
              className={componentsClasses.input}
              onChange={e => {
                const { value } = e.target;
                setContractMsg({
                  ...contractMsg,
                  amount: Number(value) * 10000,
                });
              }}
              suffix="万元"
            />
          </div>
        </Col>
        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span
              className={classes.label}
              style={{ height: 40, lineHeight: '19px' }}
            >
              <span></span> 材料和工程设
              <br />
              备暂估价金额:
            </span>
            <Input
              type="number"
              placeholder="请填写材料和工程设备暂估价金额"
              className={componentsClasses.input}
              // defaultValue={Number(contractMsg.matEngDesignEstAmount)}
              value={
                contractMsg.matEngDesignEstAmount &&
                Number(contractMsg.matEngDesignEstAmount) / 10000
              }
              onChange={e => {
                const { value } = e.target;
                setContractMsg({
                  ...contractMsg,
                  matEngDesignEstAmount: Number(value) * 10000,
                });
              }}
              suffix="万元"
            />
          </div>
        </Col>
        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span className={classes.label}>
              <span></span>安全文明施工费:
            </span>
            <Input
              placeholder="请填写安全文明施工费"
              type="number"
              className={componentsClasses.input}
              // defaultValue={Number(contractMsg.safeCivilizedAmount)}
              value={
                contractMsg.safeCivilizedAmount &&
                Number(contractMsg.safeCivilizedAmount) / 10000
              }
              onChange={e => {
                const { value } = e.target;
                setContractMsg({
                  ...contractMsg,
                  safeCivilizedAmount: Number(value) * 10000,
                });
              }}
              suffix="万元"
            />
          </div>
        </Col>
      </Row>
      <Row gutter={{ xs: 12, md: 24 }} className={classes.row}>
        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span
              className={classes.label}
              style={{ height: 40, lineHeight: '19px' }}
            >
              <span></span>专业工程暂估
              <br />
              价金额:
            </span>
            <Input
              type="number"
              placeholder="请填写专业工程暂估价金额"
              className={componentsClasses.input}
              // defaultValue={Number(contractMsg.proEngEstAmount)}
              value={
                contractMsg.proEngEstAmount &&
                Number(contractMsg.proEngEstAmount) / 10000
              }
              onChange={e => {
                const { value } = e.target;
                setContractMsg({
                  ...contractMsg,
                  proEngEstAmount: Number(value) * 10000,
                });
              }}
              suffix="万元"
            />
          </div>
        </Col>
        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span className={classes.label}>
              <span></span>暂列金额:
            </span>
            <Input
              type="number"
              placeholder="请填写暂列金额"
              className={componentsClasses.input}
              // defaultValue={Number(contractMsg.provisionalAmount)}
              value={
                contractMsg.provisionalAmount &&
                Number(contractMsg.provisionalAmount) / 10000
              }
              onChange={e => {
                const { value } = e.target;
                setContractMsg({
                  ...contractMsg,
                  provisionalAmount: Number(value) * 10000,
                });
              }}
              suffix="万元"
            />
          </div>
        </Col>
        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span className={classes.label}>
              <span>*</span>合同可变更金额:
            </span>
            <Input
              type="number"
              placeholder="请填写合同可变更金额"
              className={componentsClasses.input}
              // defaultValue={Number(contractMsg.changeableAmount)}
              value={
                contractMsg.changeableAmount &&
                Number(contractMsg.changeableAmount) / 10000
              }
              onChange={e => {
                const { value } = e.target;
                setContractMsg({
                  ...contractMsg,
                  changeableAmount: Number(value) * 10000,
                });
              }}
              suffix="万元"
            />
          </div>
        </Col>
      </Row>
      <Row gutter={{ xs: 12, md: 24 }} className={classes.row}>
        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span className={classes.label}>
              <span></span>预付款类型:
            </span>
            <Input
              placeholder="请填写预付款类型"
              className={componentsClasses.input}
              value={contractMsg.advancePaymentType}
              onChange={e => {
                const { value } = e.target;
                setContractMsg({
                  ...contractMsg,
                  advancePaymentType: value,
                });
              }}
            />
          </div>
        </Col>
        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span className={classes.label}>
              <span></span>预付款值:
            </span>
            <Input
              placeholder="请填写预付款值"
              className={componentsClasses.input}
              value={contractMsg.advancePaymentAmount}
              type="number"
              onChange={e => {
                const { value } = e.target;
                setContractMsg({
                  ...contractMsg,
                  advancePaymentAmount: value,
                });
              }}
              suffix="万元"
            />
          </div>
        </Col>
      </Row>
      <Row gutter={{ xs: 12, md: 24 }} className={classes.row}>
        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span className={classes.label}>
              <span></span>尾款类型:
            </span>
            <Input
              placeholder="请填写尾款类型"
              className={componentsClasses.input}
              value={contractMsg.balancePaymentType}
              onChange={e => {
                const { value } = e.target;
                setContractMsg({
                  ...contractMsg,
                  balancePaymentType: value,
                });
              }}
            />
          </div>
        </Col>
        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span className={classes.label}>
              <span></span>尾款值:
            </span>
            <Input
              placeholder="请填写尾款值"
              className={componentsClasses.input}
              type="number"
              value={contractMsg.balancePaymentAmount}
              onChange={e => {
                const { value } = e.target;
                setContractMsg({
                  ...contractMsg,
                  balancePaymentAmount: value,
                });
              }}
              suffix="万元"
            />
          </div>
        </Col>
      </Row>
      <Row gutter={{ xs: 12, md: 24 }} className={classes.row}>
        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span className={classes.label}>
              <span></span>质保金类型:
            </span>
            <Input
              placeholder="请填写质保金类型"
              className={componentsClasses.input}
              value={contractMsg.qualityMoneyType}
              onChange={e => {
                const { value } = e.target;
                setContractMsg({
                  ...contractMsg,
                  qualityMoneyType: value,
                });
              }}
            />
          </div>
        </Col>
        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span className={classes.label}>
              <span></span>质保金值:
            </span>
            <Input
              placeholder="请填写质保金值"
              className={componentsClasses.input}
              type="number"
              value={contractMsg.qualityMoneyAmount}
              onChange={e => {
                const { value } = e.target;
                setContractMsg({
                  ...contractMsg,
                  qualityMoneyAmount: value,
                });
              }}
              suffix="万元"
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default StepsFour;
