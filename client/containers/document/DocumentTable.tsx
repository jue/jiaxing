import { useContext, useState } from 'react';
import moment from 'moment';

import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import GetApp from '@material-ui/icons/GetApp';
import StarIcon from '@material-ui/icons/Star';

import AntdDialog from '../../components/AntdDialog';
import useDocumentStyles from './DocumentStyle';
import { DocumentContext, DocumentContextI } from './DocumentContext';
import { NewDataStatus } from '../../../constants/enums';
import DownloadIcon from '../../components/Svgs/document/downloadIcon';
import ActiveStarIcon from '../../components/Svgs/document/activeStarIcon';

import FileIcon from '../../components/FileIcon';
import AntdTable from '../../components/AntdTable';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    dialog: {
      '& .MuiDialog-paperFullWidth': {
        height: '100%',
      },
      '& .ant-spin-nested-loading': {
        height: '100%',
        marginBottom: 20,
      },
      '& .ant-alert.ant-alert-no-icon': {
        height: '100%',
      },
      '& .ant-spin-blur': {
        height: '100%',
      },
    },
    paper: {
      height: '100%',
      width: '100%',
      overflow: 'auto',
      position: 'relative',
    },
    download: {
      backgroundColor: 'rgba(0,0,0,0.7)',
      height: '100%',
      width: '100%',
      overflow: 'auto',
      padding: theme.spacing(1.5),
      // lineHeight: '35px',
      // padding: '0 10px',
      // color: '#fff',
    },
    img: {
      width: '100%',
      minHeight: '100%',
    },
  });
});

const PreviewFile = ({ visible, fileName, onClose }) => {
  const classes = useStyles({});
  let imgName = (fileName && fileName.split('.')) || [];

  const type = imgName.length ? imgName[1] : '';
  const imgType = ['jpg', 'png', 'jpeg'];
  let applicationForm = `/api/file/preview/${visible}/${fileName}`;

  return (
    <AntdDialog
      visible={visible !== ''}
      onClose={() => onClose()}
      hasClose={true}
      dialogTitle=""
      hasFooter={false}
      onConfirm={() => {}}
      width={'55%'}
    >
      <div style={{ padding: 20, height: 'calc(100vh - 220px)' }}>
        {imgType.includes(type) ? (
          <div className={classes.download}>
            <span style={{ color: '#fff', float: 'left' }}>{fileName}</span>
            <IconButton size="small" style={{ color: '#fff', float: 'right' }}>
              <GetApp />
            </IconButton>
            <img className={classes.img} src={applicationForm} />
          </div>
        ) : (
          <iframe
            style={{ width: '100%', height: '100%' }}
            src={applicationForm}
          />
        )}
      </div>
    </AntdDialog>
  );
};

const DocumentTable = () => {
  const classes = useDocumentStyles({});
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [deleteContainer, setDeleteContainer] = useState<any>({});
  const [openPreview, setOpenPreview] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  const {
    handleUpdateDocument,
    handleDeleteDocument,
    documents,
    count,
    queryDocument,
    setQueryDocument,
  } = useContext<DocumentContextI>(DocumentContext);
  const fileDisplaySize = (size) => {
    if (size < 1000) {
      return `${size}B`;
    } else if (size >= 1000 && size < 1000 * 1000) {
      const displaySize = size / 1000.0;
      return `${displaySize.toFixed(2)}KB`;
    } else if (size >= 1000 * 1000 && size < 1000 * 1000 * 1000) {
      const displaySize = size / (1000.0 * 1000.0);
      return `${displaySize.toFixed(2)}MB`;
    } else if (size >= 1000 * 1000 * 1000) {
      const displaySize = size / (1000.0 * 1000.0 * 1000.0);
      return `${displaySize.toFixed(2)}GB`;
    }
  };
  const columns = [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '标记',
      render: (text) => (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() =>
            handleUpdateDocument({ ...text, isFavorite: !text.isFavorite })
          }
        >
          {text.isFavorite ? <ActiveStarIcon /> : <StarIcon />}
        </div>
      ),
    },
    {
      title: '下载',
      render: (text) => (
        <a
          style={{ cursor: 'pointer' }}
          href={`/api/file/download?idFile=${text.idFile}`}
          download={text.name}
        >
          <DownloadIcon />
        </a>
      ),
    },
    {
      title: '文件名',
      render: (text) => (
        <div style={{ textAlign: 'left' }}>
          <Tooltip title={text.name}>
            <div
              className={classes.file}
              onClick={() => {
                setOpenPreview(text.idFile);
                setFileName(text.name);
              }}
            >
              <FileIcon file={text} />
              <div className={classes.fileName}>{text.name}</div>
            </div>
          </Tooltip>
        </div>
      ),
      width: 270,
    },
    // {
    //   title: '编码',
    //   render: (text) => text.documentNo,
    //   width: 200,
    // },
    {
      title: '创建人',
      render: (text) => {
        const account = text.account.length && text.account[0];
        return account.userName || '';
      },
    },
    {
      title: '大小',
      render: (text) => fileDisplaySize(text.size),
    },
    {
      title: '创建时间',
      render: (text) => moment(text.atCreated).format('YYYY-MM-DD'),
    },
    {
      title: '',
      render: (text) => (
        <div
          style={{ color: '#8FC220', cursor: 'pointer' }}
          onClick={() => {
            setOpenDelete(true);
            setDeleteContainer(text);
          }}
        >
          删除
        </div>
      ),
    },
  ];

  return (
    <div>
      <AntdTable
        styles={{ marginBottom: 30 }}
        onChange={() => console.warn(111)}
        columns={columns}
        dataSource={documents}
        rowKey={(row) => row._id}
        pagination={{
          size: 'small',
          defaultCurrent: 1,
          total: count,
          onChange: (page) => {
            setQueryDocument({ ...queryDocument, page: page - 1 });
          },
          style: {
            display: 'flex',
            justifyContent: 'center',
            position: 'fixed',
            width: 'calc(100% - 501px)',
            left: '32.8%',
            bottom: 0,
            backgroundColor: '#fff',
            padding: 14,
          },
        }}
        onRow={(record) => {
          return {
            onClick: (e) => {},
          };
        }}
      />
      {/* <div className={classes.pagination}>
        <Pagination
          size="small"
          total={count}
          defaultCurrent={1}
          onChange={(page) => {
            setQueryDocument({ ...queryDocument, page: page - 1 });
          }}
        />
      </div> */}
      <AntdDialog
        visible={openDelete}
        onClose={() => setOpenDelete(false)}
        hasClose={true}
        dialogTitle=""
        hasFooter={true}
        onConfirm={() => {
          if (
            deleteContainer.dataStatus &&
            deleteContainer.dataStatus === NewDataStatus.Tashed
          ) {
            handleDeleteDocument(deleteContainer._id);
          } else {
            handleUpdateDocument({
              ...deleteContainer,
              dataStatus: NewDataStatus.Tashed,
            });
          }
          setOpenDelete(false);
        }}
        width={560}
      >
        <div className={classes.createTitle}>
          <div className={classes.question}>?</div>
          <Typography>是否删除该文件信息？</Typography>
        </div>
        <Typography className={classes.deleteContainer}>
          {deleteContainer.dataStatus === NewDataStatus.Normal
            ? '移除后，该文件信息将在回收站列表。'
            : '移除后，该文件信息将彻底删除。'}
        </Typography>
      </AntdDialog>

      <PreviewFile
        visible={openPreview}
        fileName={fileName}
        onClose={() => setOpenPreview('')}
      />
    </div>
  );
};

export default DocumentTable;
