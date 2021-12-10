import React, { useContext, useState, useEffect } from 'react';
import { Select, Input, Row, Col } from 'antd';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { componentsStyles } from '../style';
import { ContractManageContext } from '../context/ContractManageContext';
import clsx from 'clsx';
import { OptionProps } from 'antd/lib/mentions';

const { Option } = Select;
const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    row: {
      marginTop: 20,
    },
    label: {
      fontSize: 14,
      color: 'rgba(0,0,0,0.45)',
      fontWeight: 400,
      display: 'inline-block',
      position: 'relative',
      '& span:nth-of-type(1)': {
        color: 'rgb(250, 85, 85)',
        fontSize: 22,
        opacity: 1,
        position: 'relative',
        top: 7,
      },
    },
    proColSpan: {
      '& .ant-input-affix-wrapper': {
        width: '100%',
      },
    },
  });
});

function StepsOne({
  visible,
  setVisible,
  csrfToken,
}: {
  visible: any;
  setVisible: any;
  csrfToken?: string;
}) {
  const componentsClasses = componentsStyles({});
  const classes = useStyles({});
  const { contractMsg, setContractMsg, projectInfos } = useContext(
    ContractManageContext
  );
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    const project = projectInfos.filter(
      (item) => item._id === contractMsg.idEngineering
    );
    if (project.length) {
      setProjectName(project[0].name);
    }
  }, [projectInfos]);

  return (
    <div>
      <Row gutter={{ xs: 12, md: 24 }}>
        <Col span={8}>
          <div
            className={clsx([componentsClasses.colSpan, classes.proColSpan])}
          >
            <span className={classes.label}>
              <span>*</span> <span>项目名称:</span>
            </span>
            <Select
              className={componentsClasses.select}
              placeholder="请选择项目名称"
              onChange={(value, option: OptionProps) => {
                setContractMsg({ ...contractMsg, idEngineering: value });
                setProjectName(option.key);
              }}
              value={projectName || undefined}
            >
              {projectInfos.map((item) => (
                <Option value={item._id} key={item.name}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </div>
        </Col>
        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span className={classes.label}>
              <span>*</span> <span>标段名称:</span>
            </span>

            <Input
              placeholder="请填写标段名称"
              className={componentsClasses.input}
              value={contractMsg.blockName}
              onChange={(e) => {
                const { value } = e.target;
                setContractMsg({ ...contractMsg, blockName: value });
              }}
            />
          </div>
        </Col>
        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span className={classes.label}>
              <span></span> 项目地点:
            </span>
            <Input
              placeholder="请填写项目地点"
              className={componentsClasses.input}
              value={contractMsg.projectSite}
              onChange={(e) => {
                const { value } = e.target;
                setContractMsg({ ...contractMsg, projectSite: value });
              }}
            />
          </div>
        </Col>
      </Row>
      <Row gutter={{ xs: 12, md: 24 }} className={classes.row}>
        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span className={classes.label}>
              <span>*</span> 资金来源:
            </span>
            <Select
              className={componentsClasses.select}
              onChange={(value) => {
                setContractMsg({ ...contractMsg, capitalSource: value });
              }}
              value={contractMsg.capitalSource || undefined}
              placeholder="请选择资金来源"
            >
              <Option value="部门预算">部门预算</Option>
              <Option value="政府投资">政府投资</Option>
            </Select>
          </div>
        </Col>

        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span
              className={classes.label}
              style={{
                height: 40,
                lineHeight: '19px',
              }}
            >
              <span></span>
              <span>
                工程核准(备案)
                <br />
                证编号:
              </span>
            </span>
            <Input
              placeholder="请填写工程核准(备案)证编号"
              className={componentsClasses.input}
              value={contractMsg.projectApprovalNumber}
              onChange={(e) => {
                const { value } = e.target;
                setContractMsg({
                  ...contractMsg,
                  projectApprovalNumber: value,
                });
              }}
            />
          </div>
        </Col>
      </Row>
      <Row gutter={{ xs: 12, md: 24 }} className={classes.row}>
        <Col span={24}>
          <div className={componentsClasses.colSpan}>
            <span className={classes.label}>
              <span>*</span> 项目规模及特征:
            </span>
            <Input
              placeholder="请填写项目规模及特征"
              className={componentsClasses.input}
              style={{ width: '88%' }}
              value={contractMsg.projectScale}
              onChange={(e) => {
                const { value } = e.target;
                setContractMsg({ ...contractMsg, projectScale: value });
              }}
            />
          </div>
        </Col>
      </Row>
      <Row gutter={{ xs: 12, md: 24 }} className={classes.row}>
        <Col span={24}>
          <div className={componentsClasses.colSpan}>
            <span className={classes.label}>
              <span>*</span> 项目承包范围:
            </span>
            <Input
              placeholder="请填写项目承包范围"
              className={componentsClasses.input}
              value={contractMsg.projectScope}
              style={{ width: '88%' }}
              onChange={(e) => {
                const { value } = e.target;
                setContractMsg({ ...contractMsg, projectScope: value });
              }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default StepsOne;
