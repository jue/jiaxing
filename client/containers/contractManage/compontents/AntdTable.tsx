import react, { useContext, useState, useEffect } from 'react';
import moment from 'dayjs';
import { useRouter } from 'next/router';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Table, Empty, Statistic } from 'antd';
import { ContractManageContext } from '../context/ContractManageContext';
import { contractType } from '../enum';
import CommonAuditModal from '../../../components/CommonAuditModal';
import { FlowContext } from '../../../contexts/FlowContext';
import { AuthContextI, AuthContext } from '../../../contexts/AuthContext';
import Pagination from 'antd/lib/pagination';
import AntdTable from '../../../components/AntdTable';
import PreViewFile from '../../../components/FilePreview/temPreView';

const { Countdown } = Statistic;

const useStyles = makeStyles(({ spacing }) =>
  createStyles({
    table: {
      '& .ant-statistic-content-value': {
        fontSize: 14,
        color: 'rgba(0, 0, 0, 0.65)',
      },
    },
    button: {
      cursor: 'pointer',
      color: '#8FC220',
      border: 0,
      background: 'rgba(255, 255, 255, 0)',
    },

    status: {
      display: 'flex',
      alignItems: 'center',
      '& span:nth-of-type(1)': {
        width: 6,
        height: 6,
        borderRadius: '50%',
        marginRight: 8,
      },
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      position: 'fixed',
      width: 'calc(100% - 260px)',
      bottom: 10,
      left: 250,
      backgroundColor: '#fff',
      padding: 8,
    },
  })
);

const AntdTableI = () => {
  const classes = useStyles({});
  const router = useRouter();
  const {
    contractMsgs,
    setQuery,
    query,
    count,
    setAuditContractDetail,
    auditContractDetail,
    handleContractUpdate,
    setEnd,
  } = useContext(ContractManageContext);

  const {
    updateAuditFlow,
    saveFiles,
    queryAuditMap,
    setDetailInfos,
    currentNode,
    fileFillData,
    queryFileFillData,
  } = useContext(FlowContext);

  const { account } = useContext<AuthContextI>(AuthContext);

  const [visible, setVisible] = useState(false);
  const [contractDetail, setContractDetail] = useState({
    _id: '',
    idCreatedBy: '',
    idAuditing: '',
  });
  const [iframeTemSrc, setIframeTemSrc] = useState<any>({ _id: '' });
  const [modelPreView, setModelPreView] = useState({});
  const [preViewFile, setPreViewFile] = useState<any>();

  useEffect(() => {
    if (currentNode.end === 1) {
      setEnd(currentNode.end);
    }
  }, [currentNode]);

  useEffect(() => {
    // if (JSON.stringify(contractDetail) === '{}') {
    //   handleQuery({ _id });
    //   // setDetailInfos(hiddenDangerSubject);
    // }
    queryAuditMap(contractDetail, 'CONTRACT_MANAGE');
    // if (hiddenDangerSubject) {
    //接受子级返回的值

    setDetailInfos(contractDetail);
    handleChildrenData(window);
  }, [contractDetail]);
  const handleChildrenData = window => {
    if (window) {
      window.onmessage = function(event) {
        const data = event.data;
        let attachments = [];
        if (data.attchmentFile) {
          data.attchmentFile.map(file => {
            attachments.push({
              typeId: file.attachmentType,
              attachmentId: file.resourceId,
            });
          });
        }
        if (data.update) {
          updateAuditFlow({
            approvalId: contractDetail.idAuditing,
            flowData: {
              ...event.data.auditInfos,
              operatorId: account._id,
              attachments: attachments,
            },
            action: data.updateApprovalAction,
            attchmentFile: data.attchmentFile,
            _id: data._id,
            handleUpdate: handleContractUpdate,
          });
          setVisible(false);
        }
        if (data.close) {
          setVisible(false);
        }
        if (data.attchment) {
          saveFiles(data.attchment, contractDetail);
        }
        if (data.modelFiles) {
          const file = data.modelFiles;
          queryFileFillData(
            contractDetail,
            file._id,
            file.originalname,
            setPreViewFile
          );
        }
      };
    }
  };

  const GeneralApprovalStatus = {
    1: '进行中',
    2: '已驳回',
    3: '已取消',
    4: '已完成',
  };

  const isApproval = router.pathname.includes('approve');

  const columns: any = [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '项目名称',
      render: text => (text.engineering ? text.engineering.name : ''),
    },
    {
      title: '合同名称',
      render: text => text.name,
    },
    {
      title: '类型',
      render: text => contractType[text.contractType],
    },
    {
      title: '合同编号',
      render: text => text.number,
    },
    {
      title: '合同金额（万元）',
      render: text => Number(text.amount) / 10000,
    },
    {
      title: isApproval ? '签订/生效时间' : '倒计时',
      render: text => {
        return (
          <>
            {isApproval && (
              <span>
                {text.contractEffectiveDate
                  ? moment(text.contractEffectiveDate).format('YYYY-MM-DD')
                  : ''}
              </span>
            )}
            {!isApproval && (
              <span>
                <Countdown value={text.planEndDate} format="D 天" />
              </span>
            )}
          </>
        );
      },
      sorter: (a, b) =>
        new Date(a.contractEffectiveDate).valueOf() -
        new Date(b.contractEffectiveDate).valueOf(),
    },
    {
      title: '状态',
      render: text => (
        <div className={classes.status}>
          <span
            style={{
              backgroundColor:
                text.status === 1
                  ? '#8FC320'
                  : text.status === 4
                  ? '#6DD400'
                  : '#F6663E',
            }}
          ></span>
          <span>{GeneralApprovalStatus[text.status]}</span>
        </div>
      ),
    },
    {
      title: '操作',
      render: text => {
        const isApproval = text.isAuth === true && text.status === 1;
        return (
          <div>
            <button
              className={classes.button}
              onClick={e => {
                e.stopPropagation();
                if (isApproval) {
                  setVisible(true);
                  setContractDetail(text);
                } else {
                  setAuditContractDetail(text);
                }
              }}
            >
              {isApproval ? '审批' : '查看'}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className={classes.table}>
      <AntdTable
        columns={columns}
        dataSource={contractMsgs}
        rowKey={row => row._id}
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
        onRow={record => {
          return {
            onClick: () => {
              setAuditContractDetail(record);
            },
          };
        }}
      />

      {Boolean(count) && (
        <div className={classes.pagination} style={{ bottom: 10 }}>
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

      <CommonAuditModal
        visible={visible}
        setVisible={setVisible}
        info={contractDetail}
      />
      {/* 模版表单预览 */}
      <PreViewFile preViewFile={preViewFile} setPreViewFile={setPreViewFile} />
    </div>
  );
};
export default AntdTableI;
