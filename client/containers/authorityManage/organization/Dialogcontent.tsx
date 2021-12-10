import React, { useContext } from 'react';
import { Select } from 'antd';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import CancelIcon from '@material-ui/icons/Cancel';

import find from 'lodash/find';

import AntdDialog from '../../../components/AntdDialog';
import { UnderlineInput } from '../../../components/Input/UnderlineInput';

import { OrganizationContext } from '../context/organizationContext';
import { CompanyType } from '../../../../constants/enums';

const { Option } = Select;

const useStyles = makeStyles(() => {
  return createStyles({
    title: {
      textAlign: 'center',
      fontWeight: 500,
    },
    formControl: {
      width: '100%',
      marginBottom: 20,
    },
    cancel: {
      cursor: 'pointer',
    },
    select: {
      marginTop: 24,
      height: 40,
      backgroundColor: '#fff',
      borderBottom: '1px solid #B2B2B2',
    },
    '@global': {
      'label + .MuiInput-formControl': {
        marginTop: 40,
      },
    },
  });
});

export const CompanyDialog = ({ open, onClose, createOrUpdate }) => {
  const classes = useStyles({});
  const {
    handleCreateCompany,
    handleUpdateCompany,
    companyInfo,
    setCompanyInfo,
    companyInfos,
  } = useContext(OrganizationContext);

  const selectCompany = find(
    companyInfos,
    (v) => v._id === companyInfo.parentId
  );

  const closeDialog = () => {
    setCompanyInfo({});
    onClose();
  };

  return (
    <AntdDialog
      visible={open}
      onClose={closeDialog}
      hasClose={true}
      dialogTitle=""
      hasFooter={true}
      onConfirm={() => {
        if (createOrUpdate) {
          handleCreateCompany();
        } else {
          handleUpdateCompany();
        }

        closeDialog();
      }}
      width={820}
    >
      <Typography className={classes.title} variant="h5">
        新建单位
      </Typography>

      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="check-item-name">
          单位名称 *
        </InputLabel>
        <UnderlineInput
          placeholder="请输入单位名称"
          style={{ fontSize: 14 }}
          value={companyInfo.name}
          endAdornment={
            <InputAdornment
              position="end"
              className={classes.cancel}
              onClick={() => setCompanyInfo({ ...companyInfo, name: '' })}
            >
              <CancelIcon
                aria-label="toggle password visibility"
                color="primary"
              />
            </InputAdornment>
          }
          onChange={(e) => {
            const { value } = e.target;
            setCompanyInfo({ ...companyInfo, name: value });
          }}
        />
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel shrink>上级单位</InputLabel>

        <Select
          defaultValue={selectCompany ? selectCompany.name : ''}
          onChange={(value) => {
            setCompanyInfo({ ...companyInfo, parentId: value });
          }}
          className={classes.select}
          bordered={null}
        >
          {companyInfos.map((item) => {
            if (item._id === companyInfo._id) {
              return <React.Fragment key={item._id} />;
            } else {
              return (
                <Option value={item._id} key={item._id}>
                  {item.name}
                </Option>
              );
            }
          })}
        </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel shrink>单位类型</InputLabel>

        <Select
          defaultValue={
            companyInfo.type
              ? (
                  find(CompanyType, (v) => v._id === companyInfo.type) || {
                    name: '',
                  }
                ).name
              : ''
          }
          onChange={(value) => {
            setCompanyInfo({ ...companyInfo, type: value });
          }}
          className={classes.select}
          bordered={null}
        >
          {CompanyType.map((item) => {
            return (
              <Option value={item._id} key={item._id}>
                {item.name}
              </Option>
            );
          })}
        </Select>
      </FormControl>
    </AntdDialog>
  );
};

export const DepartDialog = ({ open, onClose, createOrUpdate }) => {
  const classes = useStyles({});
  const {
    handleCreateDepart,
    handleUpdateDepart,
    departInfo,
    departInfos,
    setDepartInfo,
    companyInfos,
  } = useContext(OrganizationContext);

  const selectCompany = find(
    companyInfos,
    (v) => v._id === departInfo.idCompany
  );
  const selectDepart = find(departInfos, (v) => v._id === departInfo.parentId);

  const closeDialog = () => {
    setDepartInfo({});
    onClose();
  };

  return (
    <AntdDialog
      visible={open}
      onClose={closeDialog}
      hasClose={true}
      dialogTitle=""
      hasFooter={true}
      onConfirm={() => {
        if (createOrUpdate) {
          handleCreateDepart();
        } else {
          handleUpdateDepart();
        }

        closeDialog();
      }}
      width={820}
    >
      <FormControl className={classes.formControl}>
        <InputLabel shrink>所属单位 *</InputLabel>

        <Select
          defaultValue={selectCompany ? selectCompany.name : ''}
          onChange={(value) => {
            let parentId = departInfo.parentId;
            let newSelectDepart = find(
              departInfos,
              (v) => v._id === departInfo.parentId
            );

            if (
              !newSelectDepart ||
              (newSelectDepart && newSelectDepart.idCompany !== value)
            ) {
              parentId = '';
            }
            setDepartInfo({ ...departInfo, parentId, idCompany: value });
          }}
          className={classes.select}
          bordered={null}
        >
          {companyInfos.map((item) => {
            return (
              <Option value={item._id} key={item._id}>
                {item.name}
              </Option>
            );
          })}
        </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel shrink>上级部门</InputLabel>

        <Select
          value={selectDepart ? selectDepart.name : ''}
          allowClear
          onChange={(value) => {
            setDepartInfo({ ...departInfo, parentId: value });
          }}
          className={classes.select}
          bordered={null}
        >
          {departInfos.map((item) => {
            if (
              item._id === departInfo._id ||
              (selectCompany && item.idCompany !== selectCompany._id)
            ) {
              return <React.Fragment key={item._id} />;
            } else {
              return (
                <Option value={item._id} key={item._id}>
                  {item.name}
                </Option>
              );
            }
          })}
        </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="check-item-name">
          部门名称 *
        </InputLabel>
        <UnderlineInput
          placeholder="请输入部门名称"
          style={{ fontSize: 14 }}
          value={departInfo.name}
          endAdornment={
            <InputAdornment
              position="end"
              className={classes.cancel}
              onClick={() => setDepartInfo({ ...departInfo, name: '' })}
            >
              <CancelIcon
                aria-label="toggle password visibility"
                color="primary"
              />
            </InputAdornment>
          }
          onChange={(e) => {
            const { value } = e.target;
            setDepartInfo({ ...departInfo, name: value });
          }}
        />
      </FormControl>
    </AntdDialog>
  );
};

