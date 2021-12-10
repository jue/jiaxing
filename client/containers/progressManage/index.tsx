import React, { useContext, useEffect, useRef } from 'react';
import { LayoutPageContext } from '../layout/context/LayoutPageContext';
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
import FlowContextProvider from '../../contexts/FlowContext';
// import { gantt } from 'dhtmlx-gantt';
// import 'dhtmlx-gantt/codebase/dhtmlxgantt.js';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import $ from 'jquery';
const PMI = ({ router }) => {
  const classes = useProgressManageStyles();
  const { openModel, ganttScripts } = useContext<ProgressManageContextI>(
    ProgressManageContext
  );
  const { setParts } = useContext(LayoutPageContext);

  const container = useRef<HTMLDivElement>();
  useEffect(() => {
    setParts(['进度管理']);
  }, [router.query]);
  useEffect(() => {
    const avaHeight = window.innerHeight - 210;
    container.current.style.height = `${avaHeight}px`;
  }, []);
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
        <ProgressManageGantt />
        {openModel && <ProgressManageModelIframe />}
      </div>
    </>
  );
};
import dynamic from 'next/dynamic';

const PMIIndex = withRouter(PMI);

const ProgessPage = () => {
  // useEffect(() => {
  //   setTimeout(() => {
  //     $(".gantt_cell[data-column-name='batch']").css('display', 'none');
  //   }, 350);
  // }, []);
  return (
    <ProgressManageContextProvder>
      {/* <FlowContextProvider> */}
      <ProgressManageToolbar />
      {/* <GanttPage></GanttPage> */}
      <PMIIndex />
      {/* </FlowContextProvider> */}
    </ProgressManageContextProvder>
  );
};

export default ProgessPage;
