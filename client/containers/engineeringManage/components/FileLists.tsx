import { useContext, useEffect, useMemo, useState } from 'react';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { PaperClipOutlined } from '@ant-design/icons';

import { EngineeringContext } from '../context/EngineeringContext';
import { CloseOutlined } from '@ant-design/icons';
import Compared from '../../../components/Svgs/Compared';
import Previewfile from './PreViewFile';
import { FlowContext } from '../../../contexts/FlowContext';

const useStyles = makeStyles(({ spacing }) => {
  return createStyles({
    filesLit: {
      marginTop: spacing(1),
      maxHeight: 230,
      overflow: 'auto',
    },
    fileItem: {
      display: 'flex',
      alignItems: 'center',
    },
    name: {
      margin: '0 4px',
    },
  });
});

const FileLists = ({ list, type }) => {
  const { handleDeleteFile, setOpenBIM, setDiffModelFile } = useContext(
    EngineeringContext
  );
  const { taskInfos } = useContext(FlowContext);
  const [files, setFiles] = useState([]);
  const [preViewFile, setPreViewFile] = useState('');
  const classes = useStyles({});
  let fileList = [];

  useEffect(() => {
    if (
      type !== 'BIMModel' &&
      type !== 'changeAccordingFile' &&
      type !== 'changeDrawings' &&
      type !== 'model'
    ) {
      list.map(item => {
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
  }, [taskInfos, list]);

  return (
    <div className={classes.filesLit}>
      {files[0] &&
        (files[0]._id || files[0].resourceId) &&
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
                type === 'changeDrawings' ||
                type === 'BIMModel' ||
                type === 'model') && (
                <div
                  style={{ display: 'flex' }}
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
              {(type === 'BIMModel' || type === 'changeDrawings') && (
                <IconButton
                  onClick={() => {
                    setOpenBIM(true);
                    setDiffModelFile(type);
                  }}
                >
                  <Compared />
                </IconButton>
              )}
              {(type === item.attachmentType ||
                type === 'changeAccordingFile' ||
                type === 'changeDrawings') && (
                <CloseOutlined
                  style={{
                    fontSize: 14,
                    color: 'rgba(0, 0, 0, 0.45)',
                  }}
                  onClick={() => {
                    files.splice(index, 1);
                    handleDeleteFile(files, type);
                  }}
                />
              )}
            </div>
          );
        })}
      <Previewfile preViewFile={preViewFile} setPreViewFile={setPreViewFile} />
    </div>
  );
};
export default FileLists;
