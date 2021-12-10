import React, { useState, useContext, useEffect } from 'react';
import { Input, Row, Col, Select } from 'antd';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { ContractManageContext } from '../context/ContractManageContext';

const { Option } = Select;
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
  });
});

function StepsRemunerationContractDetail() {
  const classes = useStyles({});
  const [open, setOpen] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const { auditContractDetail } = useContext(ContractManageContext);

  return (
    <div>
      <Row gutter={{ xs: 12, md: 24 }}>
        <Col span={8}>
          <div>
            <span className={classes.label}>酬金方式:</span>

            <span>{auditContractDetail.remunerationType}</span>
          </div>
        </Col>
        <Col span={8}>
          <div>
            <span className={classes.label}>酬金范围:</span>

            <span>{auditContractDetail.remunerationScope}</span>
          </div>
        </Col>

        <Col span={8}>
          <div>
            <span className={classes.label}>签约酬金合同总额:</span>

            <span>{Number(auditContractDetail.amount) / 10000}</span>
          </div>
        </Col>
      </Row>

      <Row gutter={{ xs: 12, md: 24 }} className={classes.row}>
        <Col span={8}>
          <div>
            <span className={classes.label}>预付款类型:</span>

            <span>{auditContractDetail.advancePaymentType}</span>
          </div>
        </Col>

        <Col span={8}>
          <div>
            <span className={classes.label}>预付款值:</span>

            <span>{auditContractDetail.advancePaymentAmount}</span>
          </div>
        </Col>
      </Row>
      <Row gutter={{ xs: 12, md: 24 }} className={classes.row}>
        <Col span={8}>
          <div>
            <span className={classes.label}>尾款类型:</span>

            <span>{auditContractDetail.balancePaymentType}</span>
          </div>
        </Col>

        <Col span={8}>
          <div>
            <span className={classes.label}>尾款值:</span>

            <span>{auditContractDetail.balancePaymentAmount}</span>
          </div>
        </Col>
      </Row>
      <Row gutter={{ xs: 12, md: 24 }} className={classes.row}>
        <Col span={8}>
          <div>
            <span className={classes.label}>质保金类型:</span>

            <span>{auditContractDetail.qualityMoneyType}</span>
          </div>
        </Col>
        <Col span={8}>
          <div>
            <span className={classes.label}>质保金值:</span>

            <span>{auditContractDetail.qualityMoneyAmount}</span>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default StepsRemunerationContractDetail;
