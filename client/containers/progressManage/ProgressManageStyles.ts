import { makeStyles } from '@material-ui/core';

const useProgressManageStyles = makeStyles({
  '@global': {
    body: {},
    '.MuiButton-contained': {
      backgroundColor: 'transparent',
    },
    '.MuiButton-containedPrimary': {
      backgroundColor: '#1976d2',
    },
  },
  buttonGroup: {
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: 4,
    display: 'flex',
    '& div': {
      boxShadow: 'none',
      padding: '0 10px',
      height: 38,
      lineHeight: '38px',
      cursor: 'pointer',
    },
    '& div:last-child': {
      border: 'none !important',
    },
  },
  zoomIn: {
    '& div': {
      color: '#000',
      borderRight: '1px solid rgba(0, 0, 0, 0.23)',
      display: 'flex',
      alignItems: 'center',
    },
  },
  modelBtn: {
    width: 90,
    height: 32,
    lineHeight: '32px',
    textAlign: 'center',
    borderRadius: 4,
    backgroundColor: '#8FC220',
    color: '#fff',
    cursor: 'pointer',
    '&:hover': {
      background: '#8FC220',
    },
  },
  batchBtn: {
    marginRight: 16,
  },
  delayPopover: {
    width: 320,
    height: 150,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    color: 'white',

    display: 'grid',
    gridTemplateRows: 'auto 40px',
  },
  search: {
    height: 32,
    display: 'flex',
  },
  searchInput: {
    backgroundColor: '#FFF',
    marginLeft: 20,
    borderRadius: 4,
    display: 'flex',
    border: '1px solid #EBEBEB',
  },
  addButton: {
    width: 95,
    height: 32,
    color: '#fff',
    fontSize: 14,
    lineHeight: '21px',
    margin: '0 20px',
  },
  closeModel: {
    display: 'grid',
    gridTemplateRows: '1fr',
  },
  openModel: {
    display: 'grid',
    gridTemplateRows: '1fr 1fr',
  },
  ganttCheckboxColumn: {
    display: 'none',
  },
  select: {
    // marginTop: 24,
    height: 32,
    width: 200,
    backgroundColor: '#fff',
    borderBottom: '1px solid #B2B2B2',
  },
  filter: {
    marginLeft: 20,
    '& .ant-select:not(.ant-select-disabled):hover .ant-select-selector': {
      borderColor: '#8fc220 !important',
    },
    '& .ant-select-selector': {
      borderColor: '#d9d9d9 !important',
    },
    '& .ant-select-focused.ant-select-single:not(.ant-select-customize-input) .ant-select-selector': {
      boxShadow: 'none',
      WebkitBoxShadow: 'none',
    },
  },
  newSelect: {
    '& .ant-select:not(.ant-select-disabled):hover .ant-select-selector': {
      borderColor: '#8fc220 !important',
    },
    '& .ant-select-selector': {
      borderColor: '#d9d9d9 !important',
    },
    '& .ant-select-focused.ant-select-single:not(.ant-select-customize-input) .ant-select-selector': {
      boxShadow: 'none',
      WebkitBoxShadow: 'none',
    },
  },
  batchBtnLeft: {
    marginLeft: 20,
  },
  title: {
    fontSize: 16,
    fontFamily: 'PingFangSC-Medium,PingFang SC',
    fontWeight: 500,
    color: 'rgba(0,0,0,0.85)',
    borderBottom: '1px solid rgba(0,0,0,0.09)',
    paddingBottom: 10,
  },
  formItem: {
    marginBottom: 10,
  },
  taskEditTitle: {
    marginBottom: 10,
    fontSize: 14,
  },
  modelLinkBtn: {
    width: 90,
    height: 32,
    fontWeight: 'bold',
    lineHeight: '32px',
    textAlign: 'center',
    borderRadius: 4,
    // backgroundColor: '#8FC220',
    color: '#8FC220',
    cursor: 'pointer',
    '&:hover': {
      // background: '#8FC220',
      color: '#8FC220',
    },
  },
});

export default useProgressManageStyles;
