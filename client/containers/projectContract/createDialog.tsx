import AntdDialog from '../../components/AntdDialog';
import {
  makeStyles,
  Theme,
  createStyles,
  withStyles,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useContext } from 'react';
import { ProjectContractContext } from './projectContractContext';
import { InputLabel, FormControl } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import { Select } from 'antd';
import find from 'lodash/find';
import Button from '@material-ui/core/Button';

const { Option } = Select;

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    action: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: 32,
    },
    confirm: {
      outline: 'none',
      width: 65,
      height: 32,
      border: 0,
      background: ' linear-gradient(to right, #2E9BFF, #1ECFF7)',
      color: '#fff',
      borderRadius: 4,
      cursor: 'pointer',
    },
    title: {
      fontSize: 16,
      fontWeight: 500,
      color: '#000',
    },
    field: {
      width: '100%',
      marginTop: 24,
      zIndex: 1800,
    },
    select: {
      marginTop: 24,
      minHeight: 40,
      borderBottom: '1px solid #B2B2B2',
    },
    '@global': {
      '.ant-select-dropdown': {
        zIndex: '1800',
      },
    },
  });
});

const OutlineInput = withStyles((theme: Theme) =>
  createStyles({
    root: {
      'label + &': {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      position: 'relative',
      backgroundColor: theme.palette.common.white,
      borderBottom: '1px solid #B2B2B2',
      fontSize: 14,
      fontWeight: 400,
      width: '100%',
      padding: '9.5px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderColor: '#2E9BFF',
      },
    },
  })
)(InputBase);

export const CreateProjectDialog = ({ closeDialog, open, onConfrim }) => {
  const classes = useStyles({});
  const { projectInfo, setProjectInfo } = useContext(ProjectContractContext);
  console.warn(projectInfo);

  return (
    <AntdDialog
      visible={open}
      onClose={closeDialog}
      hasClose={true}
      dialogTitle=""
      hasFooter={false}
      onConfirm={() => {
        closeDialog();
      }}
      width={530}
    >
      <div>
        <Typography className={classes.title}>
          {projectInfo._id ? '编辑' : '新建'}项目
        </Typography>

        <FormControl className={classes.field}>
          <InputLabel shrink>项目名称 *</InputLabel>
          <OutlineInput
            id="authority-name"
            value={projectInfo.name || ''}
            onChange={e => {
              const { value } = e.target;
              setProjectInfo({ ...projectInfo, name: value });
            }}
          />
        </FormControl>

        <FormControl className={classes.field}>
          <InputLabel shrink>可变更金额（万元） *</InputLabel>
          <OutlineInput
            id="authority-name"
            defaultValue={projectInfo.changeableAmount / 10000 || ''}
            onChange={e => {
              const { value } = e.target;
              setProjectInfo({
                ...projectInfo,
                changeableAmount: Number(value) * 10000,
              });
            }}
          />
        </FormControl>

        <FormControl className={classes.field}>
          <InputLabel shrink>建设单位名称 *</InputLabel>
          <OutlineInput
            id="authority-name"
            value={projectInfo.constructionUnit || ''}
            onChange={e => {
              const { value } = e.target;
              setProjectInfo({ ...projectInfo, constructionUnit: value });
            }}
          />
        </FormControl>

        <FormControl className={classes.field}>
          <InputLabel shrink>建设单位负责人 *</InputLabel>
          <OutlineInput
            id="authority-name"
            value={projectInfo.head || ''}
            onChange={e => {
              const { value } = e.target;
              setProjectInfo({ ...projectInfo, head: value });
            }}
          />
        </FormControl>

        <FormControl className={classes.field}>
          <InputLabel shrink>建设单位负责人电话 *</InputLabel>
          <OutlineInput
            id="authority-name"
            value={projectInfo.phone || ''}
            onChange={e => {
              const { value } = e.target;
              setProjectInfo({ ...projectInfo, phone: value });
            }}
          />
        </FormControl>
      </div>

      <div className={classes.action}>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            onConfrim();
            closeDialog();
          }}
        >
          <span>确定</span>
        </Button>
      </div>
    </AntdDialog>
  );
};

export const ContractCreateDialog = ({ closeDialog, open, onConfrim }) => {
  const classes = useStyles({});
  const { contractInfo, setContractInfo, projectInfos } = useContext(
    ProjectContractContext
  );

  const selectProject = find(
    projectInfos,
    v => v._id === contractInfo.idEngineering
  );

  return (
    <AntdDialog
      visible={open}
      onClose={closeDialog}
      hasClose={true}
      dialogTitle=""
      hasFooter={false}
      onConfirm={() => {
        closeDialog();
      }}
      width={530}
    >
      <div>
        <Typography className={classes.title}>
          {contractInfo._id ? '编辑' : '新建'}合同
        </Typography>

        <FormControl className={classes.field}>
          <InputLabel shrink>请选择项目名称 *</InputLabel>

          <Select
            value={selectProject ? selectProject.name : ''}
            id="authority-company-name"
            onChange={value => {
              setContractInfo({
                ...contractInfo,
                idEngineering: value,
              });
            }}
            className={classes.select}
            bordered={null}
          >
            {projectInfos.map(item => {
              return (
                <Option value={item._id} key={item._id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </FormControl>

        <FormControl className={classes.field}>
          <InputLabel shrink>合同名称 *</InputLabel>
          <OutlineInput
            id="authority-name"
            value={contractInfo.name}
            onChange={e => {
              const { value } = e.target;
              setContractInfo({ ...contractInfo, name: value });
            }}
          />
        </FormControl>

        <FormControl className={classes.field}>
          <InputLabel shrink>金额（万元） *</InputLabel>
          <OutlineInput
            id="authority-name"
            defaultValue={contractInfo.amount / 10000 || ''}
            onChange={e => {
              const { value } = e.target;
              setContractInfo({
                ...contractInfo,
                amount: Number(value) * 10000,
              });
            }}
          />
        </FormControl>
      </div>

      <div className={classes.action}>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            onConfrim();
            closeDialog();
          }}
        >
          <span>确定</span>
        </Button>
      </div>
    </AntdDialog>
  );
};
