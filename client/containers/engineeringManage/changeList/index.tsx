import { useContext, useEffect, useMemo, useState } from 'react';
import { useRouter, withRouter } from 'next/router';

import { LayoutPageContext } from '../../layout/context/LayoutPageContext';

import { createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import { Tabs, Tab } from '@material-ui/core';

import {
  EngineeringTabType,
  EngineeringTypeDesc,
} from '../../../../constants/enums';
import EngineeringContextProvider, {
  EngineeringContext,
} from '../context/EngineeringContext';
import TableList from './TableList';
import ChangeDetial from '../changeDedial';
import FlowContextProvider from '../../../contexts/FlowContext';

const useStyles = makeStyles(() => {
  return createStyles({
    '@global': {
      '.ant-table-wrapper ': {
        paddingBottom: '22',
        overflow: 'auto',
      },
    },
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: 32,
      height: 40,
      boxShadow:
        '0px 1px 3px 0px rgba(0,0,0,0.05),0px 0px 0px 1px rgba(0,0,0,0.05)',
      borderRadius: 4,
    },
    paper: {
      height: '100%',
    },
    divider: {
      width: '100%',
      height: 16,
      backgroundColor: '#F0F2F5',
    },
  });
});
interface StyledTabProps {
  label: string;
  style?: any;
  value: any;
  selected: any;
}
export const ReactTabs = withStyles({
  root: {},
})(Tabs);

export const ReactTab = withStyles(({ spacing }) =>
  createStyles({
    root: {
      minWidth: 100,
      marginRight: spacing(5),
    },
  })
)((props: StyledTabProps) => <Tab disableRipple {...props} />);

const ChangeList = () => {
  const classes = useStyles({});

  const { currentTab, setCurrentTab, engineeringInfos } = useContext(
    EngineeringContext
  );

  const [open, setOpen] = useState(false);

  return (
    <>
      {open === false && (
        <>
          <div className={classes.toolbar}>
            <ReactTabs
              value={currentTab}
              onChange={(event, newValue) => setCurrentTab(newValue)}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              {Object.keys(EngineeringTabType).map((item) => {
                return (
                  <ReactTab
                    key={item}
                    label={EngineeringTypeDesc[EngineeringTabType[item]]}
                    value={EngineeringTabType[item]}
                    selected={EngineeringTabType[item] === currentTab}
                  />
                );
              })}
            </ReactTabs>
          </div>
          <div className={classes.divider} />

          {currentTab === EngineeringTabType.All && (
            <TableList data={engineeringInfos} setOpen={setOpen} />
          )}
          {currentTab === EngineeringTabType.Request && (
            <TableList data={engineeringInfos} setOpen={setOpen} />
          )}
          {currentTab === EngineeringTabType.Approval && (
            <TableList data={engineeringInfos} setOpen={setOpen} />
          )}
        </>
      )}
      {open === true && <ChangeDetial setOpen={setOpen} />}
    </>
  );
};

export default withRouter(({ router }) => {
  const { setParts } = useContext(LayoutPageContext);

  useEffect(() => {
    setParts(['工程管理', '变更列表']);
  }, [router.query]);

  return (
    <EngineeringContextProvider>
      <FlowContextProvider>
        <ChangeList />
      </FlowContextProvider>
    </EngineeringContextProvider>
  );
});
