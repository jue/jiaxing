import { useContext, useEffect, useMemo, useState } from 'react';
import { useRouter, withRouter } from 'next/router';

import { Box, Button, Tabs, Tab } from '@material-ui/core';
import { createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import { Select, Input } from 'antd';

import { LayoutPageContext } from '../../layout/context/LayoutPageContext';
import ConstructionTable from './ConstructionTable';
import { ConstructionContextProvider } from '../context/ConstructionContext';
import { ConstructionContext } from '../context/ConstructionContext';
import {
  EngineeringTabType,
  EngineeringTypeDesc,
  scheme,
} from '../../../../constants/enums';
import ConstructionCreate from './create';
import ConstructionView from './view';
import FlowContextProvider, {
  FlowContext,
} from '../../../contexts/FlowContext';
import taskSvc from '../../../services/taskSvc';
import { ReactTabs, ReactTab } from '../../../components/ReactTab';

const { Option } = Select;
const { Search } = Input;
const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
    '@global': {
      '.makeStyles-contentContainer-38': {
        background: 'none',
        height: '600px!important',
      },
      '.ant-table-wrapper': {
        overflow: 'auto',
        paddingBottom: 52,
      },
      '.ant-select:not(.ant-select-disabled):hover .ant-select-selector': {
        borderColor: '#8fc220 !important',
        borderRadius: 4,
      },
      '.ant-select-selector': {
        borderColor: '#d9d9d9 !important',
        borderRadius: 4,
      },
      '.ant-select-focused.ant-select-single:not(.ant-select-customize-input) .ant-select-selector': {
        boxShadow: 'none',
        WebkitBoxShadow: 'none',
      },
    },
    filter: {
      '& .MuiInputBase-input': {
        padding: '6.5px 12px!important ',
      },
      '& .ant-select-single:not(.ant-select-customize-input) .ant-select-selector': {
        borderRadius: '4px!important',
      },
    },
  })
);

const SearchList = ({ setOpen }) => {
  const classes = useStyles({});
  const { setQuery, query } = useContext(ConstructionContext);
  return (
    <Box p={2} display="flex">
      <Box flex="1" className={classes.filter}>
        <Search
          placeholder="请输入施工方案名称"
          onSearch={(value) => setQuery({ ...query, name: value })}
          style={{ width: 160 }}
        />
        <Select
          // defaultValue="全部"
          placeholder="请选择工程方案类型"
          style={{ width: 160, marginLeft: 10 }}
          onChange={(value) => {
            setQuery({ ...query, perilsResults: value });
          }}
        >
          {scheme.map((item, index) => (
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
        onClick={() => setOpen(true)}
      >
        新增施工方案
      </Button>
      {/* )} */}
    </Box>
  );
};
const QualityConstruction = () => {
  const { currentTab, setCurrentTab } = useContext(ConstructionContext);
  const [openCreate, setOpenCreate] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const { taskInfos, setTasksInfos } = useContext(FlowContext);

  const handleTask = (type, key) => {
    taskSvc
      .query({
        dataType: type,
        dictKey: key,
      })
      .then((task) => {
        if (task.code === 200) {
          setTasksInfos(task.data);
        }
      });
  };
  useEffect(() => {
    handleTask('SG_SCHEME', '');
  }, []);

  return (
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
      </Box>
      <div
        style={{
          height: 'calc(100% - 56px)',
          backgroundColor: '#fff',
          borderRadius: 4,
        }}
      >
        <SearchList setOpen={setOpenCreate} />
        <ConstructionTable setViewOpen={setViewOpen} handleTask={handleTask} />
      </div>
      <ConstructionCreate
        open={openCreate}
        setOpen={setOpenCreate}
        taskInfos={taskInfos}
      />
      <ConstructionView
        open={viewOpen}
        setOpen={setViewOpen}
        taskInfos={taskInfos}
      />
    </>
  );
};
export default withRouter(({ router }) => {
  const { setParts } = useContext(LayoutPageContext);
  useEffect(() => {
    setParts(['质量管理', '施工方案管理']);
  }, [router.query]);

  return (
    <ConstructionContextProvider>
      <FlowContextProvider>
        <QualityConstruction />
      </FlowContextProvider>
    </ConstructionContextProvider>
  );
});
