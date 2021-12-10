import BaseSvc from '../../services/BaseSvc';
import {
  SnackbarProvider,
  useSnackbar,
  SnackbarProviderProps,
} from 'notistack';

function Notifier() {
  const { enqueueSnackbar } = useSnackbar();
  BaseSvc.addNotification = (message, options = { variant: 'info' }) => {
    enqueueSnackbar(message, { autoHideDuration: 1500, ...options });
  };
  return null;
}

export default function NotifierWithProvider(
  props: Omit<SnackbarProviderProps, 'children'>
) {
  return (
    <SnackbarProvider maxSnack={3} preventDuplicate {...props}>
      <Notifier />
    </SnackbarProvider>
  );
}
