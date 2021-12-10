import { DatePicker } from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';

const { RangePicker } = DatePicker;

const RangePickers = () => {
  return <RangePicker locale={locale} placeholder={['开始时间', '结束时间']} />;
};

export default RangePickers;
