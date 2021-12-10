import { Button, Popover, Typography } from '@material-ui/core';
import {
  ProgressManageContext,
  ProgressManageContextI,
} from '../ProgressManageContext';
import { useContext, useEffect, useRef, useState } from 'react';

import useProgressManageStyles from '../ProgressManageStyles';
const timeTypes = ['day', 'week', 'month', 'quarter', 'year'];
const ProgressManageGantt = () => {
  const classes = useProgressManageStyles();

  const { openModel, timeTypeIndex, ganttScripts } = useContext<
    ProgressManageContextI
  >(ProgressManageContext);

  const ganttContainer = useRef<HTMLDivElement>();
  const [openDelayPopover, setOpenDelayPopover] = useState(false);
  const [delayPopoverAnchor, setDelayPopoverAnchor] = useState();
  const [id, setId] = useState();

  useEffect(() => {
    const avaHeight = window.innerHeight - 210;
    ganttContainer.current.style.height = `${
      openModel ? avaHeight / 2 : avaHeight
    }px`;
  }, [openModel]);

  useEffect(() => {
    ganttScripts.gantt.i18n.setLocale('cn');

    ganttScripts.init(ganttContainer.current, {
      delayClick: (target, id) => {
        setId(id);
        setDelayPopoverAnchor(target);
        setOpenDelayPopover(true);
      },
    });
    return () => {
      ganttScripts.destructor();
    };
  }, []);

  // useEffect(() => {
  //   ganttScripts.setZoom(timeTypes[timeTypeIndex]);
  // }, [ganttScripts, timeTypeIndex]);

  return (
    <>
      <link rel="stylesheet" href="/static/css/dhtmlxgantt.css" />
      <link rel="stylesheet" href="/static/css/dhtmlxgantt_material.css" />
      <link rel="stylesheet" href="/static/css/progress_manage.css" />
      {/* <script src="https://export.dhtmlx.com/gantt/api.js"></script> */}
      {/* <link rel="stylesheet" href="codebase/dhtmlxgantt.css" type="text/css" /> */}

      <div
        ref={(ref) => {
          ganttContainer.current = ref;
        }}
        style={{ width: '100%' }}
      />
      <Popover
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={openDelayPopover}
        anchorEl={delayPopoverAnchor}
        onClose={() => setOpenDelayPopover(false)}
        classes={{
          paper: classes.delayPopover,
        }}
      >
        <div>
          <Typography variant="body1">工程编号:&nbsp;{id}</Typography>
          <Typography variant="body1">
            当前工程进度滞后原因：工程技术规程规范、标准规划更新导致的施工方案调整。
          </Typography>
          <Typography variant="body1">处理方式：设计变更申请。</Typography>
        </div>
        <Button color="primary" size="small">
          点击查看设计变更详情
        </Button>
      </Popover>
    </>
  );
};

export default ProgressManageGantt;
