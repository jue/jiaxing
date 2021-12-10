import { Button, IconButton, InputBase, Toolbar } from '@material-ui/core';
import {
  ProgressManageContext,
  ProgressManageContextI,
} from '../ProgressManageContext';
import accountSvc from '../../../../services/accountSvc';
import progressSvc from '../../../../services/ProgressSvc';
import { useContext, useState, useRef, useEffect } from 'react';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Dropzone from '../../../../components/Dropzone/DropzoneUploadContainer';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import SearchIcon from '@material-ui/icons/Search';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import CommonAuditModal from '../../../../components/CommonAuditModal';
import TemplatePreViewFile from '../../../../components/TemplatePreViewFile';
import useProgressManageStyles from '../ProgressManageStyles';
import {
  FlowContextProvider,
  FlowContext,
} from '../../../../contexts/FlowContext';
import { AuthContextI, AuthContext } from '../../../../contexts/AuthContext';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { message } from 'antd';
import moment from 'antd/node_modules/moment';
import PreViewFile from '../../../../components/FilePreview/temPreView';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { from } from 'form-data';

const typeTitles = ['全部', '周', '月', '年'];
const ProgressManageToolbar = () => {
  const router = useRouter();
  const classes = useProgressManageStyles();
  const {
    timeTypeIndex,
    setTimeTypeIndex,
    openModel,
    setOpenModel,
    ganttScripts,
    files,
    saveFile,
  } = useContext<ProgressManageContextI>(ProgressManageContext);
  const { account, setAccount } = useContext<AuthContextI>(AuthContext);
  const {
    flows,
    currentNode,
    queryAuditMap,
    queryAuditNode,
    updateAuditFlow,
    saveFiles,
    queryTask,
    setDetailInfos,
    queryFileFillData,
  } = useContext(FlowContext);
  const [fitToView, setFitToView] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [approvalInfo, setApprovalInfo] = useState<any>({
    auditingId: '',
    idAuditing: '',
    account: { _id: '' },
  });
  const [searchValue, setInputValue] = useState('');
  const [preViewFile, setPreViewFile] = useState<any>();

  useEffect(() => {
    // 查询审批节点数据;
    handleSearchApprovalById();
    queryAuditMap({ ...approvalInfo, modelFile: [] }, 'JD_MANAGE');
    postOnMessage();
  }, [approvalInfo.auditingId]);
  useEffect(() => {
    accountSvc
      .self()
      .then(data => {
        setAccount(data);
      })
      .catch(err => {
        message.error('获取用户信息失败!');
      });
    // queryTask('JD_MANAGE');
    setTimeTypeIndex(0);
    setScaleDate(0);
  }, []);

  // const approvalInfo = { idAuditing: '' };
  const handleOnApproval = () => {
    setVisible(true);
  };
  const postOnMessage = () => {
    //接受子级返回的值
    window.onmessage = function(event) {
      const data = event.data;
      // console.log(data);
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
          approvalId: approvalInfo.auditingId,
          flowData: {
            ...event.data.auditInfos,
            operatorId: account._id,
            attachments: attachments,
          },
          action: data.updateApprovalAction,
          attchmentFile: data.attchmentFile,
          _id: data._id,
          handleUpdate: 'approval',
          type: '',
        });
        setVisible(false);
        // handleUpdate(data.auditInfos.action, data.attchmentFile);
      }
      if (data.close) {
        setVisible(false);
      }
      if (data.attchment) {
        saveFiles(data.attchment, approvalInfo);
      }
      if (data.modelFiles) {
        const file = data.modelFiles;
        queryFileFillData(
          approvalInfo,
          file._id,
          file.originalname,
          setPreViewFile
        );
      }
    };
  };

  const handleSearchApprovalById = async () => {
    try {
      const res = await progressSvc.approveSearch({ _id: router.query.id });
      // console.log(data);
      if (res.code === 200) {
        const { auditingId } = res.data;
        let obj = {
          ...res.data,
          idAuditing: auditingId,
        };
        setApprovalInfo(obj);
        setDetailInfos(obj);
      } else {
        message.error(res.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const setScaleDate = index => {
    if (index == 0) {
      ganttScripts.gantt.config.scales = [
        // { unit: 'year', step: 1, format: '%Y' },
        { unit: 'month', step: 1, format: '%Y - %F' },
        { unit: 'day', step: 1, date: '%M %d' },
      ];
    } else if (index == 1) {
      ganttScripts.gantt.config.scales = [
        { unit: 'year', step: 1, format: '%Y' },
        {
          unit: 'week',
          step: 1,
          format: function(date) {
            return '第' + ganttScripts.gantt.date.getWeek(date) + '周';
          },
        },
      ];
    } else if (index == 2) {
      ganttScripts.gantt.config.scales = [
        { unit: 'month', step: 1, format: '%Y,%F' },
        // {unit: "day", step: 1, format: "%j, %D"}
      ];
    } else if (index == 3) {
      ganttScripts.gantt.config.scales = [
        { unit: 'year', step: 1, format: '%Y' },
      ];
    }
    ganttScripts.gantt.render();
  };
  const handleOnSearch = () => {
    progressSvc
      .query({ text: searchValue })
      .then(res => {
        if (res.code == 200) {
          console.log(res);
          const data = {
            data: res.data.data.map(item => {
              let count = 0;
              res.data.data.forEach(item1 => {
                if (item1._id == item.parent) {
                  count++;
                }
              });
              if (count == 0) {
                item.parent = '0';
              }
              item.start_date = moment(item.start_date).format('DD-MM-YYYY');
              item.end_date = moment(item.end_date).format('DD-MM-YYYY');
              item.id = item._id;
              item.delay = '';
              item.importantNode = item.importantNode;
              return { ...item, ...item.custom_data };
            }),
          };
          ganttScripts.gantt.clearAll(data);
          ganttScripts.gantt.parse(data);
          setInputValue('');
        } else {
          message.error(res.msg);
        }
      })
      .catch(err => {
        console.log(err.message);
      });
  };
  return (
    <Toolbar>
      <div className={classes.buttonGroup}>
        {typeTitles.map((title, index) => (
          <div
            style={{
              color: timeTypeIndex === index ? '#fff' : '#000',
              borderRight: '1px solid',
              borderColor:
                timeTypeIndex === index ? '#8FC220' : 'rgba(0, 0, 0, 0.23)',
              backgroundColor: timeTypeIndex === index ? '#8FC220' : '',
            }}
            onClick={() => {
              setTimeTypeIndex(index);
              setScaleDate(index);
            }}
            key={title}
          >
            {title}
          </div>
        ))}
      </div>
      &nbsp; &nbsp; &nbsp;
      <div className={clsx([classes.buttonGroup, classes.zoomIn])}>
        <div onClick={() => ganttScripts.zoomOut()}>
          <ZoomOutIcon />
        </div>
        <div
          onClick={e =>
            ganttScripts.toggleMode(fitToView, () => setFitToView(!fitToView))
          }
        >
          {fitToView ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </div>

        <div onClick={() => ganttScripts.zoomIn()}>
          <ZoomInIcon />
        </div>
      </div>
      &nbsp; &nbsp; &nbsp;
      {/* <div
        onClick={() => setOpenModel(!openModel)}
        className={classes.modelBtn}
      >
        {openModel ? '隐藏' : '显示'}模型
      </div> */}
      <div style={{ flexGrow: 1 }} />
      <div className={classes.search}>
        <div className={classes.searchInput}>
          <IconButton
            aria-label="search"
            onClick={handleOnSearch}
            style={{ padding: '0 12px' }}
          >
            <SearchIcon />
          </IconButton>

          <InputBase
            placeholder="请输入搜索内容"
            inputProps={{ 'aria-label': '请输入搜索内容' }}
            value={searchValue}
            onChange={e => {
              setInputValue(e.target.value);
            }}
          />
        </div>
        {/* <Dropzone
          files={[]}
          setFiles={(files) => {
            saveFile(files);
          }}
          accept=".mpp"
          maxSize={1}
        >
          <Button
            className={clsx(classes.modelBtn, classes.batchBtn)}
            style={{ marginLeft: '16px' }}
            variant="contained"
            color="primary"
          >
            上传文件
          </Button>
        </Dropzone> */}

        <Button
          variant="contained"
          className={clsx(classes.primaryBtn)}
          style={{ marginLeft: '16px' }}
          color="primary"
          onClick={handleOnApproval}
        >
          {router.query.status ? '查看' : '审批'}
        </Button>

        <CommonAuditModal
          visible={visible}
          setVisible={setVisible}
          info={approvalInfo}
        />
        {/* <Previewfile
          preViewFile={modelPreView}
          setPreViewFile={setModelPreView}
        /> */}
        {/* 模版表单预览 */}
        <PreViewFile
          preViewFile={preViewFile}
          setPreViewFile={setPreViewFile}
        />
      </div>
    </Toolbar>
  );
};

export default () => {
  return (
    <FlowContextProvider>
      <ProgressManageToolbar />
    </FlowContextProvider>
  );
};
