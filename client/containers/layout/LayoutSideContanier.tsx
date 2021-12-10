import React, { useContext, useState, useEffect } from 'react';
import {
  Drawer,
  Hidden,
  Typography,
  ListItemIcon,
  NoSsr,
} from '@material-ui/core';
import {
  Theme,
  createStyles,
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';

import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import RSC from 'react-scrollbars-custom';
import clsx from 'clsx';
import { useRouter } from 'next/router';

import { LayoutPageContext } from './context/LayoutPageContext';

import QualityPerssonnelIcon from '../../components/Svgs/menu/Quality_Personnel_Icon';
import SafetyIcon from '../../components/Svgs/menu/SafetyIcon';
import useSessionStorage from '../../hooks/useSessionStorage';

const sideWidth = 240;
const drawerWidth = sideWidth;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      ...theme.mixins.toolbar,
    },

    nested: {},

    drawer: {
      width: drawerWidth,
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: '#5F6F84',
      color: '#fff',

      '& .Mui-selected': {
        borderLeft: '2px red solid',
      },
    },
    list: {
      padding: 0,
    },
    text: {
      marginLeft: 8,
    },
    subText: {
      marginLeft: 10,
    },
  })
);

const menuQuality = [
  // 暂时不需要
  // {
  //   _id: 'qaulityInspectPlan',
  //   name: '检查计划',
  //   path: '/quality/inspectPlan',
  // },
  {
    _id: 'qualityInspectReport',
    name: '质量检查',
    path: '/quality/v2/inspection',
  },
  // {
  //   _id: 'qualityLibrary',
  //   name: '质量资料库',
  //   path: '',
  // },
  {
    _id: 'qualityInspectConstruction',
    name: '施工方案管理',
    path: '/quality/v2/construction',
  },
];
const menuEngineering = [
  {
    _id: 'changeCreate',
    name: '新建变更',
    path: '/engineering/changeCreate',
  },
  {
    _id: 'changeList',
    name: '变更列表',
    path: '/engineering/changeList',
  },
];

const menuProgress = [
  {
    _id: 'progressHome',
    name: '进度首页',
    path: '/progress',
  },
  {
    _id: 'progressList',
    name: '进度审批列表',
    path: '/progress/approve',
  },
];

const menuAuthority = [
  {
    _id: 'authPersonnel',
    name: '人员管理',
    path: '/authority/personnel',
  },
  {
    _id: 'authOrganization',
    name: '组织架构管理',
    path: '/authority/organization',
  },
  {
    _id: 'projectContract',
    name: '项目设置',
    path: '/authority/projectContract',
  },
];

const menuPersonalCenter = [
  {
    _id: 'personInformation',
    name: '个人信息',
    path: '/personalCenter/information',
  },
  {
    _id: 'todoList',
    name: '待办列表',
    path: '/personalCenter/todoList',
  },
  {
    _id: 'notificationList',
    name: '消息列表',
    path: '/personalCenter/notificationList',
  },
  // {
  //   _id: 'workBench',
  //   name: '工作台',
  //   path: '/personalCenter/workBench',
  // },
];

const modelManage = [
  {
    _id: 'modelUpload',
    name: '模型上传',
    path: '/model/upload',
  },
  {
    _id: 'modelBrowsing',
    name: '模型浏览',
    path: '/model/browsing',
  },
  {
    _id: 'modelList',
    name: '模型列表',
    path: '/model/list',
  },
];

const menuSafety = [
  {
    _id: 'hiddenDanger',
    name: '隐患排查',
    path: '/safety/hiddenDanger',
  },
];

const menuContract = [
  {
    _id: 'create',
    name: '合同创建',
    path: '/contract/create',
  },
  {
    _id: 'approval',
    name: '合同审批',
    path: '/contract/approval',
  },
  {
    _id: 'search',
    name: '合同查询',
    path: '/contract/search',
  },
];

const menuTree = [];

function MyListItem({
  nested = false,
  pathname = null,
  SvgIcon = null,
  labelText,
  selected = false,
  onClick = (e) => {},
  expanded = false,
  showExpandIcon = false,
  type = null,
}) {
  const classes = useStyles({});
  const router = useRouter();
  const rotuerPathname = router.pathname;
  // const { routerPush } = useContext(AuthContext);
  const isSelected = pathname === rotuerPathname;

  return (
    <ListItem
      button
      className={clsx(nested && classes.nested)}
      onClick={(e) => {
        if (!nested) {
          onClick(e);
        }
        if (pathname && type !== 'external') {
          router.push(pathname);
        } else if (pathname && type === 'external') {
          window.open(pathname, '_blank');
        }
      }}
      id={pathname}
      selected={(!nested && selected) || isSelected}
    >
      <ListItemIcon style={{ minWidth: 40 }}>
        {SvgIcon && <SvgIcon fill={isSelected ? '#3F51B5' : '#66788a'} />}
      </ListItemIcon>

      <ListItemText className={clsx(classes.text)}>{labelText}</ListItemText>
      {!showExpandIcon ? null : expanded ? <ExpandLess /> : <ExpandMore />}
    </ListItem>
  );
}

