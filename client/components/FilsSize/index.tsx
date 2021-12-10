const getFileSize = fileByte => {
  let fileSizeByte = fileByte;
  let fileSizeMsg = '';
  if (fileSizeByte < 1048576) {
    fileSizeMsg = (fileSizeByte / 1024).toFixed(2) + 'K';
  } else if (fileSizeByte == 1048576) {
    fileSizeMsg = '1M';
  } else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824) {
    fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(2) + 'M';
  } else if (fileSizeByte > 1048576 && fileSizeByte == 1073741824) {
    fileSizeMsg = '1G';
  } else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776) {
    fileSizeMsg = (fileSizeByte / (1024 * 1024 * 1024)).toFixed(2) + 'G';
  } else {
    fileSizeMsg = '文件超过1T';
  }
  return fileSizeMsg;
};

export default getFileSize;
