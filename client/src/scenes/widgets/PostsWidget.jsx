import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, showSnackbar } from "../../state";
import PostWidget from "./PostWidget";
import axios from "axios";

const dbApi = process.env.REACT_APP_DB_API;

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    try {
      const response = await axios.get(`${dbApi}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.data;
      dispatch(setPosts({ posts: data }));
    } catch (err) {
      console.log(err, err.response.data.message);
      dispatch(showSnackbar({ open: true, message: 'Error fetching data!', severity: 'error', autoHideDuration: 3000 }));
    }
    
  };

  const getUserPosts = async () => {
    try {
      const response = await axios.get(`${dbApi}/posts/${userId}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.data;
      dispatch(setPosts({ posts: data }));
    } catch (err) {
      console.log(err, err.response.data.message);
      dispatch(showSnackbar({ open: true, message: 'Error fetching data!', severity: 'error', autoHideDuration: 3000 }));
    }
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
          createdAt
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
            createdAt={createdAt}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;