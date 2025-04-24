import { createSelector, createSlice } from "@reduxjs/toolkit";

//uid 와 user가 실제 firebase에 있는 collection 명대로 가져오는건지?
const initialState = {
  uid: "",
  user: null,
};

//여기서 state? initial sate?
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

//state가 여기서 정확히 뭘 받는지? 전체state? collection전부?
