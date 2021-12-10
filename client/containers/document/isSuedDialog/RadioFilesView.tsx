import { useContext, useEffect, useState } from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { Select } from 'antd';

import Dropzone from '../../../components/Dropzone/DropzoneUploadContainer';
import { DocumentContextI, DocumentContext } from '../DocumentContext';
const { Option } = Select;

const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
    '@global': {
      '.ant-select:not(.ant-select-disabled):hover .ant-select-selector': {
        borderColor: '#8fc220 !important',
        borderRadius: '4px !important',
        height: '34px !important',
      },
      '.ant-select-selector': {
        borderColor: '#d9d9d9 !important',
        borderRadius: '4px !important',
        height: '34px !important',
      },
      '.ant-select-focused.ant-select-single:not(.ant-select-customize-input) .ant-select-selector': {
        boxShadow: 'none',
        WebkitBoxShadow: 'none',
        height: '34px !important',
      },
      '.MuiFormControlLabel-label': {
        color: 'rgba(0,0,0,0.65)!important',
      },
      '.MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
        padding: spacing(0, 1),
      },
      '.MuiAutocomplete-inputRoot .MuiAutocomplete-input': {
        padding: '7.5px 4px!important',
      },
    },
  })
);

const RadioFilesView = ({ open }) => {
  const classes = useStyles({});
  const {
    documents,
    documentCategorys,
    selectCategory,
    setSelectCategory,
    saveFiles,
    messageFiles,
    setMessageFiles,
    messageInfo,
    setMessageInfo,
    setOpenBackDrop,
  } = useContext<DocumentContextI>(DocumentContext);

  const handleClose = (id) => {
    const tags = messageFiles.filter(
      (tag) => (tag.resourceId || tag.idFile) !== id
    );

    setMessageFiles(tags);
  };

  const [newRelatedFile, setNewRelatedFile] = useState<any>({});
  const [request, setRequest] = useState(false);
  const [state, setState] = useState(false);
  useEffect(() => {
    let newArr = [];
    messageFiles.map((item) => {
      if (item.idFile || item.resourceId) {
        newArr.push(item.idFile || item.resourceId);
        setMessageInfo({
          ...messageInfo,
          attachments: newArr,
        });
      }
    });
  }, [messageFiles]);
  useEffect(() => {
    setNewRelatedFile({ name: '' });
  }, [selectCategory, state]);

  return (
    <>
      <div style={{ margin: '10px 0', display: 'flex' }}>
        {open === 'newFile' && (
          <>
            {/* <Select
              id="inspection-cc"
              placeholder="请选择文件类型"
              value={selectCategory.name}
              style={{ width: '40%', marginRight: '2%', height: 34 }}
              onChange={(value) => {
                const newCompany: any = documentCategorys.find(
                  (v) => v._id === value
                );
                setSelectCategory(newCompany);
              }}
            >
              {(documentCategorys || []).map((item) => (
                <Option value={item._id} key={item._id}>
                  {item.name}
                </Option>
              ))}
            </Select> */}
            <Dropzone
              files={[]}
              setFiles={(files) => {
                saveFiles(files, 'message');
                setOpenBackDrop(true);
              }}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
              maxSize={10}
            >
              <div
                style={{
                  margin: 0,
                  backgroundColor: '#8FC220',
                  height: 30,
                  lineHeight: '30px',
                  width: 60,
                  textAlign: 'center',
                  borderRadius: 4,
                  color: '#fff',
                }}
              >
                上传
              </div>
            </Dropzone>
          </>
        )}
        {open === 'relatedForm' && (
          <>
            <Select
              id="inspection-cc"
              placeholder="请选择文件类型"
              value={selectCategory.name}
              style={{ width: '25%', marginRight: '2%', height: 34 }}
              onChange={(value) => {
                const newCompany: any = documentCategorys.find(
                  (v) => v._id === value
                );
                setSelectCategory(newCompany);
              }}
            >
              {(documentCategorys || []).map((item) => (
                <Option value={item._id} key={item._id}>
                  {item.name}
                </Option>
              ))}
            </Select>
            <Autocomplete
              style={{
                width: '25%',
                marginRight: '2%',
                height: 34,
                marginBottom: 8,
              }}
              id="virtualize-demo"
              options={documents.map((option) => option)}
              getOptionLabel={(option) => option.name}
              inputValue={newRelatedFile.name}
              onChange={(e, value, reson) => {
                if (Boolean(value)) {
                  setNewRelatedFile(value);
                  setRequest(false);
                }
              }}
              onInputChange={(event, newInputValue) => {
                setNewRelatedFile({ name: '' });
              }}
              renderInput={(params) => {
                return (
                  <div ref={params.InputProps.ref}>
                    <TextField
                      {...params}
                      variant="outlined"
                      inputProps={{
                        ...params.inputProps,
                      }}
                    />
                    {request && (
                      <span
                        style={{
                          color: '#FF8C8C',
                          fontSize: 12,
                        }}
                      >
                        请选择文件
                      </span>
                    )}
                  </div>
                );
              }}
            />
            <div
              style={{
                margin: 0,
                color: '#8FC220',
                height: 34,
                lineHeight: '34px',
              }}
              onClick={() => {
                if (!newRelatedFile.name) {
                  return setRequest(true);
                }
                setMessageFiles([...messageFiles, newRelatedFile]);
                setNewRelatedFile({});
                setState(true);
              }}
            >
              添加
            </div>
          </>
        )}
      </div>
      {messageFiles &&
        messageFiles.length > 0 &&
        messageFiles.map((item) => {
          return (
            <div
              key={item.resourceId || item.idFile}
              style={{ display: 'flex' }}
            >
              <Typography style={{ width: 100, textAlign: 'right' }}>
                {item.idFile && `${item.category.name}：`}
              </Typography>
              <div style={{ marginLeft: 16, color: '#8FC220' }}>
                {item.resourceName || item.name}
              </div>
              <div
                style={{ marginLeft: 16, color: 'red' }}
                onClick={() => {
                  handleClose(item.idFile ? item.idFile : item.resourceId);
                  setState(false);
                }}
              >
                删除
              </div>
            </div>
          );
        })}
    </>
  );
};
export default RadioFilesView;
