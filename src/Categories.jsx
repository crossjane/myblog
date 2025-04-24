import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import db from "./firebase";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Components/Header";
import { userAction, userSelector } from "./features/user/slice";
import { categoryAction, categorySelector } from "./features/category/slice";
import { boardAction, boardSelector } from "./features/board/slice";

// 포인트 : category.id / board.id 각각 받아서 categoryid는 상태로 저장= > 상태로 받기 -> 보드id는 바로 이동
// 왜 목록으로 다시올때, ? 재로드 하면 loadCategory가 안됨
//콜백??

function Categories() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const [boardLoading, setBoardLoading] = useState(false);
  const [categoryId, setCategoryId] = useState();
  const [tab, setTab] = useState("OfLdJf7dkBswF0756yBw");
  const { user } = useSelector(userSelector.selectUser);
  const { categories } = useSelector(categorySelector.selectCategories);
  const { boards } = useSelector(boardSelector.selectBoard);

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
      dispatch(categoryAction.updateCategories(newCategories));
    } catch (error) {
      console.error("error", error);
      alert("데이터를 불러올 수 없습니다.");
    }
  }

  async function clickCategory() {
    console.log(tab);
    if (tab) {
      setBoardLoading(true);

      try {
        const query = await getDocs(collection(db, "category", tab, "board"));
        const newBoards = [];
        query.forEach((doc) => {
          const id = doc.id;
          const data = doc.data();
          const formatBoard = { id, ...data };

          newBoards.push(formatBoard);
        });

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

        dispatch(boardAction.updateBoard(newBoards));

        setBoardLoading(false);
      } catch (error) {
        console.error("error", error);
        alert("페이지로 이동할 수 없습니다.");
      }
    }
  }

  function changeCheckbox(e, boardId) {
    const updatedBoards = boards.map((board) =>
      board.id === boardId ? { ...board, isChecked: e.target.checked } : board
    );

    dispatch(boardAction.updateBoard(updatedBoards));
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
      dispatch(boardAction.updateBoard(deletedBoards));
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
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          dispatch(userAction.updateUid(uid));
          dispatch(userAction.updateUser({ uid, ...userSnap.data() }));
        }
      } else {
        dispatch(userAction.updateUid(null));
        dispatch(userAction.updateUser(null));
      }
    });
  }

  useEffect(() => {
    getMe();
    loadCategories();
  }, []);

  useEffect(() => {
    console.log("searchParams.get: ", searchParams.get("tab"));
    setTab(searchParams.get("tab"));
  }, [searchParams.get("tab")]);

  useEffect(() => {
    clickCategory();
  }, [tab]);

  return (
    <div className="board">
      <Header user={user} />
      <header>
        <div className="flex justify-center items-center mb-6">
          <ul className="flex gap-4">
            {categories.map((category) => {
              return (
                <li
                  key={category.id}
                  className={`px-4 py-2 rounded cursor-pointer 
                        ${
                          category.id === tab
                            ? "text-green-800 font-semibold"
                            : "text-gray-600 hover:text-green-700 hover:font-semibold"
                        }`}
                  onClick={() => navigate(`/categories?tab=${category.id}`)}
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

      {boardLoading ? (
        <div role="status">
          <svg
            aria-hidden="true"
            class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="w-[8%] px-6 py-3 text-left text-[13px] front-mediu text-gray-500 tracking-wider">
                선택
              </th>
              <th className="w-[20%] px-6 py-3 text-left text-[13px] font-medium text-gray-500 tracking-wider">
                id
              </th>
              <th className="w-[40%] px-6 py-3 text-left text-[13px] font-medium text-gray-500 tracking-wider">
                제목
              </th>
              <th className="w-[17%] px-6 py-3 text-left text-[13px] font-medium text-gray-500 tracking-wider">
                작성자
              </th>
              <th className="px-6 w-[15%] py-3 text-left text-[13px] font-medium text-gray-500 tracking-wider">
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
      )}
    </div>
  );
}

export default Categories;
