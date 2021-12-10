import { DatePicker } from 'antd';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import locale from 'antd/lib/date-picker/locale/zh_CN';

const useStyles = makeStyles(() => {
  return createStyles({
    '@global': {
      '.contanier .MuiFormLabel-root.Mui-focused': {
        color: '#8fc220 !important',
      },
      '.ant-picker': {
        width: 220,
        boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(235, 235, 235, 1)',
      },
      '.ant-picker:hover, .ant-picker-focused': {
        borderColor: '#8fc220',
      },

      '.ant-picker-suffix': {
        color: '#8fc220',
      },

      '.ant-picker-cell-in-view.ant-picker-cell-today .ant-picker-cell-inner::before': {
        border: '1px solid #8fc220 !important',
      },

      '.ant-picker-today-btn': {
        color: '#8fc220 !important',
      },

      '.ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner,.ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner,.ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner': {
        background: '#8fc220 !important',
      },
    },
  });
});

const Datepicker = (props) => {
  const classes = useStyles({});
  return <DatePicker locale={locale} {...props} />;
};

export default Datepicker;
