import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const acceptanceStyles = makeStyles((theme: Theme) => {
  return createStyles({
    '@global': {
      ' .ant-select-item-empty': {
        opacity: 0.45,
        textAlign: 'center',
      },
    },
    title: {
      display: 'flex',
      backgroundColor: '#fff',
      margin: '0 -16px',
      alignItems: 'center',
      paddingLeft: 24,
      '& svg': {
        width: '18px !important',
        height: '18px !important',
        marginBottom: 8,
        cursor: 'pointer',
        marginRight: 20,
      },
      '& h6': {
        marginLeft: 5,
      },
    },
    contanier: {
      backgroundColor: '#fff',
      marginTop: 16,
      padding: '24px 21px 24px',
      height: 'calc(100% - 70px)',
      overflow: 'auto',
      position: 'relative',
      '& .MuiTabs-flexContainer ': {
        justifyContent: 'flex-start',
      },
      '& .ant-steps-item-title': {
        marginBottom: 24,
      },
      '& .ant-btn': {
        color: '#fff',
        background: '#8FC320',
        borderColor: 'none',
        fontSize: 14,
        fontWeight: 400,
        width: 104,
        height: 32,
        borderRadius: 4,
      },
      '& .ant-btn:hover, .ant-btn:focus': {
        color: '#fff',
        background: '#8FC320',
        borderColor: '#8FC320',
      },
      '& .btn-group': {
        display: 'flex',
        justifyContent: 'flex-end',
      },
      '& .btn-group .reset': {
        width: 100,
        height: 36,
        background: '#fff',
        border: '1px solid rgba(217,217,217,1)',
        color: '#000',
        opacity: 0.65,
        marginRight: 80,
      },
      '& .btn-group .creat': {
        width: 100,
        height: 36,
      },
      '& .ant-col-8': {
        height: 35,
        lineHeight: '35px',
      },
    },
    popver: {
      background: '#fff',
      position: 'absolute',
      zIndex: 10,
      top: 123,
      right: 17,
      left: 268,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      bottom: 14,
      '& img': {
        width: 72,
        height: 72,
      },
      '& div:nth-of-type(2)': {
        fontSize: 18,
        color: '#000',
        opacity: 0.85,
        marginTop: 28,
      },
    },
    node: {
      backgroundColor: '#fff',
      position: 'fixed',
      bottom: 14,
      left: 251,
      right: 11,
      padding: '25px 80px 20px ',
      fontSize: 14,
      color: '#000',
      boxShadow: '0px -2px 4px 0px rgba(63,146,220,0.2)',
      borderRadius: 2,
    },
    nextNode: {
      display: 'flex',
      marginBottom: 48,
      alignItems: 'center',
      '& .ant-select': {
        textAlign: 'start',
        width: 160,
        borderRadius: 4,
      },
    },
    nextHandle: {
      marginLeft: '10%',
    },
  });
});

export const useStyles = makeStyles(() => {
  return createStyles({
    '@global': {
      // '::-webkit-scrollbar': {
      //   display: 'none',
      // },
      '.ant-popover-title': {
        color: 'rgba(0, 0, 0, 0.55)!important',
      },
    },

    contanier: {
      backgroundColor: '#fff',
      marginTop: 16,
      padding: '32px 22px 59px',
      height: '91%',
      position: 'relative',
    },
    title: {
      fontSize: 20,
      color: '#000',
      opacity: 0.85,
      fontWeight: 400,
      padding: '0 0 16px 10px',
      borderBottom: '2px solid #F5F5F5',
    },
    input: {
      height: 32,
      borderRadius: 4,
    },
    content: {
      width: 232,
      margin: '0 4px 0 10px',
    },
    tenderContent: {
      width: 554,
      margin: '0 16px 0 10px',
    },
    amount: {
      width: 213,
    },
    termsComparison: {
      padding: '23px 18px 0',
      display: 'flex',
      height: '100%',
      '& ul': {
        paddingLeft: 18,
      },
      '& li': {
        marginBottom: 17,
      },
      '& li:last-child': {
        marginBottom: 32,
      },
    },
    divider: {
      width: 2,
      backgroundColor: '#F5F5F5',
      height: '90%',
      margin: '38px 40px 0',
    },
    subTitle: {
      fontSize: 16,
      fontWeight: 500,
      color: '#000000',
      opacity: 0.85,
      marginBottom: 28,
    },
    button: {
      position: 'absolute',
      right: 16,
      bottom: 16,
    },
  });
});

