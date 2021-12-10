import React, { useContext, useState, useEffect } from 'react';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import { OrganizationContext } from '../context/OrganizationContext';
import { InspectPlanStatusContext } from '../context/InspectPlanStatusContext';
import { InspectPlanReqContext } from '../context/InspectPlanReqContext';
import { makeStyles, createStyles } from '@material-ui/core';
import { stratify } from 'd3-hierarchy';

const useStyles = makeStyles(() => {
  return createStyles({
    '@global': {
      '.MuiTreeItem-root .MuiTreeItem-iconContainer': {
        // display: 'none',
      },
      '.MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label': {
        background: 'none',
      },
      '.MuiTreeItem-root.Mui-selected > .MuiTreeItem-group .MuiTreeItem-label': {
        color: '#8FC220',
        backgroundColor: 'rba(143,194,32,0.06)',
      },
    },
    root: {
      position: 'absolute',
      backgroundColor: '#fff',
      zIndex: 99,
      top: 52,
      maxHeight: 200,
      overflow: 'auto',
      width: '100%',
      boxShadow:
        '0px 0px 3px 0px rgba(0,0,0,0.1),0px 0px 0px 1px rgba(0,0,0,0.05)',
      borderRadius: 2,
      '& .MuiTreeItem-label': {
        borderBottom: '2px solid #E9E9E9',
        height: 36,
        opacity: 0.65,
        lineHeight: '36px',
        width: '100%',
        '& .MuiTreeItem-content': {
          justifyContent: 'center',
          height: '100%',
        },
      },
    },
    content: {
      '& div': {
        height: 36,
        lineHeight: '36px',
        borderBottom: '2px solid #E9E9E9',
        opacity: 0.65,
        cursor: 'pointer',
        marginLeft: 15,
        '&:hover': {
          color: '#8FC220',
          backgroundColor: 'rba(143,194,32,0.06)',
        },
      },
      '& div:last-child': {
        border: 'none',
      },
    },
  });
});

const company = (
  node,
  level,
  companyInfo,
  inspectCreatedPlanSubject,
  setInspectCreatedPlanSubject,
  setOpenAssigneePopver
) => {
  if (!node) {
    return <React.Fragment />;
  }
  const { children = [], data } = node;
  return (
    <div key={data && data._id}>
      {data && data.name && (
        <TreeItem nodeId={data._id} label={data.name} key={data._id}>
          {data.dept.map(dept => {
            return (
              <TreeItem nodeId={dept._id} label={dept.name} key={dept._id}>
                {dept.account.map(personnel => {
                  let deptPersonnel = dept._id === personnel.idDepartment;
                  return (
                    <React.Fragment key={personnel._id}>
                      {deptPersonnel && (
                        <TreeItem
                          nodeId={personnel.idDepartment}
                          label={deptPersonnel ? personnel.userName : ''}
                          key={personnel.idDepartment}
                          style={{ paddingLeft: 10 }}
                          onClick={() => {
                            setInspectCreatedPlanSubject({
                              ...inspectCreatedPlanSubject,
                              allocateObjects: personnel.userName,
                            });
                            setOpenAssigneePopver(false);
                          }}
                        ></TreeItem>
                      )}
                    </React.Fragment>
                  );
                })}
              </TreeItem>
            );
          })}
        </TreeItem>
      )}
      {children.map(child => {
        return company(
          child,
          level + 1,
          companyInfo,
          inspectCreatedPlanSubject,
          setInspectCreatedPlanSubject,
          setOpenAssigneePopver
        );
      })}
    </div>
  );
};

const AssigneeTree = () => {
  const { companyInfo } = useContext(OrganizationContext);
  const { openAssigneePopver, setOpenAssigneePopver } = useContext(
    InspectPlanStatusContext
  );
  const {
    queryPersonnelList,
    inspectCreatedPlanSubject,
    setInspectCreatedPlanSubject,
  } = useContext(InspectPlanReqContext);
  const [treeCompany, setTreeCompany] = useState<any>({});
  const classes = useStyles({});
  useEffect(() => {
    const itemAll = { _id: '0' };
    let treeC: any;
    treeC = stratify()
      .id(function(d) {
        return d._id;
      })
      .parentId(function(d) {
        return d.parentId;
      })([itemAll, ...companyInfo]);
    setTreeCompany(treeC);
  }, [companyInfo]);
  return (
    <TreeView
      style={{
        display: Boolean(openAssigneePopver) ? 'block' : 'none',
      }}
      classes={{ root: classes.root }}
    >
      {queryPersonnelList.length ? (
        <QueryNameList list={queryPersonnelList} />
      ) : (
        company(
          treeCompany,
          0,
          companyInfo,
          inspectCreatedPlanSubject,
          setInspectCreatedPlanSubject,
          setOpenAssigneePopver
        )
      )}
    </TreeView>
  );
};

const QueryNameList = nameList => {
  const {
    inspectCreatedPlanSubject,
    setInspectCreatedPlanSubject,
  } = useContext(InspectPlanReqContext);
  const { setOpenAssigneePopver } = useContext(InspectPlanStatusContext);
  const { list } = nameList;
  const classes = useStyles({});
  return (
    <div className={classes.content}>
      {list.length &&
        list.map(item => (
          <div
            onClick={() => {
              setInspectCreatedPlanSubject({
                ...inspectCreatedPlanSubject,
                allocateObjects: item,
              });
              setOpenAssigneePopver(false);
            }}
          >
            {item}
          </div>
        ))}
    </div>
  );
};

export default AssigneeTree;
