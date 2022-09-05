import { createSlice } from "@reduxjs/toolkit";

const initialApp = {
  storedNotifs: [],
  notifsCount: 0,
  notifUnread: 0,
  reRenderHelper: 0,
  renderCounter: 0,
  msgUnread: 0,
  msgNav: 0,
  messageRender: 0,
};

const appSlice = createSlice({
  name: "app",
  initialState: initialApp,
  reducers: {
    setStoredNotif(state, action) {
      state.storedNotifs = action.payload;
    },
    setCount(state, action) {
      state.notifsCount = action.payload;
    },
    setUnreadZero(state) {
      state.notifUnread = 0;
    },
    setUnread(state) {
      state.notifUnread = state.notifUnread + 1;
    },
    renderHelper(state) {
      state.reRenderHelper = state.reRenderHelper + 1;
    },
    renderCount(state) {
      state.renderCounter = state.renderCounter + 1;
    },
    setMessageUnread(state, action) {
      state.msgUnread = action.payload;
    },
    setMessageNav(state, action) {
      state.msgNav = action.payload;
    },
    messageRender(state) {
      state.messageRender = state.messageRender + 1;
    },
  },
});

export const appActions = appSlice.actions;

export default appSlice.reducer;
