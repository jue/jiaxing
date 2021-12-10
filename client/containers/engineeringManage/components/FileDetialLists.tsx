import { useState, useContext, useEffect } from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { PaperClipOutlined } from '@ant-design/icons';

import { EngineeringContext } from '../context/EngineeringContext';
import Previewfile from './PreViewFile';
import Compared from '../../../components/Svgs/Compared';
import { FlowContext } from '../../../contexts/FlowContext';

const useStyles = makeStyles(({ spacing }) => {
  return createStyles({
    filesLit: {
      marginTop: spacing(1),
    },
    fileItem: {
      display: 'flex',
      alignItems: 'center',
    },
    name: {
      margin: '0 4px',
      width: '100%',
    },
  });
});
const FileDetialLists = ({ list, type }) => {
  const classes = useStyles({});
  const { setOpenBIM, setDiffModelFile } = useContext(EngineeringContext);
  const [preViewFile, setPreViewFile] = useState('');
  const { taskInfos } = useContext(FlowContext);
  const [files, setFiles] = useState([]);
  let fileList = [];

  useEffect(() => {
    if (
      type !== 'changeAccordingFile' &&
      type !== 'changeDrawings' &&
      type !== 'SFGWFile' &&
      type !== 'FGFSZFile' &&
      type !== 'CWFSZFile' &&
      type !== 'SZFile'
    ) {
      list.map(item => {
        taskInfos.taskId &&
          taskInfos.attachmentTypes.filter(t => {
            if (
              item.attachmentType &&
              item.attachmentType.includes(t.attachmentType)
            ) {
              fileList.push(item);
            }
          });
      });
      setFiles(fileList);
    } else {
      setFiles(list);
    }
  }, [list, taskInfos]);

  return (
    <div className={classes.filesLit}>
      {files &&
        files.map((item, index) => {
          let nameList = [
            'zip',
            'rvt',
            'nwd',
            'nwc',
            'fbx',
            'obj',
            'dwg',
            'prt',
            'asm',
            '3ds',
            'skp',
            'ifc',
            'max',
          ];
          let originalnameI =
            (item.originalname && item.originalname.split('.')) ||
            (item.resourceName && item.resourceName.split('.')) ||
            [];
          const typeI = originalnameI.length ? originalnameI[1] : '';
          return (
            <div key={index} className={classes.fileItem}>
              {(type === item.attachmentType ||
                type === 'changeAccordingFile' ||
                type === 'changeDrawings') && (
                <div
                  style={{ display: 'flex', cursor: 'pointer' }}
                  onClick={() => {
                    if (nameList.includes(typeI)) {
                      setPreViewFile('');
                    } else {
                      setPreViewFile(item);
                    }
                  }}
                >
                  <IconButton
                    size="small"
                    style={{
                      fontSize: 14,
                      color: 'rgba(0, 0, 0, 0.45)',
                    }}
                  >
                    <PaperClipOutlined
                      style={{
                        fontSize: 14,
                        color: 'rgba(0, 0, 0, 0.45)',
                      }}
                    />
                  </IconButton>
                  <p className={classes.name}>
                    {item.originalname || item.resourceName}
                  </p>
                </div>
              )}
              {/* {(type !== 'BIMModel' || type === 'changeDrawings') && (
                <IconButton
                  onClick={() => {
                    setOpenBIM(true);
                    setDiffModelFile(type);
                  }}
                >
                  <Compared />
                </IconButton>
              )} */}
            </div>
          );
        })}
      <Previewfile preViewFile={preViewFile} setPreViewFile={setPreViewFile} />
    </div>
  );
};
export default FileDetialLists;
