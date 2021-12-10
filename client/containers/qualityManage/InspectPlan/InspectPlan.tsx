import { useContext, useEffect } from 'react';
import { LayoutPageContext } from '../../layout/context/LayoutPageContext';
import { withRouter, useRouter } from 'next/router';
import { InspectOperatingPlan } from './InspectPlanOperating';
import InspectPlanSubjectCreatedDialog from './InspectSubjectDialog';
import InspectQualityReqContextProvider from '../context/InspectPlanReqContext';
import InspectQualityStatusContextProvider from '../context/InspectPlanStatusContext';
import InspectListPlan from './InspectPlanList';
import { Paper } from '@material-ui/core';
import { InspectPlanDeleteDialog } from './InspectPlanDeleteDialog';
import { InspectViewPlan } from './InspectPlanView';
import { InspectSubjectDeleteDialog } from './InspectSubjectDeleteDialog';
import { InspectFileViewDialog } from './InspectFileViewDialog';
import React from 'react';
import OrganizationContextProvider from '../context/OrganizationContext';

function InspectPlan() {
  const router = useRouter();
  const { action } = router.query as {
    action: 'create' | 'edit' | 'view';
  };

  let component = null;

  switch (action) {
    case 'create':
    case 'edit':
      component = <InspectOperatingPlan />;
      break;
    case 'view':
      component = <InspectViewPlan />;
      break;
    default:
      component = <InspectListPlan />;
      break;
  }

  return (
    <Paper style={{ height: '100%' }}>
      {component}
      <InspectPlanSubjectCreatedDialog />
      <InspectSubjectDeleteDialog />
      <InspectPlanDeleteDialog />
      <InspectFileViewDialog />
    </Paper>
  );
}

export default withRouter(({ router }) => {
  const { setParts } = useContext(LayoutPageContext);

  useEffect(() => {
    setParts([
      '质量管理',
      '检查计划',
      router.query.view
        ? '计划详情'
        : router.query.edit
        ? '编辑计划'
        : router.query.grid
        ? '创建计划'
        : '',
    ]);
  }, [router.query]);

  return (
    <InspectQualityReqContextProvider>
      <InspectQualityStatusContextProvider>
        <OrganizationContextProvider>
          <InspectPlan />
        </OrganizationContextProvider>
      </InspectQualityStatusContextProvider>
    </InspectQualityReqContextProvider>
  );
});
