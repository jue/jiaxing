import React, { useState, useContext, useEffect } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  FormControl,
  InputLabel,
  Button,
  Box,
  Typography,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  TextField,
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { CloudUploadOutlined } from '@ant-design/icons';

import { Select } from 'antd';

import { OutlineInput, inspectStyles } from '../../../../styles/resetStyles';
import Dropzone from '../../../../components/Dropzone/DropzoneUploadContainer';
import { InspectReportContext } from '../../context/InspectReportContext';
import inspectSubjectSvc from '../../../../services/InspectSubjectSvc';
import { InspectPlanStatusContext } from '../../context/InspectPlanStatusContext';

const { Option } = Select;
const dateForm = 'YYYY-MM-DD';

const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
    planContanier: {
      borderRight: '1px dashed #B2B2B2',
      paddingRight: 27,
      marginRight: 29,
      width: '60%',
      overflowY: 'auto',
      overflowX: 'hidden',
    },
    formControl: {
      width: '100%',
      marginRight: spacing(5),
      '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
        padding: spacing(0, 1),
      },
    },
    inputLabel: {
      color: palette.primary.main,
    },
    radioGroup: {
      display: 'flex',
      flexDirection: 'row',
    },
    formControlLabel: {
      flex: 1,
    },
    button: {
      '& .MuiButton-label': {
        color: '#555',
      },
    },
    iconButton: {
      fontSize: 12,
    },
    files: {
      display: 'flex',
      alignItems: 'center',
    },
    autocomplete: {
      marginTop: spacing(3),
    },
    select: {
      width: '100%',
      borderBottom: '1px solid #b2b2b2',
      marginTop: spacing(2),
    },
    required: {
      color: '#FF3B30',
      marginLeft: 5,
    },
  })
);

