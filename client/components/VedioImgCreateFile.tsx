import { Box } from '@material-ui/core';

import { CloseCircleFilled } from '@ant-design/icons';
import { Badge, Tooltip } from 'antd';

const VedioImgCreateFile = ({ list, classes, info, onClick }) => {
  let fileArray = (list.resourceName && list.resourceName.split('.')) || [];
  let fileType = fileArray[1];
  const imgType = ['jpg', 'png', 'jpeg'];

  return (
    <Box key={list.resourceId} style={{ flex: '0 0 20%', display: 'flex' }}>
      <div
        style={{
          width: '94%',
          height: 64,
          marginRight: 10,
          marginBottom: 10,
          border: '1px solid rgba(0,0,0,.1)',
        }}
      >
        <Badge
          count={
            <CloseCircleFilled
              className={classes.closeCiycleIcon}
              onClick={() => {
                const replyFiles = JSON.parse(JSON.stringify(info));
                replyFiles.filter((fitem, index) => {
                  if (fitem.resourceId === list.resourceId) {
                    replyFiles.splice(index, 1);
                  }
                });
                imgType.includes(fileType) && onClick(replyFiles);
              }}
            />
          }
          offset={[0, 0]}
        >
          {imgType.includes(fileType) ? (
            <img
              src={`/api/file/preview/${list.resourceId}/${list.resourceName}`}
              alt=""
              className={classes.img}
            />
          ) : (
            <video
              src={`/api/file/preview/${list.resourceId}/${list.resourceName}`}
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
        </Badge>
      </div>
    </Box>
  );
};
export default VedioImgCreateFile;
