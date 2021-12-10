import { useContext, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Button, Box, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';

import SubjectContent from './SubjectContent';
import CheckItemContent from './CheckItemContent';
import { InspectReportContext } from '../../context/InspectReportContext';
import { inspectStyles } from '../../../../styles/resetStyles';

const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
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
      '& button': { width: 88 },
      '& .MuiButton-label': {
        fontSize: 14,
        fontWeight: 400,
      },
    },
  })
);
const SubjectDialog = () => {
  const classes = useStyles({});
  const router = useRouter();

  const {
    handleConfirm,
    setInspectCheckList,
    setInspectRectifition,
  } = useContext(InspectReportContext);
  const classesReset = inspectStyles({});
  const isEdit = router.query.edit;
  return (
    <Box className="container">
      <Typography variant="h6">{isEdit ? '编辑' : '创建'}检查</Typography>

      <Box className={classesReset.createdInspectionPlan} mb={6}>
        <SubjectContent />

        <CheckItemContent />
      </Box>

      <Box className={classes.buttonGroup}>
        <Button
          variant="outlined"
          onClick={() => {
            router.push('/quality/inspectReport');
            setInspectCheckList([]);
            setInspectRectifition({});
          }}
          className={classes.cancleButton}
        >
          取消
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            handleConfirm();
            router.push('/quality/inspectReport');
          }}
          className={classes.submitButton}
        >
          保存
        </Button>
      </Box>
    </Box>
  );
};
export default SubjectDialog;
