import react, { useEffect, useState, useContext } from 'react';
import { Box, FormControl, InputLabel, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { Select } from 'antd';

import { HiddenDangerContext } from '../../context/HiddenDangerContext';

const { Option } = Select;
interface NewAccountInfo {
  idDepartment?: string;
  userName?: string;
  _id?: string;
  companyInfo?: string;
  dept?: string;
}
const Cascader = ({ classes }) => {
  const { companyInfos } = useContext(HiddenDangerContext);
  const [newDepart, setNewDepart] = useState<any>([]);
  const [newAccounts, setNewAccounts] = useState([]);
  const [newAccountInfo, setNewAccountInfo] = useState<NewAccountInfo>({});
  const [subjects, setSubject] = useState([]);
  useEffect(() => {
    setNewAccountInfo({});
  }, [subjects]);

  const handleClose = (removedTag) => {
    const tags = subjects.filter((tag) => tag !== removedTag);
    setSubject(tags);
  };
  return (
    <>
      <Box mb={2} display="flex">
        <FormControl className={classes.formControl}>
          <InputLabel shrink htmlFor="end-time" className={classes.inputLabel}>
            抄送
          </InputLabel>
          <Box width="100%" ml={13.5}>
            <Select
              id="hidden-cc"
              placeholder="请选择单位"
              value={newAccountInfo.companyInfo}
              style={{ width: '32%', marginRight: '2%' }}
              onChange={(value) => {
                const newCompany: any = companyInfos.find(
                  (v) => v._id === value
                );

                setNewAccountInfo({
                  // ...newAccountInfo,
                  companyInfo: newCompany.name,
                });

                setNewDepart(newCompany.dept);
                setNewAccounts([]);
              }}
            >
              {(companyInfos || []).map((companyInfo) => (
                <Option value={companyInfo._id} key={companyInfo._id}>
                  {companyInfo.name}
                </Option>
              ))}
            </Select>
            <Select
              id="hidden-cd"
              placeholder="请选择部门"
              // defaultValue={provinceData[0]}
              value={newAccountInfo.dept}
              style={{ width: '32%', marginRight: '2%' }}
              onChange={(value) => {
                const newDept: any = newDepart.find((v) => v._id === value);
                setNewAccounts(newDept.account);
                setNewAccountInfo({
                  ...newAccountInfo,
                  idDepartment: String(value),
                  dept: newDept.name,
                });
              }}
            >
              {newDepart &&
                newDepart.map((companyInfo) => (
                  <Option value={companyInfo._id} key={companyInfo._id}>
                    {companyInfo.name}
                  </Option>
                ))}
            </Select>
            <Select
              id="hidden-cp"
              style={{ width: '32%' }}
              placeholder="请选择人员"
              value={newAccountInfo.userName}
              onChange={(value) => {
                const account: any = newAccounts.find((v) => v._id === value);

                setNewAccountInfo({
                  ...newAccountInfo,
                  _id: String(value),
                  userName: account.userName,
                });
                // if (account.length !== 0) {
                setSubject([
                  ...subjects,
                  {
                    ...newAccountInfo,
                    _id: String(value),
                    userName: account.userName,
                  },
                ]);
                // }
              }}
            >
              {newAccounts &&
                newAccounts.map((v) => (
                  <Option value={v._id} key={v._id}>
                    {v.userName}
                  </Option>
                ))}
            </Select>
          </Box>
        </FormControl>
      </Box>

      <Box mb={0.5} pl={10} ml={3.8}>
        {subjects &&
          subjects.map((item, index) => {
            return (
              <Button
                key={index}
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
                {item.companyInfo}/{item.dept}/{item.userName}
              </Button>
            );
          })}
      </Box>
    </>
  );
};
export default Cascader;
