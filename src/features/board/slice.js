import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
  boards: [],
};

const reducers = {
  updateBoard: (state, action) => {
    // Array.isArray(값) => 자바스크립트의 내장 함수 : 그 값이 배열이면 true, 배열이 아니면 false를 반환 .
    if (Array.isArray(action.payload)) {
      state.boards = action.payload; // 전체 덮어쓰기
    } else {
      // 특정 글 반환 (글 수정후 특정 글만 업데이트 할때.)
      const index = state.boards.findIndex(
        (board) => board.id === action.payload.id
      );

      // findIndex 는 찾지 못하면 -1반환.
      if (index !== -1) {
        state.boards[index] = {
          ...state.board[index],
          ...action.payload,
        };
      }

      // state.boards = action.payload;
    }
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
