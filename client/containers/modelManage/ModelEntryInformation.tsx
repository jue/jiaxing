import React, { useContext, useEffect, useState } from 'react';
import { OutlineInput } from '../../components/Input/OutlineInput';
import { Row, Col } from 'antd';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { ModelManageContext } from './context/ModelManageContext';
import clsx from 'clsx';
import { Select, AutoComplete } from 'antd';

const useStyles = makeStyles(() => {
  return createStyles({
    row: {
      margin: '0 0 24px !important',
      '& .ant-select:hover': {
        border: '1px solid #8FC220',
      },
      '& .ant-select:focus': {
        border: '1px solid #8FC220',
      },
    },

    flex: {
      height: '84%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      '& p': {
        marginBottom: 0,
      },
    },

    label: {
      color: '#000',
      opacity: 0.85,
      fontSize: 14,
    },
    input: {
      '& input': {
        width: 204,
        height: 30,
        padding: '0 12px',
        color: 'rgba(0, 0, 0, 0.65)',
      },
    },
    select: {
      border: '1px solid rgba(0,0,0,0.15)',
      borderRadius: 4,
      width: 228,
      height: 32,
    },

    modalCol: {
      position: 'relative',
    },
  });
});

function ModelEntryInformation() {
  const classes = useStyles({});
  const {
    projectInfos,
    contractInfos,
    createModelInfo,
    setCreateModelInfo,
    modelTable,
    queryModelVersion,
    queryContracts,
    query,
    setQuery,
  } = useContext(ModelManageContext);

  const handleChange = o => {
    setCreateModelInfo({
      ...createModelInfo,
      idContract: o.key,
    });
    setQuery({ ...query, idContract: o.key });
  };
  const handleChangePro = o => {
    setCreateModelInfo({
      ...createModelInfo,
      idEngineering: o.key,
    });
    queryContracts(o.key);
  };

  let model_name = [];
  modelTable.map(item => {
    model_name.push({ value: item.name });
  });

  return (
    <>
      <Row gutter={24} className={classes.row}>
        <Col className={clsx([classes.modalCol, 'gutter-row'])} span={8}>
          <span className={classes.label}>工程名称：</span>
          <Select
            showSearch
            placeholder="请选择/输入工程名称"
            onChange={(v, o) => {
              handleChangePro(o);
            }}
            bordered={false}
            className={classes.select}
          >
            {projectInfos.map(item => (
              <Select.Option key={item._id} value={item.name}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col className={clsx([classes.modalCol, 'gutter-row'])} span={8}>
          <span className={classes.label}>合同名称：</span>
          <Select
            showSearch
            placeholder="请选择/输入合同名称"
            onChange={(v, o) => {
              handleChange(o);
            }}
            bordered={false}
            className={classes.select}
          >
            {contractInfos.map(item => (
              <Select.Option key={item._id} value={item.name}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col className="gutter-row" span={8}>
          <span className={classes.label}>模型名称：</span>
          <AutoComplete
            className={classes.select}
            bordered={false}
            onChange={v => {
              setCreateModelInfo({
                ...createModelInfo,
                name: v,
              });
              queryModelVersion('true', v);
            }}
            placeholder="请选择/输入模型名称"
            options={model_name.length > 0 && model_name}
            filterOption={(inputValue, option) =>
              option.value.indexOf(inputValue) !== -1
            }
          />
        </Col>
      </Row>
      <Row gutter={24} className={classes.row}>
        <Col className="gutter-row" span={8}>
          <span className={classes.label}>模型版本：</span>
          <OutlineInput
            placeholder="请输入模型版本"
            className={classes.input}
            type="number"
            value={createModelInfo.version}
            onChange={e => {
              const { value } = e.target;
              setCreateModelInfo({
                ...createModelInfo,
                version: value,
              });
            }}
          />
        </Col>
      </Row>
    </>
  );
}

export default ModelEntryInformation;
