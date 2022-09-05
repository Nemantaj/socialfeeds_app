import { createSlice } from "@reduxjs/toolkit";

const initialPosts = {
  storedPosts: [],
  storedStories: [],
  postsCount: 0,
  renderPosts: 0,
  renderStory: 0,
};

const postSlice = createSlice({
  name: "posts",
  initialState: initialPosts,
  reducers: {
    setStoredPosts(state, action) {
      state.storedPosts = action.payload;
    },
    setStoredStories(state, action) {
      state.storedStories = action.payload;
    },
    setRender(state) {
      state.renderPosts = state.renderPosts + 1;
    },
    setRenderStory(state) {
      state.renderStory = state.renderStory + 1;
    },
  },
});

export const postActions = postSlice.actions;

export default postSlice.reducer;
