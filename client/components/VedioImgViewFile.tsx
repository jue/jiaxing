import { Box } from '@material-ui/core';

import { CloseCircleFilled } from '@ant-design/icons';
import { Badge, Tooltip } from 'antd';

const VedioImgViewFile = ({ list, classes, setPreViewFile }) => {
  let fileArray =
    (list && list.resourceName && list.resourceName.split('.')) || [];
  let fileType = fileArray[1];
  const imgType = ['jpg', 'png', 'jpeg'];

  return (
    <Box
      key={list && list.length && list.resourceId}
      style={{ flex: '0 0 20%', display: 'flex' }}
    >
      <div
        style={{
          width: '94%',
          height: 64,
          marginRight: 10,
          marginBottom: 10,
          cursor: 'pointer',
          border: '1px solid rgba(0,0,0,.1)',
        }}
        onClick={() => {
          imgType.includes(fileType) && setPreViewFile(list);
        }}
      >
        {imgType.includes(fileType) ? (
          <img
            src={`/api/file/preview/${list && list.resourceId}/${
              list && list.resourceName
            }`}
            alt=""
            className={classes.img}
          />
        ) : (
          <video
            src={`/api/file/preview/${list && list.resourceId}/${
              list && list.resourceName
            }`}
            // autoPlay
            loop
            controls
            style={{
              width: '90%',
              height: 56,
              margin: 3,
            }}
          />
        )}
      </div>
    </Box>
  );
};
export default VedioImgViewFile;
