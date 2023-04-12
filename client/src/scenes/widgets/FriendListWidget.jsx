import { Box, Typography, useTheme, Divider } from "@mui/material";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../state";

const dbApi = process.env.REACT_APP_DB_API;

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const getFriends = async () => {
    const response = await fetch(
      `${dbApi}/users/${userId}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  useEffect(() => {
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "0.5rem" }}
      >
        Friend List
      </Typography>

      <Divider />

      {friends.length > 0 ? (
        <Box display="flex" flexDirection="column" gap="1.5rem" mt="1rem">
          {friends.map((friend) => (
            <Friend
              key={`friend_${friend._id}`}
              friendId={friend._id}
              name={`${friend.firstName} ${friend.lastName}`}
              subtitle={friend.occupation}
              userPicturePath={friend.picturePath}
            />
          ))}
        </Box>
      ) : (
        <Typography color={palette.neutral.main} variant="body1" sx={{mt: '1rem', fontStyle: 'italic'}}>
          No friends yet
        </Typography>
      )}
    </WidgetWrapper>
  );
};

export default FriendListWidget;