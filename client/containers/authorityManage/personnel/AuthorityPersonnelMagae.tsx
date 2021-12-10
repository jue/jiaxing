import { useContext, useEffect, useState } from 'react';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import InputAdornment from '@material-ui/core/InputAdornment';

import { Pagination } from 'antd';

import { useRouter, withRouter } from 'next/router';
import PersonnelContextProvider, {
  PersonnelContext,
} from '../context/personnelContext';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AntdDialog from '../../../components/AntdDialog';
import AntdTable from '../../../components/AntdTable';
import { LayoutPageContext } from '../../layout/context/LayoutPageContext';
import { MuiInput } from '../../../components/Input';
import SearchIcon from '../../../components/Svgs/authority/SearchIcon';

import { Router } from '../../../../server/next.routes';
// import zhCN from 'antd/es/locale/zh_CN';

const useStyles = makeStyles(() => {
  return createStyles({
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 14,
    },
    muiInput: {
      width: 220,
      height: 34,
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      position: 'fixed',
      width: 'calc(100% - 258px)',
      bottom: 16,
      backgroundColor: '#fff',
      padding: 14,
    },
    operating: {
      display: 'flex',
      fontSize: 14,
      color: '#597EF7',
      cursor: 'pointer',
      alignItems: 'center',
    },
    divider: {
      height: 14,
      width: 1,
      backgroundColor: '#D8D8D8',
      margin: '0 5px',
    },
    button: {
      border: 0,
      background: 'none',
      outline: 'none',
      cursor: 'pointer',
    },
    deleteTitle: {
      textAlign: 'center',
      fontWeight: 800,
    },
  });
});

const Table = ({ setDeleteId, setDeleteName }) => {
  const classes = useStyles({});
  const router = useRouter();
  const { query, setQuery, personnelInfos, count } = useContext(
    PersonnelContext
  );

  const columns = [
    {
      title: '序号',
      dataIndex: '_id',
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '姓名',
      dataIndex: 'userName',
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
    },
    {
      title: '单位名称',
      render: text => (text.company ? text.company.name : ''),
    },
    {
      title: '所属部门',
      render: text => (text.dept ? text.dept.name : ''),
    },
    {
      title: '职务名称',
      render: text => (text.job ? text.job.name : ''),
    },
    {
      title: '操作',
      render: text => {
        return (
          <div className={classes.operating}>
            <button
              className={classes.button}
              onClick={() =>
                Router.pushRoute(`/authority/personnel/edit/${text._id}`)
              }
            >
              编辑
            </button>
            <Divider className={classes.divider} />
            <button
              className={classes.button}
              onClick={() => {
                setDeleteId(text._id);
                setDeleteName(text.name);
              }}
            >
              删除
            </button>
          </div>
        );
      },
    },
  ];
  return (
    <div style={{ paddingBottom: '5%', margin: '0 10px' }}>
      <AntdTable
        columns={columns}
        dataSource={personnelInfos}
        rowKey={row => row._id}
        pagination={false}
      />
      {Boolean(count) && (
        <div className={classes.pagination}>
          <Pagination
            size="small"
            total={count}
            defaultCurrent={1}
            onChange={page => {
              setQuery({ ...query, page: page - 1 });
            }}
          />
        </div>
      )}
    </div>
  );
};

const AuthorityPersonnelMagae = () => {
  const classes = useStyles({});
  const router = useRouter();

  const { query, setQuery, handleDelete } = useContext(PersonnelContext);
  const [queryName, setQueryName] = useState('');
  const [deleteName, setDeleteName] = useState('');
  const [deleteId, setDeleteId] = useState('');

  return (
    <>
      <div className={classes.toolbar}>
        <div className={classes.muiInput}>
          <MuiInput
            placeholder="请输入需要查询的人员姓名"
            onBlur={e => {
              const value = e.target.value.trim();
              setQueryName(value);
            }}
            endAdornment={
              <InputAdornment
                position="end"
                onClick={e => setQuery({ ...query, userName: queryName })}
                style={{ cursor: 'pointer' }}
              >
                <SearchIcon />
              </InputAdornment>
            }
          />
        </div>
        <Button
          color="primary"
          variant="contained"
          onClick={() => Router.pushRoute('/authority/personnel/create')}
        >
          <AddCircleOutlineIcon style={{ marginRight: 8 }} />
          <span>添加人员</span>
        </Button>
      </div>

      <Table setDeleteId={setDeleteId} setDeleteName={setDeleteName} />

      <AntdDialog
        visible={deleteName !== ''}
        onClose={() => setDeleteName('')}
        hasClose={true}
        dialogTitle=""
        hasFooter={true}
        onConfirm={() => {
          handleDelete(deleteId);
        }}
        width={500}
      >
        <Typography className={classes.deleteTitle}>
          您确定要删除{deleteName}？
        </Typography>
      </AntdDialog>
    </>
  );
};

export default withRouter(({ router }) => {
  const { setParts } = useContext(LayoutPageContext);

  useEffect(() => {
    setParts(['人员与权限', '人员管理']);
  }, [router.query]);

  return (
    <PersonnelContextProvider>
      <AuthorityPersonnelMagae />
    </PersonnelContextProvider>
  );
});
