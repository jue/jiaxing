import { CompanyDialog, DepartDialog, JobDialog } from './Dialogcontent';
import OrganizationContextProvider, {
  OrganizationContext,
} from '../context/organizationContext';
import {
  OrganizationTabType,
  OrganizationTabTypeDesc,
} from '../../../../constants/enums';
import React, { useContext, useEffect, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AntdDialog from '../../../components/AntdDialog';
import Button from '@material-ui/core/Button';
import { LayoutPageContext } from '../../layout/context/LayoutPageContext';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { stratify } from 'd3-hierarchy';
import { withRouter } from 'next/router';

const useStyles = makeStyles(() => {
  return createStyles({
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 14,
    },
    buttonGroup: {
      display: 'flex',
      alignItems: 'center',
    },
    tableTr: {
      height: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #E9E9E9',
      cursor: 'pointer',
      padding: '0 10px',
      '&:hover': {
        background: 'rgba(143,194,32,0.06)',
      },
    },
    selectTableTr: {
      background: 'rgba(143,194,32,0.06)',
    },
    button: {
      color: '#597EF7',
      background: 'rgba(255, 255, 255, 0)',
      border: 0,
      cursor: 'pointer',
      outline: 'none',
    },
    tableTitle: {
      maxWidth: '80%',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      fontSize: 14,
    },
    deleteTitle: {
      textAlign: 'center',
      fontWeight: 800,
    },
  });
});

const tableContainer = (
  node,
  level,
  classes,
  setDeleteName,
  setDelelteId,
  setCreate,
  setInfo,
  setCreateOrUpdate
) => {
  if (!node) {
    return <React.Fragment />;
  }
  const { children = [], data } = node;

  return (
    <div key={data && data._id}>
      {data && data.name && (
        <div
          className={classes.tableTr}
          style={{ paddingLeft: level > 1 && 50 * (level - 1) }}
        >
          <Typography className={classes.tableTitle}>{data.name}</Typography>
          <div className={classes.buttonGroup}>
            <button
              className={classes.button}
              style={{ borderRight: '1px solid #D8D8D8' }}
              onClick={() => {
                setCreate(true);
                setCreateOrUpdate(false);
                setInfo(data);
              }}
            >
              编辑
            </button>
            <button
              className={classes.button}
              onClick={() => {
                setDeleteName(`${data.name}`);
                setDelelteId(data._id);
              }}
            >
              删除
            </button>
          </div>
        </div>
      )}

      {children.map((child) => {
        return tableContainer(
          child,
          level + 1,
          classes,
          setDeleteName,
          setDelelteId,
          setCreate,
          setInfo,
          setCreateOrUpdate
        );
      })}
    </div>
  );
};

const AuthorityOrganizationManage = () => {
  const classes = useStyles({});
  const [create, setCreate] = useState<boolean>(false);
  const [createOrUpdate, setCreateOrUpdate] = useState<boolean>(true);

  const {
    companyInfos,
    departInfos,
    jobInfos,
    handleDeleteCompany,
    setCompanyInfo,
    setDepartInfo,
    handleDeleteDepart,
    setJobInfo,
    handleDeleteJob,
    currentTab,
    setCurrentTab,
  } = useContext(OrganizationContext);

  const [tree, setTree] = useState<any>({});
  const [deleteName, setDeleteName] = useState<string>('');
  const [delelteId, setDelelteId] = useState<string>('');

  useEffect(() => {
    const itemAll = { _id: '0' };
    const newCompanyInfos = JSON.parse(JSON.stringify(companyInfos));
    const newDepartInfos = JSON.parse(JSON.stringify(departInfos));
    const newJobInfos = JSON.parse(JSON.stringify(jobInfos));

    let newTree: any;

    switch (currentTab) {
      case OrganizationTabType.Company:
        newTree = stratify()
          .id(function (d) {
            return d._id;
          })
          .parentId(function (d) {
            return d.parentId;
          })([itemAll, ...newCompanyInfos]);
        break;

      case OrganizationTabType.Depart:
        newTree = stratify()
          .id(function (d) {
            return d._id;
          })
          .parentId(function (d) {
            return d.parentId;
          })([itemAll, ...newDepartInfos]);
        break;

      case OrganizationTabType.Job:
        newTree = stratify()
          .id(function (d) {
            return d._id;
          })
          .parentId(function (d) {
            return d.parentId;
          })([itemAll, ...newJobInfos]);
        break;

      default:
        break;
    }

    setTree(newTree);
  }, [companyInfos, departInfos, jobInfos]);

  return (
    <>
      <div className={classes.toolbar}>
        <Tabs
          value={currentTab}
          onChange={(event, newValue) => setCurrentTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          {Object.keys(OrganizationTabType).map((item) => {
            return (
              <Tab
                key={item}
                label={OrganizationTabTypeDesc[OrganizationTabType[item]]}
                value={OrganizationTabType[item]}
                selected={OrganizationTabType[item] === currentTab}
              />
            );
          })}
        </Tabs>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            setCreate(true);
            setCreateOrUpdate(true);
          }}
        >
          <AddCircleOutlineIcon style={{ marginRight: 8 }} />
          <span>新建</span>
        </Button>
      </div>

      {currentTab === OrganizationTabType.Company &&
        tableContainer(
          tree,
          0,
          classes,
          setDeleteName,
          setDelelteId,
          setCreate,
          setCompanyInfo,
          setCreateOrUpdate
        )}
      {currentTab === OrganizationTabType.Company && create && (
        <CompanyDialog
          open={create}
          onClose={() => setCreate(false)}
          createOrUpdate={createOrUpdate}
        />
      )}

      {currentTab === OrganizationTabType.Depart &&
        tableContainer(
          tree,
          0,
          classes,
          setDeleteName,
          setDelelteId,
          setCreate,
          setDepartInfo,
          setCreateOrUpdate
        )}
      {currentTab === OrganizationTabType.Depart && create && (
        <DepartDialog
          open={create}
          onClose={() => setCreate(false)}
          createOrUpdate={createOrUpdate}
        />
      )}

      {currentTab === OrganizationTabType.Job &&
        tableContainer(
          tree,
          0,
          classes,
          setDeleteName,
          setDelelteId,
          setCreate,
          setJobInfo,
          setCreateOrUpdate
        )}
      {currentTab === OrganizationTabType.Job && create && (
        <JobDialog
          open={create}
          onClose={() => setCreate(false)}
          createOrUpdate={createOrUpdate}
        />
      )}

      <AntdDialog
        visible={deleteName !== ''}
        onClose={() => setDeleteName('')}
        hasClose={true}
        dialogTitle=""
        hasFooter={true}
        onConfirm={() => {
          switch (currentTab) {
            case OrganizationTabType.Company:
              setDeleteName('');
              handleDeleteCompany(delelteId);
              break;

            case OrganizationTabType.Depart:
              setDeleteName('');
              handleDeleteDepart(delelteId);
              break;

            case OrganizationTabType.Job:
              setDeleteName('');
              handleDeleteJob(delelteId);
              break;

            default:
              break;
          }
        }}
        width={500}
      >
        <Typography className={classes.deleteTitle}>
          您确定要删除{deleteName}？
        </Typography>
      </AntdDialog>
    </>
  );
};

export default withRouter(({ router }) => {
  const { setParts } = useContext(LayoutPageContext);

  useEffect(() => {
    setParts(['人员与权限', '组织架构管理']);
  }, [router.query]);

  return (
    <OrganizationContextProvider>
      <AuthorityOrganizationManage />
    </OrganizationContextProvider>
  );
});
