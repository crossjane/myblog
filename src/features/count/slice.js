import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
  number: 0,
  number2: 0,
  number3: 0,
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

const selectTestState2 = createSelector(
  (state) => state.number,
  (state) => state.number2,
  (number, number2) => {
    return {
      number,
      number2,
    };
  }
);

export const test = testSlice.name;
export const testReducer = testSlice.reducer;
export const testAction = testSlice.actions;

export const testSelector = {
  selectTest: (state) => selectTestState(state[test]),
  selectTest2: (state) => selectTestState2(state[test]),
};
