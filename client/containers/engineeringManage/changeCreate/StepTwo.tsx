import { useContext, useEffect, useMemo, useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import moment from 'moment';

import {
  Grid,
  FormControl,
  InputLabel,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
} from '@material-ui/core';

import { Select } from 'antd';
import {
  EngineeringLevelTabType,
  EngineeringLevelTypeDesc,
  EngineeringChangeType,
  EngineeringChangeTypeDesc,
} from '../../../../constants/enums';

import Datepicker from '../../../components/Datepicker';
import { EngineeringContext } from '../context/EngineeringContext';
import { engineeringStyles, OutlineInput } from '../styles';
import Dropzone from '../../../components/Dropzone/DropzoneUploadContainer';
import FileList from '../components/FileLists';
import { FilesAccept } from '../FilesAccept';
import CostCalculationList from './CostCalculationList';

const { Option } = Select;

const StepTwo = ({ companys }) => {
  const router = useRouter();
  const classes = engineeringStyles({});
  const {
    engineeringInfo,
    setEngineeringInfo,
    saveFiles,
    setFileDialog,
  } = useContext(EngineeringContext);
  useEffect(() => {
    setEngineeringInfo({
      ...engineeringInfo,
      needsDesign: false,
    });
  }, []);

  const changeAccordingFile: any = engineeringInfo.changeAccordingFile || [];
  const changeDrawings: any = engineeringInfo.changeDrawings || [];
  const [defaultPayTr, setDefaultPayTr] = useState({
    _id: 'root',
  });
  const [activeNo, setActiveNo] = useState<string>('');

  return (
    <div className={classes.root}>
      <div className={classes.row}>
        <Grid container spacing={3}>
          <Grid item xs={8} sm={4}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink className={classes.inputLabel}>
                <span
                  style={{
                    color: '#FF8C8C',
                    fontSize: 24,
                    fontWeight: 300,
                    opacity: 1,
                    position: 'relative',
                    top: 8,
                  }}
                >
                  *
                </span>
                变更名称：
              </InputLabel>
              <OutlineInput
                id="changeName"
                placeholder="请输入变更名称"
                value={engineeringInfo.changeName || ''}
                onChange={(e) => {
                  const { value } = e.target;
                  setEngineeringInfo({
                    ...engineeringInfo,
                    changeName: value,
                  });
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={8} sm={4}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink className={classes.inputLabel}>
                <span
                  style={{
                    color: '#FF8C8C',
                    fontSize: 24,
                    fontWeight: 300,
                    opacity: 1,
                    position: 'relative',
                    top: 8,
                  }}
                >
                  *
                </span>
                变更级别：
              </InputLabel>
              <Select
                id="changeLevel"
                allowClear
                className={classes.select}
                placeholder="请输入变更级别"
                bordered={null}
                value={engineeringInfo.changeLevel || undefined}
                onChange={async (value) => {
                  setEngineeringInfo({
                    ...engineeringInfo,
                    changeLevel: value,
                  });
                }}
              >
                {Object.keys(EngineeringLevelTabType).map((item) => (
                  <Option value={EngineeringLevelTabType[item]} key={item}>
                    {EngineeringLevelTypeDesc[EngineeringLevelTabType[item]]}
                  </Option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={8} sm={4}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink className={classes.inputLabel}>
                <span
                  style={{
                    color: '#FF8C8C',
                    fontSize: 24,
                    fontWeight: 300,
                    opacity: 1,
                    position: 'relative',
                    top: 8,
                  }}
                >
                  *
                </span>
                变更类别：
              </InputLabel>
              <Select
                id="changeLevel"
                allowClear
                className={classes.select}
                placeholder="请输入变更类别"
                bordered={null}
                value={engineeringInfo.changeType || undefined}
                onChange={async (value) => {
                  setEngineeringInfo({
                    ...engineeringInfo,
                    changeType: value,
                  });
                }}
              >
                {Object.keys(EngineeringChangeType).map((item) => (
                  <Option value={EngineeringChangeType[item]} key={item}>
                    {EngineeringChangeTypeDesc[EngineeringChangeType[item]]}
                  </Option>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </div>

      <div className={classes.row}>
        <Grid container spacing={3}>
          <Grid item xs={8} sm={4}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink className={classes.inputLabel}>
                <span
                  style={{
                    color: '#FF8C8C',
                    fontSize: 24,
                    fontWeight: 300,
                    opacity: 1,
                    position: 'relative',
                    top: 8,
                  }}
                >
                  *
                </span>
                预估变更金额：
              </InputLabel>
              <OutlineInput
                id="estimateAmountChange"
                placeholder="请输入预估变更金额"
                type="number"
                value={
                  Number(engineeringInfo.estimateAmountChange) / 10000 ||
                  undefined
                }
                onChange={(e) => {
                  const { value } = e.target;

                  setEngineeringInfo({
                    ...engineeringInfo,
                    estimateAmountChange: !value
                      ? undefined
                      : Number(value) * 10000,
                  });
                }}
                style={{ position: 'relative' }}
              />
              <span className={classes.amount}>(万元)</span>
            </FormControl>
          </Grid>
          <Grid item xs={8} sm={4}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink className={classes.inputLabel}>
                <span
                  style={{
                    color: '#FF8C8C',
                    fontSize: 24,
                    fontWeight: 300,
                    opacity: 1,
                    position: 'relative',
                    top: 8,
                  }}
                >
                  *
                </span>
                截止期限：
              </InputLabel>

              <Datepicker
                data-subject-picker="endTime"
                placeholder="请选择时间"
                // value={moment(engineeringInfo.endTime)}
                allowClear={false}
                onChange={(d) => {
                  setEngineeringInfo({
                    ...engineeringInfo,
                    endTime: moment(d).format('YYYY-MM-DD'),
                  });
                }}
                style={{
                  marginLeft: 78,
                  width: '100%',
                  border: '1px solid rgba(217,217,217,1)',
                }}
              />
            </FormControl>
          </Grid>
        </Grid>
      </div>
      <div className={classes.row}>
        <Grid container spacing={3}>
          <Grid item xs={8} sm={4}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink className={classes.inputLabel}>
                <span
                  style={{
                    color: '#FF8C8C',
                    fontSize: 24,
                    fontWeight: 300,
                    opacity: 1,
                    position: 'relative',
                    top: 8,
                  }}
                >
                  *
                </span>
                承包单位：
              </InputLabel>
              <Select
                allowClear
                className={classes.select}
                id="contractorUnit"
                placeholder={`请选择承包单位`}
                bordered={null}
                onChange={(value) => {
                  setEngineeringInfo({
                    ...engineeringInfo,
                    contractorUnit: value,
                  });
                }}
              >
                {companys.map((item) => (
                  <Option value={item.name} key={item._id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={8} sm={4}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink className={classes.inputLabel}>
                <span
                  style={{
                    color: '#FF8C8C',
                    fontSize: 24,
                    fontWeight: 300,
                    opacity: 1,
                    position: 'relative',
                    top: 8,
                  }}
                >
                  *
                </span>
                变更负责人：
              </InputLabel>
              <OutlineInput
                id="changeOwner"
                placeholder="请输入变更负责人"
                value={engineeringInfo.changeOwner || ''}
                onChange={(e) => {
                  const { value } = e.target;
                  setEngineeringInfo({
                    ...engineeringInfo,
                    changeOwner: value,
                  });
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={8} sm={4}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink className={classes.inputLabel}>
                <span
                  style={{
                    color: '#FF8C8C',
                    fontSize: 24,
                    fontWeight: 300,
                    opacity: 1,
                    position: 'relative',
                    top: 8,
                  }}
                >
                  *
                </span>
                变更发起人：
              </InputLabel>
              <div
                style={{
                  marginLeft: 80,
                  color: 'rgba(0,0,0,0.85)',
                  lineHeight: '30px',
                }}
              >
                {engineeringInfo.initiator}
              </div>
            </FormControl>
          </Grid>
        </Grid>
      </div>

      <div className={classes.row}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <FormControl style={{ width: '90.5%' }}>
              <InputLabel shrink className={classes.inputLabel}>
                <span
                  style={{
                    color: '#FF8C8C',
                    fontSize: 24,
                    fontWeight: 300,
                    opacity: 1,
                    position: 'relative',
                    top: 8,
                  }}
                >
                  *
                </span>
                变更原因：
              </InputLabel>
              <OutlineInput
                id="changeReason"
                placeholder="请输入变更原因"
                value={engineeringInfo.changeReason || ''}
                onChange={(e) => {
                  const { value } = e.target;
                  setEngineeringInfo({
                    ...engineeringInfo,
                    changeReason: value,
                  });
                }}
              />
            </FormControl>
          </Grid>
        </Grid>
      </div>
      <div className={classes.row}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <FormControl style={{ width: '90.5%' }}>
              <InputLabel shrink className={classes.inputLabel}>
                <span
                  style={{
                    color: '#FF8C8C',
                    fontSize: 24,
                    fontWeight: 300,
                    opacity: 1,
                    position: 'relative',
                    top: 8,
                  }}
                >
                  *
                </span>
                变更描述：
              </InputLabel>
              <OutlineInput
                id="changeDesc"
                placeholder="请输入变更描述"
                value={engineeringInfo.changeDesc || ''}
                onChange={(e) => {
                  const { value } = e.target;
                  setEngineeringInfo({
                    ...engineeringInfo,
                    changeDesc: value,
                  });
                }}
              />
            </FormControl>
          </Grid>
        </Grid>
      </div>

      <div className={classes.row}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <FormControl style={{ width: '90.5%' }}>
              <InputLabel shrink className={classes.inputLabel}>
                <span
                  style={{
                    color: '#FF8C8C',
                    fontSize: 24,
                    fontWeight: 300,
                    opacity: 1,
                    position: 'relative',
                    top: 8,
                  }}
                >
                  *
                </span>
                变更类型：
              </InputLabel>
              {/* <div> */}
              <div className={classes.typeContent}>
                <Box display="flex" width={350}>
                  <FormControl
                    component="fieldset"
                    className={classes.formControl}
                  >
                    <RadioGroup
                      aria-label="needsDesign"
                      name="needsDesign"
                      defaultValue="false"
                      // value={engineeringInfo.needsDesign}
                      onChange={(e) => {
                        const { value } = e.target;

                        setEngineeringInfo({
                          ...engineeringInfo,
                          needsDesign: value === 'true',
                        });
                      }}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                      }}
                    >
                      <FormControlLabel
                        className={classes.formControlLabel}
                        value="true"
                        control={<Radio color="primary" />}
                        label="有图纸"
                      />

                      <FormControlLabel
                        className={classes.formControlLabel}
                        value="false"
                        control={<Radio color="primary" />}
                        label="无图纸"
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>
                {engineeringInfo.needsDesign === true && (
                  <Button
                    className={classes.submitButton}
                    variant="contained"
                    color="primary"
                    onClick={() => setFileDialog('changeDrawings')}
                  >
                    上传文件
                  </Button>
                )}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginLeft: 78,
                }}
              >
                <div style={{ width: '50%' }}>
                  <FileList list={changeDrawings} type="changeDrawings" />
                </div>
                <div style={{ flexGrow: 1 }} />
              </div>
              {/* </div> */}
            </FormControl>
          </Grid>
        </Grid>
      </div>
      <div className={classes.row}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <FormControl style={{ width: '90.5%' }}>
              <InputLabel shrink className={classes.inputLabel}>
                <span
                  style={{
                    color: '#FF8C8C',
                    fontSize: 24,
                    fontWeight: 300,
                    opacity: 1,
                    position: 'relative',
                    top: 8,
                  }}
                >
                  *
                </span>
                变更依据：
              </InputLabel>
              <div style={{ marginLeft: 78 }}>
                <Dropzone
                  files={[]}
                  setFiles={(files) => {
                    saveFiles('changeAccordingFile', files);
                  }}
                  accept={FilesAccept}
                  maxSize={10}
                >
                  <Button
                    className={classes.submitButton}
                    variant="contained"
                    color="primary"
                  >
                    上传文件
                  </Button>
                </Dropzone>

                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div style={{ width: '50%' }}>
                    <FileList
                      list={changeAccordingFile}
                      type="changeAccordingFile"
                    />
                  </div>
                  <div style={{ flexGrow: 1 }} />
                </div>
              </div>
            </FormControl>
          </Grid>
        </Grid>
      </div>
      <CostCalculationList
        defaultPayTr={defaultPayTr}
        setDefaultPayTr={setDefaultPayTr}
        activeNo={activeNo}
        setActiveNo={setActiveNo}
        engineeringInfo={engineeringInfo}
        setEngineeringInfo={setEngineeringInfo}
        index={-1}
      />
    </div>
  );
};
export default StepTwo;
