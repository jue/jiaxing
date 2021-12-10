import React, { useState, useContext, useEffect } from 'react';
import clsx from 'clsx';
import moment from 'moment';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  FormControl,
  InputLabel,
  Button,
  Box,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import Datepicker from '../../../../components/Datepicker';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import CloseIcon from '@material-ui/icons/Close';

import { CloudUploadOutlined } from '@ant-design/icons';
import { Select, Input } from 'antd';
import { OutlineInput } from '../../../../styles/resetStylesV2';
import { inspectStyles } from '../../../../styles/resetStyles';

import Dropzone from '../../../../components/Dropzone/DropzoneUploadContainer';
import { HiddenDangerContext } from '../../context/HiddenDangerContext';
import FileList from '../../../../components/FilePreview/FileLists';
import {
  InspectReportType,
  InspectReportDesc,
  PerilsResultsType,
  PerilsResultsDesc,
  CreateQualityInspectionDesc,
} from '../../../../../constants/enums';
import FormFiled from '../../../../components/FormFiled';
import { FlowContext } from '../../../../contexts/FlowContext';
import { OptionData } from 'rc-select/lib/interface';
import CcCascader from './CcCascader';
import ExecutorCascader from './ExecutorCascader';
import DiffFileLists from '../../../../components/FilePreview/DiffFileLists';

const { Option } = Select;
const dateForm = 'YYYY-MM-DD';

const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
    '@global': {
      '.ant-select-item-option-selected:not(.ant-select-item-option-disabled) .ant-select-item-option-state': {
        color: '#8fc220',
      },
      '.MuiFormControlLabel-label': {
        color: 'rgba(0,0,0,0.65)!important',
      },
    },
    planContanier: {
      borderRight: '1px dashed #B2B2B2',
      paddingRight: 27,
      marginRight: 29,
      width: '48%',
      overflowY: 'auto',
      overflowX: 'hidden',
    },
    formControl: {
      width: '79%',
      '& .ant-picker.ant-picker-borderless': {
        border: '1px solid #b2b2b2 !important',
      },
    },
    inputLabel: {
      color: 'rgba(0,0,0,0.45)',
      fontSize: 14,
      lineHeight: '32px',
      width: spacing(15),
      textAlign: 'right',
    },
    radioGroup: {
      display: 'flex',
      flexDirection: 'row',
      marginLeft: spacing(13.5),
    },
    formControlLabel: {
      flex: 1,
    },
    button: {
      marginLeft: spacing(13.5),
      '& .MuiButton-label': {
        color: '#555',
      },
    },
    iconButton: {
      fontSize: 12,
    },
    autocomplete: {
      marginTop: spacing(3),
    },
    select: {
      width: '100%',
      border: '1px solid #b2b2b2',
      marginLeft: spacing(13.5),
      borderRadius: 4,
    },

    addButton: {
      position: 'absolute',
      top: 12,
      right: '4%',
      height: 32,
      '& .MuiButton-label': {
        fontWeight: 400,
        color: palette.primary.main,
        fontSize: 12,
      },
      startIcon: {
        marginRight: 4,
      },
    },
    tagButton: {
      height: 26,
      paddingTop: 2,
      marginBottom: 10,
      marginRight: 10,
      background: 'rgba(143,195,32,0.13)',
      '& .MuiButton-label': {
        fontWeight: 400,
        color: 'rgba(143,195,32,1)',
        fontSize: 12,
      },
    },

    unit: {
      width: '64%',
    },
  })
);

