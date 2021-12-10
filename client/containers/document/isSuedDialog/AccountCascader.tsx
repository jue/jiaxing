import { useContext, useState, useEffect, useMemo } from 'react';
import { uniq, uniqBy, uniqWith, isEqual } from 'lodash';

import { Box, FormControl, Typography, Button } from '@material-ui/core';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import CloseIcon from '@material-ui/icons/Close';

import { Select } from 'antd';

import { DocumentContext, DocumentContextI } from '../DocumentContext';
import { Receivers } from '../../../../typings/approval_message';

const { Option } = Select;

interface NewAccountInfo {
  idDepartment?: string;
  userName?: string;
  _id?: string;
  companyInfo?: string;
  dept?: string;
  companyId?: string;
}

const AccountCascader = ({
  classes,
  label,
  newDept,
  setNewDept,
  newAccounts,
  setAccounts,
  object,
  personInfos,
  setPersonInfos,
  companies,
  departments,
}) => {
  const { companyInfos, messageInfo, setMessageInfo } = useContext<
    DocumentContextI
  >(DocumentContext);
  const [newAccountInfo, setNewAccountInfo] = useState<NewAccountInfo>({});

  const handleClose = (removedTag) => {
    const tags = personInfos.filter((tag) => tag !== removedTag);

    setPersonInfos(tags);
    setMessageInfo({
      ...messageInfo,
      [object]: tags,
    });
  };

  useEffect(() => {
    let Obj: any = {};
    let Arr: any = [];
    let newCompanies: any = [];
    let newDepartments: any = [];
    personInfos.map((item) => {
      if (item._id && item.userName) {
        Obj.receiver = item._id;
        Obj.receiverName = `${item.companyInfo}/${item.dept}/${item.userName}`;
      }
      if (!item._id && item.idDepartment) {
        item.idDepartment && newDepartments.push(item.idDepartment);
      }
      if (!item._id && !item.idDepartment) {
        newCompanies.push(item.companyId);
      }
    });
    JSON.stringify(Obj) != '{}' && Arr.push(Obj);
    setMessageInfo({
      ...messageInfo,
      [object]: Arr,
      [companies]: newCompanies,
      [departments]: newDepartments,
    });
  }, [personInfos]);
  return (
    <>
      <FormControl className={classes.formControl}>
        <Typography className={classes.inputLabel}>{label}</Typography>
        <Box flex="1" ml={1}>
          <Select
            id="inspection-cc"
            placeholder="请选择单位"
            value={newAccountInfo.companyInfo}
            style={{ width: '27%', marginRight: '2%', height: 34 }}
            onChange={(value) => {
              const newCompany: any = companyInfos.find((v) => v._id === value);
              setNewAccountInfo({
                companyInfo: newCompany.name,
                companyId: newCompany._id,
              });
              setNewDept(newCompany.dept);
            }}
          >
            {(companyInfos || []).map((companyInfo) => (
              <Option value={companyInfo._id} key={companyInfo._id}>
                {companyInfo.name}
              </Option>
            ))}
          </Select>
          <Select
            id="inspection-cd"
            placeholder="请选择部门"
            value={newAccountInfo.dept}
            style={{ width: '27%', marginRight: '2%' }}
            onChange={(value) => {
              const newDeptI: any = newDept.find((v) => v._id === value);

              setAccounts(newDeptI.account);
              setNewAccountInfo({
                ...newAccountInfo,
                idDepartment: String(value),
                dept: newDeptI.name,
              });
            }}
          >
            {newDept &&
              newDept.map((companyInfo) => (
                <Option value={companyInfo._id} key={companyInfo._id}>
                  {companyInfo.name}
                </Option>
              ))}
          </Select>
          <Select
            placeholder="请选择人员"
            style={{ width: '27%', marginRight: '2%' }}
            value={newAccountInfo.userName}
            onChange={(value) => {
              const account: any = newAccounts.find((v) => v._id === value);
              setNewAccountInfo({
                ...newAccountInfo,
                _id: String(value),
                userName: account.userName,
              });
            }}
          >
            {newAccounts &&
              newAccounts.map((v) => (
                <Option value={v._id} key={v._id}>
                  {v.userName}
                </Option>
              ))}
          </Select>
          <Button
            color="primary"
            variant="outlined"
            size="small"
            onClick={() => {
              if (!newAccountInfo.companyId) {
                return;
              }
              if (personInfos.length == 0) {
                setPersonInfos([newAccountInfo]);
              } else {
                let info: any = personInfos;

                let arrIndex = [];
                let i = 0;
                info.forEach((item, index) => {
                  let idValue = item['_id'];
                  let deptValue = item['idDepartment'];
                  let companyValue = item['companyId'];
                  if (newAccountInfo._id) {
                    if (idValue) {
                      if (idValue == newAccountInfo._id) {
                        i++;
                        arrIndex.push(index);
                      }
                    } else if (deptValue) {
                      if (deptValue === newAccountInfo.idDepartment) {
                        i++;
                        arrIndex.push(index);
                      }
                    } else if (companyValue) {
                      if (companyValue === newAccountInfo.companyId) {
                        i++;
                        arrIndex.push(index);
                      }
                    }
                  } else if (newAccountInfo.idDepartment) {
                    if (deptValue) {
                      if (deptValue === newAccountInfo.idDepartment) {
                        i++;
                        arrIndex.push(index);
                      }
                    } else if (companyValue) {
                      if (companyValue === newAccountInfo.companyId) {
                        i++;
                        arrIndex.push(index);
                      }
                    }
                  } else if (newAccountInfo.companyId) {
                    if (companyValue) {
                      if (companyValue === newAccountInfo.companyId) {
                        i++;
                        arrIndex.push(index);
                      }
                    }
                  }
                });
                if (i == 0) {
                  setPersonInfos([...personInfos, newAccountInfo]);
                } else {
                  arrIndex.forEach((item) => {
                    info.splice(item, 1, newAccountInfo);
                  });
                  info = uniqWith(info, isEqual);
                  setPersonInfos(info);
                }
              }
              setTimeout(() => {
                setNewAccountInfo({});
              }, 200);
            }}
            className={classes.addButton}
            startIcon={<AddCircleOutline style={{ fontSize: 14 }} />}
          >
            添加
          </Button>
        </Box>
      </FormControl>

      {personInfos &&
        personInfos.map((item, index) => {
          return (
            <FormControl className={classes.formControl} key={index}>
              <Typography className={classes.inputLabel} />
              <Button
                key={item}
                color="primary"
                variant="outlined"
                size="small"
                className={classes.tagButton}
                endIcon={
                  <CloseIcon
                    style={{ fontSize: 14 }}
                    onClick={() => handleClose(item)}
                  />
                }
              >
                {!item._id
                  ? item.idDepartment
                    ? `${item.companyInfo}/${item.dept}`
                    : `${item.companyInfo}`
                  : `${item.companyInfo}/${item.dept}/${item.userName}`}
              </Button>
            </FormControl>
          );
        })}
    </>
  );
};
export default AccountCascader;
