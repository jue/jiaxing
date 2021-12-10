import { useContext, useEffect } from 'react';
import { useRouter, withRouter } from 'next/router';

import { Box, Button, Tabs, Tab } from '@material-ui/core';
import { createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import { Select } from 'antd';

import { Router } from '../../../../server/next.routes';
import { AuthContext, AuthContextI } from '../../../contexts/AuthContext';
import { LayoutPageContext } from '../../layout/context/LayoutPageContext';
import QualityInspectionTable from './QualityInspectionTable';
import InspectionContextProvider from '../context/InspectionContext';
import { InspectionContext } from '../context/InspectionContext';
import {
  ExaminationTabType,
  ExaminationTypeDesc,
  DataResultDesc,
  DataTypeDesc,
} from '../../../../constants/enums';
import InspectionCreate from './create';
import InspectionView from './view';
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
        borderRadius: 4,
      },
      '& .ant-select-selector': {
        borderColor: '#d9d9d9 !important',
        borderRadius: 4,
      },
      '& .ant-select-focused.ant-select-single:not(.ant-select-customize-input) .ant-select-selector': {
        boxShadow: 'none',
        WebkitBoxShadow: 'none',
      },
      '& .MuiInputBase-input': {
        padding: '6.5px 12px!important ',
      },
      '& .ant-select-single:not(.ant-select-customize-input) .ant-select-selector': {
        borderRadius: '4px!important',
      },
    },
  })
);

const Search = () => {
  const { account } = useContext<AuthContextI>(AuthContext);
  const classes = useStyles({});
  const { setQuery, query } = useContext(InspectionContext);
  return (
    <Box p={2} display="flex">
      <Box flex="1" className={classes.filter}>
        <Select
          // defaultValue="全部"
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
          // defaultValue="全部"
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
        </Select>
      </Box>
      {/* {account.company && account.company.type === 'buildingUnit' && ( */}
      <Button
        variant="contained"
        color="primary"
        size="small"
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => {
          Router.pushRoute('/quality/v2/inspection/create');
        }}
      >
        检查
      </Button>
      {/* )} */}
    </Box>
  );
};

function IndexPage() {
  const { currentTab, setCurrentTab } = useContext(InspectionContext);

  const router = useRouter();

  const { action } = router.query as {
    action: 'create' | 'edit' | 'view';
  };
  let component = null;
  switch (action) {
    case 'create':
    case 'edit':
      component = <InspectionCreate />;
      break;
    case 'view':
      component = <InspectionView />;
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
          <>
            <Search />
            <QualityInspectionTable />
          </>
        </>
      );
      break;
  }

  return <>{component}</>;
}

export default withRouter(({ router }) => {
  const { setParts } = useContext(LayoutPageContext);

  useEffect(() => {
    setParts(['质量管理', '质量检查']);
  }, [router.query]);

  return (
    <InspectionContextProvider>
      <FlowContextProvider>
        <IndexPage />
      </FlowContextProvider>
    </InspectionContextProvider>
  );
});
