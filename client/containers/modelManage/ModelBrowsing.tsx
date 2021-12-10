import React, { useContext, useEffect, useState } from 'react';
import { LayoutPageContext } from '../layout/context/LayoutPageContext';
import { withRouter } from 'next/router';
import { Collapse, Tooltip, Input } from 'antd';
import uniq from 'lodash/uniq';
import ModelManageContextProvider, {
  ModelManageContext,
} from './context/ModelManageContext';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Search from '../../components/Svgs/Search';

const useStyles = makeStyles(() => {
  return createStyles({
    contanier: {
      display: 'flex',
      width: '100%',
      height: '100%',
    },
    leftContanier: {
      width: 140,
      height: '100%',
      backgroundColor: '#E0E4EB',
    },
    collapse: {
      backgroundColor: '#fff',
      fontFamily: 'PingFangSC-Regular,PingFang SC',
      width: 140,
      '& .ant-collapse-content-box': {
        padding: 0,
        color: '#333',
      },
      '& .ant-collapse-header': {
        height: 48,
        lineHeight: '48px !important',
        padding: '0px 0px 0px 0 !important',
        backgroundColor: '#FAFCFF',
      },
      '& .ant-collapse-content': {
        borderTop: 'none',
      },
      '&  .ant-collapse-item': {
        borderBottom: 'none',
      },
      '& .ant-collapse-content-box:hover': {
        color: '#8FC320',
      },
      '& .ant-collapse-content-box:focus': {
        color: '#8FC320',
      },
    },

    panelItem: {
      backgroundColor: '#F2F7F8',
      height: 40,
      lineHeight: '40px',
      paddingLeft: 13,
      fontSize: 14,
      cursor: 'pointer',
    },
    title: {
      margin: '69px 0 30px 13px',
      fontSize: 12,
      fontWeight: 400,
      color: '#999999',
    },
    rightContanier: {
      width: '100%',
      backgroundColor: '#F0F2F5',
      height: '100%',
      boxShadow:
        '0px 0px 3px 0px rgba(0,0,0,0.1),0px 0px 0px 1px rgba(0,0,0,0.05)',
      borderRadius: 4,
    },
    model: {
      width: '98%',
      backgroundColor: '#fff',
      height: '96%',
      margin: '16px 16px 0',
      display: 'flex',
    },
    modelSearch: {
      position: 'relative',
      width: 196,
    },
    modelContanier: {
      width: '84%',
      padding: '17px 16px 16px 17px',
    },
    tooltip: {
      overflow: 'hidden',
      height: 48,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      lineHeight: '48px',
      textAlign: 'left',
      paddingLeft: 13,
    },
    headerTooltip: {
      width: 94,
    },
    childrenTooltip: { width: 110, cursor: 'pointer' },
    input: {
      width: 148,
      height: 30,
      borderRadius: 4,
      border: '1px solid rgba(217,217,217,1)',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 8,
      margin: '41px 0 31px 14px',
      '& input': {
        border: 'none',
        marginLeft: 10,
        width: 110,
      },
    },
    modelList: {
      paddingLeft: 9,
      height: 470,
      overflow: 'hidden',
      overflowY: 'auto',
      width: 119,
    },
    modelItem: {
      height: 40,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      borderBottom: '1px solid rgba(247,247,247,0.8)',
      padding: '0 5px',
      lineHeight: '40px',
      fontSize: 14,
      color: '#333',
      cursor: 'pointer',
      display: 'block',
    },
    positionFilter: {
      position: 'absolute',
      top: 112,
      right: 0,
    },
    type: {
      padding: '0px 5px',
      fontSize: 12,
      minWidth: 50,
      boxShadow: '-1px 1px 2px #ccc',
      minHeight: 30,
      fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
      fontWeight: 400,
      marginLeft: 8,
      marginBottom: 4,
      textTransform: 'uppercase',
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
      lineHeight: '30px',
      cursor: 'pointer',
    },
    sel: {
      color: 'white',
      backgroundColor: '#1890ff',
    },
    unSel: {
      background: 'radial-gradient(circle at 70% 30%, white, #e1f5fe)',
      color: 'rgba(0, 0, 0, 0.54)',
    },
    iframe: {
      width: '100%',
      height: '100%',
      border: 'none',
      backgroundColor: '#ededed',
    },
  });
});

