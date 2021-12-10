import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import isEmpty from 'lodash/isEmpty';
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/styles/withStyles';

const ColorLinearProgress = withStyles({
  colorPrimary: {
    backgroundColor: '#b2dfdb',
  },
  barColorPrimary: {
    backgroundColor: '#00695c',
  },
})(LinearProgress);

const DropzoneFileContainer = (props: { file: File; deleteFile: Function }) => {
  const { file, deleteFile } = props;
  const { progress = 0 } = file as any;
  if (isEmpty(file)) {
    return <>无.</>;
  }
  return (
    <div style={{ padding: 4 }}>
      {progress !== 0 && (
        <ColorLinearProgress variant="determinate" value={progress} />
      )}
      <IconButton
        size="small"
        onClick={e => {
          e.stopPropagation();
          deleteFile(file);
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      <span>{file.name}</span>
    </div>
  );
};

export default DropzoneFileContainer;