export const JobDialog = ({ open, onClose, createOrUpdate }) => {
  const classes = useStyles({});
  const {
    handleCreateJob,
    handleUpdateJob,
    jobInfo,
    setJobInfo,
    companyInfos,
    departInfos,
    jobInfos,
  } = useContext(OrganizationContext);

  const selectCompany = find(companyInfos, (v) => v._id === jobInfo.idCompany);
  const selectDepart = find(departInfos, (v) => v._id === jobInfo.idDepartment);
  const selectJob = find(jobInfos, (v) => v._id === jobInfo.parentId);

  const closeDialog = () => {
    setJobInfo({});
    onClose();
  };

  return (
    <AntdDialog
      visible={open}
      onClose={closeDialog}
      hasClose={true}
      dialogTitle=""
      hasFooter={true}
      onConfirm={() => {
        if (createOrUpdate) {
          handleCreateJob();
        } else {
          handleUpdateJob();
        }

        closeDialog();
      }}
      width={820}
    >
      <FormControl className={classes.formControl}>
        <InputLabel shrink>所属单位 *</InputLabel>

        <Select
          defaultValue={selectCompany ? selectCompany.name : ''}
          onChange={(value) => {
            let idDepartment = jobInfo.idDepartment;
            let newSelectDepart = find(
              departInfos,
              (v) => v._id === jobInfo.idDepartment
            );

            if (newSelectDepart && newSelectDepart.idCompany !== value) {
              idDepartment = '';
            }
            setJobInfo({ ...jobInfo, idDepartment, idCompany: value });
          }}
          className={classes.select}
          bordered={null}
        >
          {companyInfos.map((item) => {
            return (
              <Option value={item._id} key={item._id}>
                {item.name}
              </Option>
            );
          })}
        </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel shrink>所属部门 *</InputLabel>

        <Select
          value={selectDepart ? selectDepart.name : ''}
          onChange={(value) => {
            let parentId = jobInfo.parentId;
            let newSelectJob = find(
              jobInfos,
              (v) => v._id === jobInfo.parentId
            );

            if (newSelectJob && newSelectJob.idDepartment !== value) {
              parentId = '';
            }
            setJobInfo({ ...jobInfo, parentId, idDepartment: value });
          }}
          className={classes.select}
          bordered={null}
        >
          {departInfos.map((item) => {
            if (selectCompany && item.idCompany !== selectCompany._id) {
              return <React.Fragment key={item._id} />;
            } else {
              return (
                <Option value={item._id} key={item._id}>
                  {item.name}
                </Option>
              );
            }
          })}
        </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel shrink>上级领导</InputLabel>

        <Select
          value={selectJob ? selectJob.name : ''}
          onChange={(value) => {
            setJobInfo({ ...jobInfo, parentId: value });
          }}
          className={classes.select}
          bordered={null}
        >
          {jobInfos.map((item) => {
            if (
              item._id === jobInfo._id ||
              (selectDepart && item.idDepartment !== selectDepart._id)
            ) {
              return <React.Fragment key={item._id} />;
            } else {
              return (
                <Option value={item._id} key={item._id}>
                  {item.name}
                </Option>
              );
            }
          })}
        </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="check-item-name">
          职务名称 *
        </InputLabel>
        <UnderlineInput
          placeholder="请输入职务名称"
          style={{ fontSize: 14 }}
          value={jobInfo.name}
          endAdornment={
            <InputAdornment
              position="end"
              className={classes.cancel}
              onClick={() => setJobInfo({ ...jobInfo, name: '' })}
            >
              <CancelIcon
                aria-label="toggle password visibility"
                color="primary"
              />
            </InputAdornment>
          }
          onChange={(e) => {
            const { value } = e.target;
            setJobInfo({ ...jobInfo, name: value });
          }}
        />
      </FormControl>
    </AntdDialog>
  );
};
