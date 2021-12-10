import { useContext, createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import useApproveListStyles from './ApproveListStyle';
import { LayoutPageContext } from '../../layout/context/LayoutPageContext';
import useProgressManageStyles from '../ProgressManageStyles';
import AntdTable from '../../../components/AntdTable';
import moment from 'antd/node_modules/moment';
import { Box, Tab, Tabs, Button } from '@material-ui/core';
import { Select, message } from 'antd';
const { Option } = Select;
import {
  EngineeringTypeDesc,
  ConstructionStateDesc,
} from '../../../../constants/enums';
import progressSvc from '../../../services/ProgressSvc';
import clsx from 'clsx';
const ApproveList = () => {
  const router = useRouter();
  const { setParts } = useContext(LayoutPageContext);
  // const classes = useApproveListStyles();
  const classes = useProgressManageStyles();
  const [tabsValue, setTabsValue] = useState('all');
  const [approveData, setApproveData] = useState({ data: [], count: 0 });
  const [selectValue, setSlectValue] = useState(undefined);

  const getTableData = (params) => {
    progressSvc
      .approveSearch(params)
      .then((res) => {
        if (res.code == 200) {
          const data = res.data.data.map((item, index) => {
            return {
              ...item,
              id: params.page * 10 + index + 1,
              userName: item.account.userName,
            };
          });
          setApproveData({ data, count: res.data.count });
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    setParts(['进度审批列表']);
    getTableData({ page: 0, limit: 10 });
  }, []);
  const columns = [
    {
      title: '序号',
      width: 70,
      align: 'center',
      dataIndex: 'id',
    },
    {
      title: '任务',
      dataIndex: 'name',
    },
    {
      title: '创建人',
      dataIndex: 'userName',
    },
    {
      title: '创建时间',
      dataIndex: 'atCreated',
      render: (text, record) => {
        return moment(record.atCreated).format('YYYY-MM-DD');
      },
    },
    {
      title: '审批状态',
      dataIndex: 'status',
      render: (text, record) => {
        if (record.status === 1) {
          return '审批中';
        } else if (record.status === 2) {
          return '已驳回';
        } else if (record.status === 3) {
          return '已取消';
        } else if (record.status === 4) {
          return '已通过';
        }
      },
    },
    {
      title: '操作',
      width: 120,
      align: 'center',
      render: (text, record) => {
        // console.log(record);
        if (record.isAuth) {
          return (
            <div
              className={clsx(classes.modelLinkBtn)}
              onClick={() => {
                // console.log(record);
                router.push({
                  pathname: '/progress/approveDetail',
                  query: {
                    id: record._id,
                  },
                });
              }}
            >
              审批
            </div>
          );
        } else {
          return (
            <div
              className={clsx(classes.modelLinkBtn)}
              onClick={() => {
                // console.log(record);
                router.push({
                  pathname: '/progress/approveDetail',
                  query: {
                    id: record._id,
                    status: 0,
                  },
                });
              }}
            >
              查看
            </div>
          );
        }
      },
    },
  ];
  // pagination
  const handleTableChange = (pagination, filters, sorter, extra) => {
    // console.log(pagination);
    const { current } = pagination;
    let obj: any = {
      page: current - 1,
      limit: 10,
    };
    if (selectValue) {
      obj.status = selectValue;
    }
    if (tabsValue == 'approval') {
      obj.myself = true;
    } else if (tabsValue == 'request') {
      obj.idCreatedBy = true;
    }
    getTableData(obj);
  };
  // search
  const handleOnSearch = () => {
    getTableData({ page: 0, limit: 10, status: selectValue });
  };
  // tab change
  const handleTabsChange = (v) => {
    let obj;
    if (v == 'all') {
      obj = { page: 0, limit: 10 };
    } else if (v == 'approval') {
      obj = { page: 0, limit: 10, myself: true };
    } else if (v == 'request') {
      obj = { page: 0, limit: 10, idCreatedBy: true };
    }
    getTableData(obj);
    setSlectValue(undefined);
  };
  return (
    <div>
      <div>
        <Tabs
          value={tabsValue}
          onChange={(_, v) => {
            // console.log(v);
            handleTabsChange(v);
            setTabsValue(v);
          }}
          indicatorColor="primary"
          textColor="primary"
        >
          {Object.keys(EngineeringTypeDesc).map((item) => {
            return (
              <Tab
                key={item}
                label={EngineeringTypeDesc[item]}
                value={item}
                style={{ marginRight: 50 }}
              />
            );
          })}
        </Tabs>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 20,
          }}
        >
          <div style={{ display: 'flex' }}>
            <Box flex="1" className={classes.filter}>
              <Select
                placeholder="审批状态"
                value={selectValue}
                onChange={(value) => {
                  setSlectValue(value);
                }}
                className={classes.select}
                bordered={null}
              >
                {ConstructionStateDesc.map((item) => {
                  return (
                    <Option value={item.key} key={item.key}>
                      {item.value}
                    </Option>
                  );
                })}
              </Select>
            </Box>
            <Button
              className={clsx(classes.modelBtn, classes.batchBtnLeft)}
              onClick={handleOnSearch}
            >
              搜索
            </Button>
          </div>
          <div>
            <Button
              className={clsx(classes.modelBtn, classes.batchBtn)}
              onClick={() => {
                router.push('/progress');
              }}
            >
              更新进度
            </Button>
          </div>
        </div>
        <AntdTable
          styles={{ marginBottom: 30 }}
          columns={columns}
          dataSource={approveData.data}
          rowKey={(row) => row._id}
          pagination={{ position: ['bottomCenter'], total: approveData.count }}
          onRow={(record) => {
            return {
              onClick: (e) => {},
            };
          }}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
};
export default ApproveList;
