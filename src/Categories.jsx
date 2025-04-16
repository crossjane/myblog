import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import db from "./firebase";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

// 포인트 : category.id / board.id 각각 받아서 categoryid는 상태로 저장= > 상태로 받기 -> 보드id는 바로 이동
// 왜 목록으로 다시올때, ? 재로드 하면 loadCategory가 안됨
//콜백??

function Categories() {
  let navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [boards, setBoards] = useState([]);
  const [categoryId, setCategoryId] = useState();
  const [user, setUser] = useState();

  async function loadCategories() {
    try {
      const query = await getDocs(collection(db, "category"));
      const newCategories = [];
      query.forEach(async (doc) => {
        const id = doc.id;
        const data = doc.data();
        const formatCategory = { id, ...data, isChecked: false };

        newCategories.push(formatCategory);
      });

      setCategories(newCategories);

      if (newCategories.length > 0) {
        const firstCategoryId = newCategories[0].id;
        clickCategory(firstCategoryId);
      }
    } catch (error) {
      console.error("error", error);
      alert("데이터를 불러올 수 없습니다.");
    }
  }

  async function clickCategory(id) {
    setCategoryId(id);

    try {
      const query = await getDocs(collection(db, "category", id, "board"));
      const newBoards = [];
      query.forEach((doc) => {
        const id = doc.id;
        const data = doc.data();
        const formatBoard = { id, ...data };

        newBoards.push(formatBoard);
      });

      console.log(newBoards);

      for (const newBoard of newBoards) {
        if (newBoard.uid) {
          const userRef = doc(db, "users", newBoard.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            newBoard.user = { ...userSnap.data() };
          }
        }

        console.log("newBoard:", newBoard);
      }

      setBoards(newBoards);
    } catch (error) {
      console.error("error", error);
      alert("페이지로 이동할 수 없습니다.");
    }
  }

  function changeCheckbox(e, boardId) {
    const updatedBoards = boards.map((board) =>
      board.id === boardId ? { ...board, isChecked: e.target.checked } : board
    );

    setBoards(updatedBoards);
  }

  async function deleteBoards() {

    const deletedBoards = [];


    try {
      for (const board of boards) {
        if (board.isChecked) {
          await deleteDoc(doc(db, "category", categoryId, "board", board.id));
        } else {
          deletedBoards.push(board);
        }
      }

      setBoards(deletedBoards);
    } catch (error) {
      console.log("error", error);
      alert("삭제 할 수 없습니다.");
    }
  }

  function gotoDetail(boardId) {
    navigate(`/categories/${categoryId}/board/${boardId}`);
  }

  function gotoWrite() {
    navigate(`/categories/${categoryId}/write`);
  }

  function getMe() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        const uid = user.uid;
        setUser(uid);
      } else {
        setUser("");
      }
    });
  }

  async function logout() {
    try {
      const auth = getAuth();
      const result = await signOut(auth);
      alert("로그아웃되었습니다.");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    getMe();
    loadCategories();
  }, []);

  return (
    <div className="board">
      <button onClick={logout}>로그아웃</button>
      <div className="flex justify-center items-center mb-6">
        <b className="text-2xl text-green-800 font-semibold font-inter">
          Jane's Life
        </b>
      </div>
      <header>
        <div className="flex justify-center items-center mb-6">
          <ul className="flex gap-4">
            {categories.map((category) => {
              return (
                <li
                  key={category.id}
                  className={`px-4 py-2 rounded cursor-pointer 
                        ${
                          category.id === categoryId
                            ? "text-green-800 font-semibold"
                            : "text-gray-600 hover:text-green-700 hover:font-semibold"
                        }`}
                  onClick={() => clickCategory(category.id)}
                >
                  {category.name}
                </li>
              );
            })}
          </ul>
        </div>

        {user && (
          <div className="btns">
            <button
              className="bg-[rgb(219,230,222)] hover:bg-[rgb(155, 165, 158)] text-green-800 font-medium py-2 px-4 rounded-lg shadow-sm"
              onClick={deleteBoards}
            >
              삭제
            </button>
            <button
              className="bg-[rgb(219,230,222)] hover:bg-[rgb(219,230,222)] text-green-800 font-medium py-2 px-4 rounded-lg shadow-sm"
              onClick={gotoWrite}
            >
              글쓰기
            </button>
          </div>
        )}
      </header>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="w-[8%] px-6 py-3 text-left text-[13px] front-mediu text-gray-500 tracking-wider">
              선택
            </th>
            <th className="w-[10%] px-6 py-3 text-left text-[13px] font-medium text-gray-500 tracking-wider">
              id
            </th>
            <th className="w-[40%] px-6 py-3 text-left text-[13px] font-medium text-gray-500 tracking-wider">
              제목
            </th>
            <th className="w-[17%] px-6 py-3 text-left text-[13px] font-medium text-gray-500 tracking-wider">
              작성자
            </th>
            <th className="px-6 py-3 text-left text-[13px] font-medium text-gray-500 tracking-wider">
              등록일
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {boards.map((board) => (
            <tr key={board.id}>
              <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-900">
                <input
                  type="checkbox"
                  checked={board.isChecked}
                  onChange={(e) => changeCheckbox(e, board.id)}
                />
              </td>
              <td
                className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-900"
                onClick={() => gotoDetail(board.id)}
              >
                {board.id}
              </td>
              <td
                className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-900"
                onClick={() => gotoDetail(board.id)}
              >
                {board.title}
              </td>
              <td
                className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-900"
                onClick={() => gotoDetail(board.id)}
              >
                {board.user?.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Categories;
