import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
  boards: [],
};

const reducers = {
  updateBoard: (state, action) => {
    state.boards = action.payload;
  },
};

const name = "board";
export const boardSlice = createSlice({
  name,
  initialState,
  reducers,
});

const selectBoardState = createSelector(
  (state) => state.boards,
  (boards) => {
    return {
      boards,
    };
  }
);

export const board = boardSlice.name;
export const boardReducer = boardSlice.reducer;
export const boardAction = boardSlice.actions;

export const boardSelector = {
  selectBoard: (state) => selectBoardState(state[board]),
};
