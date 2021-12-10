import React, { useState, useContext } from 'react';
import { Input, Row, Col, Select } from 'antd';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { componentsStyles } from '../style';
import { ContractManageContext } from '../context/ContractManageContext';

const { Option } = Select;
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

function StepsRemunerationContract() {
  const antdComponentClasses = componentsStyles({});
  const classes = useStyles({});
  const [open, setOpen] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const { contractMsg, setContractMsg } = useContext(ContractManageContext);

  return (
    <div>
      <Row gutter={{ xs: 12, md: 24 }}>
        <Col span={8}>
          <div className={antdComponentClasses.colSpan}>
            <span className={classes.label}>
              <span>*</span> 酬金方式:
            </span>
            <Select
              className={antdComponentClasses.select}
              placeholder="请选择酬金方式"
              value={contractMsg.remunerationType}
              onChange={value => {
                setContractMsg({ ...contractMsg, remunerationType: value });
              }}
            >
              <Option value="固定总价">固定总价</Option>
              <Option value="固定总费率方式">固定总费率方式</Option>
              <Option value="投标价">投标价</Option>
            </Select>
          </div>
        </Col>
        <Col span={8}>
          <div className={antdComponentClasses.colSpan}>
            <span className={classes.label}>
              <span>*</span> 酬金范围:
            </span>
            <Select
              className={antdComponentClasses.select}
              placeholder="请选择酬金范围"
              value={contractMsg.remunerationScope}
              onChange={value => {
                setContractMsg({ ...contractMsg, remunerationScope: value });
              }}
            >
              <Option value="包含绩效酬金">包含绩效酬金</Option>
              <Option value="不包含绩效酬金">不包含绩效酬金</Option>
            </Select>
          </div>
        </Col>
        <Col span={8}>
          <div className={antdComponentClasses.colSpan}>
            <span
              className={classes.label}
              style={{ height: 40, lineHeight: '19px' }}
            >
              <span>*</span>签约酬金
              <br />
              合同总额:
            </span>
            <Input
              placeholder="请填写签约酬金合同总额"
              type="number"
              className={antdComponentClasses.input}
              // defaultValue={Number(contractMsg.safeCivilizedAmount)}
              value={contractMsg.amount && Number(contractMsg.amount) / 10000}
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
      </Row>

      <Row gutter={{ xs: 12, md: 24 }} className={classes.row}>
        <Col span={8}>
          <div className={antdComponentClasses.colSpan}>
            <span className={classes.label}>
              <span></span>预付款类型:
            </span>
            <Input
              placeholder="请填写预付款类型"
              className={antdComponentClasses.input}
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
          <div className={antdComponentClasses.colSpan}>
            <span className={classes.label}>
              <span></span>预付款值:
            </span>
            <Input
              placeholder="请填写预付款值"
              className={antdComponentClasses.input}
              value={contractMsg.advancePaymentAmount}
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
          <div className={antdComponentClasses.colSpan}>
            <span className={classes.label}>
              <span></span>尾款类型:
            </span>
            <Input
              placeholder="请填写尾款类型"
              className={antdComponentClasses.input}
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
          <div className={antdComponentClasses.colSpan}>
            <span className={classes.label}>
              <span></span>尾款值:
            </span>
            <Input
              placeholder="请填写尾款值"
              className={antdComponentClasses.input}
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
          <div className={antdComponentClasses.colSpan}>
            <span className={classes.label}>
              <span></span>质保金类型:
            </span>
            <Input
              placeholder="请填写质保金类型"
              className={antdComponentClasses.input}
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
          <div className={antdComponentClasses.colSpan}>
            <span className={classes.label}>
              <span></span>质保金值:
            </span>
            <Input
              placeholder="请填写质保金值"
              className={antdComponentClasses.input}
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

export default StepsRemunerationContract;
