import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
  uid: "",
  user: null,
};

const reducers = {
  updateUid: (state, action) => {
    state.uid = action.payload;
  },
  updateUser: (state, action) => {
    console.log("action :", action);
    state.user = action.payload;
  },
};

const name = "user";
export const userSlice = createSlice({
  name,
  initialState,
  reducers,
});

const selectUserState = createSelector(
  (state) => state.uid,
  (state) => state.user,
  (uid, user) => {
    return {
      uid,
      user,
    };
  }
);

export const user = userSlice.name;
export const userReducer = userSlice.reducer;
export const userAction = userSlice.actions;

export const userSelector = {
  selectUser: (state) => {
    console.log("state", state);
    return selectUserState(state[user]);
  },
};
