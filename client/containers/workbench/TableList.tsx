import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { WorkBenchContext } from './context/WorkBenchContext';
import moment from 'moment';
import { Empty } from 'antd';
import AntdTable from '../../components/AntdTable';

const useStyles = makeStyles({
  '@global': {
    '.MuiTableCell-sizeSmall': {
      padding: 6,
    },
    '.MuiTableCell-root': {
      border: 'none',
    },
    '.MuiPaper-elevation1': {
      boxShadow: 'none!important',
    },

    '.ant-table-thead > tr > th, .ant-table-tbody > tr > td, .ant-table tfoot > tr > th, .ant-table tfoot > tr > td': {
      padding: '4px 2px !important',
    },
    '.ant-table-tbody > tr > td': {
      border: 'none!important',
    },
  },
});

export default function DenseTable({ type }) {
  const classes = useStyles();
  const { qualityProblemList, progressDelayTop10 } = useContext(
    WorkBenchContext
  );
  const columns: any = [
    {
      title: '序号',
      width: 45,
      render: (text, record, index) =>
        index + 1 !== 10 ? `0${index + 1}` : 10,
    },
    {
      title: type === 'quality' ? '问题项名称' : '任务名称',
      // render: (text) => text.name,
      dataIndex: type === 'quality' ? 'name' : 'text',
    },

    {
      title: type === 'quality' ? '整改状态' : '延期天数',
      width: 80,
      render: (text) => {
        let days;
        if (type === 'quality') {
          days =
            moment(text.idPerils && text.idPerils.endTime) < moment(new Date());
        }
        return (
          <>
            {type === 'quality' ? (
              days ? (
                <span style={{ color: '#FF9898', fontSize: 12 }}>已延期</span>
              ) : (
                <span style={{ color: '#8FC320', fontSize: 12 }}>整改中</span>
              )
            ) : (
              text.delayDays
            )}
          </>
        );
      },
    },
  ];

  return (
    <>
      <AntdTable
        scroll={{ y: 195 }}
        columns={columns}
        dataSource={type == 'quality' ? qualityProblemList : progressDelayTop10}
        rowKey={(row) => row._id}
        showSorterTooltip={false}
        pagination={false}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无数据"
            />
          ),
        }}
        onRow={(record) => {}}
      />
    </>
  );
}
