import React, { useContext } from 'react';
import { Pagination, Tooltip, Empty, message } from 'antd';
import AntdTable from '../../components/AntdTable';
import { ModelManageContext } from './context/ModelManageContext';
import moment from 'moment';
import { ModelModal } from './ModelModal';
import clsx from 'clsx';
import getFileSize from '../../components/FilsSize';
import Chip from '@material-ui/core/Chip';
import DownloadIcon from '../../components/Svgs/DownloadIcon';
import DeleteIcon from '../../components/Svgs/DeleteIcon';
import Compared from '../../components/Svgs/Compared';
import { useStyles } from './ModelStyles';
import { useRouter } from 'next/router';

const filter = ['rvt', 'nwd', 'fbx', 'dwg', 'skp', 'ifc'];
message.config({ maxCount: 1 });
const warning = () => {
  message.warning({
    content: '模型正在处理中',
  });
};

const error = () => {
  message.error({
    content: '模型上传失败',
    maxCount: 1,
  });
};

function TableList() {
  const classes = useStyles({});
  const {
    modelTable,
    query,
    setQuery,
    count,
    deleteModelItem,
    handleViewQuery,
    setBimModelCompared,
    queryModelVersion,
  } = useContext(ModelManageContext);
  const status = {
    doing: '正在处理',
    done: '处理完成',
    error: '处理出错',
  };
  const srcPrefix = '/static/images/fileIcons/';
  const router = useRouter();
  const columns = [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      width: 40,
    },
    {
      title: '项目名称',
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip
          placement="topLeft"
          title={text.engineering && text.engineering.name}
        >
          {text.engineering ? text.engineering.name : ''}
        </Tooltip>
      ),
    },
    {
      title: '合同名称',
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip
          placement="topLeft"
          title={text.contract && text.contract.name}
        >
          {text.contract ? text.contract.name : ''}
        </Tooltip>
      ),
    },
    {
      title: '模型名称',
      ellipsis: {
        showTitle: false,
      },
      render: (text) => {
        const files = text.files;
        const files_name = files.originalname;
        const last_three = files_name.substring(files_name.length - 3);
        const suffix = filter.filter((f) => f === last_three);
        const img_name = suffix[0] ? suffix[0] : 'unsupport_model';

        return (
          <Tooltip
            placement="topLeft"
            title={text.name}
            className={classes.modelName}
          >
            <Chip
              icon={<img src={`${srcPrefix}${img_name}.png`} />}
              label={text.name}
              className={classes.titleChip}
              classes={{
                label: classes.titleInner,
              }}
              variant="outlined"
              onClick={async () => {
                if (files.status === 'done') {
                  handleViewQuery(files._id, files.originalname);
                } else if (files.status === 'doing') {
                  warning();
                } else {
                  error();
                }
              }}
            />
          </Tooltip>
        );
      },
    },

    {
      title: '模型编码',
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text.number}>
          {text.number}
        </Tooltip>
      ),
    },
    {
      title: '创建人',
      ellipsis: {
        showTitle: false,
      },
      render: (text) => {
        const userName = text.account ? text.account.userName : '';
        return (
          <Tooltip placement="topLeft" title={userName}>
            {userName}
          </Tooltip>
        );
      },
    },
    {
      title: '创建时间',
      render: (text) => moment(text.atCreated).format('YYYY/MM/DD'),
    },
    {
      title: '大小',
      render: (text) => getFileSize(text.size),
    },
    {
      title: '版本',
      dataIndex: 'version',
    },
    {
      title: '状态',
      render: (text) => (
        <span>
          {text && text.files && text.files.status ? (
            <span
              className={clsx([
                text.files.status === 'error' ? classes.status : '',
              ])}
            >
              {status[text.files.status]}
            </span>
          ) : (
            '-'
          )}
        </span>
      ),
    },
    {
      title: '操作',
      render: (text) => {
        // const files = text.files;
        return (
          <div className={classes.operating}>
            {/* 模型对比 */}
            <span
              className={classes.operImg}
              onClick={() => {
                setBimModelCompared(text);
                queryModelVersion('', '');
              }}
            >
              <Compared />
            </span>
            {/* {files && (
              <a
                href={`/api/file/download?idFile=${files.idFile}`}
                className={classes.download}
                download
              >
                <DownloadIcon />
              </a>
            )} */}

            <span
              className={classes.operImg}
              onClick={() => {
                ModelModal('确定删除吗？', text._id, deleteModelItem);
              }}
            >
              <DeleteIcon />
            </span>
          </div>
        );
      },
    },
  ];
  return (
    <div className={classes.antdTable}>
      <AntdTable
        columns={columns}
        dataSource={modelTable.length && modelTable[0]._id ? modelTable : []}
        rowKey="_id"
        pagination={false}
      />
      <div style={{ height: 30 }} />
      <div className={classes.pagination}>
        <Pagination
          size="small"
          total={count}
          defaultCurrent={1}
          onChange={(page) => {
            setQuery({ ...query, page: page - 1 });
          }}
        />
      </div>
    </div>
  );
}

export default TableList;
