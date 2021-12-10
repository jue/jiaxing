import { useContext, useEffect, useState } from 'react';
import { Box, Button, Tabs, withStyles, Tab } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { useRouter, withRouter } from 'next/router';
import { Router } from '../../../../server/next.routes';
import { AuthContext, AuthContextI } from '../../../contexts/AuthContext';
import { LayoutPageContext } from '../../layout/context/LayoutPageContext';
import HiddenDangerTable from './HiddenDangerTable';
import HiddenDangerContextProvider from '../context/HiddenDangerContext';
import { Select } from 'antd';
import HiddenDangerCreate from './create';
import HiddenDangerView from './view';

import {
  ExaminationTabType,
  ExaminationTypeDesc,
  DataResultDesc,
  DataTypeDesc,
} from '../../../../constants/enums';
import { HiddenDangerContext } from '../context/HiddenDangerContext';
import FlowContextProvider from '../../../contexts/FlowContext';
import { ReactTabs, ReactTab } from '../../../components/ReactTab';

const { Option } = Select;
const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
    '@global': {
      '.makeStyles-contentContainer-38': {
        background: 'none',
        height: '600px!important',
      },
      '.ant-table-wrapper': {
        paddingBottom: 52,
        overflow: 'auto',
      },
    },
    filter: {
      '& .ant-select:not(.ant-select-disabled):hover .ant-select-selector': {
        borderColor: '#8fc220 !important',
      },
      '& .ant-select-selector': {
        borderColor: '#d9d9d9 !important',
      },
      '& .ant-select-focused.ant-select-single:not(.ant-select-customize-input) .ant-select-selector': {
        boxShadow: 'none',
        WebkitBoxShadow: 'none',
      },
    },
  })
);
const Search = () => {
  const { account } = useContext<AuthContextI>(AuthContext);
  const { setQuery, query } = useContext(HiddenDangerContext);
  const classes = useStyles({});

  return (
    <Box p={2} display="flex">
      <Box flex="1" className={classes.filter}>
        <Select
          placeholder="请选择检查类型"
          style={{ width: 160, marginLeft: 10 }}
          onChange={(value) => {
            setQuery({ ...query, type: value });
          }}
        >
          {DataTypeDesc.map((item, index) => (
            <Option value={item.value} key={index}>
              {item.label}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="请选择检查结果"
          style={{ width: 160, marginLeft: 10 }}
          onChange={(value) => {
            // const { value } = e.target;
            setQuery({ ...query, perilsResults: value });
          }}
        >
          {DataResultDesc.map((item, index) => (
            <Option value={item.value} key={index}>
              {item.label}
            </Option>
          ))}
          Z
        </Select>
      </Box>
      {/* {account.company && account.company.type === 'buildingUnit' && ( */}
      <Button
        variant="contained"
        color="primary"
        size="small"
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => {
          Router.pushRoute('/safety/hiddenDanger/create');
        }}
      >
        检查
      </Button>
      {/* )} */}
    </Box>
  );
};

function IndexPage() {
  const { currentTab, setCurrentTab } = useContext(HiddenDangerContext);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { action } = router.query as {
    action: 'create' | 'edit' | 'view';
  };
  let component = null;
  switch (action) {
    case 'create':
    case 'edit':
      component = <HiddenDangerCreate />;
      break;
    case 'view':
      component = <HiddenDangerView />;
      break;
    default:
      component = (
        <>
          <Box
            mb={2}
            bgcolor="#fff"
            borderRadius={4}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <ReactTabs
              value={currentTab}
              onChange={(event, newValue) => setCurrentTab(newValue)}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              {Object.keys(ExaminationTabType).map((item) => {
                return (
                  <ReactTab
                    key={item}
                    label={ExaminationTypeDesc[ExaminationTabType[item]]}
                    value={ExaminationTabType[item]}
                    selected={ExaminationTabType[item] === currentTab}
                  />
                );
              })}
            </ReactTabs>
          </Box>
          <div
            style={{
              height: 'calc(100% - 56px)',
              backgroundColor: '#fff',
              borderRadius: 4,
            }}
          >
            <Search />
            <HiddenDangerTable setOpen={setOpen} />
          </div>
        </>
      );
      break;
  }

  return <>{component}</>;
}

export default withRouter(({ router }) => {
  const { setParts } = useContext(LayoutPageContext);

  useEffect(() => {
    setParts(['安全风险管理', '隐患排查']);
  }, [router.query]);

  return (
    <HiddenDangerContextProvider>
      <FlowContextProvider>
        <IndexPage />
      </FlowContextProvider>
    </HiddenDangerContextProvider>
  );
});
