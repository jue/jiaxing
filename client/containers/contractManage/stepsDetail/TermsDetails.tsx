import { Row, Col } from 'antd';

export const TermsDetails = ({ classes, data }) => {
  return (
    <>
      {data.map((item, index) => (
        <div key={index}>
          {item && (item.key || item.value) && (
            <Row gutter={{ xs: 12, md: 24 }} className={classes.tenderRow}>
              <Col span={8}>
                <div>
                  <span className={classes.label}>属性名称:</span>
                  <span>{item.key}</span>
                </div>
              </Col>
              <Col span={16}>
                <div>
                  <span className={classes.label}>属性内容:</span>
                  <span>{item.value}</span>
                </div>
              </Col>
            </Row>
          )}
        </div>
      ))}
    </>
  );
};