const defaultMenuOpenStatus = {
  zlgl: false,
  aqgl: false,
  rygl: false,
  grzx: false,
  gcgl: false,
  jdkz: false,
  jdgl: false,
  gzt: false,
};

function DrawerContent() {
  const classes = useStyles();
  const router = useRouter();
  const [menuOpenStatus, setMenuOpen] = useSessionStorage(
    'menuOpenStatus',
    defaultMenuOpenStatus
  );

  // const [menuOpenStatus, setMenuOpen] = useState(defaultMenuOpenStatus);

  const { pathname } = router;

  useEffect(() => {
    setMenuOpen({
      ...defaultMenuOpenStatus,
      zlgl: pathname.startsWith('/quality'),
      aqgl: pathname.startsWith('/safty'),
      rygl: pathname.startsWith('/authority'),
      grzx: pathname.startsWith('/person'),
      model: pathname.startsWith('/model'),
      gcgl: pathname.startsWith('/engineering'),
      jdgl: pathname.startsWith('/progress'),
      htgl: pathname.startsWith('/contract'),
    });
  }, []);

  return (
    <NoSsr>
      <RSC>
        <List>
          <MyListItem
            labelText="个人工作台"
            onClick={() => {
              router.push('/workBench');
            }}
            pathname={'/workBench'}
            nested={false}
            SvgIcon={QualityPerssonnelIcon}
            selected={pathname === '/workBench'}
            // showExpandIcon
            expanded={menuOpenStatus.gzt}
          />
          <MyListItem
            labelText="驾驶舱"
            pathname={'/controlCabin'}
            nested={false}
            SvgIcon={QualityPerssonnelIcon}
            selected={pathname === 'controlCabin'}
            // showExpandIcon
            expanded={menuOpenStatus.rygl}
            type="external"
          />

          <MyListItem
            labelText="模型管理"
            onClick={() => {
              setMenuOpen({
                ...defaultMenuOpenStatus,
                model: !menuOpenStatus.model,
              });
            }}
            pathname={null}
            nested={false}
            SvgIcon={QualityPerssonnelIcon}
            showExpandIcon
            expanded={menuOpenStatus.model}
          />
          <Collapse in={menuOpenStatus.model} timeout="auto" unmountOnExit>
            <List>
              {modelManage.map((item, index) => {
                return (
                  <MyListItem
                    key={item._id}
                    labelText={item.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(item.path);
                    }}
                    pathname={item.path}
                    nested={true}
                    SvgIcon={null}
                    selected={pathname === item.path}
                  />
                );
              })}
            </List>
          </Collapse>
          <MyListItem
            labelText="进度管理"
            onClick={() => {
              setMenuOpen({
                ...defaultMenuOpenStatus,
                jdgl: !menuOpenStatus.jdgl,
              });
            }}
            pathname={null}
            nested={false}
            SvgIcon={QualityPerssonnelIcon}
            // selected={pathname.startsWith('/progress')}
            showExpandIcon
            expanded={menuOpenStatus.jdgl}
          />
          <Collapse in={menuOpenStatus.jdgl} timeout="auto" unmountOnExit>
            {menuProgress.map((item, index) => {
              return (
                <MyListItem
                  key={item._id}
                  labelText={item.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.path) router.push(item.path);
                  }}
                  pathname={item.path}
                  nested={true}
                  SvgIcon={null}
                  selected={pathname === item.path}
                />
              );
            })}
          </Collapse>

          <MyListItem
            labelText="工程变更"
            onClick={() => {
              setMenuOpen({
                ...defaultMenuOpenStatus,
                gcgl: !menuOpenStatus.gcgl,
              });
            }}
            pathname={null}
            nested={false}
            SvgIcon={QualityPerssonnelIcon}
            // selected={pathname.startsWith('/engineering')}
            showExpandIcon
            expanded={menuOpenStatus.gcgl}
          />
          <Collapse in={menuOpenStatus.gcgl} timeout="auto" unmountOnExit>
            {menuEngineering.map((item, index) => {
              return (
                <MyListItem
                  key={item._id}
                  labelText={item.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.path) router.push(item.path);
                  }}
                  pathname={item.path}
                  nested={true}
                  SvgIcon={null}
                  selected={pathname === item.path}
                />
              );
            })}
          </Collapse>

          <MyListItem
            labelText="质量管理"
            onClick={() => {
              setMenuOpen({
                ...defaultMenuOpenStatus,
                zlgl: !menuOpenStatus.zlgl,
              });
            }}
            pathname={null}
            nested={false}
            SvgIcon={QualityPerssonnelIcon}
            showExpandIcon={true}
            expanded={menuOpenStatus.zlgl}
            // selected={pathname === '/quality'}
          />
          <Collapse in={menuOpenStatus.zlgl} timeout="auto" unmountOnExit>
            <List>
              {menuQuality.map((item, index) => {
                return (
                  <MyListItem
                    key={item._id}
                    labelText={item.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.path) router.push(item.path);
                    }}
                    pathname={item.path}
                    nested={true}
                    SvgIcon={null}
                    selected={pathname === item.path}
                  />
                );
              })}
            </List>
          </Collapse>

          <MyListItem
            labelText="安全风险管理"
            onClick={() => {
              setMenuOpen({
                ...defaultMenuOpenStatus,
                aqgl: !menuOpenStatus.aqgl,
              });
            }}
            pathname={null}
            nested={false}
            SvgIcon={SafetyIcon}
            selected={pathname.startsWith('/safty')}
            showExpandIcon
            expanded={menuOpenStatus.aqgl}
          />
          <Collapse in={menuOpenStatus.aqgl} timeout="auto" unmountOnExit>
            {menuSafety.map((item, index) => {
              return (
                <MyListItem
                  key={item._id}
                  labelText={item.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.path) router.push(item.path);
                  }}
                  pathname={item.path}
                  nested={true}
                  SvgIcon={null}
                  selected={pathname === item.path}
                />
              );
            })}
          </Collapse>

          <MyListItem
            labelText="档案管理"
            onClick={() => {
              router.push('/document');
            }}
            pathname={'/document'}
            nested={false}
            SvgIcon={QualityPerssonnelIcon}
            selected={pathname === '/document'}
            // showExpandIcon
            expanded={menuOpenStatus.rygl}
          />

          <MyListItem
            labelText="合同管理"
            onClick={() => {
              setMenuOpen({
                ...defaultMenuOpenStatus,
                htgl: !menuOpenStatus.htgl,
              });
            }}
            pathname={null}
            nested={false}
            SvgIcon={QualityPerssonnelIcon}
            // selected={pathname.startsWith('/progress')}
            showExpandIcon
            expanded={menuOpenStatus.htgl}
          />
          <Collapse in={menuOpenStatus.htgl} timeout="auto" unmountOnExit>
            {menuContract.map((item, index) => {
              return (
                <MyListItem
                  key={item._id}
                  labelText={item.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.path) router.push(item.path);
                  }}
                  pathname={item.path}
                  nested={true}
                  SvgIcon={null}
                  selected={pathname === item.path}
                />
              );
            })}
          </Collapse>

          <MyListItem
            labelText="人员与权限"
            onClick={() => {
              setMenuOpen({
                ...defaultMenuOpenStatus,
                rygl: !menuOpenStatus.rygl,
              });
            }}
            pathname={null}
            nested={false}
            SvgIcon={QualityPerssonnelIcon}
            selected={pathname.startsWith('/personnel')}
            showExpandIcon
            expanded={menuOpenStatus.rygl}
          />
          <Collapse in={menuOpenStatus.rygl} timeout="auto" unmountOnExit>
            {menuAuthority.map((item, index) => {
              return (
                <MyListItem
                  key={item._id}
                  labelText={item.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.path) router.push(item.path);
                  }}
                  pathname={item.path}
                  nested={true}
                  SvgIcon={null}
                  selected={pathname === item.path}
                />
              );
            })}
          </Collapse>
          <MyListItem
            labelText="个人中心"
            onClick={() => {
              setMenuOpen({
                ...defaultMenuOpenStatus,
                grzx: !menuOpenStatus.grzx,
              });
            }}
            pathname={null}
            nested={false}
            SvgIcon={QualityPerssonnelIcon}
            // selected={pathname.startsWith('/personalCenter')}
            showExpandIcon
            expanded={menuOpenStatus.grzx}
          />
          <Collapse in={menuOpenStatus.grzx} timeout="auto" unmountOnExit>
            {menuPersonalCenter.map((item, index) => (
              <MyListItem
                key={item._id}
                labelText={item.name}
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.path) router.push(item.path);
                }}
                pathname={item.path}
                nested={true}
                SvgIcon={null}
                selected={pathname === item.path}
              />
            ))}
          </Collapse>
        </List>
      </RSC>
    </NoSsr>
  );
}

export default function LayoutSideContanier() {
  const classes = useStyles();
  const theme = useTheme();
  const { openSideBar, setOpenSideBar } = useContext(LayoutPageContext);

  const handleDrawerToggle = () => {
    setOpenSideBar(!openSideBar);
  };

  return (
    <nav className={classes.drawer} aria-label="side-bar">
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={openSideBar}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <Typography>汉唐</Typography>
          <DrawerContent />
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          <div className={classes.toolbar} />
          <DrawerContent />
        </Drawer>
      </Hidden>
    </nav>
  );
}
