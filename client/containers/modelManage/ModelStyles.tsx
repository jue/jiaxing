import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => {
  return createStyles({
    modelList: {
      height: 'calc(100% - 29px)',
    },
    topBar: {
      margin: '29px 0 26px 36px',
    },
    select: {
      border: '1px solid #B2B2B2',
      borderRadius: 4,
      width: 160,
      height: 32,
      marginRight: 20,
    },
    operating: {
      display: 'flex',
      alignItems: 'center',
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      position: 'fixed',
      width: 'calc(100% - 258px)',
      bottom: 16,
      backgroundColor: '#fff',
      padding: 14,
    },
    operImg: {
      cursor: 'pointer',
      height: 22,
      display: 'flex',
      alignItems: 'center',
    },
    download: {
      cursor: 'pointer',
      width: 30,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // marginRight: 10,
    },
    antdTable: {
      '& .ant-table-wrapper': {
        marginBottom: 60,
      },
      '& .MuiChip-clickable.MuiChip-outlined:hover, .MuiChip-clickable.MuiChip-outlined:focus, .MuiChip-deletable.MuiChip-outlined:focus': {
        background: 'rgba(143, 194, 32, 0) !important',
      },
      '& .ant-table-container table > thead > tr:first-child th:first-child': {
        paddingLeft: 8,
        paddingRight: 0,
      },
      '& .ant-table-container table > thead > tr:first-child th:nth-of-type(4)': {
        paddingLeft: 0,
        paddingRight: 0,
      },
      '& .ant-table-container .ant-table-tbody tr td:nth-of-type(1)': {
        paddingLeft: 8,
        paddingRight: 0,
      },
      '& .ant-table-container .ant-table-tbody tr td:nth-of-type(4)': {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
    modelName: {
      cursor: 'pointer',
      '& span': {
        display: 'inline-block',
      },

      '& span:hover': {
        color: '#8FC220',
      },
    },
    status: {
      color: '#FA5555',
    },
    modelIcon: {
      display: 'inline-block',
    },
    titleChip: {
      border: '1px solid rgba(0,0,0, 0)',
      width: '100%',
      '& img': {
        borderRadius: '100%',
        width: 30,
        height: 30,
        marginLeft: '0 !important',
      },
    },
    titleInner: {
      width: '100%',
      overflow: 'hidden',
      paddingRight: 0,
      '& .MuiChip-outlined .MuiChip-icon': {
        marginLeft: 0,
      },
    },
  });
});