const { Panel } = Collapse;

function callback(key) {
  console.log(key);
}

let filter = [];

function LeftContanier() {
  const {
    projectInfos,
    contractInfos,
    queryContracts,
    queryModelVersion,
  } = useContext(ModelManageContext);
  const classes = useStyles({});

  return (
    <div className={classes.leftContanier}>
      <div className={classes.title}>项目-合同</div>

      <Collapse
        onChange={callback}
        expandIconPosition="right"
        className={classes.collapse}
        accordion
      >
        {projectInfos.map((item, index) => (
          <Panel
            header={
              <Tooltip placement="right" title={item.name} key={item._id}>
                <div
                  className={clsx([classes.tooltip, classes.headerTooltip])}
                  onClick={() => {
                    queryContracts(item._id);
                  }}
                >
                  <span>{item.name}</span>
                </div>
              </Tooltip>
            }
            key={index}
          >
            {contractInfos.map((c) => (
              <Tooltip placement="right" title={c.name} key={c._id}>
                <div
                  className={clsx([classes.tooltip, classes.childrenTooltip])}
                  onClick={() => {
                    queryModelVersion('', '', c._id);
                  }}
                >
                  {c.name}
                </div>
              </Tooltip>
            ))}
          </Panel>
        ))}
      </Collapse>
    </div>
  );
}

function RightContanier() {
  const { modelTable, queryModelVersion, handleViewQuery, model } = useContext(
    ModelManageContext
  );

  // extensions from existed data
  modelTable.map((m) => {
    if (m && m.files && m.files.originalname) {
      const extension = m.files.originalname.substr(
        m.files.originalname.lastIndexOf('.')
      );

      if (extension) {
        filter.push(extension);
      }
    }
  });
  filter = uniq(filter);

  // display fisrt
  if (
    !model.pathname &&
    modelTable &&
    modelTable.length &&
    modelTable[0] &&
    modelTable[0].files &&
    modelTable[0].files._id
  ) {
    handleViewQuery(modelTable[0].files._id);
  }

  const classes = useStyles({});
  const [state, setState] = useState('');

  return (
    <div className={classes.rightContanier}>
      <div className={classes.model}>
        <div className={classes.modelSearch}>
          <div className={classes.input}>
            <Search />
            <input
              placeholder="请输入模型名称"
              onChange={(e) => {
                const { value } = e.target;
                queryModelVersion('', value);
              }}
            />
          </div>
          <div className={classes.modelList}>
            {modelTable.map((m) => (
              <Tooltip
                placement="right"
                title={m.name}
                key={m._id}
                className={classes.modelItem}
              >
                <span
                  onClick={async () => {
                    handleViewQuery(m.files._id);
                  }}
                >
                  {m.name}
                </span>
              </Tooltip>
            ))}
          </div>
          <div className={classes.positionFilter}>
            {filter.map((item, index) => (
              <div
                key={item}
                className={clsx([
                  classes.type,
                  state === item ? classes.sel : classes.unSel,
                ])}
                onClick={() => {
                  setState(item);
                  queryModelVersion('', '', '', item === '全部' ? '' : item);
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className={classes.modelContanier}>
          <iframe src={model.pathname} className={classes.iframe} />
        </div>
      </div>
    </div>
  );
}

function ModelBrowsing() {
  const classes = useStyles({});

  return (
    <div className={classes.contanier}>
      <LeftContanier />
      <RightContanier />
    </div>
  );
}

export default withRouter(({ router }) => {
  const { setParts } = useContext(LayoutPageContext);

  useEffect(() => {
    setParts(['模型管理', '模型浏览']);
  }, [router.query]);

  return (
    <ModelManageContextProvider>
      <ModelBrowsing />
    </ModelManageContextProvider>
  );
});
