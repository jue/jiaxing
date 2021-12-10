import { useContext } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';

import { Grid, FormControl, InputLabel } from '@material-ui/core';
import { engineeringStyles } from '../styles';
import { EngineeringContext } from '../context/EngineeringContext';
import FileDetialLists from '../components/FileDetialLists';
import FileList from '../components/FileLists';
import Dropzone from '../../../components/Dropzone/DropzoneUploadContainer';

const StepFourDetial = () => {
  const classes = engineeringStyles({});
  const { engineeringInfo, saveFiles, updateEngineeringtMsg } = useContext(
    EngineeringContext
  );
  return (
    <div className={classes.root}>
      <div className={classes.row}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl
              className={classes.formControl}
              style={{ width: '100%' }}
            >
              <InputLabel
                shrink
                className={clsx(classes.inputLabel, classes.common)}
              >
                市发改委文件：
              </InputLabel>
              <div
                className={clsx(classes.typeContent, classes.model)}
                style={{ marginLeft: 88 }}
              >
                {engineeringInfo.SFGWFile && (
                  <FileDetialLists
                    list={engineeringInfo.SFGWFile}
                    type="SFGWFile"
                  />
                )}
                {engineeringInfo.executiveDept === '市轨道公司办公室' && (
                  <>
                    {updateEngineeringtMsg.SFGWFile &&
                      updateEngineeringtMsg.SFGWFile.length !== 0 && (
                        <FileList
                          list={updateEngineeringtMsg.SFGWFile}
                          type="SFGWFile"
                        />
                      )}
                    <Dropzone
                      files={[]}
                      setFiles={(files) => {
                        saveFiles('SFGWFile', files);
                      }}
                      accept=".doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png"
                      maxSize={10}
                    >
                      <div className={clsx(classes.uploadBtn, classes.common)}>
                        上传
                      </div>
                    </Dropzone>
                  </>
                )}
              </div>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl
              className={classes.formControl}
              style={{ width: '100%' }}
            >
              <InputLabel
                shrink
                className={clsx(classes.inputLabel, classes.common)}
              >
                分管副市长文件：
              </InputLabel>
              <div
                className={clsx(classes.typeContent, classes.model)}
                style={{ marginLeft: 88 }}
              >
                {engineeringInfo.FGFSZFile && (
                  <FileDetialLists
                    list={engineeringInfo.FGFSZFile}
                    type="FGFSZFile"
                  />
                )}
                {engineeringInfo.executiveDept === '市轨道公司办公室' && (
                  <>
                    {updateEngineeringtMsg.FGFSZFile &&
                      updateEngineeringtMsg.FGFSZFile.length !== 0 && (
                        <FileList
                          list={updateEngineeringtMsg.FGFSZFile}
                          type="FGFSZFile"
                        />
                      )}
                    <Dropzone
                      files={[]}
                      setFiles={(files) => {
                        saveFiles('FGFSZFile', files);
                      }}
                      accept=".doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png"
                      maxSize={10}
                    >
                      <div className={clsx(classes.uploadBtn, classes.common)}>
                        上传
                      </div>
                    </Dropzone>
                  </>
                )}
              </div>
            </FormControl>
          </Grid>
        </Grid>
      </div>
      <div className={classes.row}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl
              className={classes.formControl}
              style={{ width: '100%' }}
            >
              <InputLabel
                shrink
                className={clsx(classes.inputLabel, classes.common)}
              >
                常务副市长文件：
              </InputLabel>
              <div
                className={clsx(classes.typeContent, classes.model)}
                style={{ marginLeft: 88 }}
              >
                {engineeringInfo.CWFSZFile && (
                  <FileDetialLists
                    list={engineeringInfo.CWFSZFile}
                    type="CWFSZFile"
                  />
                )}
                {engineeringInfo.executiveDept === '市轨道公司办公室' && (
                  <>
                    {updateEngineeringtMsg.CWFSZFile &&
                      updateEngineeringtMsg.CWFSZFile.length !== 0 && (
                        <FileList
                          list={updateEngineeringtMsg.CWFSZFile}
                          type="CWFSZFile"
                        />
                      )}
                    <Dropzone
                      files={[]}
                      setFiles={(files) => {
                        saveFiles('CWFSZFile', files);
                      }}
                      accept=".doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png"
                      maxSize={10}
                    >
                      <div className={clsx(classes.uploadBtn, classes.common)}>
                        上传
                      </div>
                    </Dropzone>
                  </>
                )}
              </div>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl
              className={classes.formControl}
              style={{ width: '100%' }}
            >
              <InputLabel
                shrink
                className={clsx(classes.inputLabel, classes.common)}
              >
                市长文件：
              </InputLabel>
              <div
                className={clsx(classes.typeContent, classes.model)}
                style={{ marginLeft: 88 }}
              >
                {engineeringInfo.SZFile && (
                  <FileDetialLists
                    list={engineeringInfo.SZFile}
                    type="SZFile"
                  />
                )}
                {engineeringInfo.executiveDept === '市轨道公司办公室' && (
                  <>
                    {updateEngineeringtMsg.SZFile &&
                      updateEngineeringtMsg.SZFile.length !== 0 && (
                        <FileList
                          list={updateEngineeringtMsg.SZFile}
                          type="SZFile"
                        />
                      )}
                    <Dropzone
                      files={[]}
                      setFiles={(files) => {
                        saveFiles('SZFile', files);
                      }}
                      accept=".doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png"
                      maxSize={10}
                    >
                      <div className={clsx(classes.uploadBtn, classes.common)}>
                        上传
                      </div>
                    </Dropzone>
                  </>
                )}
              </div>
            </FormControl>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
export default StepFourDetial;
