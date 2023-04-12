import { ChatBubbleOutlineOutlined, FavoriteBorderOutlined, FavoriteOutlined, ShareOutlined } from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme, Button, CircularProgress, TextField, InputBase } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, showSnackbar } from "../../state";
import axios from "axios";
import Comment from "../../components/Comment";
  
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
  
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
  
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
  
    return (
      <WidgetWrapper m="0 0 2rem 0">
        <Friend
          friendId={postUserId}
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
        />
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
                  <Comment userId={comment.userId} comment={comment.comment} postId={postId} commentId={comment.commentId} createdAt={comment.createdAt}/>
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