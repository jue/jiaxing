import { useContext } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Button from '@material-ui/core/Button';

import { Descriptions } from 'antd';

import clsx from 'clsx';
import moment from 'moment';
import { useRouter } from 'next/router';

import { InspectPlanSubjectList } from './InspectSubject';
import { inspectStyles } from '../../../styles/resetStyles';
import { InspectPlanReqContext } from '../context/InspectPlanReqContext';
import { InspectPlanStatusContext } from '../context/InspectPlanStatusContext';

const dateForm = 'YYYY-MM-DD';

const usePlanStyles = makeStyles(() => {
  return createStyles({
    planContanier: {
      borderRight: '1px dashed #B2B2B2',
      paddingRight: 27,
      marginRight: 29,
      width: '60%',
      overflow: 'auto',
    },
    planTitle: {
      fontSize: 16,
      fontWeight: 500,
      opacity: 0.8,
      lineHeight: '24px',
      marginBottom: 30,
    },

    filesReview: {
      margin: '49px 0 37px',
    },
    button: {
      width: 100,
      height: 34,
      borderRadius: 4,
      border: '1px solid rgba(143,194,32,1)',
      lineHeight: '22px',
      '& .MuiButton-label': {
        fontWeight: 400,
        color: '#555',
        fontSize: 14,
      },
    },
    fileItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cancelButton: {
      boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.1)',
      '& .MuiButton-label': {
        color: '#000',
        opacity: 0.3,
      },
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'flex-end',
      '& button': { width: 88 },
      '& button:nth-of-type(2)': {
        margin: '0 60px',
      },
      '& .MuiButton-label': {
        fontSize: 14,
        fontWeight: 400,
      },
    },
  });
});

export const InspectViewPlan = () => {
  const classes = usePlanStyles({});
  const classesReset = inspectStyles({});
  const router = useRouter();
  const { inspectCreatedPlan } = useContext(InspectPlanReqContext);
  const { setOpenFileViewDialog } = useContext(InspectPlanStatusContext);
  return (
    <div className="container">
      <div>
        <div className={classes.planTitle}>计划详情</div>
      </div>
      <div className={classesReset.createdInspectionPlan}>
        <div className={clsx([classesReset.flex, classes.planContanier])}>
          <Descriptions>
            <Descriptions.Item label="项目"> </Descriptions.Item>
          </Descriptions>
          <Descriptions>
            <Descriptions.Item label="标段"> </Descriptions.Item>
          </Descriptions>
          <Descriptions>
            <Descriptions.Item label="计划编号">
              {inspectCreatedPlan.number}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions>
            <Descriptions.Item label="计划名称">
              {inspectCreatedPlan.name}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions>
            <Descriptions.Item label="计划时间">
              {moment(inspectCreatedPlan.startTime).format(dateForm)}
              &nbsp;-&nbsp;
              {moment(inspectCreatedPlan.endTime).format(dateForm)}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions>
            <Descriptions.Item label="计划描述">
              {inspectCreatedPlan.desc}
            </Descriptions.Item>
          </Descriptions>

          <div className={classes.filesReview}>
            {inspectCreatedPlan.files &&
              inspectCreatedPlan.files.map((item, index) => {
                return (
                  <div key={index} className={classes.fileItem}>
                    <div>{item.originalname}</div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#3A3B3F',
                        fontSize: 12,
                        fontWeight: 400,
                        cursor: 'pointer',
                      }}
                      onClick={() => setOpenFileViewDialog(item._id)}
                    >
                      <VisibilityIcon
                        style={{
                          width: 22,
                          height: 22,
                          color: '#8FC220',
                          marginRight: 10,
                        }}
                      />
                      <span>预览</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <InspectPlanSubjectList />
      </div>
      <div className={classes.buttonGroup}>
        <Button
          className={classes.cancelButton}
          onClick={() => {
            router.push('/quality/inspectPlan');
          }}
        >
          返回
        </Button>
        <Button color="primary" variant="contained">
          预览
        </Button>
        <Button color="primary" variant="contained">
          下载
        </Button>
      </div>
    </div>
  );
};