export const detailStyles = makeStyles((theme: Theme) => {
  return createStyles({
    contanier: {
      backgroundColor: '#fff',
      marginTop: 16,
      padding: '24px 21px 24px',
      height: 'calc(100% - 30px)',
      overflow: 'auto',
      position: 'relative',
      '& .MuiTabs-flexContainer ': {
        justifyContent: 'flex-start',
      },
      '& .ant-steps-item-title': {
        marginBottom: 44,
      },
      '& .ant-btn': {
        color: '#fff',
        backgroundColor: '#8FC320',

        borderColor: '#8FC320',
        fontSize: 14,
        fontWeight: 400,
        width: 104,
        height: 32,
        borderRadius: 4,
      },
      '& .ant-btn:hover, .ant-btn:focus': {
        color: '#fff',
        backgroundColor: '#8FC320',

        borderColor: '#8FC320',
      },
      '& .btn-group': {
        display: 'flex',
        justifyContent: 'flex-end',
      },
      '& .btn-group .reset': {
        width: 100,
        height: 36,
        background: '#fff',
        border: '1px solid rgba(217,217,217,1)',
        color: '#000',
        opacity: 0.65,
        marginRight: 80,
      },
      '& .btn-group .creat': {
        width: 100,
        height: 36,
      },
      '& .ant-select-item-empty': {
        opacity: 0.45,
        textAlign: 'center',
      },
    },
    popver: {
      background: '#fff',
      position: 'absolute',
      zIndex: 10,
      top: 145,
      right: 17,
      left: 272,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      bottom: 14,
      '& img': {
        width: 72,
        height: 72,
      },
      '& div:nth-of-type(2)': {
        fontSize: 18,
        color: '#000',
        opacity: 0.85,
        marginTop: 28,
      },
    },
    node: {
      backgroundColor: '#fff',
      position: 'fixed',
      bottom: 16,
      left: 251,
      right: 11,
      padding: '25px 80px 20px ',
      fontSize: 14,
      color: 'rgba(0,0,0,0.85)',
      boxShadow: '0px -2px 4px 0px rgba(63,146,220,0.2)',
      borderRadius: 2,
    },
    nextNode: {
      display: 'flex',
      marginBottom: 48,
      alignItems: 'center',
      '& .ant-select': {
        textAlign: 'start',
        width: 160,
        borderRadius: 4,
      },
    },
    nextHandle: {
      marginLeft: 75,
    },
    option: {
      marginLeft: 75,
    },
    example: {
      fontSize: 12,
      color: '#2BA3FD',
      fontWeight: 400,
      marginLeft: 10,
    },
    tip: {
      width: 60,
      height: 20,
      background: 'rgba(0,0,0,0.02)',
      borderRadius: 4,
      border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 12,
      color: '#000',
      opacity: 0.25,
      fontWeight: 400,
      // transform: 'scale(0.8)',
      textAlign: 'center',
      lineHeight: '20px',
      cursor: 'pointer',
    },
    opinion: {
      position: 'absolute',
      fontSize: 10,
      transform: 'scale(0.8)',
      color: '#FA6400',
    },
    statusDetail: {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between',
      color: '#000',
      fontSize: 14,
      '& span:nth-of-type(1)': {
        opacity: 0.85,
      },
      '& span:nth-of-type(2)': {
        opacity: 0.65,
      },
    },
  });
});

export const componentsStyles = makeStyles((theme: Theme) => {
  return createStyles({
    colSpan: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      '& .ant-input-affix-wrapper': {
        borderRadius: 4,
      },
    },
    select: {
      width: '70%',
      height: 32,
      '& .ant-select-selector': {
        borderRadius: '4px !important',
      },
    },
    input: {
      width: '70%',
      height: 32,
      borderRadius: 4,
    },
    datePicker: {
      width: '70% !important',
      height: 32,
      borderRadius: 4,
      boxShadow: 'none !important',
      borderColor: '#d9d9d9',
    },
    contanier: {
      '& .ant-btn': {
        color: '#fff',
        backgroundColor: '#8FC320',
        borderColor: 'none',
        fontSize: 14,
        fontWeight: 400,
        width: 104,
        height: 32,
        borderRadius: 4,
      },
      '& .ant-btn:hover, .ant-btn:focus': {
        color: '#fff',
        backgroundColor: '#8FC320',
        borderColor: 'none',
      },
    },
  });
});
