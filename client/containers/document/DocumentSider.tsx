import useDocumentStyles from './DocumentStyle';
import { useState, useContext, useEffect } from 'react';
import { DocumentContext, DocumentContextI } from './DocumentContext';
import AntdDialog from '../../components/AntdDialog';

import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import FilterIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const DocumentSider = () => {
  const classes = useDocumentStyles({});
  const {
    handleCreateUpdateDocumentCategory,
    handleDeleteDocumentCategory,
    selectCategory,
    setSelectCategory,
    documentCategorys,
    documentCategory,
    setDocumentCategory,
  } = useContext<DocumentContextI>(DocumentContext);
  const [open, setOpen] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [documentSearchs, setDocumentSearchs] = useState([]);
  const [editCategory, setEditCategory] = useState<any>({});
  const [openModial, setOpenMedial] = useState(false);

  useEffect(() => {
    setDocumentSearchs(documentCategorys);
  }, [documentCategorys]);

  const changeSearch = (e) => {
    const value = e.target.value.trim();
    if (value) {
      const searchArray = documentCategorys.filter((v) =>
        v.name.includes(value)
      );
      setDocumentSearchs(searchArray);
    } else {
      setDocumentSearchs(documentCategorys);
    }
  };

  return (
    <div className={classes.leftSider}>
      <div className={classes.siderTop}>
        <div className={classes.search}>
          <SearchIcon className={classes.searchIcon} />
          <input
            onChange={(e) => changeSearch(e)}
            className={classes.searchInput}
          />
        </div>
        <div className={classes.addIcon} onClick={() => setOpen(true)}>
          <AddIcon style={{ color: '#fff' }} />
        </div>
      </div>

      <div>
        {documentSearchs.map((item) => {
          return (
            <div
              key={item._id}
              className={
                selectCategory._id === item._id
                  ? classes.active
                  : classes.disActive
              }
              style={{
                position: 'relative',
                cursor: 'pointer',
              }}
              onClick={() => {
                setSelectCategory(item);
              }}
            >
              <div
                className={classes.title}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingRight: 10,
                }}
              >
                <span>{item.name}</span>
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    setEditCategory(editCategory._id === item._id ? {} : item)
                  }
                >
                  <FilterIcon />
                </div>
              </div>

              {editCategory._id === item._id && (
                <div className={classes.menu}>
                  <div
                    className={classes.menuButton}
                    onClick={() => {
                      setOpen(true);
                      setDocumentCategory(item);
                      setEditCategory({});
                    }}
                  >
                    编辑菜单名称
                  </div>
                  <div
                    className={classes.menuButton}
                    onClick={() => {
                      setOpenDelete(true);
                      setDocumentCategory(item);
                      setEditCategory({});
                    }}
                  >
                    删除菜单
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AntdDialog
        visible={open}
        onClose={() => {
          setOpen(false);
          setDocumentCategory({});
        }}
        hasClose={true}
        dialogTitle=""
        hasFooter={true}
        onConfirm={() => {
          handleCreateUpdateDocumentCategory().then(() => {
            setOpen(false);
            setDocumentCategory({});
          });
        }}
        width={560}
        // disabled={Boolean(!documentCategory.name)}
      >
        <Typography style={{ textAlign: 'center', marginBottom: 20 }}>
          {documentCategory._id ? '编辑' : '新建'}菜单
        </Typography>

        <TextField
          fullWidth
          label="菜单名称"
          variant="outlined"
          value={documentCategory.name}
          InputLabelProps={{
            shrink: true,
          }}
          // onBlur={(e) =>
          //   setDocumentCategory({ ...documentCategory, name: e.target.value })
          // }
          onChange={(e) =>
            setDocumentCategory({ ...documentCategory, name: e.target.value })
          }
        />
      </AntdDialog>

      <AntdDialog
        visible={openDelete}
        onClose={() => setOpenDelete(false)}
        hasClose={true}
        dialogTitle=""
        hasFooter={true}
        onConfirm={() =>
          handleDeleteDocumentCategory(documentCategory._id).then(() =>
            setOpenDelete(false)
          )
        }
        width={560}
      >
        <div className={classes.createTitle}>
          <div className={classes.question}>?</div>
          <Typography>是否删除该文件信息？</Typography>
        </div>
      </AntdDialog>
    </div>
  );
};

export default DocumentSider;
