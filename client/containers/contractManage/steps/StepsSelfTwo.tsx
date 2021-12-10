import React, { useState, useContext } from 'react';
import { Input, Row, Col, Button, Select, DatePicker } from 'antd';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { componentsStyles } from '../style';
import { ContractManageContext } from '../context/ContractManageContext';
import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';
import AddPartyB from './AddPartyB';
moment.locale('zh-cn');

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
  });
});

function StepsSelfTwo() {
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
              <span>*</span> 合同名称:
            </span>
            <Input
              placeholder="请填写合同名称"
              className={componentsClasses.input}
              value={contractMsg.name}
              onChange={e => {
                const { value } = e.target;
                setContractMsg({ ...contractMsg, name: value });
              }}
            />
          </div>
        </Col>
        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span className={classes.label}>
              <span></span> 合同统一编号:
            </span>
            <Input
              placeholder="请填写合同统一编号"
              className={componentsClasses.input}
              value={contractMsg.number}
              onChange={e => {
                const { value } = e.target;
                setContractMsg({ ...contractMsg, number: value });
              }}
            />
          </div>
        </Col>
        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span className={classes.label}>
              <span></span> 本单位合同编号:
            </span>
            <Input
              placeholder="请填写本单位合同编号"
              className={componentsClasses.input}
              value={contractMsg.unitUnifiedNumber}
              onChange={e => {
                const { value } = e.target;
                setContractMsg({
                  ...contractMsg,
                  unitUnifiedNumber: value,
                });
              }}
            />
          </div>
        </Col>
      </Row>
      <Row gutter={{ xs: 12, md: 24 }} className={classes.row}>
        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span className={classes.label}>合同生效日期:</span>
            <DatePicker
              disabled
              locale={locale}
              className={componentsClasses.datePicker}
            />
          </div>
        </Col>
        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span className={classes.label}>
              <span>*</span> 资金来源:
            </span>
            <Select
              className={componentsClasses.select}
              onChange={value => {
                setContractMsg({ ...contractMsg, capitalSource: value });
              }}
              placeholder="请选择资金来源"
              value={contractMsg.capitalSource}
            >
              <Option value="部门预算">部门预算</Option>
              <Option value="政府投资">政府投资</Option>
            </Select>
          </div>
        </Col>
      </Row>
      <Row gutter={{ xs: 12, md: 24 }} className={classes.row}>
        <Col span={24}>
          <div className={componentsClasses.colSpan}>
            <span className={classes.label}>
              <span>*</span> 合同描述:
            </span>
            <Input
              placeholder="请填写合同描述"
              className={componentsClasses.input}
              style={{ width: '88%' }}
              value={contractMsg.contractDesc}
              onChange={e => {
                const { value } = e.target;
                setContractMsg({ ...contractMsg, contractDesc: value });
              }}
            />
          </div>
        </Col>
      </Row>
      <Row gutter={{ xs: 12, md: 24 }} className={classes.row}>
        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span className={classes.label}>
              <span>*</span> 甲方:
            </span>
            <Input
              placeholder="请填写甲方"
              className={componentsClasses.input}
              value={contractMsg.partyA}
              onChange={e => {
                const { value } = e.target;
                setContractMsg({ ...contractMsg, partyA: value });
              }}
            />
          </div>
        </Col>
        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span className={classes.label}>
              <span>*</span> 甲方法人:
            </span>
            <Input
              placeholder="请填写甲方法人"
              className={componentsClasses.input}
              value={contractMsg.partyALegalPerson}
              onChange={e => {
                const { value } = e.target;
                setContractMsg({ ...contractMsg, partyALegalPerson: value });
              }}
            />
          </div>
        </Col>
        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span
              className={classes.label}
              style={{ height: 40, lineHeight: '19px' }}
            >
              <span></span> 甲方统一社会
              <br />
              信用代码:
            </span>
            <Input
              placeholder="请填写甲方统一社会信用代码"
              className={componentsClasses.input}
              value={contractMsg.partyANumber}
              onChange={e => {
                const { value } = e.target;
                setContractMsg({
                  ...contractMsg,
                  partyANumber: value,
                });
              }}
            />
          </div>
        </Col>
      </Row>
      <AddPartyB />
      <Button
        style={{ marginTop: 24 }}
        onClick={() => {
          setContractMsg({
            ...contractMsg,
            partyB: [
              ...contractMsg.partyB,
              {
                partyB: '',
                partyBNumber: '',
                partyBLegalPerson: '',
              },
            ],
          });
        }}
      >
        添加乙方
      </Button>
    </div>
  );
}

export default StepsSelfTwo;
