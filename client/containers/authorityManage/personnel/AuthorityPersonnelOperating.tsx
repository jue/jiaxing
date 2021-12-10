import { useContext, useEffect } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { InputLabel, FormControl } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import clsx from 'clsx';
import { Select } from 'antd';

import { withRouter, useRouter } from 'next/router';
import { LayoutPageContext } from '../../layout/context/LayoutPageContext';
import { AuthoritySetUp } from './AuthoritySetUp';
import { OutlineInput, inspectStyles } from '../../../styles/resetStyles';

import PersonnelContextProvider, {
  PersonnelContext,
} from '../context/personnelContext';
import OrganizationContextProvider, {
  OrganizationContext,
} from '../context/organizationContext';

import find from 'lodash/find';

const { Option } = Select;

const useStyles = makeStyles(() => {
  return createStyles({
    '@global': {
      '.ant-select-single:not(.ant-select-customize-input) .ant-select-selector': {
        height: '40px !important',
      },
      '.ant-select-single:not(.ant-select-customize-input) .ant-select-selector .ant-select-selection-search-input': {
        height: '40px !important',
      },
      '.ant-select-selector .ant-select-selection-item': {
        lineHeight: '38px !important',
      },
    },
    select: {
      marginTop: 24,
      height: 40,
      backgroundColor: '#F5F5F5',
      borderRadius: 4,
    },
    formControl: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      '& .MuiFormControl-root': {
        width: '48%',
      },
      '& .MuiFormControl-root:nth-of-type(1)': {
        marginRight: 22,
      },
    },
    input: {
      backgroundColor: '#F5F5F5',
      border: '1px solid #EBEBEB',
      borderRadius: 4,
      fontSize: 12,
      fontWeight: 400,
      width: '100%',
      height: 40,
      padding: '0 12px',
      fontFamily: 'PingFangSC-Regular,PingFang SC',
      boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.05)',
      marginTop: 24,
    },
  });
});

