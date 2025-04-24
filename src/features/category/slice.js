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

export const categorySelector = {
  selectCategories: (state) => selectCategoryState(state[category]),
};