const SubjectContent = () => {
  const {
    inspectReportCreated,
    setInspectReportCreated,
    saveFiles,
  } = useContext(InspectReportContext);
  const { setOpenFileViewDialog, setRectificationDialog } = useContext(
    InspectPlanStatusContext
  );

  const classes = useStyles({});
  const classesReset = inspectStyles({});

  const [subjectList, setSubjectList] = useState([]);

  const getSubjectList = async () => {
    const data = await inspectSubjectSvc.query('');
    setSubjectList(data.data);
  };

  useEffect(() => {
    getSubjectList();
  }, []);

  return (
    <Box className={clsx([classesReset.flex, classes.planContanier])}>
      <Box mt={3}>
        <FormControl className={classes.formControl}>
          <InputLabel
            shrink
            htmlFor="inspection-name"
            className={classes.inputLabel}
          >
            检查主题
            <span className={classes.required}>*</span>
          </InputLabel>
          <Autocomplete
            className={classes.autocomplete}
            id="inspection-name"
            inputValue={inspectReportCreated.name || ''}
            options={subjectList.map((option) => option)}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  variant="outlined"
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              );
            }}
            onChange={(e, value, reson) => {
              setInspectReportCreated({
                ...inspectReportCreated,
                name: value && value.name,
                idSubject: value && value._id,
              });
            }}
          />
        </FormControl>
      </Box>
      <Box my={4}>
        <Grid container spacing={3}>
          <Grid container item md={4}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink htmlFor="inspection-way">
                检查方式
                <span className={classes.required}>*</span>
              </InputLabel>
              <Select
                id="inspection-way"
                className={classes.select}
                bordered={null}
                value={inspectReportCreated.way || ''}
                placeholder="请选择检查方式"
                onChange={(value) => {
                  setInspectReportCreated({
                    ...inspectReportCreated,
                    way: value,
                  });
                }}
              >
                <Option value="day">日常检查</Option>
                <Option value="special">专项检查</Option>
                <Option value="spot">抽检</Option>
              </Select>
            </FormControl>
          </Grid>
          <Grid container item md={4}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink htmlFor="inspection-type">
                检查类型
                <span className={classes.required}>*</span>
              </InputLabel>
              <Select
                id="inspection-type"
                placeholder="请选择检查类型"
                className={classes.select}
                bordered={null}
                value={inspectReportCreated.type}
                onChange={(value) => {
                  setInspectReportCreated({
                    ...inspectReportCreated,
                    type: value,
                  });
                }}
              >
                <Option value="constructionUnit">施工单位自检</Option>
                <Option value="supervisionUnit">监理单位检查</Option>
                <Option value="developmentUnit">建设单位检查</Option>
                <Option value="projectJoint">项目联合检查</Option>
                <Option value="other">其他</Option>
              </Select>
            </FormControl>
          </Grid>
          <Grid container item md={4}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink htmlFor="inspection-frequency">
                检查频率
                <span className={classes.required}>*</span>
              </InputLabel>
              <Select
                id="inspection-frequency"
                placeholder="请选择"
                className={classes.select}
                bordered={null}
                value={inspectReportCreated.frequency}
                onChange={(value) => {
                  setInspectReportCreated({
                    ...inspectReportCreated,
                    frequency: value,
                  });
                }}
              >
                <Option value="week">每周</Option>
                <Option value="month">每月</Option>
                <Option value="quarter">每季度</Option>
                <Option value="year">每年</Option>
                <Option value="withOutday">不定期</Option>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Box mb={4} display="flex">
        <FormControl className={classes.formControl}>
          <InputLabel shrink htmlFor="inspection-desc">
            检查描述
          </InputLabel>
          <OutlineInput
            id="nspection-desc"
            value={inspectReportCreated.desc || ''}
            placeholder="检查描述..."
            multiline
            // variant="filled"
            onChange={(e) => {
              const { value } = e.target;
              setInspectReportCreated({ ...inspectReportCreated, desc: value });
            }}
          />
        </FormControl>
      </Box>
      <Box mb={4} display="flex">
        <FormControl component="fieldset" className={classes.formControl}>
          <RadioGroup
            aria-label="inspection-result"
            name="inspection-result"
            value={inspectReportCreated.result || ''}
            onChange={(e) => {
              const { value } = e.target;
              setInspectReportCreated({
                ...inspectReportCreated,
                result: value,
              });
            }}
            className={classes.radioGroup}
          >
            <FormControlLabel
              className={classes.formControlLabel}
              value="qualified"
              control={<Radio color="primary" />}
              label="合格"
            />

            <FormControlLabel
              className={classes.formControlLabel}
              value="warning"
              control={<Radio color="primary" />}
              label="预警"
            />
            <FormControlLabel
              className={classes.formControlLabel}
              onClick={() =>
                Boolean('created')
                  ? setRectificationDialog('created')
                  : setRectificationDialog('edit')
              }
              value="rectification"
              control={<Radio color="primary" />}
              label="整改"
            />
            <FormControlLabel
              className={classes.formControlLabel}
              onClick={() =>
                Boolean('created')
                  ? setRectificationDialog('created')
                  : setRectificationDialog('edit')
              }
              value="shutdownRectification"
              control={<Radio color="primary" />}
              label="停工整改"
            />
          </RadioGroup>
        </FormControl>
      </Box>

      {Boolean(inspectReportCreated.files && inspectReportCreated.files.length)
        ? inspectReportCreated.files.map((item) => (
            <Grid container spacing={3} key={item._id}>
              <Grid item md={9} className={classes.files}>
                {item.originalname}
              </Grid>
              <Grid item md={3}>
                <IconButton
                  aria-label="toggle password visibility"
                  className={classes.iconButton}
                  // onClick={() => {
                  // setIdFiles(item.idFile);
                  // }}
                  onClick={() => {
                    setOpenFileViewDialog(item._id);
                  }}
                >
                  <Visibility color="primary" />
                  <Typography variant="body2" style={{ marginLeft: 8 }}>
                    预览
                  </Typography>
                </IconButton>
              </Grid>
            </Grid>
          ))
        : ''}

      <Box flex="1" display="flex" flexDirection="column">
        <Dropzone
          files={[]}
          setFiles={(files) => {
            saveFiles('report', files);
          }}
          accept=".rvt,.nwd, .png, .jpg, .jpeg, .docx, .txt, .md, .xlsx, .pdf"
          maxSize={10}
        >
          <Button className={classes.button} variant="outlined" color="primary">
            <CloudUploadOutlined style={{ color: '#8FC220' }} />
            上传附件
          </Button>
        </Dropzone>
      </Box>
      {/* <RectificationDialog /> */}
    </Box>
  );
};
export default SubjectContent;
