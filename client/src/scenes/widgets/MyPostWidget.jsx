import { EditOutlined, DeleteOutlined, AttachFileOutlined, GifBoxOutlined, ImageOutlined, MicOutlined } from "@mui/icons-material";
import { Box, Divider, Typography, InputBase, useTheme, Button, IconButton, useMediaQuery, CircularProgress, Tooltip } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "../../components/UserImage";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, showSnackbar } from "../../state";
import axios from "axios";

const dbApi = process.env.REACT_APP_DB_API;

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const smScreens = useMediaQuery("(min-width: 450px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handlePost = async () => {
    if (!post.trim()) {
      dispatch(showSnackbar({ open: true, message: 'Please enter a post!', severity: 'warning', autoHideDuration: 3000 }));
      return;
    }

    setIsLoading(true);
    dispatch(showSnackbar({ open: true, message: 'Posting...', severity: 'info', autoHideDuration: null }));
    try {
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("description", post);
      if (image) {
        formData.append("image", image);
      }

      // console.log(...formData);

      const response = await axios.post(`${dbApi}/posts`, 
      formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });

      const posts = response.data;
      dispatch(setPosts({ posts }));
      setImage(null);
      setPost("");

      dispatch(showSnackbar({ open: true, message: 'Post created successfully', severity: 'success', autoHideDuration: 3000 }));

    } catch (err) {
      console.log(err, err.response.data.message)
      // setError(err.response.data.message || 'An error occurred')
      dispatch(showSnackbar({ open: true, message: 'Failed to create post!', severity: 'error', autoHideDuration: 3000 }));
    } finally {
      setIsLoading(null);
    }
    
  };

  return (
    <WidgetWrapper mb="1.5rem">
      <FlexBetween gap="1.5rem">
        <UserImage picturePath={picturePath} />
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          multiline
          maxRows={4}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: smScreens ? "1rem 2rem" : "1rem",
          }}
        />
      </FlexBetween>
      {isImage && (
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
                    <Typography>Add Image Here</Typography>
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
        
      )}

      <Box>
        {error && <Typography variant="body1" color="error">{error}</Typography>}
      </Box>

      <Divider sx={{ margin: "1.25rem 0" }} />
      
      
      <FlexBetween>
        <Tooltip title="Upload image" placement="top">
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain, cursor: 'pointer' }} />
          {smScreens && <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>}
        </FlexBetween>
        </Tooltip>
        
        <Tooltip title="In development..." placement="top">
        <FlexBetween gap="0.25rem" >
          <GifBoxOutlined sx={{ color: mediumMain, cursor: 'pointer' }} />
          {smScreens && <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Clip
          </Typography>}
        </FlexBetween>
        </Tooltip>
        
        <Tooltip title="In development..." placement="top">
        <FlexBetween gap="0.25rem" >
          <AttachFileOutlined sx={{ color: mediumMain, cursor: 'pointer' }} />
          {smScreens && <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Attachment
          </Typography>}
        </FlexBetween>
        </Tooltip>
        
        <Tooltip title="In development..." placement="top">
        <FlexBetween gap="0.25rem" >
          <MicOutlined sx={{ color: mediumMain, cursor: 'pointer' }} />
          {smScreens && <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Audio
          </Typography>}
        </FlexBetween>
        </Tooltip>

        <Button
          disabled={!post || isLoading || !!error}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} sx={{color: palette.background.alt}}/>
          ) : (
            "POST"
          )}
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;