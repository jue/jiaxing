import { useContext } from 'react';

import { Select } from 'antd';

import { EngineeringContext } from '../context/EngineeringContext';
const { Option } = Select;

const ChangeNode = ({ classes, openSnackbar, setOpenSnackbar }) => {
  const { nextAuditing, engineeringInfo, setEngineeringInfo } = useContext(
    EngineeringContext
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <div style={{ width: 200, marginRight: 50 }}>
        <span>下一处理环节：</span>
        <span>{nextAuditing && nextAuditing.nextState}</span>
      </div>
      <div>
        <span>下一环节处理人：</span>

        <Select
          id="idExecutive"
          className={classes.select}
          bordered={null}
          value={engineeringInfo.idExecutive || ''}
          placeholder="请选择合同名称"
          onChange={(value) => {
            setEngineeringInfo({
              ...engineeringInfo,
              executiveDept: nextAuditing.nextState,
              idExecutive: value,
            });
            setOpenSnackbar(false);
          }}
        >
          {((nextAuditing && nextAuditing.nextAccount) || []).map((item) => (
            <Option value={item._id} key={item._id}>
              {item.userName}
            </Option>
          ))}
        </Select>
        {openSnackbar === true && (
          <div className={classes.opinion} style={{ marginLeft: 100 }}>
            请选择下一环节处理人
          </div>
        )}
      </div>
    </div>
  );
};
export default ChangeNode;
