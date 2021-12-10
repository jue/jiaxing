import { Table, Empty } from 'antd';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette }) => {
  return createStyles({
    '@global': {
      '.ant-table-thead>tr>th': {
        background: '#fff !important',
      },
      '.ant-table-tbody>tr.ant-table-row:hover>td': {
        background: 'rgba(143, 194, 32, 0.06) !important',
      },
      '.ant-pagination-item': {
        margin: '0 4px !important',
      },
      '.ant-pagination-item-active': {
        background: 'rgba(143, 194, 32, 0.12) !important',
        border: '0 !important',
      },
      '.ant-pagination-item-active a,.ant-pagination-item-active:focus a': {
        color: palette.primary.main,
      },
      '.ant-pagination-item a:hover': {
        color: palette.primary.main,
        background: 'rgba(143, 194, 32, 0.06) !important',
      },
      '.ant-pagination.mini .ant-pagination-prev .ant-pagination-item-link:hover, .ant-pagination.mini .ant-pagination-next .ant-pagination-item-link:hover': {
        color: palette.primary.main,
      },
      '.ant-pagination.mini .ant-pagination-prev .ant-pagination-item-link:focus, .ant-pagination.mini .ant-pagination-next .ant-pagination-item-link:focus': {
        color: palette.primary.main,
      },
      '.ant-pagination.mini .ant-pagination-item:not(.ant-pagination-item-active)': {
        borderColor: 'rgba(0,0,0,0.15)!important',
      },
    },
  });
});

const AntdTable = props => {
  const classes = useStyles({});

  return (
    <Table
      {...props}
      locale={{
        emptyText: (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
        ),
      }}
    />
  );
};

export default AntdTable;
