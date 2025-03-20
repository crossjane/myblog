import React from "react"
import { Routes, Route } from "react-router-dom";
import Board from "./Board";
import Todo from "./Todo";
import Write from "./Write";
import BoardDetail from "./BoardDetail";

function App() {




  return(
  <Routes>
     <Route path="boards" element={<Board />} />
     <Route path="todo" element={<Todo />} />
     <Route path="write" element={<Write />} />
     <Route path="boards/:id" element={<BoardDetail/>}/>
  </Routes>


  )


}



export default App
