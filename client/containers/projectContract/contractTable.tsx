import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Pagination } from 'antd';
import { useState, useContext } from 'react';
import { ProjectContractContext } from './projectContractContext';
import DeleteDialog from '../../components/DeleteDialog';
import { ContractCreateDialog } from './createDialog';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    createBtn: {
      width: 88,
      height: 32,
      color: '#fff',
      background:
        'linear-gradient(270deg,rgba(30,207,247,1) 0%,rgba(46,155,255,1) 100%)',
      borderRadius: 4,
      border: '1px solid rgba(255,255,255,0.4)',
      fontSize: 14,
      fontWeight: 500,
      cursor: 'pointer',
    },
    title: {
      fontWeight: 500,
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    table: {
      width: '100%',
      minHeight: 646,
      marginBottom: 40,
      marginTop: 20,
    },
    items: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #E8E8E8',
      height: 52,
      paddingRight: 16,
      '&:hover': {
        background: 'rgba(43,163,253,0.1)',
      },
    },
    activeItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #E8E8E8',
      height: 52,
      paddingRight: 16,
      background: 'rgba(43,163,253,0.1)',
    },
    button: {
      background: 'rgba(255, 255, 255, 0)',
      border: 0,
      color: '#2BA3FD',
      cursor: 'pointer',
    },
  });
});

const Table = ({ setOpenEditDialog }) => {
  const classes = useStyles({});
  const {
    contractInfos,
    contractInfo,
    setContractInfo,
    handleDeleteContract,
  } = useContext(ProjectContractContext);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>('');

  return (
    <div className={classes.table}>
      {contractInfos &&
        contractInfos.map(item => {
          return (
            <div
              key={item._id}
              className={
                contractInfo._id === item._id
                  ? classes.activeItem
                  : classes.items
              }
            >
              <span>{item.name}</span>
              <div>
                <button
                  className={classes.button}
                  style={{ borderRight: '1px solid rgba(0,0,0,0.09)' }}
                  onClick={e => {
                    e.stopPropagation();
                    setContractInfo(item);
                    setOpenEditDialog(true);
                  }}
                >
                  编辑
                </button>
                <button
                  className={classes.button}
                  onClick={() => {
                    setOpenDeleteDialog(true);
                    setContractInfo(item);
                    setDeleteId(item._id);
                  }}
                >
                  删除
                </button>
              </div>
            </div>
          );
        })}

      <DeleteDialog
        open={openDeleteDialog}
        title="合同"
        closeDialog={() => {
          setOpenDeleteDialog(false);
          setContractInfo({});
        }}
        onConfrim={() => handleDeleteContract(deleteId)}
      />
    </div>
  );
};

const ContractTable = () => {
  const classes = useStyles({});
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const {
    contractInfo,
    setContractInfo,
    handleCreateContract,
    handleUpdateContract,
  } = useContext(ProjectContractContext);

  return (
    <div>
      <div className={classes.toolbar}>
        <Typography className={classes.title}>列表</Typography>

        <Button
          color="primary"
          variant="contained"
          onClick={() => setOpenEditDialog(true)}
        >
          <span>新建合同</span>
        </Button>
      </div>

      <div className={classes.container}>
        <Table setOpenEditDialog={setOpenEditDialog} />
        <Pagination defaultCurrent={1} total={1} />,
      </div>

      <ContractCreateDialog
        open={openEditDialog}
        closeDialog={() => {
          setOpenEditDialog(false);
          setContractInfo({});
        }}
        onConfrim={() => {
          if (contractInfo._id) {
            handleUpdateContract();
          } else {
            handleCreateContract();
          }
        }}
      />
    </div>
  );
};

export default ContractTable;
