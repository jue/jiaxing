import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';

const styles = (theme: Theme) => {
  return {
    thumbsContainer: {
      display: 'flex',
      flexDirection: 'row' as 'row',
      flexWrap: 'wrap' as 'wrap',
    },
    thumb: {
      display: 'inline-flex',
      borderRadius: 2,
      border: '1px solid #eaeaea',
      boxSizing: 'border-box' as 'border-box',
    },
    thumbInner: {
      minWidth: 0,
      overflow: 'hidden',
      position: 'relative' as 'relative',
      padding: theme.spacing(1),
      paddingRight: 40,
    },
    img: {
      display: 'block',
      width: 'auto',
      height: '100%',
    },
    closeButton: {
      position: 'absolute' as 'absolute',
      top: -5,
      right: -5,
    },
  };
};

const useStyles = makeStyles(styles);
export default useStyles;
