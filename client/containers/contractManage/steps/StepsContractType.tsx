import React, { useContext } from 'react';
import { Select, Input, Row, Col } from 'antd';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { componentsStyles } from '../style';
import { ContractManageContext } from '../context/ContractManageContext';
import clsx from 'clsx';
import { contractType } from '../enum';

const { Option } = Select;
const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    row: {
      marginTop: 48,
    },
    label: {
      fontSize: 14,
      color: 'rgba(0,0,0,0.45)',
      fontWeight: 400,
      width: '30%',
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
    proColSpan: {
      '& .ant-input-affix-wrapper': {
        width: '100%',
      },
    },
  });
});

function StepsContractType() {
  const componentsClasses = componentsStyles({});
  const classes = useStyles({});
  const { contractMsg, setContractMsg, tabIndex } = useContext(
    ContractManageContext
  );

  function onChange(value) {
    console.log(`selected ${value}`);
  }

  function onBlur() {
    console.log('blur');
  }

  function onFocus() {
    console.log('focus');
  }

  function onSearch(val) {
    console.log('search:', val);
  }

  return (
    <div>
      <Row gutter={{ xs: 12, md: 24 }} style={{ marginBottom: 20 }}>
        {tabIndex === 0 && (
          <Col span={8} style={{ marginLeft: 47, paddingRight: 24 }}>
            <div
              className={clsx([componentsClasses.colSpan, classes.proColSpan])}
            >
              <span className={classes.label}>
                <span>*</span> <span>合同类型:</span>
              </span>
              <Select
                className={componentsClasses.select}
                placeholder="请选择合同类型"
                value={contractType[contractMsg.contractType] || undefined}
                onChange={value => {
                  setContractMsg({ ...contractMsg, contractType: value });
                }}
              >
                <Option value="construction">施工合同</Option>
                <Option value="supervision">监理合同</Option>
                <Option value="other">其他合同（服务类）</Option>
              </Select>
            </div>
          </Col>
        )}
        <Col
          span={8}
          style={{
            paddingRight: 46,
            paddingLeft: 0,
            marginLeft: tabIndex === 1 ? 47 : 0,
          }}
        >
          <div className={componentsClasses.colSpan}>
            <span className={classes.label}>
              <span></span> <span>中标通知书:</span>
            </span>
            {/* 可选择可输入 */}
            {/* <Select
              showSearch
              placeholder="请选择中标通知书"
              value={contractMsg.letterAcceptance}
              onChange={e => {
                const { value } = e.target;
                setContractMsg({ ...contractMsg, letterAcceptance: value });
              }}
              onBlur={(event: React.FocusEvent<HTMLElement>): void => {
                const { value } = event.target;
                setContractMsg({ ...contractMsg, letterAcceptance: value });
              }}
              onSearch={value => {
                setContractMsg({ ...contractMsg, letterAcceptance: value });
              }}
              className={componentsClasses.select}
              notFoundContent="暂无数据"
            ></Select> */}
            <Input
              placeholder="请填写中标通知书"
              className={componentsClasses.input}
              value={contractMsg && contractMsg.letterAcceptance}
              onChange={e => {
                const { value } = e.target;
                setContractMsg({
                  ...contractMsg,
                  letterAcceptance: value,
                });
              }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default StepsContractType;
