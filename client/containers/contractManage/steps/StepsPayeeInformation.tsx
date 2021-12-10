import React, { useContext } from 'react';
import { Input, Row, Col } from 'antd';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { componentsStyles } from '../style';
import { ContractManageContext } from '../context/ContractManageContext';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    label: {
      fontSize: 14,
      color: 'rgba(0,0,0,0.45)',
      fontWeight: 400,
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

    addIcon: {
      '& svg': {
        width: 24,
        height: 24,
        color: '#2BA3FD',
      },
    },
    item: {
      display: 'flex',
      alignItems: 'center',
    },
  });
});

function StepsPayeeInformation() {
  const componentsClasses = componentsStyles({});
  const classes = useStyles({});
  const { contractMsg, setContractMsg } = useContext(ContractManageContext);

  return (
    <Row gutter={{ xs: 12, md: 24 }} style={{ marginTop: 24 }}>
      <Col span={8}>
        <div className={componentsClasses.colSpan}>
          <span className={classes.label}>
            <span></span> 开户银行:
          </span>
          <Input
            placeholder="请填写开户银行"
            className={componentsClasses.input}
            value={contractMsg && contractMsg.openAccountBank}
            onChange={e => {
              const { value } = e.target;
              setContractMsg({
                ...contractMsg,
                openAccountBank: value,
              });
            }}
          />
        </div>
      </Col>
      <Col span={8}>
        <div className={componentsClasses.colSpan}>
          <span className={classes.label}>
            <span></span> 开户人:
          </span>
          <Input
            placeholder="请填写开户人"
            className={componentsClasses.input}
            value={contractMsg && contractMsg.openAccountPerson}
            onChange={e => {
              const { value } = e.target;
              setContractMsg({
                ...contractMsg,
                openAccountPerson: value,
              });
            }}
          />
        </div>
      </Col>
      <Col span={8}>
        <div className={componentsClasses.colSpan}>
          <span className={classes.label}>
            <span></span> 银行账号:
          </span>
          <Input
            placeholder="请填写银行账号"
            className={componentsClasses.input}
            value={contractMsg && contractMsg.openAccount}
            onChange={e => {
              const { value } = e.target;
              setContractMsg({
                ...contractMsg,
                openAccount: value,
              });
            }}
          />
        </div>
      </Col>
    </Row>
  );
}

export default StepsPayeeInformation;
