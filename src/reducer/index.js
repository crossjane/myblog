import { combineReducers } from "@reduxjs/toolkit";
import { test, testReducer } from "../features/count/slice";
import { user, userReducer } from "../features/user/slice";

const rootReducer = (state, action) => {
  switch (action.type) {
    default: {
      const combinedReducer = combineReducers({
        [test]: testReducer,
        [user]: userReducer,
      });
      return combinedReducer(state, action);
    }
  }
};

export default rootReducer;
