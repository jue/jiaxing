import clsx from 'clsx';
import { Row, Col, Divider, Select, Progress } from 'antd';
const { Option } = Select;

export const TodoList = ({
  icon,
  label,
  iconColor,
  count,
  onClick,
  classes,
}) => {
  return (
    <div
      className={clsx(classes.col, classes.todoCol)}
      onClick={() => onClick()}
    >
      <span className={clsx(classes.span, iconColor, classes.font)} />
      <span
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 27,
        }}
      >
        {icon}
        <span style={{ marginLeft: 8 }}>{label}</span>
      </span>
      <span style={{ width: '20%' }}>
        <span style={{ fontSize: 28, marginRight: 8 }}>{count}</span>项
      </span>
    </div>
  );
};
export const DateSelect = ({ title, classes, onSlect }) => {
  return (
    <div style={{ display: 'flex' }}>
      <p
        className={classes.font}
        style={{
          flex: 1,
          color: 'rgba(0, 0, 0, 0.65)',
        }}
      >
        {title}
      </p>
      <Select
        // value={selectDepart ? selectDepart.name : ''}
        onChange={(value) => {
          // setDepartInfo({ ...departInfo, parentId: value });
          onSlect(value);
        }}
        defaultValue="30天"
        bordered={null}
        style={{ width: 80, height: 30, lineHeight: '30px' }}
      >
        <Option value={30}>30天</Option>
        <Option value={90}>3个月</Option>
        <Option value={180}>6个月</Option>
        <Option value={360}>1年</Option>
      </Select>
    </div>
  );
};
