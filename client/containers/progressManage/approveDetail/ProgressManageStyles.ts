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
  primaryBtn: {
    '&:hover': {
      backgroundColor: '#1976d2',
    },
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
    height: 40,
    width: 200,
    backgroundColor: '#fff',
    borderBottom: '1px solid #B2B2B2',
  },
  marginGap: {
    marginLeft: 20,
  },
  marginGapBg: {
    color: 'red',
  },
  marginGapContainer: {
    position: 'absolute',
    top: 220,
    left: 240,
    marginLeft: 15,
    marginBottom: 15,
    background: 'rgba(255, 255, 0, 0.7)',
    // opacity: 0.7,
    width: 710,
    height: 28,
    fontSize: 14,
    zIndex: 50,
  },
});

export default useProgressManageStyles;
