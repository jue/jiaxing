import { useState, useContext } from 'react';
import { Box } from '@material-ui/core';

import { Select } from 'antd';

import { InspectionContext } from '../../context/InspectionContext';

const { Option } = Select;
interface NewAccountInfo {
  idDepartment?: string;
  userName?: string;
  _id?: string;
  companyInfo?: string;
  dept?: string;
}
const ExecutorCascader = ({ classes }) => {
  const {
    companyInfos,
    setHiddenDangerSubject,
    hiddenDangerSubject,
    handleAuditingMap,
  } = useContext(InspectionContext);
  const [newDepart, setNewDepart] = useState<any>([]);
  const [newAccounts, setNewAccounts] = useState([]);
  const [newAccountInfo, setNewAccountInfo] = useState<NewAccountInfo>({});
  const [typeCompany, setTypeCompany] = useState('');
  return (
    <Box width="100%" ml={13.5}>
      <Select
        id="inspection-eC"
        placeholder="请选择单位"
        value={newAccountInfo.companyInfo}
        style={{ width: '32%', marginRight: '2%' }}
        onChange={(value) => {
          const newCompany: any = companyInfos.find((v) => v._id === value);
          setTypeCompany(newCompany.type);
          setNewAccountInfo({
            companyInfo: newCompany.name,
          });
          setNewDepart(newCompany.dept);
        }}
      >
        {(companyInfos || []).map((companyInfo) => (
          <Option value={companyInfo._id} key={companyInfo._id}>
            {companyInfo.name}
          </Option>
        ))}
      </Select>
      <Select
        id="inspection-ed"
        placeholder="请选择部门"
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
        id="inspection-ep"
        style={{ width: '32%' }}
        placeholder="请选择人员"
        value={newAccountInfo.userName}
        onChange={(value) => {
          const account: any = newAccounts.find((v) => v._id === value);

          setNewAccountInfo({
            ...newAccountInfo,
            userName: account.userName,
            // _id: String(value),
          });
          setHiddenDangerSubject({
            ...hiddenDangerSubject,
            executor: value,
          });
          handleAuditingMap(typeCompany);
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
  );
};
export default ExecutorCascader;
