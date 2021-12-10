import React, { useContext } from 'react';
import { Row, Col } from 'antd';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
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
  });
});

function StepsFourDetail() {
  const classes = useStyles({});
  const { auditContractDetail } = useContext(ContractManageContext);

  return (
    <div>
      <Row gutter={{ xs: 12, md: 24 }}>
        <Col span={8}>
          <div>
            <span className={classes.label}>合同总金额:</span>
            <span>{Number(auditContractDetail.amount) / 10000}</span>
          </div>
        </Col>
        <Col span={8}>
          <div>
            <span className={classes.label}>材料和工程设备暂估价金额:</span>
            <span>
              {Number(auditContractDetail.matEngDesignEstAmount) / 10000}
            </span>
          </div>
        </Col>
        <Col span={8}>
          <div>
            <span className={classes.label}>安全文明施工费: </span>
            <span>
              {Number(auditContractDetail.safeCivilizedAmount) / 10000}
            </span>
          </div>
        </Col>
      </Row>
      <Row gutter={{ xs: 12, md: 24 }} className={classes.row}>
        <Col span={8}>
          <div>
            <span className={classes.label}>专业工程暂估价金额:</span>
            <span>{Number(auditContractDetail.proEngEstAmount) / 10000}</span>
          </div>
        </Col>
        <Col span={8}>
          <div>
            <span className={classes.label}>暂列金额:</span>
            <span>{Number(auditContractDetail.provisionalAmount) / 10000}</span>
          </div>
        </Col>
        <Col span={8}>
          <div>
            <span className={classes.label}>合同可变更金额:</span>
            <span>{Number(auditContractDetail.changeableAmount) / 10000}</span>
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

export default StepsFourDetail;
