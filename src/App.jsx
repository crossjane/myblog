import React from "react";
import { Routes, Route } from "react-router-dom";
import Board from "./Board";
import Todo from "./Todo";
import Write from "./Write";
import BoardDetail from "./BoardDetail";
import Categories from "./Categories";
import CategoriesDetail from "./CategoriesDetail";
import CategoryWrite from "./CategoryWrite";
import Join from "./Join";
import Login from "./Login";
import { Provider } from "react-redux";
import store from "./store/configureStore";
import Mypage from "./Mypage";

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="boards" element={<Board />} />
        <Route path="todo" element={<Todo />} />
        <Route path="write" element={<Write />} />
        <Route path="boards/:id" element={<BoardDetail />} />
        <Route path="categories" element={<Categories />} />
        <Route
          path="categories/:categoryId/board/:boardId"
          element={<CategoriesDetail />}
        />
        <Route
          path="categories/:categoryId/write"
          element={<CategoryWrite />}
        />
        <Route path="join" element={<Join />} />
        <Route path="login" element={<Login />} />
        <Route path="mypage" element={<Mypage />} />
      </Routes>
    </Provider>
  );
}

export default App;
