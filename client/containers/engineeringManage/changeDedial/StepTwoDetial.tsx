import { useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import clsx from 'clsx';

import {
  Grid,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
} from '@material-ui/core';

import { Select } from 'antd';

import {
  EngineeringLevelTabType,
  EngineeringLevelTypeDesc,
  EngineeringChangeTypeDesc,
} from '../../../../constants/enums';

import { EngineeringContext } from '../context/EngineeringContext';
import { engineeringStyles } from '../styles';
import FileDetialLists from '../components/FileDetialLists';
import { FlowContext } from '../../../contexts/FlowContext';

const { Option } = Select;

const StepTwoDetial = () => {
  const classes = engineeringStyles({});
  const {
    engineeringInfo,
    setEngineeringInfo,
    updateEngineeringtMsg,
    setUpdateEngineeringtMsg,
  } = useContext(EngineeringContext);
  const { currentNode } = useContext(FlowContext);
  let NewExecutiveDept = ['工程管理部', '合同管理部', '合同管理部部长/组长'];

  return (
    <div className={classes.root}>
      <div className={classes.row}>
        <Grid container spacing={3}>
          <Grid item xs={8} sm={4}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink className={classes.inputLabel}>
                变更名称：
              </InputLabel>
              <div className={clsx(classes.select, classes.detial)}>
                {engineeringInfo.changeName}
              </div>
            </FormControl>
          </Grid>
          <Grid item xs={8} sm={4}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink className={classes.inputLabel}>
                变更级别：
              </InputLabel>

              {/* {engineeringInfo.isAuth === true &&
              currentNode.nodeName &&
              (NewExecutiveDept.includes(currentNode.nodeName) ||
                currentNode.nodeName.includes('（召开会议）')) ? (
                <Select
                  id="changeLevel"
                  className={classes.select}
                  placeholder="请输入变更级别"
                  bordered={null}
                  value={engineeringInfo.changeLevel || ''}
                  onChange={async value => {
                    setEngineeringInfo({
                      ...engineeringInfo,
                      changeLevel: value,
                    });
                    setUpdateEngineeringtMsg({
                      ...updateEngineeringtMsg,
                      changeLevel: value,
                    });
                  }}
                >
                  {Object.keys(EngineeringLevelTabType).map(item => (
                    <Option value={EngineeringLevelTabType[item]} key={item}>
                      {EngineeringLevelTypeDesc[EngineeringLevelTabType[item]]}
                    </Option>
                  ))}
                </Select>
              ) : ( */}
              <div className={clsx(classes.select, classes.detial)}>
                {EngineeringLevelTypeDesc.common ===
                  engineeringInfo.changeLevel ||
                EngineeringLevelTypeDesc.great === engineeringInfo.changeLevel
                  ? engineeringInfo.changeLevel
                  : EngineeringLevelTypeDesc[engineeringInfo.changeLevel]}
              </div>
              {/* )} */}
            </FormControl>
          </Grid>
          <Grid item xs={8} sm={4}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink className={classes.inputLabel}>
                变更类别：
              </InputLabel>
              <div className={clsx(classes.select, classes.detial)}>
                {EngineeringChangeTypeDesc[engineeringInfo.changeType]}
              </div>
            </FormControl>
          </Grid>
        </Grid>
      </div>

      <div className={classes.row}>
        <Grid container spacing={3}>
          <Grid item xs={8} sm={4}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink className={classes.inputLabel}>
                预估变更金额：
              </InputLabel>
              <div
                className={clsx(classes.select, classes.detial)}
                style={{ position: 'relative' }}
              >
                {engineeringInfo.estimateAmountChange / 10000}
              </div>
              <span className={classes.amount}>(万元)</span>
            </FormControl>
          </Grid>
          <Grid item xs={8} sm={4}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink className={classes.inputLabel}>
                截止期限：
              </InputLabel>
              <div className={clsx(classes.select, classes.detial)}>
                {moment(engineeringInfo.endTime).format('YYYY-MM-DD')}
              </div>
            </FormControl>
          </Grid>
        </Grid>
      </div>

      <div className={classes.row}>
        <Grid container spacing={3}>
          <Grid item xs={8} sm={4}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink className={classes.inputLabel}>
                承包单位：
              </InputLabel>
              <div className={clsx(classes.select, classes.detial)}>
                {engineeringInfo.contractorUnit}
              </div>
            </FormControl>
          </Grid>

          <Grid item xs={8} sm={4}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink className={classes.inputLabel}>
                变更负责人：
              </InputLabel>
              <div className={clsx(classes.select, classes.detial)}>
                {engineeringInfo.changeOwner}
              </div>
            </FormControl>
          </Grid>
          <Grid item xs={8} sm={4}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink className={classes.inputLabel}>
                变更发起人：
              </InputLabel>
              <div className={clsx(classes.select, classes.detial)}>
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
                变更原因：
              </InputLabel>
              <div className={clsx(classes.select, classes.detial)}>
                {engineeringInfo.changeReason}
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
                变更描述：
              </InputLabel>
              <div className={clsx(classes.select, classes.detial)}>
                {engineeringInfo.changeDesc}
              </div>
            </FormControl>
          </Grid>
        </Grid>
      </div>

      <div className={classes.row}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <FormControl style={{ width: '90.5%' }}>
              <InputLabel
                shrink
                className={clsx(classes.inputLabel, classes.common)}
              >
                变更类型：
              </InputLabel>
              <div className={classes.typeContent}>
                <Box display="flex" width={150}>
                  <FormControl
                    component="fieldset"
                    className={classes.formControl}
                  >
                    <RadioGroup
                      aria-label="needsDesign"
                      name="needsDesign"
                      defaultValue={
                        engineeringInfo.needsDesign === true ? 'true' : 'false'
                      }
                      className={classes.radioGroup}
                    >
                      <FormControlLabel
                        className={classes.formControlLabel}
                        value={
                          engineeringInfo.needsDesign === true
                            ? 'true'
                            : 'false'
                        }
                        control={<Radio color="primary" />}
                        label={
                          engineeringInfo.needsDesign === true
                            ? '有图纸'
                            : '无图纸'
                        }
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>
              </div>
              {engineeringInfo.needsDesign === true && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginLeft: 78,
                  }}
                >
                  <div style={{ width: '50%' }}>
                    <FileDetialLists
                      list={engineeringInfo.changeDrawings}
                      type="changeDrawings"
                    />
                  </div>
                  <div style={{ flexGrow: 1 }} />
                </div>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </div>
      <div className={classes.row}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <FormControl style={{ width: '90.5%' }}>
              <InputLabel
                shrink
                className={clsx(classes.inputLabel, classes.common)}
              >
                变更依据：
              </InputLabel>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginLeft: 78,
                }}
              >
                <div style={{ width: '50%' }}>
                  <FileDetialLists
                    list={engineeringInfo.changeAccordingFile}
                    type="changeAccordingFile"
                  />
                </div>
                <div style={{ flexGrow: 1 }} />
              </div>
            </FormControl>
          </Grid>
        </Grid>
      </div>
      {engineeringInfo.desideAgree !== '' && (
        <div className={classes.row}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <FormControl style={{ width: '90.5%' }}>
                <InputLabel
                  shrink
                  className={clsx(classes.inputLabel, classes.common)}
                >
                  已核定变更意见：
                </InputLabel>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginLeft: 90,
                  }}
                >
                  <div>
                    <>
                      <div>1、是否同意立项：</div>
                      <div>{engineeringInfo.desideAgree}</div>
                    </>

                    <>
                      <div>
                        2、核定工程投资
                        {`（${engineeringInfo.investmentAmountDesc}）
                      ${engineeringInfo.investmentAmount &&
                        engineeringInfo.investmentAmount.toFixed(
                          2
                        )}万元，变更级别：${
                          EngineeringLevelTypeDesc[engineeringInfo.changeLevel]
                        }，变更类别：${
                          EngineeringChangeTypeDesc[engineeringInfo.changeType]
                        }。`}
                      </div>
                    </>
                    <>
                      <div>
                        3、费用分担意见：
                        {`建设单位（${engineeringInfo.feePercent1}%）；施工单位（${engineeringInfo.feePercent1}%）。`}
                      </div>
                    </>
                  </div>
                  <div style={{ flexGrow: 1 }} />
                </div>
              </FormControl>
            </Grid>
          </Grid>
        </div>
      )}

      <div className={classes.row}>
        <div style={{ fontSize: 12 }}>费用计算清单</div>
        <div className={classes.payTable}>
          <div className={classes.payHeader}>
            <div className={classes.payShortTd}>项目号</div>
            <div className={classes.payMiddleTd}>项目内容</div>
            <div className={classes.payShortTd}>单位</div>
            <div className={classes.payLongTd}>变更前费用</div>
            <div className={classes.payLongTd}>变更后费用</div>
          </div>

          <div className={classes.payHeader}>
            <div className={classes.payShortTd}>--</div>
            <div className={classes.payMiddleTd}>--</div>
            <div className={classes.payShortTd}>--</div>
            <div className={classes.payLongTd} style={{ display: 'flex' }}>
              <div className={classes.paySingle}>数量</div>
              <div className={classes.paySingle}>单价</div>
              <div className={classes.paySingle}>金额</div>
            </div>
            <div className={classes.payLongTd} style={{ display: 'flex' }}>
              <div className={classes.paySingle}>数量</div>
              <div className={classes.paySingle}>单价</div>
              <div className={classes.paySingle}>金额</div>
            </div>
          </div>

          {(engineeringInfo.costStatement || []).map((item, index) => {
            return (
              <div className={classes.payHeader} key={index}>
                <div className={classes.payShortTd}>{item.costProNumber}</div>
                <div className={classes.payMiddleTd}>{item.costProContent}</div>
                <div className={classes.payShortTd}>{item.costCompany}</div>
                <div className={classes.payLongTd} style={{ display: 'flex' }}>
                  <div className={classes.paySingle}>
                    {item.costBeforeCount}
                  </div>
                  <div className={classes.paySingle}>{item.costBeforeUnit}</div>
                  <div className={classes.paySingle}>
                    {item.costBeforePrice}
                  </div>
                </div>
                <div className={classes.payLongTd} style={{ display: 'flex' }}>
                  <div className={classes.paySingle}>{item.costAfterCount}</div>
                  <div className={classes.paySingle}>{item.costAfterUnit}</div>
                  <div className={classes.paySingle}>{item.costAfterPrice}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default StepTwoDetial;
