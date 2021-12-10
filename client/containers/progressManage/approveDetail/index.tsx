import React, { useContext, useEffect, useRef, useState } from 'react';
import moment from 'antd/node_modules/moment';
import { useRouter } from 'next/router';
import { LayoutPageContext } from '../../layout/context/LayoutPageContext';
import ProgressManageContextProvder, {
  ProgressManageContext,
  ProgressManageContextI,
} from './ProgressManageContext';
import ProgressManageGantt from './scriptGant/ProgressManageGantt';
import ProgressManageModelIframe from './scriptGant/ProgressManageModelIframe';
import clsx from 'clsx';
import useProgressManageStyles from './ProgressManageStyles';
import { withRouter } from 'next/router';
import ProgressManageToolbar from './scriptGant/ProgressMangeToolbar';
import FlowContextProvider from '../../../contexts/FlowContext';
import progressSvc from '../../../services/ProgressSvc';
import { message } from 'antd';
const actions = {
  update: '更新',
  batchUpdate: '批量更新',
  delete: '删除',
  batchDelete: '批量删除',
  create: '创建',
  batchCreate: '批量创建',
};
const PMI = ({ router }) => {
  const classes = useProgressManageStyles();
  const { openModel, ganttScripts, approvalInfo, setApprovalInfo } = useContext<
    ProgressManageContextI
  >(ProgressManageContext);
  const { setParts } = useContext(LayoutPageContext);
  const [taskInfo, setTaskInfo] = useState({ data: [] });
  const container = useRef<HTMLDivElement>();
  useEffect(() => {
    setParts(['进度审批详情']);
  }, [router.query]);

  useEffect(() => {
    ganttScripts.gantt.clearAll();
    handleInitData();
    const avaHeight = window.innerHeight - 210;
    container.current.style.height = `${avaHeight}px`;
    return () => {
      // ganttScripts.gantt.destructor();
    };
  }, []);
  // 加载审批数据
  const handleInitData = () => {
    progressSvc.query({}).then((datas) => {
      const progressData: any = datas.data;
      const taskInfoData: any = {
        data: progressData.data.map((item) => {
          // console.log(item);
          let endDate = new Date(item.start_date);
          let endDate1 = endDate.getTime() + item.duration * 3600 * 24 * 1000;
          item.start_date = moment(item.start_date).format('DD-MM-YYYY');
          item.end_date = moment(new Date(endDate1).toISOString()).format(
            'DD-MM-YYYY'
          );
          // item.check_value = false;
          item.sgPrincipal = item.resource.length > 0 ? item.resource[0] : '';
          item.id = item._id;
          item.$custom_data = null;
          item.delay = 1;
          item.progress = item.progress <= 0.00001 ? 0.00001 : item.progress;
          item.importantNode =
            item.importantNode && item.importantNode == '1' ? '1' : '0';
          return {
            ...item,
            ...item.custom_data,
            priority: item.custom_data.priority + '',
          };
        }),
      };
      for (let i = 0; i < progressData.data.length; i++) {
        if (progressData.data[i].detail) {
          taskInfoData.links = progressData.data[i].detail.links;
          break;
        }
      }
      setTaskInfo(taskInfoData);
      handleOnTask(taskInfoData);
    });
  };
  const setGanttRowStyle = (approvaData) => {
    ganttScripts.gantt.templates.grid_row_class = ganttScripts.gantt.templates.task_row_class = (
      start_date,
      end_date,
      item
    ) => {
      let count = 0;
      approvaData.forEach((approval) => {
        if (item.id === approval.id) {
          // console.log(1);
          count++;
        }
      });
      if (count > 0) {
        return 'red';
      }
    };
  };
  const handleOnTask = (taskInfoData) => {
    progressSvc
      .approveSearch({ _id: router.query.id })
      .then((res) => {
        if (res.code == 200) {
          const {
            data,
            account,
            actionType,
            atCreated,
            progressId,
            links,
          } = res.data;
          setApprovalInfo({
            num: Array.isArray(data)
              ? data.length
              : actionType.indexOf('batch') != -1
              ? progressId.length
              : 1,
            author: account.userName,
            actionType: actions[actionType],
            date: moment(atCreated).format('YYYY-MM-DD'),
          });
          if (data && Array.isArray(data)) {
            let newTaskInfo = { ...taskInfoData };
            let approvaData = data.map((item) => {
              let endDate = new Date(item.start_date);
              let endDate1 =
                endDate.getTime() + item.duration * 3600 * 24 * 1000;
              item.start_date = moment(item.start_date).format('DD-MM-YYYY');
              item.end_date = moment(new Date(endDate1).toISOString()).format(
                'DD-MM-YYYY'
              );
              // item.check_value = false;
              item.$custom_data = null;
              item._id = item.id;
              item.delay = 1;
              item.progress =
                item.progress <= 0.00001 ? 0.00001 : item.progress;
              item.importantNode = item.importantNode ? '1' : '';
              item.priority = item.custom_data
                ? item.custom_data.priority + ''
                : '';
              return { ...item, account };
            });
            ganttScripts.gantt.parse({
              data: newTaskInfo.data.concat(approvaData),
              links: links
                ? newTaskInfo.links && newTaskInfo.links.concat(links)
                : newTaskInfo.links,
            });
            setGanttRowStyle(approvaData);
            ganttScripts.gantt.refreshData();
          } else {
            let newTaskInfo = { ...taskInfoData };
            let count = 0;
            newTaskInfo.data.forEach((item, index) => {
              if (res.data.progressId.indexOf(item._id) != -1) {
                count++;
                if (res.data.data) {
                  newTaskInfo.data[index] = {
                    ...newTaskInfo.data[index],
                    ...res.data.data,
                    ...res.data.data.custom_data,
                    sgPrincipal: data.resource[0],
                    start_date: data.start_date
                      ? moment(data.start_date).format('DD-MM-YYYY')
                      : newTaskInfo.data[index].start_date,
                    end_date: data.end_date
                      ? moment(data.end_date).format('DD-MM-YYYY')
                      : newTaskInfo.data[index].end_date,
                    account: account,
                    priority: data.custom_data.priority + '',
                    resourcAccount: res.data.resourcAccount,
                    delay: 1,
                  };
                } else {
                  newTaskInfo.data[index] = {
                    ...res.data.data,
                    ...newTaskInfo.data[index],
                    sgPrincipal:
                      newTaskInfo.data[index].resource.length > 0
                        ? newTaskInfo.data[index].resource[0]
                        : '',
                    account: account,
                    priority: newTaskInfo.data[index].priority + '',
                    delay: 1,
                  };
                }
              }
            });
            if (count == 0) {
              newTaskInfo.data.push({
                ...data,
                ...data.custom_data,
                id:
                  res.data.progressId.length > 0
                    ? res.data.progressId[0]
                    : '888888',
                account: account,
                text: data ? data.text : res.data.name,
                delay: 1,
                start_date: data
                  ? moment(data.start_date).format('DD-MM-YYYY')
                  : '',
                end_date: data
                  ? moment(data.end_date).format('DD-MM-YYYY')
                  : '',
                importantNode: data.importantNode,
                resourcAccount: res.data.resourcAccount,
              });
            }
            ganttScripts.gantt.parse({
              data: newTaskInfo.data,
              links: links
                ? newTaskInfo.links && newTaskInfo.links.concat(links)
                : newTaskInfo.links,
            });
            ganttScripts.gantt.templates.grid_row_class = ganttScripts.gantt.templates.task_row_class = (
              start_date,
              end_date,
              item
            ) => {
              if (item.id == '888888') {
                return 'red';
              }
              if (res.data.progressId.indexOf(item.id) != -1) {
                return 'red';
              }
            };
            ganttScripts.gantt.refreshData();
          }
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <div
        ref={(ref) => {
          container.current = ref;
        }}
        className={clsx({
          [classes.closeModel]: !openModel,
          [classes.openModel]: openModel,
        })}
      >
        {' '}
        {approvalInfo.author && (
          <div className={clsx(classes.marginGapContainer)}>
            <span className={clsx(classes.marginGap, classes.marginGapBg)}>
              当前审批任务数：
            </span>
            <span className={clsx(classes.marginGapBg)}>
              {approvalInfo.num}
            </span>
            <span className={clsx(classes.marginGap)}>操作：</span>
            <span>{approvalInfo.actionType}</span>
            <span className={clsx(classes.marginGap)}>申请人：</span>
            <span>{approvalInfo.author}</span>
            <span className={clsx(classes.marginGap)}>申请时间：</span>
            <span>{approvalInfo.date}</span>
          </div>
        )}
        <ProgressManageGantt />
        {openModel && <ProgressManageModelIframe />}
      </div>
    </>
  );
};

const PMIIndex = withRouter(PMI);
const ApproveDetail = () => {
  return (
    <ProgressManageContextProvder>
      {/* <FlowContextProvider> */}
      <ProgressManageToolbar />
      <PMIIndex />
      {/* </FlowContextProvider> */}
    </ProgressManageContextProvder>
  );
};

export default ApproveDetail;
