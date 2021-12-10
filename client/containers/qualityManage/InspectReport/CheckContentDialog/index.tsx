import React, { useState, useContext } from 'react';
import shortid from 'shortid';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  FormControl,
  InputLabel,
  InputAdornment,
  Grid,
  Input,
  Button,
  Box,
  Typography,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import { Select, Badge } from 'antd';
import { CloudUploadOutlined, CloseCircleFilled } from '@ant-design/icons';

import { InspectReportContext } from '../../context/InspectReportContext';

import AntdDialog from '../../../../components/AntdDialog';
import { UnderlineInput } from '../../../../components/Input/UnderlineInput';
import Dropzone from '../../../../components/Dropzone/DropzoneUploadContainer';

import InspectReportBim from './InspectReportBim';

const { Option } = Select;

const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
    title: {
      fontSize: 24,
      fontFamily: 'PingFangSC-Medium,PingFang SC',
      fontWeight: 500,
      color: 'rgba(0,0,0,0.8)',
      lineHeight: '33px',
      textAlign: 'center',
    },
    formControl: {
      width: '100%',
      marginBottom: 20,
    },
    select: {
      width: '100%',
      borderBottom: '1px solid #b2b2b2',
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
      marginBottom: 10,
      '& .MuiButton-label': {
        fontWeight: 400,
        color: '#555',
        fontSize: 14,
      },
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
    img: {
      width: 80,
      height: 80,
      borderRadius: 4,
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
  })
);
const CheckContentDialog = ({ checkContentDialog, setCheckContentDialog }) => {
  const {
    inspectCheckItemCreated,
    setInspectCheckItemCreated,
    setInspectReportCreated,
    inspectReportCreated,
    saveFiles,
    handleCraeatedCheckItem,
  } = useContext(InspectReportContext);

  const classes = useStyles({});
  const [open, setOpen] = useState(false);

  return (
    <AntdDialog
      visible={Boolean(checkContentDialog)}
      hasClose={true}
      dialogTitle={
        <p className={classes.title}>
          {(checkContentDialog == 'created' && '新增') ||
            (checkContentDialog == 'edit' && '编辑')}
          检查项
        </p>
      }
      hasFooter={false}
      onClose={() => setCheckContentDialog('')}
      onConfirm
      width={820}
    >
      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="check-item-name">
          检查项
          <span className={classes.required}>*</span>
        </InputLabel>
        <UnderlineInput
          value={inspectCheckItemCreated.name || ''}
          placeholder="请输入检查项"
          endAdornment={
            <InputAdornment position="end" onClick={() => {}}>
              <CancelIcon
                aria-label="toggle password visibility"
                color="primary"
              />
            </InputAdornment>
          }
          onChange={(e) => {
            const { value } = e.target;
            setInspectCheckItemCreated({
              ...inspectCheckItemCreated,
              name: value,
            });
            // setInspectCheckItemEdit({
            //   ...inspectCheckItemEdit,
            //   name: value,
            // });
          }}
        />
      </FormControl>

      <Grid container className={classes.formControl}>
        <Grid item md={5}>
          <InputLabel shrink htmlFor="check-item-result">
            结果
            <span className={classes.required}>*</span>
          </InputLabel>
          <Select
            id="check-item-result"
            className={classes.select}
            bordered={null}
            value={inspectCheckItemCreated.result || ''}
            onChange={(value) => {
              setInspectCheckItemCreated({
                ...inspectCheckItemCreated,
                result: value,
              });
              // setInspectCheckItemEdit({
              //   ...inspectCheckItemEdit,
              //   result: value,
              // });
            }}
          >
            <Option value="pass">通过</Option>
            <Option value="notPass">待整改</Option>
          </Select>
        </Grid>
        <Grid item md={2} />
        <Grid item md={5} className={classes.gridDatePicker}>
          <InputLabel shrink htmlFor="check-item-type">
            检查项列别
            <span className={classes.required}>*</span>
          </InputLabel>
          <Select
            id="check-item-type"
            className={classes.select}
            bordered={null}
            value={inspectCheckItemCreated.type || ''}
            onChange={(value) => {
              setInspectCheckItemCreated({
                ...inspectCheckItemCreated,
                type: value,
              });
              // setInspectCheckItemEdit({
              //   ...inspectCheckItemEdit,
              //   type: value,
              // });
            }}
          >
            <Option value="sand">沙子</Option>
            <Option value="concrete">混凝土</Option>
            <Option value="reinforced">钢筋</Option>
            <Option value="casting">浇筑</Option>
          </Select>
        </Grid>
      </Grid>

      <FormControl fullWidth className={classes.formControl}>
        <InputLabel shrink htmlFor="check-item-remark">
          备注
        </InputLabel>
        <Input
          id="check-item-remark"
          value={inspectCheckItemCreated.remark || ''}
          onChange={(e) => {
            setInspectCheckItemCreated({
              ...inspectCheckItemCreated,
              remark: e.target.value,
            });
            // setInspectCheckItemEdit({
            //   ...inspectCheckItemEdit,
            //   remark: e.target.value,
            // });
          }}
          placeholder="备注..."
        />
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => setOpen(true)}
        style={{ marginBottom: 40 }}
      >
        添加锚点
      </Button>
      <Box display="flex">
        {Boolean(
          inspectCheckItemCreated.files && inspectCheckItemCreated.files.length
        ) &&
          inspectCheckItemCreated.files.map((item) => (
            <Box mr={4}>
              <div
                key={item._id}
                style={{ width: 80, height: 80, marginRight: 10 }}
              >
                <Badge
                  count={
                    <CloseCircleFilled
                      className={classes.closeCiycleIcon}
                      onClick={() => {
                        inspectCheckItemCreated.files.filter((fitem, index) => {
                          if (fitem._id === item._id) {
                            inspectCheckItemCreated.files.splice(index, 1);
                          }
                        });

                        setInspectCheckItemCreated({
                          ...inspectCheckItemCreated,
                          files: inspectCheckItemCreated.files,
                        });
                        // setInspectCheckItemEdit({
                        //   ...inspectCheckItemEdit,
                        //   files: inspectCheckItemCreated.files,
                        // });
                      }}
                    />
                  }
                  offset={[0, 0]}
                >
                  <img
                    src={`/api/file/download?idFile=${item._id}`}
                    alt=""
                    className={classes.img}
                  />
                </Badge>
              </div>
            </Box>
          ))}
        <Box mb={5}>
          <Dropzone
            files={[]}
            setFiles={(files) => {
              saveFiles('checkItem', files);
            }}
            accept=".png, .jpg, .jpeg"
            maxSize={10}
          >
            <Button
              className={classes.button}
              size="small"
              variant="outlined"
              color="primary"
            >
              <CloudUploadOutlined style={{ color: '#8FC220' }} />
              上传图片
            </Button>
          </Dropzone>
          <Typography color="error" variant="body2">
            最多上传五张图片
          </Typography>
        </Box>
      </Box>

      <Grid className={classes.buttonGroup}>
        <Button
          onClick={() => {
            setCheckContentDialog('');
          }}
        >
          取消
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            const id = shortid.generate();
            const idReport = inspectReportCreated._id || shortid.generate();
            handleCraeatedCheckItem({
              ...inspectCheckItemCreated,
              _id: id,
            });
            setInspectReportCreated({
              ...inspectReportCreated,
              _id: idReport,
            });
            setCheckContentDialog('');
            setInspectCheckItemCreated({});
          }}
        >
          确认
        </Button>
      </Grid>
      <InspectReportBim open={open} setOpen={setOpen} />
    </AntdDialog>
  );
};
export default CheckContentDialog;
