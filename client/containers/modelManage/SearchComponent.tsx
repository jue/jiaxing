import React, { useContext, useEffect, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { OutlineInput } from '../../components/Input/OutlineInput';
import { ModelManageContext } from './context/ModelManageContext';

const useStyles = makeStyles(() => {
  return createStyles({
    input: {
      '& input': {
        width: 204,
        height: 30,
        padding: '0 12px',
      },
    },

    modal: {
      position: 'absolute',
      width: 228,
      backgroundColor: '#fff',
      boxShadow:
        '0 3px 6px -4px rgba(0,0,0,.12), 0 6px 16px 0 rgba(0,0,0,.08), 0 9px 28px 8px rgba(0,0,0,.05)',
      maxHeight: 200,
      zIndex: 99,
      borderRadius: 4,
      left: 84,
      padding: '10px 12px 0',
      overflowl: 'auto',
      '& p:hover': {},
    },
    info: {
      marginBottom: 0,
      height: 30,
      cursor: 'pointer',
    },
  });
});

function SearchComponent({
  infos,
  setCreateModelInfo,
  createModelInfo,
  handleSearch,
  type,
}) {
  const { queryModelVersion } = useContext(ModelManageContext);
  const classes = useStyles({});
  const [selectItem, setSelectItem] = useState('');
  const [modal, setModal] = useState<boolean>(false);

  return (
    <>
      <OutlineInput
        placeholder={`请选择/输入${type}名称`}
        className={classes.input}
        value={selectItem}
        onChange={e => {
          const { value } = e.target;
          handleSearch(value);
          setSelectItem(value);
          if (infos.length) {
            setModal(true);
          } else {
            setModal(false);
          }
        }}
        onFocus={e => {
          e.stopPropagation();
          if (infos.length) {
            setModal(true);
          } else {
            setModal(false);
          }
        }}
      />
      <div
        className={classes.modal}
        style={{ display: modal ? 'block' : 'none' }}
      >
        {infos.map(item => (
          <p
            key={item._id}
            className={classes.info}
            onClick={e => {
              e.stopPropagation();
              setSelectItem(item.name);
              setModal(false);
              if (type === '工程') {
                setCreateModelInfo({
                  ...createModelInfo,
                  idEngineering: item._id,
                });
              }
              if (type === '合同') {
                setCreateModelInfo({
                  ...createModelInfo,
                  idContract: item._id,
                });
              }
              if (type === '模型') {
                queryModelVersion('true', item.name);
              }
            }}
          >
            {item.name}
          </p>
        ))}
      </div>
    </>
  );
}

export default SearchComponent;
