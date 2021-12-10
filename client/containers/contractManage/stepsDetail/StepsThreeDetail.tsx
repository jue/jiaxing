import React, { useContext } from 'react';
import { Row, Col } from 'antd';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { ContractManageContext } from '../context/ContractManageContext';

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
    subTitle: {
      fontSize: 10,
      display: 'block',
      marginTop: -6,
      color: '#000000',
      opacity: 0.45,
      fontWeight: 400,
      width: 110,
    },
  });
});

function StepsThreeDetail() {
  const classes = useStyles({});
  const { auditContractDetail } = useContext(ContractManageContext);

  return (
    <div>
      <Row gutter={{ xs: 12, md: 24 }}>
        <Col span={8}>
          <div>
            <span className={classes.label}>计划开工日期:</span>
            <span>
              {auditContractDetail.planStartDate &&
                moment(auditContractDetail.planStartDate).format('YYYY-MM-DD')}
            </span>
          </div>
        </Col>
        <Col span={8}>
          <div>
            <span className={classes.label}>计划竣工日期:</span>
            <span>
              {auditContractDetail.planEndDate &&
                moment(auditContractDetail.planEndDate).format('YYYY-MM-DD')}
            </span>
          </div>
        </Col>
        <Col span={8}>
          <div>
            <span className={classes.label}>合同工期:</span>
            <span>{auditContractDetail.contractTime}</span>
          </div>
        </Col>
      </Row>

      <Row gutter={{ xs: 12, md: 24 }} className={classes.row}>
        <Col span={8}>
          <div>
            <span className={classes.label}>招标工期:</span>
            <span>{auditContractDetail.tenderTime}</span>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default StepsThreeDetail;
