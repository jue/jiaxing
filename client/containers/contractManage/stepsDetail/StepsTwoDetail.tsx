import React, { useContext } from 'react';
import { Row, Col } from 'antd';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { ContractManageContext } from '../context/ContractManageContext';
import moment from 'moment';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    row: {
      marginTop: 48,
    },
    label: {
      fontSize: 14,
      color: '#000000',
      opacity: 0.45,
      fontWeight: 400,
      display: 'inline-block',
      width: 126,
    },
    tenderRow: {
      margin: '48px 0',
    },
    amount: {
      margin: '48px 0',
    },
  });
});

function StepsTwoDetail() {
  const classes = useStyles({});

  const { auditContractDetail } = useContext(ContractManageContext);

  return (
    <div>
      <Row gutter={{ xs: 12, md: 24 }}>
        <Col span={8}>
          <div>
            <span className={classes.label}>合同名称:</span>
            <span>{auditContractDetail.name}</span>
          </div>
        </Col>
        <Col span={8}>
          <div>
            <span className={classes.label}>合同统一编号:</span>
            <span>{auditContractDetail.number}</span>
          </div>
        </Col>
        <Col span={8}>
          <div>
            <span className={classes.label}>本单位合同编号:</span>
            <span>{auditContractDetail.unitUnifiedNumber}</span>
          </div>
        </Col>
      </Row>
      <Row gutter={{ xs: 12, md: 24 }} className={classes.row}>
        <Col span={21}>
          <div style={{ display: 'flex' }}>
            <span className={classes.label}>签订/生效日期:</span>
            <span>
              {auditContractDetail.contractEffectiveDate &&
                moment(auditContractDetail.contractEffectiveDate).format(
                  'YYYY-MM-DD'
                )}
            </span>
          </div>
        </Col>
      </Row>

      <Row gutter={{ xs: 12, md: 24 }} className={classes.tenderRow}>
        <Col span={8}>
          <div>
            <span className={classes.label}>发包人(甲方):</span>
            <span>{auditContractDetail.partyA}</span>
          </div>
        </Col>
        <Col span={8}>
          <div>
            <span className={classes.label}>发包人(法人):</span>
            <span>{auditContractDetail.partyALegalPerson}</span>
          </div>
        </Col>
        <Col span={8}>
          <div>
            <span className={classes.label}>发包人统一社会信用代码:</span>
            <span>{auditContractDetail.partyANumber}</span>
          </div>
        </Col>
      </Row>

      {auditContractDetail.partyB.length &&
        auditContractDetail.partyB.map((item, index) => (
          <Row gutter={{ xs: 12, md: 24 }} key={index}>
            <Col span={8}>
              <div>
                <span className={classes.label}>承包人(乙方):</span>
                <span>{item.partyB}</span>
              </div>
            </Col>
            <Col span={8}>
              <div>
                <span className={classes.label}>承包人(法人):</span>
                <span>{item.partyBLegalPerson}</span>
              </div>
            </Col>
            <Col span={8}>
              <div>
                <span className={classes.label}>承包人统一社会信用代码:</span>
                <span>{item.partyBNumber}</span>
              </div>
            </Col>
          </Row>
        ))}
    </div>
  );
}

export default StepsTwoDetail;
