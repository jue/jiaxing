import React, { useContext, useEffect, useState } from 'react';
import { makeStyles, createStyles, withStyles } from '@material-ui/core/styles';
import { InspectPlanStatusContext } from '../../../context/InspectPlanStatusContext';
import { InspectReportContext } from '../../../context/InspectReportContext';
import { OrganizationContext } from '../../../context/OrganizationContext';

import AntdDialog from '../../../../../components/AntdDialog';
import Typography from '@material-ui/core/Typography';
import { Box, Button, Grid, IconButton } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { stratify } from 'd3-hierarchy';

import { Tree, Checkbox, Row, Col } from 'antd';

const useStyles = makeStyles(({ spacing }) => {
  return createStyles({
    container: {
      '& .ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected': {
        background: 'none',
        color: '#8FC220',
      },
      '& .ant-checkbox-input:focus + .ant-checkbox-inner,ant-checkbox-checked .ant-checkbox-inner,.ant-checkbox-indeterminate .ant-checkbox-inner': {
        backgroundColor: '#8FC220!important',
        border: '1px solid #8FC220!important',
      },
      '& .ant-checkbox-checked::after,.ant-checkbox-wrapper:hover .ant-checkbox-inner': {
        border: '1px solid #8FC220!important',
      },
      '& .ant-checkbox-checked .ant-checkbox-inner': {
        backgroundColor: '#8FC220!important',
        border: '1px solid #8FC220!important',
      },
    },
    title: {
      fontSize: 16,
      fontFamily: 'PingFangSC-Medium,PingFang SC',
      fontWeight: 500,
      color: 'rgba(0,0,0,0.8)',
      lineHeight: '22px',
      textAlign: 'center',
      marginBottom: 36,
    },
    buttonGroup: {
      textAlign: 'center',
      marginTop: 74,
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
    required: {
      color: '#FF3B30',
      marginLeft: 5,
    },
  });
});

const tableContainer = (node, level, classes) => {
  const { HandleQueryDepartIndo, setDepartInfo } = useContext(
    OrganizationContext
  );
  if (!node) {
    return <React.Fragment />;
  }
  const { children = [], data } = node;

  return (
    <>
      <div key={data && data._id}>
        {data && data.name && (
          <div
            className={classes.tableTr}
            style={{ paddingLeft: level > 1 && 50 * (level - 1) }}
            onClick={() => {
              if (data._id === data.dept.idCompany) {
                // setDepartInfo(data.dept);
                HandleQueryDepartIndo(data._id);
              }
            }}
          >
            <Typography className={classes.tableTitle}>{data.name}</Typography>
          </div>
        )}

        {children.map((child) => {
          return tableContainer(child, level + 1, classes);
        })}
      </div>
    </>
  );
};

const Organization = {
  Company: '单位设置',
  Depart: '部门设置',
  Person: '人员设置',
};

const TaskAddPersonDialog = ({ openAddPerson, setOpenAddPerson }) => {
  const { companyInfo, departInfo, handleQueryCompany } = useContext(
    OrganizationContext
  );

  const [treeCompany, setTreeCompany] = useState<any>({});
  const [treeDepart, setTreeDepart] = useState<any>({});

  const classes = useStyles({});
  const handleCancle = () => {
    setOpenAddPerson(false);
  };

  useEffect(() => {
    const itemAll = { _id: '0' };
    const newCompanyInfos = JSON.parse(JSON.stringify(companyInfo));
    // const newDepartInfos = JSON.parse(JSON.stringify(departInfo));
    let newTreeCompany: any, newTreeDepart: any;

    newTreeCompany = stratify()
      .id(function (d) {
        return d._id;
      })
      .parentId(function (d) {
        return d.parentId;
      })([itemAll, ...newCompanyInfos]);

    // newTreeDepart = stratify()
    //   .id(function (d) {
    //     return d._id;
    //   })
    //   .parentId(function (d) {
    //     return d.parentId;
    //   })([itemAll, ...newDepartInfos]);

    setTreeCompany(newTreeCompany);
    // setTreeDepart(newTreeDepart);
  }, [companyInfo, departInfo]);

  function onChange(checkedValues) {
    console.log('checked = ', checkedValues);
  }

  const onSelect = (selectedKeys, info) => {
    console.log('selected', info.node.title);
  };

  const [treeOpen, setTreeOpen] = useState(false);
  return (
    <AntdDialog
      visible={Boolean(openAddPerson)}
      hasClose={false}
      dialogTitle={<p className={classes.title}>{openAddPerson}</p>}
      hasFooter={false}
      onClose={() => handleCancle()}
      onConfirm
      width={800}
    >
      <Box className={classes.container}>
        <Box>
          <Typography style={{ marginBottom: 10 }}>
            任务参与人
            <span className={classes.required}>*</span>
          </Typography>
          <Box
            width="100%"
            height={40}
            border="1px dashed #B2B2B2"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius={4}
          >
            {treeOpen === false && (
              <IconButton
                color="primary"
                size="small"
                onClick={() => {
                  setTreeOpen(true);
                  handleQueryCompany();
                }}
              >
                <AddCircleOutlineIcon />
              </IconButton>
            )}
          </Box>
          {treeOpen === true && (
            <Box width="100%" display="flex" mt={2.5}>
              <Box width="100%" flex="auto">
                <Typography>{Organization.Company}</Typography>
                {tableContainer(treeCompany, 0, classes)}
              </Box>

              <Box width="100%" flex="auto">
                <Typography>{Organization.Depart}</Typography>
                {tableContainer(departInfo, 0, classes)}
              </Box>

              <Box width="100%" flex="auto">
                <Typography>{Organization.Person}</Typography>
                <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                  <Row>
                    <Col span={24}>
                      <Checkbox value="A">A</Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="B">B</Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="C">C</Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="D">D</Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="E">E</Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <Grid className={classes.buttonGroup}>
        <Button
          onClick={() => {
            handleCancle();
          }}
        >
          取消
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            handleCancle();
          }}
        >
          确认
        </Button>
      </Grid>
    </AntdDialog>
  );
};
export default TaskAddPersonDialog;
