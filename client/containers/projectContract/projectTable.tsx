import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Pagination } from 'antd';
import { useContext, useState } from 'react';
import { ProjectContractContext } from './projectContractContext';
import DeleteDialog from '../../components/DeleteDialog';
import { CreateProjectDialog } from './createDialog';
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
    },
    activeItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #E8E8E8',
      height: 52,
      paddingRight: 16,
    },
    button: {
      background: 'rgba(255, 255, 255, 0)',
      border: 0,
      color: '#8FC220',
      cursor: 'pointer',
    },
  });
});

const Table = ({ setOpenEditDialog }) => {
  const classes = useStyles({});
  const {
    projectInfos,
    projectInfo,
    setProjectInfo,
    handleDeleteProject,
  } = useContext(ProjectContractContext);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>('');

  return (
    <div className={classes.table}>
      {projectInfos.map(item => {
        return (
          <div
            key={item._id}
            className={
              projectInfo._id === item._id ? classes.activeItem : classes.items
            }
          >
            <span>{item.name}</span>
            <div>
              <button
                className={classes.button}
                style={{ borderRight: '1px solid rgba(0,0,0,0.09)' }}
                onClick={e => {
                  e.stopPropagation();
                  setProjectInfo(item);
                  setOpenEditDialog(true);
                }}
              >
                编辑
              </button>
              <button
                className={classes.button}
                onClick={() => {
                  setOpenDeleteDialog(true);
                  setProjectInfo(item);
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
        title="项目"
        closeDialog={() => {
          setOpenDeleteDialog(false);
          setProjectInfo({});
        }}
        onConfrim={() => handleDeleteProject(deleteId)}
      />
    </div>
  );
};

const ProjectTable = () => {
  const classes = useStyles({});
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const {
    projectInfo,
    setProjectInfo,
    handleUpdateProject,
    handleCreateProject,
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
          <span>新建项目</span>
        </Button>
      </div>
      <div className={classes.container}>
        <Table setOpenEditDialog={setOpenEditDialog} />
        <Pagination defaultCurrent={1} total={1} />,
      </div>

      <CreateProjectDialog
        open={openEditDialog}
        closeDialog={() => {
          setOpenEditDialog(false);
          setProjectInfo({});
        }}
        onConfrim={() => {
          if (projectInfo._id) {
            handleUpdateProject();
          } else {
            handleCreateProject();
          }
        }}
      />
    </div>
  );
};

export default ProjectTable;
