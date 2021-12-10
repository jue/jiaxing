import { makeStyles } from '@material-ui/core/styles';

const useDocumentStyles = makeStyles({
  leftSider: {
    background: 'rgba(241,246,255,1)',
    width: 200,
  },
  siderTop: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 55,
    marginBottom: 50,
  },
  addIcon: {
    width: 32,
    height: 32,
    background: '#8FC220',
    borderRadius: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disActive: {
    height: 60,
    width: '100%',
    borderLeft: '4px solid rgba(241,246,255,1)',
    color: '#333333',
    paddingLeft: 38,
  },
  active: {
    height: 60,
    width: '100%',
    borderLeft: '4px solid #8FC220',
    color: '#8FC220',
    paddingLeft: 38,
    background: '#FAFCFF',
  },
  search: {
    display: 'flex',
    alignItems: 'center',
    width: 100,
    height: 30,
    border: '1px solid rgba(217,217,217,1)',
    borderRadius: 4,
    overflow: 'hidden',
    background: '#fff',
    padding: '0 10px',
  },
  searchIcon: {
    color: '#D9D9D9',
    width: 12,
    height: 12,
  },
  searchInput: {
    width: '80%',
    border: 'none',
    outline: 'none',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  },
  menu: {
    background: '#fff',
    boxShadow: '0px 2px 14px 0px rgba(0,0,0,0.08)',
    color: '#333',
    width: 128,
    height: 96,
    fontSize: 16,
    padding: 14,
    position: 'absolute',
    right: 0,
    top: 60,
    zIndex: 100,
  },
  menuButton: {
    cursor: 'pointer',
    height: 40,
  },
  tableBox: {
    boxShadow: '0px 0px 4px 0px rgba(115,111,134,0.15)',
    borderRadius: 2,
    background: '#fff',
    margin: 12,
    padding: '30px 20px',
  },
  tableTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 60px 20px 20px',
  },
  createButton: {
    width: 105,
    height: 32,
    background: '#8FC220',
    color: '#fff',
    '&:hover': {
      background: '#8FC220',
    },
  },
  createTitle: {
    display: 'flex',
    alignItems: 'center',
    color: '#000',
    fontWeight: 800,
    marginBottom: 20,
    fontSize: 20,
  },
  question: {
    width: 22,
    height: 22,
    borderRadius: '100%',
    background: '#FAAD14',
    color: '#fff',
    marginRight: 16,
    textAlign: 'center',
    lineHeight: '22px',
    fontWeight: 800,
    fontSize: 16,
  },
  deleteContainer: {
    color: '#666',
  },
  fileName: {
    width: 230,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    marginLeft: 12,
  },
  file: {
    display: 'flex',
    justifyContent: 'center',
    cursor: 'pointer',
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
  '@global': {
    '.ant-table-thead > tr > th': {
      background: '#F3F6FF',
    },
    '.MuiTabs-indicator': {
      width: '100px !important',
    },
    '.MuiTab-root': {
      minWidth: '100px !important',
    },
    '.ant-modal': {
      // height: '82%!important',
      paddingBottom: 0,
    },
    '.ant-modal-body, .ant-modal-content': {
      height: '100%',
    },
  },
});

export default useDocumentStyles;