const AuthorityPersonnelOperating = () => {
  const classesReset = inspectStyles({});
  const classes = useStyles({});

  const {
    personnelInfo,
    personnelInfos,
    setPersonnelInfo,
    handleCreate,
    handleUpdate,
  } = useContext(PersonnelContext);

  const router = useRouter();
  const isEdit = router.query.action === 'edit';
  const editId = router.query._id;

  const editPersonnelInfo = find(personnelInfos, v => v._id === editId);

  useEffect(() => {
    if (isEdit && editPersonnelInfo) {
      setPersonnelInfo(editPersonnelInfo);
    }
  }, [editPersonnelInfo]);

  const { companyInfos, departInfos, jobInfos } = useContext(
    OrganizationContext
  );

  const selectCompany = find(
    companyInfos,
    v => v._id === personnelInfo.idCompany
  );

  const newDepartInfos = departInfos.filter(
    v => v.idCompany === personnelInfo.idCompany
  );
  const selectDepart = find(
    departInfos,
    v => v._id === personnelInfo.idDepartment
  );

  const newJobInfos = jobInfos.filter(
    v => v.idDepartment === personnelInfo.idDepartment
  );
  const selectJob = find(jobInfos, v => v._id === personnelInfo.idJob);

  return (
    <div className="container">
      <div>
        <div className={classesReset.planTitle}>
          {isEdit ? '编辑' : '添加'}人员
        </div>
      </div>
      <div className={classesReset.createdInspectionPlan}>
        <div className={clsx([classesReset.flex, classesReset.planContanier])}>
          <FormControl className="block">
            <InputLabel shrink>请输入人员姓名 *</InputLabel>
            <OutlineInput
              id="authority-name"
              value={personnelInfo.userName}
              onChange={e => {
                const { value } = e.target;
                setPersonnelInfo({ ...personnelInfo, userName: value });
              }}
            />
          </FormControl>

          <FormControl className="block">
            <InputLabel shrink>请选择单位名称 *</InputLabel>

            <Select
              value={selectCompany ? selectCompany.name : ''}
              id="authority-company-name"
              onChange={value => {
                let idDepartment = personnelInfo.idDepartment;
                let idJob = personnelInfo.idJob;
                let department = find(departInfos, v => v.idCompany === value);
                if (!department) {
                  idDepartment = '';
                  idJob = '';
                }
                setPersonnelInfo({
                  ...personnelInfo,
                  idDepartment,
                  idJob,
                  idCompany: value,
                });
              }}
              className={classes.select}
              bordered={null}
            >
              {companyInfos.map(item => {
                return (
                  <Option value={item._id} key={item._id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </FormControl>

          <FormControl className="block">
            <InputLabel shrink>请选择所属部门 *</InputLabel>

            <Select
              value={selectDepart ? selectDepart.name : ''}
              id="authority-depart-name"
              onChange={value => {
                let idJob = personnelInfo.idJob;
                let job = find(jobInfos, v => v.idDepartment === value);
                if (!job) {
                  idJob = '';
                }
                setPersonnelInfo({
                  ...personnelInfo,
                  idJob,
                  idDepartment: value,
                });
              }}
              className={classes.select}
              bordered={null}
            >
              {newDepartInfos.map(item => {
                return (
                  <Option value={item._id} key={item._id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </FormControl>

          <FormControl className="block">
            <InputLabel shrink>请选择职务名称 *</InputLabel>

            <Select
              value={selectJob ? selectJob.name : ''}
              id="authority-depart-name"
              onChange={value => {
                setPersonnelInfo({ ...personnelInfo, idJob: value });
              }}
              className={classes.select}
              bordered={null}
            >
              {newJobInfos.map(item => {
                return (
                  <Option value={item._id} key={item._id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </FormControl>

          <FormControl className={clsx(['block', classes.formControl])}>
            <FormControl>
              <InputLabel shrink>请输入手机号码</InputLabel>
              <InputBase
                id="authority-name"
                value={personnelInfo.phone}
                onChange={e => {
                  const { value } = e.target;
                  setPersonnelInfo({ ...personnelInfo, phone: value });
                }}
                type="number"
                classes={{ input: classes.input }}
              />
            </FormControl>
            <FormControl>
              <InputLabel shrink>请输入邮箱地址</InputLabel>
              <InputBase
                id="authority-name"
                value={personnelInfo.email}
                onChange={e => {
                  const { value } = e.target;
                  setPersonnelInfo({ ...personnelInfo, email: value });
                }}
                classes={{ input: classes.input }}
              />
            </FormControl>
          </FormControl>
        </div>
        {/* <AuthoritySetUp /> */}
      </div>

      <div className={classesReset.buttonGroup}>
        <Button
          className={classesReset.cancelButton}
          style={{ marginRight: 60 }}
          onClick={() => {
            router.push('/authority/personnel');
          }}
        >
          {router.query.edit ? '返回' : '取消'}
        </Button>

        <Button
          color="primary"
          variant="contained"
          disabled={
            !personnelInfo.userName ||
            !personnelInfo.idCompany ||
            !personnelInfo.idDepartment ||
            !personnelInfo.idJob
          }
          onClick={() => {
            if (isEdit) {
              handleUpdate();
            } else {
              handleCreate();
            }
            router.push('/authority/personnel');
          }}
        >
          保存
        </Button>
      </div>
    </div>
  );
};

export default withRouter(({ router }) => {
  const { setParts } = useContext(LayoutPageContext);

  useEffect(() => {
    setParts(['人员与权限', '人员管理', '添加人员']);
  }, [router.query]);

  return (
    <OrganizationContextProvider>
      <PersonnelContextProvider>
        <AuthorityPersonnelOperating />
      </PersonnelContextProvider>
    </OrganizationContextProvider>
  );
});
