import React, { useContext } from 'react';
import { Row, Col } from 'antd';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { ContractManageContext } from '../context/ContractManageContext';
import { contractType } from '../enum';

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

function StepsOneDetail() {
  const classes = useStyles({});
  const { auditContractDetail } = useContext(ContractManageContext);

  return (
    <div>
      <Row gutter={{ xs: 12, md: 24 }}>
        <Col span={8}>
          <div>
            <span className={classes.label}>项目名称:</span>

            <span>
              {auditContractDetail.engineering &&
                auditContractDetail.engineering.name}
            </span>
          </div>
        </Col>
        <Col span={8}>
          <div>
            <span className={classes.label}>标段名称:</span>

            <span>{auditContractDetail.blockName}</span>
          </div>
        </Col>
        <Col span={8}>
          <div>
            <span className={classes.label}>项目地点:</span>

            <span>{auditContractDetail.projectSite}</span>
          </div>
        </Col>
      </Row>
      <Row gutter={{ xs: 12, md: 24 }} className={classes.row}>
        <Col span={8}>
          <div>
            <span className={classes.label}>资金来源:</span>
            <span>{auditContractDetail.capitalSource}</span>
          </div>
        </Col>
        <Col span={8}>
          <div>
            <span className={classes.label}>
              工程核准(备案)
              <br />
              证编号:
            </span>
            <span>{auditContractDetail.projectApprovalNumber}</span>
          </div>
        </Col>
      </Row>

      <Row gutter={{ xs: 12, md: 24 }} className={classes.row}>
        <Col span={8}>
          <div>
            <span className={classes.label}>项目规模及特征:</span>
            <span>{auditContractDetail.projectScale}</span>
          </div>
        </Col>
        <Col span={8}>
          <div>
            <span className={classes.label}>项目承包范围:</span>
            <span>{auditContractDetail.projectScope}</span>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default StepsOneDetail;
