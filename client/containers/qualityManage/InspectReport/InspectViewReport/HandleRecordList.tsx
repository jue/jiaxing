import { useState, useContext, useEffect } from 'react';

import { Box, Paper, Typography } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import { Rate, Descriptions } from 'antd';

import moment from 'moment';

import { InspectReportContext } from '../../context/InspectReportContext';

const useStyles = makeStyles(({ palette, spacing }) => {
  return createStyles({
    paper: {
      padding: spacing(1, 2.5),
      marginBottom: 12,
    },
    typography: {
      marginRight: 4,
      width: 70,
    },
  });
});

const HandleRecordList = () => {
  const { inspectRectification, inspectReportCreated } = useContext(
    InspectReportContext
  );
  const classes = useStyles({});
  const acceptResult = {
    pass: '通过',
    nopass: '不通过',
  };
  return (
    <Box width="40%">
      <Typography>办理记录</Typography>

      <div style={{ height: '85%', overflow: 'hidden' }}>
        <div style={{ height: '99%', overflow: 'auto' }}>
          <Box mt={3}>
            <Paper className={classes.paper}>
              <Typography color="textSecondary">整改安排</Typography>
              <Descriptions size="small">
                <Descriptions.Item label="安排人">
                  {inspectRectification.idExecutive}
                </Descriptions.Item>
              </Descriptions>

              <Descriptions size="small">
                <Descriptions.Item label="执行人">
                  {inspectRectification.idExecutive}
                </Descriptions.Item>
              </Descriptions>

              <Descriptions size="small">
                <Descriptions.Item label="截止日期">
                  {moment(inspectRectification.endTime).format('YYYY-MM-DD')}
                </Descriptions.Item>
              </Descriptions>

              <Descriptions size="small">
                <Descriptions.Item label="完成日期">
                  {moment(inspectRectification.endTime).format('YYYY-MM-DD')}
                </Descriptions.Item>
              </Descriptions>
            </Paper>

            <Paper className={classes.paper}>
              <Typography color="textSecondary">验收情况</Typography>
              <Descriptions size="small">
                <Descriptions.Item label="验收人">罗丹茹</Descriptions.Item>
              </Descriptions>

              <Descriptions size="small">
                <Descriptions.Item label="整改人">罗丹茹</Descriptions.Item>
              </Descriptions>

              <Descriptions size="small">
                <Descriptions.Item label="验收结果">
                  {acceptResult[inspectReportCreated.acceptResult]}
                </Descriptions.Item>
              </Descriptions>

              <Descriptions size="small">
                <Descriptions.Item label="验收评价">
                  <Rate
                    disabled
                    value={Number(inspectReportCreated.acceptEvaluation)}
                  />
                </Descriptions.Item>
              </Descriptions>
              <Descriptions size="small" column={8}>
                <Descriptions.Item label="验收结果">
                  {inspectReportCreated.acceptOpinion}
                </Descriptions.Item>
              </Descriptions>
            </Paper>
          </Box>
        </div>
      </div>
    </Box>
  );
};
export default HandleRecordList;
