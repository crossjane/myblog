import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
  number: 0,
};

const reducers = {
  sumCount: (state, action) => {
    state.number = state.number + 1;
  },
};

const name = "test";
export const testSlice = createSlice({
  name,
  initialState,
  reducers,
});

const selectTestState = createSelector(
  (state) => state.number,
  (number) => {
    return {
      number,
    };
  }
);

export const test = testSlice.name;
export const testReducer = testSlice.reducer;
export const testAction = testSlice.actions;

export const testSelector = {
  selectTest: (state) => selectTestState(state[test]),
};
