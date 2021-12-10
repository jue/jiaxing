import { useContext, useState } from 'react';
import debounce from 'lodash/debounce';
import { motion } from 'framer-motion';
import Dropzone from 'react-dropzone';

import {
  Tab,
  Tabs,
  Typography,
  Button,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import useDocumentStyles from './DocumentStyle';
import { DocumentContext, DocumentContextI } from './DocumentContext';
import { DataStatusDesc } from '../../../constants/enums';
import DocumentTable from './DocumentTable';
import DocumentSider from './DocumentSider';
import IsSuedDialog from './isSuedDialog';

let easing = [0.175, 0.85, 0.42, 0.96];

const fadeInUpVariants = {
  exit: { y: 150, opacity: 0, transition: { duration: 0.5, ease: easing } },
  enter: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easing,
    },
  },
};

const SettingsIndex = () => {
  const classes = useDocumentStyles();

  const {
    selectCategory,
    queryDocument,
    setQueryDocument,
    saveFiles,
    queryCompanys,
    openBackdrop,
    setOpenBackDrop,
  } = useContext<DocumentContextI>(DocumentContext);

  const query = debounce((v) => {
    setQueryDocument({ ...queryDocument, search: v });
  }, 1000);
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: 'flex' }}>
      <DocumentSider />
      <div style={{ width: 'calc(100% - 200px)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 8px',
            margin: '0 12px',
          }}
        >
          <Tabs
            value={queryDocument.dataStatus}
            onChange={(_, v) => {
              setQueryDocument({ ...queryDocument, dataStatus: v });
            }}
            indicatorColor="primary"
            textColor="primary"
          >
            {Object.keys(DataStatusDesc).map((item) => {
              return (
                <Tab
                  key={item}
                  label={DataStatusDesc[item]}
                  value={item}
                  style={{ marginRight: 50 }}
                />
              );
            })}
          </Tabs>
          <div style={{ flexGrow: 1 }} />

          <div className={classes.search} style={{ width: 240 }}>
            <SearchIcon className={classes.searchIcon} />
            <input
              className={classes.searchInput}
              placeholder="请输入搜索内容"
              onChange={(e) => {
                query(e.target.value);
              }}
            />
          </div>
        </div>
        <motion.div
          initial="exit"
          animate="enter"
          exit="exit"
          variants={fadeInUpVariants}
          style={{ height: 'calc(100vh - 92px)', overflow: 'auto', padding: 8 }}
        >
          <div className={classes.tableBox}>
            <div className={classes.tableTop}>
              <Typography>{selectCategory.name}全部列表</Typography>
              {queryDocument.dataStatus !== 'Tashed' && (
                <div style={{ display: 'flex' }}>
                  <Dropzone
                    onDrop={(acceptedFiles) => {
                      saveFiles(acceptedFiles, 'table');
                      setOpenBackDrop(true);
                    }}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div>
                        <div>
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Button className={classes.createButton}>
                              新建文件列表
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Dropzone>
                  <Button
                    className={classes.createButton}
                    style={{ marginLeft: 16 }}
                    onClick={() => {
                      setOpen(true);
                      queryCompanys();
                    }}
                  >
                    文档下发
                  </Button>
                </div>
              )}
            </div>

            <DocumentTable />
          </div>
        </motion.div>
      </div>
      <IsSuedDialog open={open} setOpen={setOpen} />
      <Backdrop style={{ zIndex: 99999, color: 'white' }} open={openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default SettingsIndex;
