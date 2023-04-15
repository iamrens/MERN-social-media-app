import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, useTheme, IconButton, TextField, useMediaQuery, CircularProgress } from "@mui/material";
import UserImage from './UserImage';
import { setPost, showSnackbar } from '../state';
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { formatDistanceToNow } from 'date-fns';

const dbApi = process.env.REACT_APP_DB_API;

const Comment = ({ userId, comment, postId, commentId, createdAt, updatedAt }) => {
    const token = useSelector((state) => state.token)
    const { _id } = useSelector((state) => state.user);
    const [user , setUser] = useState("");
    const dispatch = useDispatch();
    const { palette } = useTheme();
    const [updatedComment, setUpdatedComment] = useState(comment);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const smScreens = useMediaQuery("(min-width: 500px)");
    const smMaxScreens = useMediaQuery("(max-width: 500px)");

    const getUser = async () => {
        try {
          const response = await axios.get(`${dbApi}/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch (err) {
          console.error(err, err.response.data.message);
        }
    };

    useEffect(() => {
        getUser();
    }, [comment]); // eslint-disable-line react-hooks/exhaustive-deps

    // console.log(createdAt)

    const deleteComment = async () => {
      setIsLoading(true);
      try {
        const response = await axios.delete(`${dbApi}/posts/${postId}/comments/${commentId}`, 
          {
            headers: { Authorization: `Bearer ${token}`},
            data: {userId: userId}
          },
          
        );
        const updatedPost = response.data;
        dispatch(setPost({ post: updatedPost }));
        dispatch(showSnackbar({ open: true, message: 'Delete comment succesful.', severity: 'success', autoHideDuration: 3000 }));
        
      } catch (err) {
        console.log(err, err.response.data.message);
        dispatch(showSnackbar({ open: true, message: 'Error deleting comment!', severity: 'error', autoHideDuration: 3000 }));
      } finally {
        setIsLoading(false)
      }
    };

    const editComment = async () => {
      setIsLoading(true)
      try {
        const response = await axios.patch(`${dbApi}/posts/${postId}/comments/${commentId}`,
          { updatedComment: updatedComment, userId: userId, updatedAt: Date.now()}, 
          {
            headers: { Authorization: `Bearer ${token}`},
          },
          
        );
        const updatedPost = response.data;
        dispatch(setPost({ post: updatedPost }));
        dispatch(showSnackbar({ open: true, message: 'Edit comment succesful.', severity: 'success', autoHideDuration: 3000 }));
        
      } catch (err) {
        console.log(err, err.response.data.message);
        dispatch(showSnackbar({ open: true, message: 'Error editting comment!', severity: 'error', autoHideDuration: 3000 }));
      } finally {
        setIsEditing(false)
        setIsLoading(false)
      }
    };

    const handleEdit = () => {
      setIsEditing(true);
    };

    const handleCancel = () => {
      setIsEditing(false);
    };

  return (
    <Box sx={{display: 'flex', alignItems: 'center', py: 1, width: '100%',}}>
      <Box sx={{display: 'flex', alignItems: 'center', width: '80%'}}>

        <UserImage picturePath={user.picturePath} size="35px"/>

        <Box sx={{mx: 1.5, width: '90%'}}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography variant="h6" >{`${user.firstName} ${user.lastName}`}</Typography>
            {smScreens && 
              <Typography variant='body2' sx={{ color: palette.neutral.medium, wordWrap: "break-word", pl: 1.5}}>
                {formatDistanceToNow(new Date(updatedAt || createdAt))}
              </Typography>
            }
          </Box>
          { isEditing ? 
            <TextField
              onChange={e => setUpdatedComment(e.target.value)}
              defaultValue={updatedComment}
              multiline
              maxRows={4}
              size="small"
              autoComplete="off"
              fullWidth    
              sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '1rem',
                backgroundColor: palette.neutral.light
              }
              }}
            /> : 
            <>
              <Typography sx={{ color: palette.neutral.main, wordWrap: "break-word" }}>
                {comment}
              </Typography>
            </>
            } 
        </Box>
      </Box>

      <Box sx={{width: '20%'}}>
        {_id === userId &&
          isEditing ? 
          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end',}}>
            <IconButton onClick={editComment} disabled={isLoading} sx={{p: smMaxScreens ? 0.5 : 1, "&:hover": {bgcolor: palette.background.default}}}>
              {isLoading ? <CircularProgress size={24} sx={{color: palette.primary.main}}/> : <SaveIcon />}
            </IconButton>   
            <IconButton onClick={handleCancel} sx={{p: smMaxScreens ? 0.5 : 1,"&:hover": {bgcolor: palette.background.default}}}>
              <CancelIcon />
            </IconButton> 
          </Box> 
          :
          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end',}}>
            <IconButton onClick={handleEdit} sx={{p: smMaxScreens ? 0.5 : 1, "&:hover": {bgcolor: palette.background.default}}}>
              <EditIcon />
            </IconButton>   
            <IconButton onClick={deleteComment} disabled={isLoading} sx={{p: smMaxScreens ? 0.5 : 1, "&:hover": {bgcolor: palette.background.default}}}>
            {isLoading ? <CircularProgress size={24} sx={{color: palette.primary.main}}/> : <DeleteIcon />}
            </IconButton>    
          </Box>
        }
      </Box>
    </Box>
  )
};

export default Comment