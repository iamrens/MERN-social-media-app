import { ChatBubbleOutlineOutlined, FavoriteBorderOutlined, FavoriteOutlined, ShareOutlined } from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme, Button, CircularProgress, TextField, InputBase } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, showSnackbar, setPosts } from "../../state";
import axios from "axios";
import Comment from "../../components/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { EditOutlined, DeleteOutlined } from "@mui/icons-material";
import Dropzone from "react-dropzone";
  
const dbApi = process.env.REACT_APP_DB_API;

const PostWidget = ({
    postId,
    postUserId,
    name,
    description,
    location,
    picturePath,
    userPicturePath,
    likes,
    comments,
}) => {
    const [isComments, setIsComments] = useState(false);
    const [comment , setComment] = useState("");
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);
    const [isLiked, setIsLiked] = useState(Boolean(likes[loggedInUserId]));
    const likeCount = Object.keys(likes).length;
    const [isLoading, setIsLoading] = useState(false);
    const [editPost, setEditPost] = useState(description);
    const [image, setImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(false);

    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
    const medium = palette.neutral.medium;
  
    const patchLike = async () => {
      try {
        const response = await axios.patch(`${dbApi}/posts/${postId}/like`,
          { userId: loggedInUserId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const updatedPost = response.data;
        dispatch(setPost({ post: updatedPost }));

        setIsLiked(!isLiked);
        const message = isLiked ? 'You disliked the post.' : 'You liked the post.';
        dispatch(showSnackbar({ open: true, message, severity: 'info', autoHideDuration: 3000 }));
      } catch (err) {
        console.log(err, err.response.data.message);
        const message = isLiked ? 'Error disliking the post!' : 'Error liking the post!';
        dispatch(showSnackbar({ open: true, message: message, severity: 'error', autoHideDuration: 3000 }));
      }
    };

    const postComment = async () => {
      if (!comment.trim()) {
        dispatch(showSnackbar({ open: true, message: 'Please enter a comment!', severity: 'warning', autoHideDuration: 3000 }));
        return;
      }
      setIsLoading(true);

      try {
        const response = await axios.post(`${dbApi}/posts/${postId}/comments`, 
          { userId: loggedInUserId, comment: comment},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )

        const updatedPost = response.data;
        // console.log(updatedPost)

        dispatch(setPost({ post: updatedPost }));
        setComment("");
        dispatch(showSnackbar({ open: true, message: 'Comment added successfully.', severity: 'success', autoHideDuration: 3000 }));

      } catch (err) {
        console.log(err, err.response.data.message);
        dispatch(showSnackbar({ open: true, message: 'Error posting comment!', severity: 'error', autoHideDuration: 3000 }));
      } finally {
        setIsLoading(false)
      }
    };

    const deletePost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.delete(`${dbApi}/posts/${postId}`, 
          {
            headers: { Authorization: `Bearer ${token}`},
            data: {userId: postUserId}
          },
          
        );
        const posts = response.data;
        dispatch(setPosts({ posts }));
        dispatch(showSnackbar({ open: true, message: 'Delete post succesful.', severity: 'success', autoHideDuration: 3000 }));
        
      } catch (err) {
        console.log(err, err.response.data.message);
        dispatch(showSnackbar({ open: true, message: 'Error deleting post!', severity: 'error', autoHideDuration: 3000 }));
      } finally {
        setIsLoading(false)
      }
    };

    const updatePost = async () => {
      if (!editPost.trim()) {
        dispatch(showSnackbar({ open: true, message: 'Please enter a post!', severity: 'warning', autoHideDuration: 3000 }));
        return;
      }

      setIsLoading(true);
      dispatch(showSnackbar({ open: true, message: 'Editing...', severity: 'info', autoHideDuration: null }));

      try {
        const formData = new FormData();
        formData.append("userId", loggedInUserId);
        formData.append("description", editPost);
        if (image) {
          formData.append("image", image);
        }
        // console.log(...formData)
        // console.log(postUserId)
        const response = await axios.patch(`${dbApi}/posts/${postId}`,
          formData, {
            headers: { 
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            },
          }
        );
        const updatedPost = response.data;
        dispatch(setPost({ post: updatedPost }));
        dispatch(showSnackbar({ open: true, message: 'Edit post succesful.', severity: 'success', autoHideDuration: 3000 }));
        
      } catch (err) {
        console.log(err, err.response.data.message);
        dispatch(showSnackbar({ open: true, message: 'Error editting post!', severity: 'error', autoHideDuration: 3000 }));
      } finally {
        setIsLoading(false)
        setIsEditing(false)
      }
    };

    const handleEdit = () => {
      setIsEditing(true);
      setEditPost(description)
    };

    const handleCancel = () => {
      setIsEditing(false);
      setEditPost(null)
    };
  
    return (
      <WidgetWrapper m="0 0 2rem 0">
        {loggedInUserId === postUserId ? 
          <FlexBetween>
            <Friend
              friendId={postUserId}
              name={name}
              subtitle={location}
              userPicturePath={userPicturePath}
            />
            <Box sx={{display: 'flex', alignItems: 'center'}}>
            {isEditing ? 
              <>
                <IconButton 
                  onClick={updatePost}
                  sx={{ "&:hover": {bgcolor: palette.background.default} }}
                >
                  {isLoading ? <CircularProgress size={24} color="primary" /> : <SaveIcon />}
                </IconButton>
                <IconButton
                  onClick={handleCancel}
                  disabled={isLoading}
                  sx={{ "&:hover": {bgcolor: palette.background.default} }}
                >
                  {isLoading ? <CircularProgress size={24} color="primary" /> : <CancelIcon />}
                </IconButton>
              </>
            :
            <>
              <IconButton 
                onClick={handleEdit}
                sx={{ "&:hover": {bgcolor: palette.background.default} }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={deletePost}
                disabled={isLoading}
                sx={{ "&:hover": {bgcolor: palette.background.default} }}
              >
                {isLoading ? <CircularProgress size={24} color="primary" /> : <DeleteIcon />}
              </IconButton>
            </>
            }
          </Box> 
          </FlexBetween>
        :
          <Box>
          <Friend
            friendId={postUserId}
            name={name}
            subtitle={location}
            userPicturePath={userPicturePath}
            postId={postId}
            updatePost={updatePost}
          />
          </Box>
        }
        {isEditing ? 
          <Box sx={{mt: "1rem"}}>
            <InputBase
              placeholder="Edit you post..."
              onChange={(e) => setEditPost(e.target.value)}
              value={editPost}
              multiline
              maxRows={4}
              sx={{
                width: "100%",
                backgroundColor: palette.neutral.light,
                borderRadius: "2rem",
                p: "1rem"
              }}
            />
            <Box
              border={`1px solid ${medium}`}
              borderRadius="5px"
              mt="1rem"
              p="1rem"
            >
              <Dropzone
                accept={{ 
                  "image/jpeg": [".jpg", ".jpeg"],
                  "image/png": [".png"],
                  "image/jpg": [".jpg", ".jpeg"]
                }}
                validator={file => {
                  if (file.size > 2097152) {
                    setError("Image must be less than 2mb")
                  } else {
                    setError(false)
                  }
                }}
                multiple={false}
                onDrop={(acceptedFiles) => {
                  setImage(acceptedFiles[0]);
                  // setError(null);
                }}
                onDropRejected={(rejectedFiles) => setError("Invalid image format")}
              >
                {({ getRootProps, getInputProps }) => (
                  <FlexBetween>
                    <Box
                      {...getRootProps()}
                      border={`2px dashed ${palette.primary.main}`}
                      p="1.5rem 1rem"
                      width="100%"
                      sx={{ "&:hover": { cursor: "pointer" } }}
                    >
                      <input {...getInputProps()} />
                      {!image ? (
                        <Typography>Add/Change Image Here</Typography>
                      ) : (
                        <FlexBetween>
                          <Typography>{image.name}</Typography>
                          <EditOutlined sx={{fontSize: "1.5rem"}}/>
                        </FlexBetween>
                      )}
                    </Box>
                    {image && (
                      <IconButton
                        onClick={() => {
                          setImage(null);
                          setError(false);
                        }}
                      >
                        <DeleteOutlined sx={{fontSize: "1.5rem"}}/>
                      </IconButton>
                    )}
                  </FlexBetween>
                )}
              </Dropzone>
            </Box>
            <Box>
              {error && <Typography variant="body1" color="error">{error}</Typography>}
            </Box>
          </Box>
        :
          <>
            <Typography color={main} sx={{ mt: "1rem" }}>
              {description}
            </Typography>
            {picturePath && (
              <img
                width="100%"
                height="auto"
                alt="post"
                style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
                src={`${picturePath}`}
              />
            )}
          </>
        }
        <FlexBetween mt="0.5rem">
          <FlexBetween gap="1rem">
            <FlexBetween gap="0.3rem">
              <IconButton onClick={patchLike}>
                {isLiked ? (
                  <FavoriteOutlined sx={{ color: primary }} />
                ) : (
                  <FavoriteBorderOutlined />
                )}
              </IconButton>
              <Typography>{likeCount}</Typography>
            </FlexBetween>
  
            <FlexBetween gap="0.3rem">
              <IconButton onClick={() => setIsComments(!isComments)}>
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{comments.length}</Typography>
            </FlexBetween>
          </FlexBetween>
  
          <IconButton>
            <ShareOutlined />
          </IconButton>
        </FlexBetween>
        <Box>
        {isComments && (
          <Box mt="0.5rem" sx={{width: "100%"}}>
            {comments.map((comment, i) => (
              <Box key={`${name}-${i}`}>
                <Divider />
                  <Comment 
                    userId={comment.userId} 
                    comment={comment.comment} 
                    postId={postId} 
                    commentId={comment.commentId} 
                    createdAt={comment.createdAt}
                    updatedAt={comment.updatedAt}
                  />
              </Box>
            ))}
            <Divider />
            <FlexBetween mt="1rem">
              <TextField
                placeholder="Write a comment ..."
                onChange={e => setComment(e.target.value)}
                value={comment}
                multiline
                maxRows={4}
                size="small"
                autoComplete="off"    
                sx={{
                  width: "100%",
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '1rem',
                    backgroundColor: palette.neutral.light
                  }
                }}
              />
              <Button
                disabled={!comment || isLoading}
                onClick={postComment}
                sx={{
                  color: palette.background.alt,
                  ml:"0.5rem",
                  backgroundColor: palette.primary.main,
                  borderRadius: "3rem",
                  fontSize: "14px",
                  "&:hover":{
                    cursor:"pointer",
                    color: palette.background.alt,
                    backgroundColor: palette.primary.main,
                  }
                }}
              >
                {isLoading ? <CircularProgress size={24} sx={{color: palette.background.alt}}/> : "ADD" }
            </Button>
            </FlexBetween>
          </Box>
        )}
        </Box>
      </WidgetWrapper>
    );
};
  
export default PostWidget;