import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends, showSnackbar } from "../state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import axios from "axios";


const dbApi = process.env.REACT_APP_DB_API;

const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { _id, friends } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const [ isLoading, setIsLoading ] = useState(false);
    const isFriend = friends.find((friend) => friend._id === friendId);
  
    const { palette } = useTheme();
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;
  
    const addRemoveFriend = async () => {
        setIsLoading(true);
        try {
          const response = await axios.patch(`${dbApi}/users/${_id}/${friendId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.data;
          dispatch(setFriends({ friends: data }));

          const message = isFriend ? "Successfully remove from friendlist." : "Successfully added from friendlist."
          dispatch(showSnackbar({ open: true, message: message, severity: 'success', autoHideDuration: 3000 }));
        } catch (err) {
          console.log(err, err.response.data.message);
          const message = isFriend ? "Error removing friend!" : "Error adding friend!"
          dispatch(showSnackbar({ open: true, message: message, severity: 'error', autoHideDuration: 3000 }));
        } finally {
          setIsLoading(false);
        }
    };
  
    return (
      <FlexBetween>
        <FlexBetween gap="1rem">
          <UserImage picturePath={userPicturePath} size="55px" />
          <Box
            onClick={() => {
              navigate(`/profile/${friendId}`);
              navigate(0);
            }}
          >
            <Typography
              color={main}
              variant="h5"
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {name}
            </Typography>
            <Typography color={medium} fontSize="0.75rem">
              {subtitle}
            </Typography>
          </Box>
        </FlexBetween>
        {_id === friendId ? null :
         <IconButton
            onClick={() => addRemoveFriend()}
            disabled={isLoading}
            sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="primary" />
              ) : (isFriend ? (
                  <PersonRemoveOutlined sx={{ color: primaryDark }} />
              ) : (
                  <PersonAddOutlined sx={{ color: primaryDark }} />
              ))}
          </IconButton>}
      </FlexBetween>
    );
};
  
export default Friend;