const Subject = () => {
  const {
    saveFiles,
    hiddenDangerSubject,
    setHiddenDangerSubject,
    relusTrue,
    setRelusTrue,
    companyInfos,
    bizDatas,
    taskinfo,
    setTaskinfo,
  } = useContext(HiddenDangerContext);
  const { taskInfos } = useContext(FlowContext);

  const classes = useStyles({});
  const classesReset = inspectStyles({});
  const [units, setUnits] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (units.length > 0) {
      setRelusTrue({ ...relusTrue, partCompanys: '' });
    }
  }, [units]);

  const handleClose = (removedTag) => {
    const tags = units.filter((tag) => tag !== removedTag);
    setUnits(tags);
    setHiddenDangerSubject({
      ...hiddenDangerSubject,
      partCompanys: tags,
    });
    if (tags.length === 0) {
      setRelusTrue({
        ...relusTrue,
        partCompanys: CreateQualityInspectionDesc.PartCompanys,
      });
    }
  };

  const [newFile, setNewFile] = useState([]);
  useEffect(() => {
    let arr =
      hiddenDangerSubject.nodeFiles &&
      hiddenDangerSubject.nodeFiles.filter(
        (item) => item.attachmentType !== taskinfo.attachmentType
      );
    setNewFile(arr);
  }, [taskinfo]);
  return (
    <Box className={clsx([classesReset.flex, classes.planContanier])}>
      <Box mt={3} mb={relusTrue.name !== '' ? 4 : 2} position="relative">
        <FormFiled
          classes={classes.formControl}
          title="检查主题"
          type={
            <OutlineInput
              id="hidden-name"
              value={hiddenDangerSubject.name || ''}
              placeholder="请输入检查主题"
              onChange={(e) => {
                const { value } = e.target;
                setHiddenDangerSubject({ ...hiddenDangerSubject, name: value });
                if (value === '') {
                  setRelusTrue({
                    ...relusTrue,
                    name: CreateQualityInspectionDesc.Name,
                  });
                } else {
                  setRelusTrue({ ...relusTrue, name: '' });
                }
              }}
            />
          }
          relusRequired={relusTrue.name}
          createRelus={CreateQualityInspectionDesc.Name}
        />
      </Box>
      <Box mb={relusTrue.desc !== '' ? 4 : 2} position="relative">
        <FormFiled
          classes={classes.formControl}
          title="检查描述"
          type={
            <OutlineInput
              id="hidden-desc"
              value={hiddenDangerSubject.desc || ''}
              multiline
              rows={4}
              placeholder="请输入检查描述"
              onChange={(e) => {
                const { value } = e.target;
                setHiddenDangerSubject({ ...hiddenDangerSubject, desc: value });
                if (value === '') {
                  setRelusTrue({
                    ...relusTrue,
                    desc: CreateQualityInspectionDesc.Desc,
                  });
                } else {
                  setRelusTrue({ ...relusTrue, desc: '' });
                }
              }}
            />
          }
          relusRequired={relusTrue.desc}
          createRelus={CreateQualityInspectionDesc.Desc}
        />
      </Box>
      <Box mb={relusTrue.type !== '' ? 4 : 2} position="relative">
        <FormFiled
          classes={classes.formControl}
          title="检查类型"
          type={
            <Select
              id="hidden-type"
              placeholder="请选择检查类型"
              className={classes.select}
              bordered={null}
              value={hiddenDangerSubject.type}
              onChange={(value) => {
                setHiddenDangerSubject({
                  ...hiddenDangerSubject,
                  type: value,
                });
                setRelusTrue({ ...relusTrue, type: '' });
              }}
            >
              {Object.keys(InspectReportType).map((item) => (
                <Option value={InspectReportType[item]} key={item}>
                  {InspectReportDesc[InspectReportType[item]]}
                </Option>
              ))}
            </Select>
          }
          relusRequired={relusTrue.type}
          createRelus={CreateQualityInspectionDesc.Type}
        />
      </Box>
      <Box mb={relusTrue.perilsTime !== '' ? 4 : 2} position="relative">
        <FormFiled
          classes={classes.formControl}
          title="检查日期"
          type={
            <Datepicker
              id="hidden-time"
              bordered={false}
              placeholder="请选择检查日期"
              className={classes.select}
              onChange={(d) => {
                setHiddenDangerSubject({
                  ...hiddenDangerSubject,
                  perilsTime: moment(d).format(dateForm),
                });
                setRelusTrue({ ...relusTrue, perilsTime: '' });
              }}
            />
          }
          relusRequired={relusTrue.perilsTime}
          createRelus={CreateQualityInspectionDesc.PerilsTime}
        />
      </Box>

      <Box mb={relusTrue.partCompanys !== '' ? 4 : 2} position="relative">
        <Grid container spacing={3}>
          <Grid
            container
            item
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <FormFiled
              classes={clsx(classes.formControl, classes.unit)}
              title="参与单位"
              type={
                <Select
                  id="hidden-type"
                  placeholder="请选择参与单位"
                  className={classes.select}
                  bordered={null}
                  value={inputValue || undefined}
                  onChange={(value, option: OptionData) => {
                    setInputValue(option.children as string);
                  }}
                >
                  {companyInfos.map((item) => (
                    <Option value={item._id} key={item._id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              }
              relusRequired={relusTrue.partCompanys}
              createRelus={CreateQualityInspectionDesc.PartCompanys}
            />
            <Button
              color="primary"
              variant="outlined"
              size="small"
              onClick={() => {
                if (inputValue) {
                  setUnits([...units, inputValue]);
                  setHiddenDangerSubject({
                    ...hiddenDangerSubject,
                    partCompanys: [...units, inputValue],
                  });
                  setInputValue('');
                }
              }}
              className={classes.addButton}
              startIcon={<AddCircleOutline style={{ fontSize: 14 }} />}
            >
              添加
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box mb={0.5} pl={10} ml={3.8}>
        {units.map((item) => {
          return (
            <Button
              key={item}
              color="primary"
              variant="outlined"
              size="small"
              className={classes.tagButton}
              endIcon={
                <CloseIcon
                  style={{ fontSize: 14 }}
                  onClick={() => handleClose(item)}
                />
              }
            >
              {item}
            </Button>
          );
        })}
      </Box>
      <Box mb={relusTrue.perilsResults !== '' ? 4 : 2} position="relative">
        <FormFiled
          classes={classes.formControl}
          title="检查结果"
          type={
            <RadioGroup
              aria-label="hidden-result"
              name="hidden-result"
              value={hiddenDangerSubject.perilsResults || ''}
              onChange={(e) => {
                const { value } = e.target;
                setHiddenDangerSubject({
                  ...hiddenDangerSubject,
                  perilsResults: value,
                });
                setRelusTrue({ ...relusTrue, perilsResults: '' });
              }}
              className={classes.radioGroup}
            >
              {Object.keys(PerilsResultsType).map((item) => (
                <FormControlLabel
                  key={item}
                  className={classes.formControlLabel}
                  value={PerilsResultsType[item]}
                  control={
                    <Radio
                      size="small"
                      color="primary"
                      style={{ height: 32, lineHeight: '32px' }}
                    />
                  }
                  label={PerilsResultsDesc[PerilsResultsType[item]]}
                />
              ))}
            </RadioGroup>
          }
          relusRequired={relusTrue.perilsResults}
          createRelus={CreateQualityInspectionDesc.PerilsResults}
        />
      </Box>

      <Box mb={relusTrue.type !== '' ? 4 : 2} position="relative">
        <FormFiled
          classes={classes.formControl}
          title="整改执行人"
          type={<ExecutorCascader classes={classes} />}
          relusRequired={relusTrue.type}
          createRelus={CreateQualityInspectionDesc.Type}
        />
      </Box>
      <CcCascader classes={classes} />

      <Box mb={relusTrue.perilsTime !== '' ? 4 : 2} position="relative">
        <FormFiled
          classes={classes.formControl}
          title="整改截止日期"
          type={
            <Datepicker
              id="end-time"
              bordered={false}
              placeholder="请选择整改截止日期"
              className={classes.select}
              onChange={(d) => {
                setHiddenDangerSubject({
                  ...hiddenDangerSubject,
                  endTime: moment(d).format(dateForm),
                });
                setRelusTrue({ ...relusTrue, endTime: '' });
              }}
            />
          }
          relusRequired={relusTrue.endTime}
          createRelus={CreateQualityInspectionDesc.EndTime}
        />
      </Box>

      {bizDatas &&
        bizDatas.map((list, index) => (
          <Box mb={2} display="flex" key={index}>
            <FormControl className={classes.formControl}>
              <InputLabel
                shrink
                htmlFor="end-time"
                className={classes.inputLabel}
              >
                {list.name}
              </InputLabel>
              {list.type === 'string' && (
                <OutlineInput
                  id="bizData-name"
                  // value={list.code || ''}
                  placeholder={`请输入${list.name}`}
                  onChange={(e) => {
                    const { value } = e.target;
                    setHiddenDangerSubject({
                      ...hiddenDangerSubject,
                      bizData: {
                        ...hiddenDangerSubject.bizData,
                        [list.code]: value,
                      },
                    });
                  }}
                />
              )}
              {list.type === 'number' && (
                <Input
                  placeholder={`请输入${list.name}`}
                  type="number"
                  onChange={(e) => {
                    const { value } = e.target;
                    setHiddenDangerSubject({
                      ...hiddenDangerSubject,
                      bizData: {
                        ...hiddenDangerSubject.bizData,
                        [list.code]: value,
                      },
                    });
                  }}
                />
              )}
              {list.type === 'enum' && (
                <Select
                  id="enum"
                  placeholder={`请输入${list.name}`}
                  bordered={null}
                  className={classes.select}
                  onChange={(value) => {
                    setHiddenDangerSubject({
                      ...hiddenDangerSubject,
                      bizData: {
                        ...hiddenDangerSubject.bizData,
                        [list.code]: value,
                      },
                    });
                  }}
                >
                  {(list.value && Object.keys(list.value)).map(
                    (item, index) => {
                      return (
                        <Option value={item} key={index}>
                          {list.value[item]}
                        </Option>
                      );
                    }
                  )}
                </Select>
              )}
            </FormControl>
          </Box>
        ))}

      {taskInfos.attachmentTypes &&
        taskInfos.attachmentTypes.map((item) => {
          return (
            <>
              <Box flex="1" display="flex" flexDirection="column" key={item}>
                <FormControl className={classes.formControl}>
                  <InputLabel
                    shrink
                    htmlFor="end-files"
                    className={classes.inputLabel}
                  >
                    {item.attachmentName}
                  </InputLabel>
                  <Dropzone
                    files={[]}
                    setFiles={(files) => {
                      saveFiles('subject', files, '1', item.attachmentType);
                      window.localStorage.setItem(
                        'attachmentType',
                        item.attachmentType
                      );
                      setTaskinfo(item);
                    }}
                    accept=".rvt,.nwd, .png, .jpg, .jpeg, .docx, .txt, .md, .xlsx, .pdf"
                    maxSize={10}
                  >
                    <Button
                      className={classes.button}
                      variant="outlined"
                      color="primary"
                      size="small"
                    >
                      <CloudUploadOutlined style={{ color: '#8FC220' }} />
                      {item.attachmentName}
                    </Button>
                  </Dropzone>
                </FormControl>
              </Box>
              {hiddenDangerSubject.nodeFiles &&
                hiddenDangerSubject.nodeFiles.length !== 0 &&
                (taskinfo.attachmentType === item.attachmentType ? (
                  <Box flex="1" display="flex" flexDirection="column" ml={13.5}>
                    <FileList
                      list={hiddenDangerSubject.nodeFiles}
                      type="create"
                      info={hiddenDangerSubject}
                      setInfo={setHiddenDangerSubject}
                      typeForm=""
                    />
                  </Box>
                ) : (
                  <Box flex="1" display="flex" flexDirection="column" ml={13.5}>
                    <DiffFileLists
                      list={newFile}
                      type="create"
                      info={hiddenDangerSubject}
                      setInfo={setHiddenDangerSubject}
                    />
                  </Box>
                ))}
            </>
          );
        })}
    </Box>
  );
};
export default Subject;
