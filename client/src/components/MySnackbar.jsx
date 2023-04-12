import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { useSelector, useDispatch } from "react-redux";
import { hideSnackbar } from '../state';

const MySnackbar = () => {
  const dispatch = useDispatch();
  const { open, message, severity, autoHideDuration } = useSelector((state) => state.snackbar || {});

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(hideSnackbar());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'left' }}
      sx={{ top: 2, right: 2 }}
    >
      <MuiAlert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default MySnackbar;
