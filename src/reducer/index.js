import { combineReducers } from "@reduxjs/toolkit";
import { test, testReducer } from "../features/count/slice";
import { user, userReducer } from "../features/user/slice";
import { category, categoryReducer } from "../features/category/slice";
import { board, boardReducer } from "../features/board/slice";

const rootReducer = (state, action) => {
  switch (action.type) {
    default: {
      const combinedReducer = combineReducers({
        [test]: testReducer,
        [user]: userReducer,
        [category]: categoryReducer,
        [board]: boardReducer,
      });
      return combinedReducer(state, action);
    }
  }
};

export default rootReducer;
