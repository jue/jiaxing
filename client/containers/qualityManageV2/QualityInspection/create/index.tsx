import { useContext, useEffect, useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Button, Box, Typography } from '@material-ui/core';
import { useRouter, withRouter } from 'next/router';
import clsx from 'clsx';

import QualityInspectionSubject from './Subject';
import QualityInspectionProblem from './Problem';
import InspectionContextProvider from '../../context/InspectionContext';
import { inspectStyles } from '../../../../styles/resetStyles';
import { LayoutPageContext } from '../../../layout/context/LayoutPageContext';
import { InspectionContext } from '../../context/InspectionContext';
import { CreateQualityInspectionDesc } from '../../../../../constants/enums';
import taskSvc from '../../../../services/taskSvc';
import { FlowContext } from '../../../../contexts/FlowContext';
import accountSvc from '../../../../services/accountSvc';
import flowSvc from '../../../../services/flowSvc';
const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
    dangerContanier: {
      position: 'relative',
    },
    submitButton: {
      width: 88,
    },
    cancleButton: {
      width: 88,
      marginRight: spacing(8),
      '& .MuiButton-label': {
        color: 'rgba(0,0,0,0.3)',
      },
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'flex-end',
      position: 'absolute',
      bottom: 16,
      right: 16,
      // width: '100%',
      // backgroundColor: '#fff',
      paddingTop: 20,
      '& button': { width: 88 },
      '& .MuiButton-label': {
        fontSize: 14,
        fontWeight: 400,
      },
    },
  })
);
const CreatePage = () => {
  const classes = useStyles({});
  const router = useRouter();
  const { setTasksInfos } = useContext(FlowContext);

  const {
    handleConfirm,
    relusTrue,
    setRelusTrue,
    hiddenDangerSubject,
    setBizDatas,
  } = useContext(InspectionContext);
  const classesReset = inspectStyles({});
  useEffect(() => {
    accountSvc.self().then((data) => {
      taskSvc
        .query({
          dataType: 'QUALITY_INSPECT',
          // dictKey: `${data.company.type}-`,
        })
        .then((task) => {
          if (task.code === 200) {
            setTasksInfos(task.data);
          }
        });
    });
  }, []);

  return (
    <Box className={clsx([classes.dangerContanier, 'container'])}>
      <Typography variant="h6">
        <img
          src="/static/images/titleIcon.png"
          style={{ width: 20, marginBottom: 4, marginRight: 4 }}
        />
        新建质量检查
      </Typography>

      <Box className={classesReset.createdInspectionPlan} mb={6}>
        <QualityInspectionSubject />
        <QualityInspectionProblem />
      </Box>

      <Box className={classes.buttonGroup}>
        <Button
          variant="outlined"
          onClick={() => {
            router.push('/quality/v2/inspection');
            // setInspectCheckList([]);
            // setInspectRectifition({});
          }}
          className={classes.cancleButton}
        >
          取消
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            let newRelusTrue: any = relusTrue;
            if (
              !hiddenDangerSubject.name ||
              !hiddenDangerSubject.desc ||
              !hiddenDangerSubject.type ||
              !hiddenDangerSubject.perilsTime ||
              !hiddenDangerSubject.partCompanys ||
              !hiddenDangerSubject.perilsResults
            ) {
              if (!hiddenDangerSubject.name) {
                newRelusTrue.name = CreateQualityInspectionDesc.Name;
                newRelusTrue.desc = CreateQualityInspectionDesc.Desc;
              }
              if (!hiddenDangerSubject.desc) {
                newRelusTrue.desc = CreateQualityInspectionDesc.Desc;
              }
              if (!hiddenDangerSubject.type) {
                newRelusTrue.type = CreateQualityInspectionDesc.Type;
              }

              if (!hiddenDangerSubject.perilsTime) {
                newRelusTrue.perilsTime =
                  CreateQualityInspectionDesc.PerilsTime;
              }
              if (!hiddenDangerSubject.partCompanys) {
                newRelusTrue.partCompanys =
                  CreateQualityInspectionDesc.PartCompanys;
              }
              if (!hiddenDangerSubject.perilsResults) {
                newRelusTrue.perilsResults =
                  CreateQualityInspectionDesc.PerilsResults;
              }
              if (!hiddenDangerSubject.endTime) {
                newRelusTrue.endTime = CreateQualityInspectionDesc.EndTime;
              }
              setRelusTrue({ ...relusTrue, ...newRelusTrue });
              return;
            }
            handleConfirm();
          }}
          className={classes.submitButton}
        >
          保存
        </Button>
      </Box>
    </Box>
  );
};
export default withRouter(({ router }) => {
  const { setParts } = useContext(LayoutPageContext);

  useEffect(() => {
    setParts(['质量管理', '质量检查', '新建质量检查']);
  }, [router.query]);

  return (
    <InspectionContextProvider>
      <CreatePage />
    </InspectionContextProvider>
  );
});
