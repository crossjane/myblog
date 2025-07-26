import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
};

const reducers = {
  updateCategories: (state, action) => {
    state.categories = action.payload;
  },
};

const name = "category";
export const categorySlice = createSlice({
  name,
  initialState,
  reducers,
});

const selectCategoryState = createSelector(
  (state) => state.categories,
  (categories) => {
    return {
      categories,
    };
  }
);

export const category = categorySlice.name;
export const categoryReducer = categorySlice.reducer;
export const categoryAction = categorySlice.actions;

// Redux store에서 category 관련상태를 꺼내서 가져오는 함수 
export const categorySelector = {
  selectCategories: (state) => selectCategoryState(state[category]),
};
