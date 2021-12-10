import { useContext, useState } from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import {
  CloudUploadOutlined,
  CloseCircleFilled,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import shortid from 'shortid';
import { useRouter } from 'next/router';
import Badge from 'antd/lib/badge';

import clsx from 'clsx';

import { UnderlineInput } from '../../../components/Input/UnderlineInput';
import Dropzone from '../../../components/Dropzone/DropzoneUploadContainer';
import { InspectPlanReqContext } from '../context/InspectPlanReqContext';
import { InspectPlanStatusContext } from '../context/InspectPlanStatusContext';
import AntdDialog from '../../../components/AntdDialog';
import Datepicker from '../../../components/Datepicker';
import { MuiSelect } from '../../../components/Select';
import AssingeeTree from './InspectSunjectAssignee';
import { method, type, frequency } from './enums';
import { OrganizationContext } from '../context/OrganizationContext';

const dateForm = 'YYYY-MM-DD';
const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    closeIcon: {
      width: '100%',
      textAlign: 'right',
    },
    formControl: {
      width: '100%',
      marginBottom: 20,
      position: 'relative',
    },
    grid: {
      marginRight: 100,
    },
    select: {
      width: '100%',
      marginTop: 1,
    },
    title: {
      fontSize: 24,
      fontFamily: 'PingFangSC-Medium,PingFang SC',
      fontWeight: 500,
      color: 'rgba(0,0,0,0.8)',
      lineHeight: '33px',
      textAlign: 'center',
    },
    gridDatePicker: {
      '& .ant-picker': {
        width: '100%',
      },
      '& .ant-picker.ant-picker-borderless': {
        borderBottom: '1px solid #b2b2b2 !important',
      },
    },
    button: {
      width: 100,
      height: 34,
      borderRadius: 4,
      border: '1px solid rgba(143,194,32,1)',
      lineHeight: '22px',
      '& .MuiButton-label': {
        fontWeight: 400,
        color: '#555',
        fontSize: 14,
      },
    },
    fileGrid: {
      marginTop: 40,
      display: 'flex',
      width: '100%',
      flexWrap: 'wrap',
    },
    buttonGroup: {
      textAlign: 'center',
      '& button': {
        width: 88,
        height: 34,
        boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.1)',
      },
      '& button:nth-of-type(1)': {
        marginRight: 60,
        '& .MuiButton-label': {
          fontWeight: 400,
          color: 'rgba(0,0,0,0.3)',
        },
      },
    },
    imgContanier: {
      display: 'flex',
      marginBottom: 20,
      marginRight: 10,
    },
    img: {
      width: 80,
      height: 80,
      borderRadius: 4,
      marginLeft: 20,
    },
    closeCiycleIcon: {
      color: '#FF7474',
      width: 14,
      height: 14,
    },
    required: {
      color: '#FF3B30',
      marginLeft: 5,
    },
    popverI: {},
    popverII: {},
  });
});

const disabledDate = (current) => {
  return current && current < moment().endOf('day');
};

