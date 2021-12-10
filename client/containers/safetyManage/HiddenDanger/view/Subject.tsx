import React, { useState, useContext, useEffect } from 'react';
import clsx from 'clsx';
import moment from 'moment';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

import { inspectStyles } from '../../../../styles/resetStyles';

import { HiddenDangerContext } from '../../context/HiddenDangerContext';
import FileList from '../../../../components/FilePreview/FileLists';
import {
  InspectReportDesc,
  PerilsResultsDesc,
} from '../../../../../constants/enums';
import { FlowContext } from '../../../../contexts/FlowContext';
import TemplatePreViewFile from '../../../../components/TemplatePreViewFile';
import PreViewFile from '../../../../components/FilePreview/temPreView';

const dateForm = 'YYYY-MM-DD';

const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
    planContanier: {
      borderRight: '1px dashed #B2B2B2',
      paddingRight: 27,
      marginRight: 29,
      width: '43%',
      overflowY: 'auto',
      overflowX: 'hidden',
    },
    tagButton: {
      height: 26,
      paddingTop: 2,
      marginBottom: 10,
      marginRight: 10,
      background: 'rgba(143,195,32,0.13)',
      '& .MuiButton-label': {
        fontWeight: 400,
        color: 'rgba(143,195,32,1)',
        fontSize: 12,
      },
    },
    label: {
      color: 'rgba(0,0,0,0.45)!important',
      width: 110,
      textAlign: 'right',
    },
  })
);

const Subject = () => {
  const { hiddenDangerSubject, setHiddenDangerSubject } = useContext(
    HiddenDangerContext
  );

  const classes = useStyles({});
  const classesReset = inspectStyles({});
  const { taskInfos, queryFileFillData } = useContext(FlowContext);
  const [preViewFile, setPreViewFile] = useState<any>();

  return (
    <Box className={clsx([classesReset.flex, classes.planContanier])}>
      {/* <Box display="flex" mt={3} mb={2}>
        <Box className={classes.label}>项目：</Box>
        <Box>1111</Box>
      </Box>
      <Box display="flex" mb={2}>
        <Box className={classes.label}>标段：</Box>
        <Box>1111</Box>
      </Box>
       */}
      <Box display="flex" mt={3} mb={2}>
        <Box className={classes.label}>检查编号：</Box>
        <Box>{hiddenDangerSubject.number}</Box>
      </Box>
      <Box display="flex" mb={2}>
        <Box className={classes.label}>检查主题：</Box>
        <Box>{hiddenDangerSubject.name}</Box>
      </Box>
      <Box display="flex" mb={2}>
        <Box className={classes.label}>检查描述：</Box>
        <Box>{hiddenDangerSubject.desc}</Box>
      </Box>

      <Box display="flex" mb={2}>
        <Box className={classes.label}>检查时间：</Box>
        <Box>{moment(hiddenDangerSubject.perilsTime).format(dateForm)}</Box>
      </Box>

      <Box display="flex" mb={2}>
        <Box className={classes.label}>参与单位：</Box>
        <Box>
          {hiddenDangerSubject.partCompanys &&
            hiddenDangerSubject.partCompanys.join(',')}
        </Box>
      </Box>
      <Box display="flex" mb={2}>
        <Box className={classes.label}>检查类型：</Box>
        <Box>{InspectReportDesc[hiddenDangerSubject.type]}</Box>
      </Box>

      <Box display="flex" mb={2}>
        <Box className={classes.label}>检查结果：</Box>
        <Box>{PerilsResultsDesc[hiddenDangerSubject.perilsResults]}</Box>
      </Box>

      <Box display="flex" mb={2}>
        <Box className={classes.label}>整改执行人：</Box>
        <Box>
          {hiddenDangerSubject.accountExecutor &&
            hiddenDangerSubject.accountExecutor.userName}
        </Box>
      </Box>
      {/* <Box display="flex" mb={2}>
        <Box className={classes.label}>抄送人：</Box>
        <Box>
          {hiddenDangerSubject.accountExecutor &&
            hiddenDangerSubject.accountExecutor.userName}
        </Box>
      </Box> */}
      <Box display="flex" mb={2}>
        <Box className={classes.label}>截止日期：</Box>
        <Box>{moment(hiddenDangerSubject.endTime).format(dateForm)}</Box>
      </Box>

      {taskInfos.attachmentTypes &&
        taskInfos.attachmentTypes.map((item, index) => {
          // window.localStorage.setItem('attachmentType', item.attachmentType);
          return (
            <React.Fragment key={index}>
              <Box display="flex" mb={2}>
                <Box className={classes.label}>{item.attachmentName}：</Box>
                <Box flex="1" display="flex" flexDirection="column">
                  {hiddenDangerSubject.nodeFiles &&
                    hiddenDangerSubject.nodeFiles.length !== 0 && (
                      <FileList
                        list={hiddenDangerSubject.nodeFiles}
                        type="view"
                        info={hiddenDangerSubject}
                        setInfo={setHiddenDangerSubject}
                        typeForm={item}
                      />
                    )}
                </Box>
              </Box>
            </React.Fragment>
          );
        })}

      <Box display="flex" mb={3}>
        <Box className={classes.label}>表单模版下载：</Box>
        {hiddenDangerSubject.modelFile &&
          hiddenDangerSubject.modelFile.map((file) => (
            <Box
              onClick={() => {
                queryFileFillData(
                  hiddenDangerSubject,
                  file.bizFormId,
                  file.bizFormName,
                  setPreViewFile
                );
              }}
            >
              {file.bizFormName}
            </Box>
          ))}
      </Box>
      <PreViewFile preViewFile={preViewFile} setPreViewFile={setPreViewFile} />
    </Box>
  );
};
export default Subject;
