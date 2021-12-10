import { useContext, useEffect, useMemo, useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import clsx from 'clsx';

import { Grid, FormControl, InputLabel } from '@material-ui/core';

import { EngineeringContext } from '../context/EngineeringContext';
import { engineeringStyles } from '../styles';
import { FlowContext } from '../../../contexts/FlowContext';
import { IconButton } from '@material-ui/core';
import { PaperClipOutlined } from '@ant-design/icons';
import Previewfile from '../components/PreViewFile';

const StepThreeDetial = () => {
  const router = useRouter();
  const { engineeringInfo } = useContext(EngineeringContext);
  const classes = engineeringStyles({});
  const { taskInfos } = useContext(FlowContext);
  const [preViewFile, setPreViewFile] = useState('');

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

  return (
    <div className={classes.root}>
      <div className={classes.row}>
        <Grid container spacing={1}>
          {taskInfos.taskId &&
            taskInfos.attachmentTypes.map(item => {
              const type =
                item.attachmentName.includes('BIM') ||
                item.attachmentName.includes('模型');

              return (
                <Grid item xs={6} sm={3} key={item.attachmentType}>
                  <FormControl
                    className={classes.formControl}
                    style={{ width: '100%' }}
                  >
                    <InputLabel
                      shrink
                      className={clsx(classes.inputLabel, classes.common)}
                    >
                      {item.attachmentName}
                    </InputLabel>
                    <div className={clsx(classes.typeContent, classes.model)}>
                      {engineeringInfo.nodeFiles &&
                        engineeringInfo.nodeFiles.map((file, index) => {
                          let originalnameI =
                            (file.originalname &&
                              file.originalname.split('.')) ||
                            (file.resourceName &&
                              file.resourceName.split('.')) ||
                            [];
                          const typeI = originalnameI.length
                            ? originalnameI[1]
                            : '';

                          return (
                            <div
                              key={index}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              {item.attachmentType === file.attachmentType && (
                                <div
                                  style={{ display: 'flex' }}
                                  onClick={() => {
                                    if (nameList.includes(typeI)) {
                                      setPreViewFile('');
                                    } else {
                                      setPreViewFile(file);
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
                                  <p
                                    style={{
                                      margin: '0 4px',
                                      width: '100%',
                                    }}
                                  >
                                    {file.resourceName}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </FormControl>
                </Grid>
              );
            })}
        </Grid>
      </div>
      <Previewfile preViewFile={preViewFile} setPreViewFile={setPreViewFile} />
    </div>
  );
};
export default StepThreeDetial;