const InspectPlanSubjectCreatedDialog = () => {
  const {
    createdSubjectDialog,
    openAssigneePopver,
    setCreatedSubjectDialog,
    setOpenAssigneePopver,
  } = useContext(InspectPlanStatusContext);
  const {
    inspectCreatedPlanSubject,
    setInspectCreatedPlanSubject,
    hadleCraeatedSubjectList,
    inspectPlanSubjectList,
    inspectCreatedPlan,
    setInspectCreatedPlan,
    saveFiles,
    handleCreatedSubjects,
    queryUserName,
  } = useContext(InspectPlanReqContext);
  const { handleQueryCompany } = useContext(OrganizationContext);

  const [openMethod, setOpenMethod] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [openFrequency, setOpenFrequency] = useState(false);

  const classes = useStyles({});
  const handleCancle = () => {
    setCreatedSubjectDialog(false);
    setInspectCreatedPlanSubject({});
  };
  const query = useRouter().query;
  let disabled: Boolean = true;
  if (
    inspectCreatedPlanSubject.name &&
    inspectCreatedPlanSubject.endTime &&
    inspectCreatedPlanSubject.startTime &&
    inspectCreatedPlanSubject.allocateObjects &&
    inspectCreatedPlanSubject.count &&
    inspectCreatedPlanSubject.method &&
    inspectCreatedPlanSubject.type &&
    inspectCreatedPlanSubject.frequency
  ) {
    disabled = false;
  }

  return (
    <AntdDialog
      visible={Boolean(createdSubjectDialog)}
      hasClose={true}
      dialogTitle={
        <p className={classes.title}>
          {createdSubjectDialog === 'created' && '新增'}
          {createdSubjectDialog === 'edit' && '编辑'}检查内容
        </p>
      }
      hasFooter={false}
      onClose={() => handleCancle()}
      onConfirm
      width={820}
    >
      <FormControl className={classes.formControl}>
        <InputLabel shrink>
          检查主题<span className={classes.required}>*</span>
        </InputLabel>
        <UnderlineInput
          value={inspectCreatedPlanSubject.name || ''}
          onChange={(e) => {
            const { value } = e.target;
            setInspectCreatedPlanSubject({
              ...inspectCreatedPlanSubject,
              name: value,
            });
          }}
          endAdornment={
            <InputAdornment
              position="end"
              onClick={() => {
                setInspectCreatedPlanSubject({
                  ...inspectCreatedPlanSubject,
                  subject: '',
                });
              }}
            >
              <CancelIcon aria-label="toggle password visibility" />
            </InputAdornment>
          }
        />
      </FormControl>
      <Grid container className={clsx([classes.formControl, classes.popverI])}>
        <Grid item md={5}>
          <FormControl className={classes.formControl}>
            <InputLabel shrink htmlFor="inspection-method">
              检查方式<span className={classes.required}>*</span>
            </InputLabel>
            <MuiSelect
              id="inspection-method"
              className={classes.select}
              bordered={null}
              displayEmpty
              value={inspectCreatedPlanSubject.method || ''}
              onChange={(e) => {
                const { value } = e.target;
                setInspectCreatedPlanSubject({
                  ...inspectCreatedPlanSubject,
                  method: value,
                });
              }}
              onOpen={() => <UpOutlined />}
              onClick={(e) => setOpenMethod(!openMethod)}
              open={openMethod}
              IconComponent={() =>
                openMethod ? <UpOutlined /> : <DownOutlined />
              }
            >
              {method.map((item) => (
                <MenuItem key={item.label} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
        </Grid>
        <Grid item md={2} />
        <Grid item md={5}>
          <FormControl className={classes.formControl}>
            <InputLabel shrink htmlFor="inspection-type">
              检查类型<span className={classes.required}>*</span>
            </InputLabel>
            <MuiSelect
              id="inspection-type"
              className={classes.select}
              bordered={null}
              displayEmpty
              value={inspectCreatedPlanSubject.type || ''}
              onChange={(e) => {
                const { value } = e.target;

                setInspectCreatedPlanSubject({
                  ...inspectCreatedPlanSubject,
                  type: value,
                });
              }}
              onOpen={() => <UpOutlined />}
              onClick={(e) => setOpenType(!openType)}
              open={openType}
              IconComponent={() =>
                openType ? <UpOutlined /> : <DownOutlined />
              }
            >
              {type.map((item) => (
                <MenuItem key={item.label} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container>
        <Grid container item md={5}>
          <Grid item md={5}>
            <FormControl
              className={clsx([classes.formControl, classes.popverII])}
            >
              <InputLabel shrink htmlFor="inspection-frequency">
                检查周期<span className={classes.required}>*</span>
              </InputLabel>
              <MuiSelect
                defaultValue=""
                id="inspection-frequency"
                className={classes.select}
                bordered={null}
                value={inspectCreatedPlanSubject.frequency || ''}
                onChange={(e) => {
                  const { value } = e.target;
                  setInspectCreatedPlanSubject({
                    ...inspectCreatedPlanSubject,
                    frequency: value,
                  });
                }}
                displayEmpty
                onOpen={() => <UpOutlined />}
                onClick={(e) => setOpenFrequency(!openFrequency)}
                open={openFrequency}
                IconComponent={() =>
                  openFrequency ? <UpOutlined /> : <DownOutlined />
                }
              >
                {frequency.map((item) => (
                  <MenuItem key={item.label} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </Grid>
          <Grid item md={2} />
          <Grid item md={5}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink>
                检查次数<span className={classes.required}>*</span>
              </InputLabel>
              <UnderlineInput
                value={inspectCreatedPlanSubject.count || ''}
                type="number"
                onChange={(e) => {
                  const { value } = e.target;
                  setInspectCreatedPlanSubject({
                    ...inspectCreatedPlanSubject,
                    count: value,
                  });
                }}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid item md={2} />
        <Grid item md={5}>
          <FormControl className={classes.formControl}>
            <InputLabel shrink htmlFor="inspection-assignee">
              分配对象<span className={classes.required}>*</span>
            </InputLabel>
            <UnderlineInput
              value={inspectCreatedPlanSubject.allocateObjects || ''}
              onClick={(e) => {
                setOpenAssigneePopver(true);
                handleQueryCompany();
              }}
              onChange={(e) => {
                const { value } = e.target;
                queryUserName(value);
                setInspectCreatedPlanSubject({
                  ...inspectCreatedPlanSubject,
                  allocateObjects: value,
                });
              }}
              endAdornment={
                openAssigneePopver ? <UpOutlined /> : <DownOutlined />
              }
            />
            <AssingeeTree />
          </FormControl>
        </Grid>
      </Grid>
      <Grid container className={classes.gridDatePicker}>
        <Grid item md={5}>
          <InputLabel shrink htmlFor="start-time">
            开始时间<span className={classes.required}>*</span>
          </InputLabel>
          <Datepicker
            data-subject-picker="start-time"
            bordered={false}
            disabledDate={disabledDate}
            placeholder="请选择时间"
            defaultValue={
              inspectCreatedPlanSubject.startTime &&
              moment(inspectCreatedPlanSubject.startTime, dateForm)
            }
            onChange={(d) => {
              setInspectCreatedPlanSubject({
                ...inspectCreatedPlanSubject,
                startTime: moment(d).format(dateForm),
              });
            }}
          />
        </Grid>
        <Grid item md={2}></Grid>
        <Grid item md={5}>
          <InputLabel shrink htmlFor="end-time">
            结束时间<span className={classes.required}>*</span>
          </InputLabel>
          <Datepicker
            data-subject-picker="end-time"
            placeholder="请选择时间"
            disabledDate={disabledDate}
            defaultValue={
              inspectCreatedPlanSubject.endTime &&
              moment(inspectCreatedPlanSubject.endTime, dateForm)
            }
            bordered={false}
            onChange={(d) => {
              setInspectCreatedPlanSubject({
                ...inspectCreatedPlanSubject,
                endTime: moment(d).format(dateForm),
              });
            }}
          />
        </Grid>
      </Grid>
      <Grid className={classes.fileGrid}>
        <div className={classes.imgContanier}>
          {inspectCreatedPlanSubject.files &&
            inspectCreatedPlanSubject.files.map((item, index) => {
              return (
                <Badge
                  key={index}
                  count={
                    <CloseCircleFilled
                      className={classes.closeCiycleIcon}
                      onClick={() => {
                        inspectCreatedPlanSubject.files.filter(
                          (fitem, index) => {
                            if (fitem._id === item._id) {
                              inspectCreatedPlanSubject.files.splice(index, 1);
                            }
                          }
                        );
                        setInspectCreatedPlanSubject({
                          ...inspectCreatedPlanSubject,
                          files: inspectCreatedPlanSubject.files,
                        });
                      }}
                    />
                  }
                  offset={[0, 0]}
                >
                  <img
                    src={`/api/file/download?idFile=${item._id}`}
                    className={classes.img}
                  />
                </Badge>
              );
            })}
        </div>
        <Dropzone
          files={[]}
          setFiles={(files) => {
            saveFiles('subject', files);
          }}
          accept=".png, .jpg, .jpeg"
          maxSize={10}
        >
          <Button className={classes.button}>
            <CloudUploadOutlined style={{ color: '#8FC220' }} />
            <span>上传图片</span>
          </Button>
        </Dropzone>
      </Grid>
      <Grid className={classes.buttonGroup}>
        <Button
          onClick={() => {
            handleCancle();
          }}
        >
          取消
        </Button>
        <Button
          color="primary"
          variant="contained"
          disabled={Boolean(disabled)}
          onClick={() => {
            handleCancle();
            const id = shortid.generate();
            const idPlan = inspectCreatedPlan._id || shortid.generate();
            if (
              query.action === 'create' &&
              createdSubjectDialog === 'created'
            ) {
              hadleCraeatedSubjectList({
                ...inspectCreatedPlanSubject,
                _id: id,
              });
              setInspectCreatedPlan({
                ...inspectCreatedPlan,
                _id: idPlan,
              });
            } else if (
              query.action !== 'create' &&
              createdSubjectDialog === 'created'
            ) {
              handleCreatedSubjects();
            }

            if (query.action === 'create' && createdSubjectDialog === 'edit') {
              inspectPlanSubjectList.map((item, index) => {
                if (item._id === inspectCreatedPlanSubject._id) {
                  inspectPlanSubjectList[index] = inspectCreatedPlanSubject;
                }
              });
            }
          }}
        >
          确认
        </Button>
      </Grid>
    </AntdDialog>
  );
};

export default () => {
  return <InspectPlanSubjectCreatedDialog />;
};
