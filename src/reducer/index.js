import { combineReducers } from "@reduxjs/toolkit";
import { test, testReducer } from "../features/count/slice";

const rootReducer = (state, action) => {
  switch (action.type) {
    default: {
      const combinedReducer = combineReducers({
        [test]: testReducer,
      });
      return combinedReducer(state, action);
    }
  }
};

export default rootReducer;
