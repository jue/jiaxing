import { useContext } from 'react';
import { InspectPlanSubjectList } from './InspectSubject';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { inspectStyles } from '../../../styles/resetStyles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { CloudUploadOutlined } from '@ant-design/icons';
import Dropzone from '../../../components/Dropzone/DropzoneUploadContainer';
import { InspectPlanReqContext } from '../context/InspectPlanReqContext';
import { InspectPlanStatusContext } from '../context/InspectPlanStatusContext';
import clsx from 'clsx';
import Datepicker from '../../../components/Datepicker';
import moment from 'moment';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useRouter } from 'next/router';
import { OutlineInput } from '../../../components/Input/OutlineInput';

const dateForm = 'YYYY-MM-DD';
const useStyles = makeStyles(() => {
  return createStyles({
    required: {
      color: '#FF3B30',
      marginLeft: 5,
    },
    planDesc: {
      '& .MuiInputBase-root': { borderRadius: 4 },
      '& #plan-desc': {
        background: '#F5F5F5',
        border: 0,
      },
    },
  });
});

const disabledDate = current => {
  return current && current < moment().endOf('day');
};

export const InspectOperatingPlan = () => {
  const classesReset = inspectStyles({});
  const classes = useStyles({});
  const router = useRouter();
  const isEdit = router.query.action === 'edit';
  const {
    inspectCreatedPlan,
    setInspectCreatedPlan,
    saveFiles,
    handleConfirm,
    editInspectPlan,
    setEditInspectPlan,
  } = useContext(InspectPlanReqContext);
  const { setOpenFileViewDialog } = useContext(InspectPlanStatusContext);
  let disabled: Boolean = true;

  if (
    inspectCreatedPlan.name &&
    inspectCreatedPlan.startTime &&
    inspectCreatedPlan.endTime
  ) {
    disabled = false;
  }
  return (
    <div className="container">
      <div>
        <div className={classesReset.planTitle}>
          {isEdit ? '编辑' : '创建'}计划
        </div>
      </div>
      <div className={clsx([classesReset.createdInspectionPlan])}>
        <div className={clsx([classesReset.flex, classesReset.planContanier])}>
          <FormControl className="block">
            <InputLabel shrink>
              计划名称<span className={classes.required}>*</span>
            </InputLabel>
            <OutlineInput
              id="plan-name"
              value={inspectCreatedPlan.name || ''}
              onChange={e => {
                const { value } = e.target;
                setInspectCreatedPlan({ ...inspectCreatedPlan, name: value });
                setEditInspectPlan({ ...editInspectPlan, name: value });
              }}
            />
          </FormControl>

          <FormControl className={clsx([classes.planDesc, 'block'])}>
            <InputLabel shrink>计划描述</InputLabel>
            <OutlineInput
              id="plan-desc"
              value={inspectCreatedPlan.desc || ''}
              onChange={e => {
                const { value } = e.target;
                setInspectCreatedPlan({ ...inspectCreatedPlan, desc: value });
                setEditInspectPlan({ ...editInspectPlan, desc: value });
              }}
            />
          </FormControl>

          <div className={classesReset.datePicker}>
            <div>
              <div className={classesReset.planPicker}>
                开始时间<span className={classes.required}>*</span>
              </div>
              <Datepicker
                data-plan-picker="start-time"
                bordered={false}
                placeholder="请选择时间"
                disabledDate={disabledDate}
                value={
                  inspectCreatedPlan.startTime &&
                  moment(inspectCreatedPlan.startTime, dateForm)
                }
                onChange={d => {
                  setInspectCreatedPlan({
                    ...inspectCreatedPlan,
                    startTime: moment(d).format(dateForm),
                  });
                  setEditInspectPlan({
                    ...editInspectPlan,
                    startTime: moment(d).format(dateForm),
                  });
                }}
              />
            </div>
            <div>
              <div className={classesReset.planPicker}>
                结束时间<span className={classes.required}>*</span>
              </div>
              <Datepicker
                data-plan-picker="end-time"
                bordered={false}
                placeholder="请选择时间"
                disabledDate={disabledDate}
                value={
                  inspectCreatedPlan.endTime &&
                  moment(inspectCreatedPlan.endTime, dateForm)
                }
                onChange={d => {
                  setInspectCreatedPlan({
                    ...inspectCreatedPlan,
                    endTime: moment(d).format(dateForm),
                  });
                  setEditInspectPlan({
                    ...editInspectPlan,
                    endTime: moment(d).format(dateForm),
                  });
                }}
              />
            </div>
          </div>
          <div className={classesReset.filesReview}>
            {inspectCreatedPlan.files &&
              inspectCreatedPlan.files.map((item, index) => {
                return (
                  <div key={index} className={classesReset.fileItem}>
                    <div>{item.originalname}</div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#3A3B3F',
                        fontSize: 12,
                        fontWeight: 400,
                      }}
                      onClick={() => {
                        setOpenFileViewDialog(item._id);
                      }}
                    >
                      <VisibilityIcon
                        style={{
                          width: 22,
                          height: 22,
                          color: '#8FC220',
                          marginRight: 10,
                        }}
                      />
                      <span>预览</span>
                    </div>
                  </div>
                );
              })}
          </div>
          <div style={{ width: 100 }}>
            <Dropzone
              files={[]}
              setFiles={files => {
                saveFiles('plan', files);
              }}
              accept=".rvt,.nwd, .png, .jpg, .jpeg, .docx, .txt, .md, .xlsx, .pdf"
              maxSize={10}
            >
              <Button className={classesReset.button}>
                <CloudUploadOutlined />
                <span>上传附件</span>
              </Button>
            </Dropzone>
          </div>
        </div>
        <InspectPlanSubjectList />
      </div>
      <div className={classesReset.buttonGroup}>
        <Button
          className={classesReset.cancelButton}
          onClick={() => {
            router.push('/quality/inspectPlan');
          }}
        >
          {router.query.edit ? '返回' : '取消'}
        </Button>
        <Button
          color="primary"
          variant="contained"
          disabled={Boolean(disabled)}
          onClick={() => {
            handleConfirm();
            router.push('/quality/inspectPlan');
          }}
        >
          保存
        </Button>
      </div>
    </div>
  );
};
