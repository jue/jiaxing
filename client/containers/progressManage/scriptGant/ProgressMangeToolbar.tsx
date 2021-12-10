import { Button, IconButton, InputBase, Toolbar, Box } from '@material-ui/core';
import {
  ProgressManageContext,
  ProgressManageContextI,
} from '../ProgressManageContext';
import progressSvc from '../../../services/ProgressSvc';
import engineeringSvc from '../../../services/EngineeringSvc';
import companySvc from '../../../services/companySvc';
import accountSvc from '../../../services/accountSvc';
import { useContext, useState, useRef, useEffect } from 'react';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Dropzone from '../../../components/Dropzone/DropzoneUploadContainer';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import SearchIcon from '@material-ui/icons/Search';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import useProgressManageStyles from '../ProgressManageStyles';
import LoadingDialog from '../../../components/AntdDialog/LoadingDialog';
import AntdDialog from '../../../components/AntdDialog';
import clsx from 'clsx';
import { message, Select, Form } from 'antd';
import moment from 'antd/node_modules/moment';
const { Option } = Select;
import ReactDOM from 'react-dom';
import $ from 'jquery';

const typeTitles = ['全部', '周', '月', '年'];
const priority = [
  { key: 0, label: '低' },
  { key: 1, label: '普通' },
  { key: 2, label: '高' },
];
var taskProgress = [];
for (let i = 0; i <= 100; i = i + 10) {
  taskProgress.push({ key: `${i / 100}`, label: `${i}%` });
}
const ProgressManageToolbar = () => {
  const [form] = Form.useForm();
  const classes = useProgressManageStyles();
  const {
    timeTypeIndex,
    setTimeTypeIndex,
    openModel,
    setOpenModel,
    ganttScripts,
    files,
    saveFiles,
  } = useContext<ProgressManageContextI>(ProgressManageContext);
  const [open, setOpen] = useState<boolean>(false);
  const [taskNum, setTaskNum] = useState<number>(0);
  const [companies, setCompanies] = useState({
    sgCompanies: [],
    glCompanies: [],
  });
  const [sgPrincipal, setSgPrincipal] = useState([]);
  const [glPrincipal, setGlPrincipal] = useState([]);
  const [batchFlag, setBatchFlag] = useState<boolean>(false);
  const [searchValue, setInputValue] = useState('');
  const [loadingFlag, setLoadingFlag] = useState<boolean>(false);
  useEffect(() => {
    setTimeTypeIndex(0);
    setScaleDate(0);
  }, []);
  useEffect(() => {
    if (files[0]) {
    }
  }, [files]);
  const [fitToView, setFitToView] = useState<boolean>(false);
  //文件上传
  const handleOnUpLoadMpp = (files) => {
    var formData: any = new FormData();
    // files.map((element) => {
    formData.append('file', files[0]);
    // });
    engineeringSvc
      .search({})
      .then((res) => {
        if (res.length > 0) {
          let projectId = res[0]._id;
          let fileName = files[0].name;
          formData.append('type', 'msproject-parse');
          formData.append('data', {});
          setLoadingFlag(true);
          progressSvc
            .uploadMpp(formData, projectId, fileName)
            .then((res) => {
              if (res.code == 200) {
                setLoadingFlag(false);
                message.success(
                  '任务更新已提交审批，具体请至“进度审批列表”查看!'
                );
              } else {
                message.error(res.msg);
              }
            })
            .catch((err) => {
              message.error('您暂无权限进行上传!');
            });
        } else {
          message.error('请先添加项目工程！');
        }
      })
      .catch((err) => {
        message.error(err);
      });
  };
  // 设置年月周
  const setScaleDate = (index) => {
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
          format: function (date) {
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
  // 打开弹窗
  const handleOnMoreEdit = () => {
    // console.log($(".gantt_cell[data-column-name='batch']"));
    companySvc.query({}).then((data) => {
      let sgArr = [];
      let jlArr = [];
      data.forEach((item) => {
        if (item.type === 'constructionUnit') {
          sgArr.push({
            key: item._id,
            label: item.name,
          });
        }
        if (item.type === 'constructionControlUnit') {
          jlArr.push({
            key: item._id,
            label: item.name,
          });
        }
      });
      setCompanies({
        sgCompanies: sgArr,
        glCompanies: jlArr,
      });
      setBatchFlag(false);
    });
    setTaskNum(ganttScripts.gantt.children.length);
    form.resetFields();
    setOpen(true);
  };
  //设置负责人/监理负责人
  const onSelectChange = (value, type) => {
    // console.log(value, type);
    accountSvc
      .search({
        idCompany: value,
      })
      .then((data) => {
        const newData = (data.data || []).map((item) => {
          item.key = item._id;
          item.label = item.userName;
          return item;
        });
        if (type == 'sg') {
          setSgPrincipal(newData);
        } else if (type == 'gl') {
          setGlPrincipal(newData);
        }
      });
  };
  // submit
  const onFinish = (fieldsValue) => {
    console.log(fieldsValue);
    const params = {
      actionType: 'batchUpdate',
      data: {
        progress: fieldsValue.progress,
        custom_data: {
          priority: fieldsValue.priority,
          jlPrincipal: fieldsValue.jlPrincipal,
        },
        resource: [fieldsValue.sgPrincipal],
      },
      ids: ganttScripts.gantt.children,
      projectId: '',
    };
    progressSvc.update(params).then((res) => {
      if (res.code == 200) {
        setOpen(false);
        ganttScripts.gantt.children.forEach((item) => {
          $(`#input_${item}`).prop('checked', false);
        });
        ganttScripts.gantt.children = [];
        message.success('进度更新已提交审批，具体请至“进度审批列表”查看!');
      } else {
        message.error(res.msg);
      }
    });
  };
  const handleOnMoreDelete = () => {
    setTaskNum(ganttScripts.gantt.children.length);
    setOpen(true);
    setBatchFlag(true);
  };
  const onFinishDelete = () => {
    const params = {
      actionType: 'batchDelete',
      data: {},
      ids: ganttScripts.gantt.children,
      projectId: '',
    };
    progressSvc
      .delete(params)
      .then((res) => {
        if (res.code == 200) {
          setOpen(false);
          ganttScripts.gantt.children.forEach((item) => {
            $(`#input_${item}`).prop('checked', false);
          });
          ganttScripts.gantt.children = [];
          message.success('批量删除已提交审批，具体请至“进度审批列表”查看!');
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleOnSearch = () => {
    progressSvc
      .query({ text: searchValue })
      .then((res) => {
        // console.log(res);
        if (res.code == 200) {
          console.log(res);
          const data = {
            data: res.data.data.map((item) => {
              let count = 0;
              res.data.data.forEach((item1) => {
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
      .catch((err) => {
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
          onClick={(e) =>
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
      <div
        onClick={() => setOpenModel(!openModel)}
        className={classes.modelBtn}
      >
        {openModel ? '隐藏' : '显示'}模型
      </div>
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
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
        </div>
        <Dropzone
          files={[]}
          setFiles={(files) => {
            saveFiles(files);
            handleOnUpLoadMpp(files);
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
        </Dropzone>
        {/* <form
          // ref="addForm"
          action="http://localhost:3000/api/progress/mpp"
          method="POST"
          encType="multipart/form-data"
          id="addForm"
        >
          <input type="file" name="file" accept=".mpp" id="input-file" />
          <input type="hidden" name="type" value="msproject-parse" />
          <button
            type="submit"
            onClick={(event) => {
              // console.log(event.target);

              setFiles($('#input-file')[0].files);
            }}
          >
            Get
          </button>
        </form> */}
        <div
          onClick={handleOnMoreEdit}
          className={clsx(classes.modelBtn, classes.batchBtn)}
        >
          批量编辑
        </div>
        <AntdDialog
          visible={open}
          hasClose={true}
          dialogTitle={
            <p className={classes.title}>
              {' '}
              {batchFlag ? '批量删除' : '批量编辑'}
            </p>
          }
          hasFooter={true}
          onClose={() => {
            setOpen(false);
          }}
          onConfirm={() => (batchFlag ? onFinishDelete() : form.submit())}
          width={500}
        >
          <div>
            <div className={classes.taskEditTitle}>
              目前已选定任务：<label>{taskNum}</label>&nbsp;个
              {batchFlag ? ',请确认是否一并删除？' : ''}
            </div>
            {!batchFlag && (
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                // initialValues={{ requiredMark }}
                // onValuesChange={onRequiredTypeChange}
                // requiredMark={requiredMark}
              >
                <Form.Item
                  label="优先级"
                  name="priority"
                  rules={[{ required: true, message: '请选择优先级!' }]}
                  className={classes.formItem}
                >
                  <Select
                    placeholder="优先级"
                    // value={selectValue}
                    // onChange={(value) => {
                    //   setSlectValue(value);
                    // }}
                    className={classes.select}
                    bordered={null}
                  >
                    {priority.map((item) => {
                      return (
                        <Option value={item.key} key={item.key}>
                          {item.label}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="施工单位"
                  name="sgCompany"
                  rules={[{ required: true, message: '请选择施工单位!' }]}
                  className={classes.formItem}
                >
                  <Select
                    placeholder="施工单位"
                    // value={selectValue}
                    onChange={(value) => onSelectChange(value, 'sg')}
                    className={classes.select}
                    bordered={null}
                  >
                    {companies.sgCompanies.map((item) => {
                      return (
                        <Option value={item.key} key={item.key}>
                          {item.label}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="负责人"
                  name="sgPrincipal"
                  rules={[{ required: true, message: '请选择施工负责人!' }]}
                  className={classes.formItem}
                >
                  <Select
                    placeholder="负责人"
                    // value={selectValue}
                    // onChange={(value) => {
                    //   setSlectValue(value);
                    // }}
                    className={classes.select}
                    bordered={null}
                  >
                    {sgPrincipal.map((item) => {
                      return (
                        <Option value={item.key} key={item.key}>
                          {item.label}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="监理单位"
                  name="glCompany"
                  rules={[{ required: true, message: '请选择监理单位!' }]}
                  className={classes.formItem}
                >
                  <Select
                    placeholder="监理单位"
                    // value={selectValue}
                    onChange={(value) => onSelectChange(value, 'gl')}
                    className={classes.select}
                    bordered={null}
                  >
                    {companies.glCompanies.map((item) => {
                      return (
                        <Option value={item.key} key={item.key}>
                          {item.label}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="监理负责人"
                  name="jlPrincipal"
                  rules={[{ required: true, message: '请选择监理负责人!' }]}
                  className={classes.formItem}
                >
                  <Select
                    placeholder="监理负责人"
                    // value={selectValue}
                    // onChange={(value) => {
                    //   setSlectValue(value);
                    // }}
                    className={classes.select}
                    bordered={null}
                  >
                    {glPrincipal.map((item) => {
                      return (
                        <Option value={item.key} key={item.key}>
                          {item.label}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="任务完成百分比"
                  name="progress"
                  rules={[{ required: true, message: '请选择任务完成百分比!' }]}
                  className={classes.formItem}
                >
                  <Select
                    placeholder="任务完成百分比"
                    // value={selectValue}
                    // onChange={(value) => {
                    //   setSlectValue(value);
                    // }}
                    className={classes.select}
                    bordered={null}
                  >
                    {taskProgress.map((item) => {
                      return (
                        <Option value={item.key} key={item.key}>
                          {item.label}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Form>
            )}
          </div>
        </AntdDialog>
        <LoadingDialog visible={loadingFlag} copyWriting=""></LoadingDialog>
        <div onClick={handleOnMoreDelete} className={classes.modelBtn}>
          批量删除
        </div>
      </div>
    </Toolbar>
  );
};

export default ProgressManageToolbar;
