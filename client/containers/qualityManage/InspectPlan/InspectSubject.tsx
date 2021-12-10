import React, { useContext, useState } from 'react';
import { Button } from '@material-ui/core';
import { InspectPlanStatusContext } from '../context/InspectPlanStatusContext';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { useRouter } from 'next/router';
import SubjectList from './InspectSubjectList';
import SubjectTabs, { SubjectTab } from './InspectSubjectTabs';
import Typography from '@material-ui/core/Typography';
import { inspectStyles } from '../../../styles/resetStyles';
import { InspectPlanReqContext } from '../context/InspectPlanReqContext';

const useStyles = makeStyles(() => {
  return createStyles({
    toolBar: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 24,
      fontSize: 14,
      fontWeight: 400,
      color: '#555',
    },

    subjectListContanier: {
      width: '40%',
      height: '100%',
      overflow: 'auto',
    },

    createdButton: {
      width: 70,
      height: 26,
      borderRadius: 4,
      lineHeight: '13px',
      fontSize: 12,
      fontWeight: 400,
      padding: 0,
      marginLeft: 20,
    },
    operating: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    tabs: {
      marginRight: 20,
    },
    icon: {
      marginLeft: 4,
    },
    addIcon: {
      width: 13,
      height: 13,
      marginRight: 10,
    },
  });
});

export const InspectPlanSubjectList = () => {
  const { setCreatedSubjectDialog } = useContext(InspectPlanStatusContext);
  const { handleQuerySubjects, queryTaskStatus } = useContext(
    InspectPlanReqContext
  );
  const { query } = useRouter();
  const action = query.action;
  const classes = useStyles({});
  const inspectClasses = inspectStyles({});
  const [tabIndex, setTabIndex] = useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newTabIndex: number) => {
    switch (newTabIndex) {
      case 0:
        handleQuerySubjects('');
        break;
      case 1:
        handleQuerySubjects(true);
        break;

      default:
        break;
    }
    setTabIndex(newTabIndex);
  };

  return (
    <div className={classes.subjectListContanier}>
      <div className={classes.toolBar}>
        <div>检查内容</div>
        <Typography component="div" className={classes.operating}>
          {action !== 'create' && (
            <>
              {queryTaskStatus.delayCount !== 0 && (
                <SubjectTabs
                  value={tabIndex}
                  onChange={handleChange}
                  className={classes.tabs}
                >
                  <SubjectTab label="显示全部" />
                  <SubjectTab label="查看超期" />
                </SubjectTabs>
              )}
            </>
          )}

          {action !== 'view' && (
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                setCreatedSubjectDialog('created');
              }}
              className={inspectClasses.outlineButton}
            >
              <AddCircleOutlineIcon className={classes.addIcon} />
              添加检查内容
            </Button>
          )}
        </Typography>
      </div>
      <SubjectList />
    </div>
  );
};
