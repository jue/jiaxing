import { useContext } from 'react';
import clsx from 'clsx';

import { Grid, FormControl, InputLabel } from '@material-ui/core';
import { engineeringStyles } from '../styles';
import { EngineeringContext } from '../context/EngineeringContext';
import FileDialog from '../components/FileDialog';
import FileList from '../components/FileLists';
import Dropzone from '../../../components/Dropzone/DropzoneUploadContainer';
import { FlowContext } from '../../../contexts/FlowContext';

const StepThree = () => {
  const classes = engineeringStyles({});
  const {
    setFileDialog,
    engineeringInfo,
    saveFiles,
    setCreateModelInfo,
  } = useContext(EngineeringContext);
  const { taskInfos } = useContext(FlowContext);

  const BIMModel: any = engineeringInfo.BIMModel || [];

  return (
    <div className={classes.root}>
      <div className={classes.row}>
        <Grid container spacing={3}>
          {taskInfos.taskId &&
            taskInfos.attachmentTypes.map(item => {
              return (
                <Grid item xs={6} sm={3} key={item.attachmentName}>
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
                        engineeringInfo.nodeFiles.length !== 0 && (
                          <FileList
                            list={engineeringInfo.nodeFiles}
                            type={item.attachmentType}
                          />
                        )}

                      <Dropzone
                        files={[]}
                        setFiles={files => {
                          saveFiles(item.attachmentType, files);
                        }}
                        accept=""
                        // maxSize={10}
                      >
                        <div
                          className={clsx(classes.uploadBtn, classes.common)}
                        >
                          上传
                        </div>
                      </Dropzone>
                    </div>
                  </FormControl>
                </Grid>
              );
            })}
        </Grid>
      </div>

      <FileDialog />
    </div>
  );
};
export default StepThree;
