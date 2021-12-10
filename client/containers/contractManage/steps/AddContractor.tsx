import React, { useContext } from 'react';
import { Input, Row, Col, Button } from 'antd';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { componentsStyles } from '../style';
import { PlusCircleFilled } from '@ant-design/icons';
import { ContractManageContext } from '../context/ContractManageContext';
import NumberToChinese from '../../../components/NumberToChinese';

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

function AddContractor() {
  const componentsClasses = componentsStyles({});
  const classes = useStyles({});
  const { contractMsg, setContractMsg, setOpenTermsComparison } = useContext(
    ContractManageContext
  );
  let arr = (contractMsg && contractMsg.partyB) || [];

  return (
    <React.Fragment>
      {arr.map((item, index) => {
        return (
          <Row
            gutter={{ xs: 12, md: 24 }}
            style={{ marginTop: 24 }}
            key={index}
          >
            <Col span={8}>
              <div className={componentsClasses.colSpan}>
                <span className={classes.label}>
                  <span>*</span> 承包人(乙方):
                </span>
                <Input
                  placeholder="请填写承包人(乙方)"
                  className={componentsClasses.input}
                  value={item.partyB}
                  onChange={e => {
                    const { value } = e.target;
                    arr[index] = { ...arr[index], partyB: value };
                    setContractMsg({
                      ...contractMsg,
                      partyB: [...arr],
                    });
                  }}
                />
              </div>
            </Col>
            <Col span={8}>
              <div className={componentsClasses.colSpan}>
                <span className={classes.label}>
                  <span>*</span> 承包人(法人):
                </span>
                <Input
                  placeholder="请填写承包人(法人)"
                  className={componentsClasses.input}
                  value={item.partyBLegalPerson}
                  onChange={e => {
                    const { value } = e.target;
                    arr[index] = {
                      ...arr[index],
                      partyBLegalPerson: value,
                    };
                    setContractMsg({
                      ...contractMsg,
                      partyB: [...arr],
                    });
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
                  <span></span> 承包人统一社
                  <br />
                  会信用代码:
                </span>
                <Input
                  placeholder="请填写承包人统一社会信用代码"
                  className={componentsClasses.input}
                  value={item.partyBNumber}
                  onChange={e => {
                    const { value } = e.target;
                    arr[index] = { ...arr[index], partyBNumber: value };
                    setContractMsg({
                      ...contractMsg,
                      partyB: [...arr],
                    });
                  }}
                />
              </div>
            </Col>
          </Row>
        );
      })}
    </React.Fragment>
  );
}

export default AddContractor;
