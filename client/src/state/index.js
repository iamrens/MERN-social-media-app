import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  snackbar: {
    open: false,
    message: "",
    severity: "success",
    autoHideDuration: 3000,
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("User friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    showSnackbar: (state, action) => {
      state.snackbar.open = true;
      state.snackbar.message = action.payload.message;
      state.snackbar.severity = action.payload.severity;
      state.snackbar.autoHideDuration = action.payload.autoHideDuration;
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false;
      state.snackbar.message = "";
      state.snackbar.severity = "success";
    },
  },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost, showSnackbar, hideSnackbar } =
  authSlice.actions;
export default authSlice.reducer;