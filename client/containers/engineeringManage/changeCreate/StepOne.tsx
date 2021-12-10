import { useContext, useEffect } from 'react';

import { EngineeringContext } from '../context/EngineeringContext';

import { Grid, FormControl, InputLabel, TextField } from '@material-ui/core';

import { Select, Radio } from 'antd';
import { engineeringStyles, OutlineInput } from '../styles';
import { FlowContext } from '../../../contexts/FlowContext';

const { Option } = Select;

const StepOne = ({ companys }) => {
  const classes = engineeringStyles({});
  const {
    engineeringInfo,
    setEngineeringInfo,
    projectInfos,
    queryContracts,
    contractInfos,
    // setContractInfos,
    createModelInfo,
    setCreateModelInfo,
  } = useContext(EngineeringContext);

  const { handleCreateBizData, bizDatasFlow } = useContext(FlowContext);

  useEffect(() => {
    setEngineeringInfo({
      ...engineeringInfo,
      contractName: '',
      idContract: '',
    });
  }, [engineeringInfo.idEngineering]);

  useEffect(() => {
    handleCreateBizData('GC_CHANGE');
  }, []);
  //建设单位
  let constructionUnitC: any = companys.filter(
    (item) => item.type === 'buildingUnit'
  );
  //施工单位
  let constructionExectionUnit: any = companys.filter(
    (item) => item.type === 'constructionUnit'
  );
  //设计单位
  let designUnitC: any = companys.filter((item) => item.type === 'designUnit');

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
                工程名称：
              </InputLabel>
              <Select
                id="engineeringName"
                className={classes.select}
                placeholder="请选择工程名称"
                bordered={null}
                value={engineeringInfo.engineeringName || undefined}
                onChange={async (value) => {
                  let projectInfo = projectInfos.find(
                    (item) => item.name === value
                  );

                  setEngineeringInfo({
                    ...engineeringInfo,
                    engineeringName: value,
                    // constructionUnit: projectInfo.constructionUnit,
                    idEngineering: projectInfo._id,
                    // phone: projectInfo.phone,
                    // head: projectInfo.head,
                  });
                  setCreateModelInfo({
                    ...createModelInfo,
                    idEngineering: projectInfo._id,
                  });
                  queryContracts(projectInfo._id);
                }}
              >
                {projectInfos &&
                  projectInfos.length &&
                  projectInfos.map((item) => (
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
                合同名称：
              </InputLabel>
              <Select
                id="contractName"
                className={classes.select}
                bordered={null}
                value={engineeringInfo.contractName || undefined}
                placeholder="请选择合同名称"
                onChange={(value) => {
                  let contractInfo = contractInfos.find(
                    (item) => item.name === value
                  );
                  setEngineeringInfo({
                    ...engineeringInfo,
                    contractName: value,
                    idContract: contractInfo._id,
                  });
                  setCreateModelInfo({
                    ...createModelInfo,
                    idContract: contractInfo._id,
                  });
                }}
              >
                {contractInfos &&
                  contractInfos.length &&
                  contractInfos.map((item) => (
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
                建设单位：
              </InputLabel>
              <Select
                className={classes.select}
                id="buildingUnit"
                allowClear
                placeholder={`请选择建设单位`}
                bordered={null}
                onChange={(value) => {
                  setEngineeringInfo({
                    ...engineeringInfo,
                    constructionUnit: value,
                  });
                }}
              >
                {constructionUnitC.map((item) => (
                  <Option value={item.name} key={item._id}>
                    {item.name}
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
                施工单位：
              </InputLabel>
              <Select
                className={classes.select}
                id="constructionExectionUnit"
                allowClear
                placeholder={`请选择施工单位`}
                bordered={null}
                onChange={(value) => {
                  setEngineeringInfo({
                    ...engineeringInfo,
                    constructionExectionUnit: value,
                  });
                }}
              >
                {constructionExectionUnit.map((item) => (
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
                设计单位：
              </InputLabel>
              <Select
                className={classes.select}
                id="designUnit"
                allowClear
                placeholder={`请选择设计单位`}
                bordered={null}
                onChange={(value) => {
                  setEngineeringInfo({
                    ...engineeringInfo,
                    designUnit: value,
                  });
                }}
              >
                {designUnitC.map((item) => (
                  <Option value={item.name} key={item._id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {bizDatasFlow && (
            // <div className={classes.row}>
            //   <Grid container spacing={3}>
            <Grid item xs={8} sm={4}>
              {bizDatasFlow.map((data) => {
                return (
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
                      {data.name}：
                    </InputLabel>
                    {data.type !== 'bool' && data.type !== 'enum' && (
                      <OutlineInput
                        id={data.code}
                        placeholder={`请输入${data.name}`}
                        onChange={(e) => {
                          const { value } = e.target;
                          setEngineeringInfo({
                            ...engineeringInfo,
                            bizData: {
                              ...engineeringInfo.bizData,
                              [data.code]: value,
                            },
                          });
                        }}
                      />
                    )}
                    {data.type === 'enum' && (
                      <Select
                        className={classes.select}
                        allowClear
                        id={data.code}
                        placeholder={`请选择${data.name}`}
                        bordered={null}
                        onChange={(value) => {
                          let newValue: any = value;
                          setEngineeringInfo({
                            ...engineeringInfo,
                            bizData: {
                              ...engineeringInfo.bizData,
                              [data.code]: value,
                            },
                            constructionControlUnit:
                              data.name === '监理单位'
                                ? data.value[newValue]
                                : '',
                          });
                        }}
                      >
                        {Object.keys(data.value).map((key, index) => (
                          <Option value={key as string} key={index}>
                            {data.value[key]}
                          </Option>
                        ))}
                      </Select>
                    )}
                    {data.type === 'bool' && (
                      <Radio.Group
                        onChange={(e) => {
                          const { value } = e.target;
                          setEngineeringInfo({
                            ...engineeringInfo,
                            bizData: {
                              ...engineeringInfo.bizData,
                              [data.code]: value,
                            },
                          });
                        }}
                      >
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                      </Radio.Group>
                    )}
                  </FormControl>
                );
              })}
            </Grid>
            //   </Grid>
            // </div>
          )}
        </Grid>
      </div>
    </div>
  );
};
export default StepOne;
