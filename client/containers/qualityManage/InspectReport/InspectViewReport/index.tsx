import { useContext, useState, useEffect } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import { useRouter } from 'next/router';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Box from '@material-ui/core/Box';
import { Descriptions } from 'antd';

import { InspectReportContext } from '../../context/InspectReportContext';
import { InspectPlanStatusContext } from '../../context/InspectPlanStatusContext';

import TaskShowLeft from '../../../../components/Svgs/TaskShowLeft';
import TaskHiddenRight from '../../../../components/Svgs/TaskHiddenRight';

import TaskHandleList from './TaskHandleList';
import HandleRecordList from './HandleRecordList';
import CheckItemContent from '../SubjectDialog/CheckItemContent';

import { inspectStyles } from '../../../../styles/resetStyles';

const dateForm = 'YYYY-MM-DD';

const usePlanStyles = makeStyles(() => {
  return createStyles({
    planContanier: {
      borderRight: '1px dashed #B2B2B2',
      paddingRight: 27,
      // marginRight: 29,
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
      height: 34,
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

const InspectViewReport = () => {
  const classes = usePlanStyles({});
  const classesReset = inspectStyles({});
  const router = useRouter();

  const { inspectReportCreated, setInspectCheckList } = useContext(
    InspectReportContext
  );
  const { setOpenFileViewDialog } = useContext(InspectPlanStatusContext);

  const reportType = {
    constructionUnit: '施工单位自检',
    supervisionUnit: '监理单位检查',
    developmentUnit: '建设单位检查',
    projectJoint: '项目联合检查',
    other: '其他',
  };
  const reportWay = {
    day: '日常检查',
    special: '专项检查',
    spot: '抽检',
  };
  const reportFrequency = {
    week: '每周',
    month: '每月',
    quarter: '每季度',
    year: '每年',
    withOutday: '不定期',
  };
  const reportResult = {
    qualified: '合格',
    warning: '预警',
    rectification: '整改',
    shutdownRectification: '停工整改',
  };
  useEffect(() => {
    setQualityTitle(window.localStorage.getItem('qualityTitle'));
  }, []);
  const [qualityTitle, setQualityTitle] = useState('');
  const [show, setShow] = useState(false);

  return (
    <div className="container">
      <Box position="relative">
        <div className={classes.planTitle}>
          {qualityTitle === 'report' ? '检查详情' : '整改任务名称'}
        </div>
      </Box>
      <div className={classesReset.createdInspectionPlan}>
        <div className={clsx([classesReset.flex, classes.planContanier])}>
          <Descriptions>
            <Descriptions.Item label="项目"> </Descriptions.Item>
          </Descriptions>
          <Descriptions>
            <Descriptions.Item label="标段"> </Descriptions.Item>
          </Descriptions>
          <Descriptions>
            <Descriptions.Item label="检查编号">
              {inspectReportCreated.number}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions>
            <Descriptions.Item label="检查主题">
              {inspectReportCreated.name}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions>
            <Descriptions.Item label="编辑时间">
              {moment(inspectReportCreated.atCreated).format(dateForm)}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions>
            <Descriptions.Item label="检查单位">
              建设单位
              {/* {inspectReportCreated.desc} */}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions>
            <Descriptions.Item label="检查类型">
              {reportType[inspectReportCreated.type]}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions>
            <Descriptions.Item label="检查方式">
              {reportWay[inspectReportCreated.way]}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions>
            <Descriptions.Item label="检查频率">
              {reportFrequency[inspectReportCreated.frequency]}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions>
            <Descriptions.Item label="检查结果">
              {reportResult[inspectReportCreated.result]}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions
            style={{
              borderBottom: '1px solid rgba(230,233,236,1)',
              paddingBottom: 20,
            }}
          >
            <Descriptions.Item label="检查描述">
              {inspectReportCreated.desc}
            </Descriptions.Item>
          </Descriptions>

          <div className={classes.filesReview}>
            {inspectReportCreated.files &&
              inspectReportCreated.files.map((item, index) => {
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
                      }}
                      onClick={() => {
                        setOpenFileViewDialog(item._id);
                      }}
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
        {show === false && (
          <>
            <Box mr={3} display="flex" alignItems="center">
              <div onClick={() => setShow(true)}>
                <TaskShowLeft />
              </div>
            </Box>
            {qualityTitle === 'rectification' && <TaskHandleList />}
            {qualityTitle === 'report' && <HandleRecordList />}
          </>
        )}
        {show === true && (
          <>
            <CheckItemContent />

            <Box display="flex" alignItems="center" mr="-40px">
              <div onClick={() => setShow(false)}>
                <TaskHiddenRight />
              </div>
            </Box>
          </>
        )}
      </div>
      <div className={classes.buttonGroup}>
        <Button
          className={classes.cancelButton}
          onClick={() => {
            router.push('/quality/inspectReport');
            setInspectCheckList({});
          }}
        >
          返回
        </Button>

        {/* <Button color="primary" variant="contained" style={{ padding: 0 }}>
          下载
        </Button>
        <Button
          color="primary"
          variant="contained"
          startIcon={<TaskHandle />}
          style={{ width: 102, padding: 0 }}
          onClick={() => {
            setTaskHandle(true);
          }}
        >
          任务处理
        </Button> */}
      </div>
    </div>
  );
};
export default InspectViewReport;
