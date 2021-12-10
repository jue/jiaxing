import React, { useEffect, useContext, useState } from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  Grid,
  Button,
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';

import { Select } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';

import { ConstructionContext } from '../../context/ConstructionContext';
import AntdDialog from '../../../../components/AntdDialog';
import Dropzone from '../../../../components/Dropzone/DropzoneUploadContainer';
import FileList from '../../../../components/FilePreview/FileLists';

import { OutlineInput } from '../../../../styles/resetStylesV2';
import { SchemeType, SchemeTypeDesc } from '../../../../../constants/enums';
import DiffFileLists from '../../../../components/FilePreview/DiffFileLists';

const { Option } = Select;

const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
    '@global': {
      '.ant-select-item-option-selected:not(.ant-select-item-option-disabled) .ant-select-item-option-state': {
        color: '#8fc220',
      },
    },
    title: {
      fontSize: 16,
      fontFamily: 'PingFangSC-Medium,PingFang SC',
      fontWeight: 500,
      color: 'rgba(0,0,0,0.85)',
      borderBottom: '1px solid rgba(0,0,0,0.09)',
      paddingBottom: spacing(2),
    },
    formControl: {
      // width: '75%',
      marginBottom: spacing(2.5),
      display: 'flex',
      flexDirection: 'row',
    },
    button: {
      width: 106,
      marginBottom: spacing(1),
      marginLeft: spacing(1.5),
      border: '1px dashed rgba(143, 194, 32, 0.5)',
      '& .MuiButton-label': {
        fontWeight: 400,
        color: palette.primary.main,
      },
    },
    buttonGroup: {
      marginTop: spacing(6),
      textAlign: 'right',
      '& button': {
        width: 65,
        height: 32,
        boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.1)',
      },
      '& button:nth-of-type(1)': {
        marginRight: spacing(2),
        '& .MuiButton-label': {
          fontWeight: 400,
          color: 'rgba(0,0,0,0.3)',
        },
      },
    },

    radioGroup: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      marginLeft: spacing(1.5),
    },

    inputLabel: {
      color: 'rgba(0,0,0,0.45)',
      // fontSize: 14,
      lineHeight: '32px',
      width: 110,
      textAlign: 'right',
    },
    upload: {
      color: 'rgba(0,0,0,0.45)',
      // fontSize: 14,
      lineHeight: '32px',
      width: 90,
      textAlign: 'right',
    },
    select: {
      width: '100%',
      border: '1px solid #b2b2b2',
      marginLeft: spacing(1.5),
      borderRadius: 4,
    },
  })
);

const ConstructionCreate = ({ open, setOpen, taskInfos }) => {
  const {
    constructionInfo,
    setConstructionInfo,
    saveFiles,
    handleConfirm,
    taskinfo,
    setTaskinfo,
  } = useContext(ConstructionContext);

  const [newFile, setNewFile] = useState([]);
  useEffect(() => {
    let arr =
      constructionInfo.nodeFiles &&
      constructionInfo.nodeFiles.filter(
        (item) => item.attachmentType !== taskinfo.attachmentType
      );
    setNewFile(arr);
  }, [taskinfo]);
  const classes = useStyles({});

  return (
    <AntdDialog
      visible={open}
      hasClose={true}
      dialogTitle={<p className={classes.title}>新建施工方案</p>}
      hasFooter={false}
      onClose={() => setOpen(false)}
      onConfirm
      width={600}
    >
      <FormControl className={classes.formControl}>
        <Box className={classes.inputLabel}>施工方案名称</Box>

        <OutlineInput
          style={{ marginLeft: 12 }}
          id="constructionInfo-name"
          value={constructionInfo.name || ''}
          placeholder="请输入施工方案名称"
          onChange={(e) => {
            const { value } = e.target;
            setConstructionInfo({
              ...constructionInfo,
              name: value,
            });
          }}
        />
      </FormControl>

      <FormControl className={classes.formControl}>
        <Box className={classes.inputLabel}>方案类型</Box>
        <RadioGroup
          aria-label="constructionInfo-type"
          name="constructionInfo-type"
          value={constructionInfo.type || ''}
          onChange={(e) => {
            const { value } = e.target;
            let newInfo: any = {};
            if (value === 'specialConstructionSchemeOver') {
              newInfo = {
                type: value,
                bizData: {
                  specialConstructionSchemeOver: SchemeTypeDesc[value],
                },
              };
            } else {
              newInfo = {
                type: value,
              };
            }
            setConstructionInfo({
              ...constructionInfo,
              ...newInfo,
            });
          }}
          className={classes.radioGroup}
        >
          {Object.keys(SchemeType).map((item) => (
            <FormControlLabel
              key={item}
              value={SchemeType[item]}
              control={
                <Radio
                  size="small"
                  color="primary"
                  style={{ height: 32, lineHeight: '32px' }}
                />
              }
              label={SchemeTypeDesc[SchemeType[item]]}
            />
          ))}
        </RadioGroup>
      </FormControl>

      <FormControl className={classes.formControl}>
        <Box className={classes.inputLabel}>所属项目</Box>
        <Select
          id="constructionInfo-projectName"
          placeholder="请选择所属项目"
          className={classes.select}
          bordered={null}
          value={constructionInfo.projectName}
          onChange={(value) => {
            setConstructionInfo({
              ...constructionInfo,
              projectName: value,
            });
          }}
        >
          <Option value="嘉兴有轨电车一期工程">嘉兴有轨电车一期工程</Option>
        </Select>
      </FormControl>

      {taskInfos.attachmentTypes &&
        taskInfos.attachmentTypes.map((item) => {
          return (
            <React.Fragment key={item}>
              <Box flex="1" display="flex" flexDirection="column">
                <FormControl className={classes.formControl}>
                  <Box className={classes.upload}>{item.attachmentName}</Box>
                  <Dropzone
                    files={[]}
                    setFiles={(files) => {
                      saveFiles(files, '1', item.attachmentType);
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
              <Box display="flex">
                <Box className={classes.inputLabel} />
                {constructionInfo.nodeFiles &&
                  constructionInfo.nodeFiles.length !== 0 &&
                  (taskinfo.attachmentType === item.attachmentType ? (
                    <Box flex="1" display="flex" flexDirection="column">
                      <FileList
                        list={constructionInfo.nodeFiles}
                        type="create"
                        info={constructionInfo}
                        setInfo={setConstructionInfo}
                        typeForm=""
                      />
                    </Box>
                  ) : (
                    <Box flex="1" display="flex" flexDirection="column">
                      <DiffFileLists
                        list={newFile}
                        type="create"
                        info={constructionInfo}
                        setInfo={setConstructionInfo}
                      />
                    </Box>
                  ))}
                {/* {constructionInfo.nodeFiles &&
                  constructionInfo.nodeFiles.length !== 0 && (
                    <Box display="flex" flexDirection="column">
                      <FileList
                        list={constructionInfo.nodeFiles}
                        type="create"
                        info={constructionInfo}
                        setInfo={setConstructionInfo}
                      />
                    </Box>
                  )} */}
              </Box>
            </React.Fragment>
          );
        })}

      <Grid className={classes.buttonGroup}>
        <Button
          onClick={() => {
            setOpen(false);
          }}
        >
          取消
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            handleConfirm();
            setOpen(false);
          }}
        >
          确认
        </Button>
      </Grid>
    </AntdDialog>
  );
};
export default ConstructionCreate;
