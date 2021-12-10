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

function AddTerms() {
  const componentsClasses = componentsStyles({});
  const classes = useStyles({});
  const { contractMsg, setContractMsg, setOpenTermsComparison } = useContext(
    ContractManageContext
  );
  let arr =
    (contractMsg && contractMsg.payTerms && [...contractMsg.payTerms]) || [];

  return (
    <React.Fragment>
      {arr.map((item, index) => {
        return (
          <div key={index}>
            <div className={classes.label} style={{ marginTop: 24 }}>
              条款{NumberToChinese(index + 1)}:
            </div>
            <Row
              gutter={{ xs: 12, md: 24 }}
              style={{ marginTop: 24 }}
              key={index}
            >
              <Col span={8}>
                <div className={componentsClasses.colSpan}>
                  <span className={classes.label}>
                    <span></span> 支付内容:
                  </span>
                  <Input
                    placeholder="请填写支付内容"
                    className={componentsClasses.input}
                    value={item.payContent}
                    onChange={e => {
                      const { value } = e.target;
                      arr[index] = { ...arr[index], payContent: value };
                      setContractMsg({
                        ...contractMsg,
                        payTerms: [...arr],
                      });
                    }}
                  />
                </div>
              </Col>
              <Col span={8}>
                <div className={componentsClasses.colSpan}>
                  <span className={classes.label}>
                    <span></span> 支付金额:
                  </span>
                  <Input
                    placeholder="请填写支付金额"
                    className={componentsClasses.input}
                    type="number"
                    value={item.payAmount}
                    onChange={e => {
                      const { value } = e.target;
                      const reg = /^\d+(\.\d+)?$/;
                      arr[index] = {
                        ...arr[index],
                        payAmount: Number(value),
                        payPercentage: Number(
                          (
                            (Number(value) / contractMsg.amount) *
                            1000000
                          ).toFixed(2)
                        ),
                      };
                      setContractMsg({
                        ...contractMsg,
                        payTerms: [...arr],
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
                    <span></span> 支付占总额
                    <br />
                    百分比(%):
                  </span>
                  <Input
                    placeholder="请填写支付占总额百分比(%)"
                    className={componentsClasses.input}
                    type="number"
                    value={item.payPercentage}
                    onChange={e => {
                      const { value } = e.target;

                      arr[index] = {
                        ...arr[index],
                        payPercentage: Number(value),
                        payAmount: Number(
                          (Number(value) * contractMsg.amount) / 1000000
                        ),
                      };
                      setContractMsg({
                        ...contractMsg,
                        payTerms: [...arr],
                      });
                    }}
                  />
                </div>
              </Col>
            </Row>
            <Row
              gutter={{ xs: 12, md: 24 }}
              style={{ marginTop: 24 }}
              key={index}
            >
              <Col span={24}>
                <div className={componentsClasses.colSpan}>
                  <span className={classes.label}>
                    <span></span> 支付条件:
                  </span>
                  <Input
                    placeholder="请填写支付条件"
                    className={componentsClasses.input}
                    style={{ width: '90.5%' }}
                    value={item.payTerms}
                    onChange={e => {
                      const { value } = e.target;
                      arr[index] = { ...arr[index], payTerms: value };
                      setContractMsg({
                        ...contractMsg,
                        payTerms: [...arr],
                      });
                    }}
                  />
                </div>
              </Col>
            </Row>
          </div>
        );
      })}
    </React.Fragment>
  );
}

export default AddTerms;
