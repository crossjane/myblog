import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import db from "./firebase";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Components/Header";
import { userAction, userSelector } from "./features/user/slice";
import { categoryAction, categorySelector } from "./features/category/slice";
import { boardAction, boardSelector } from "./features/board/slice";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Pagination, PaginationItem } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

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
  // 현재 페이지지
  const [currentPage, setCurrentPage] = useState(1);
  const onPageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const items_per_page = 10;
  // 상태로로
  const indexOfLast = currentPage * items_per_page;
  const indexOfFirst = indexOfLast - items_per_page;
  // 상태로 해야됨됨
  const currentBoards = boards.slice(indexOfFirst, indexOfLast);

  async function loadCategories() {
    try {
      // collection 문서들이 있는 컬렉션 기준으로 . doc() 은 하나의

      const querySnapshot = await getDocs(collection(db, "category"));

      const newCategories = [];
      querySnapshot.forEach((doc) => {
        const id = doc.id;
        const data = doc.data();
        const formatCategory = {
          id,
          ...data,
          createdAt: data.createdAt?.toDate()?.toISOString() ?? null,
          isChecked: false,
        };

        newCategories.push(formatCategory);
      });
      if (newCategories.length > 0) {
        setTab(newCategories[0].id);
      }
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
        const q = query(
          collection(db, "category", tab, "board"),
          orderBy("createdAt", "desc")
        );
        const result = await getDocs(q);
        const newBoards = [];
        result.forEach((doc) => {
          const id = doc.id;
          const data = doc.data();

          const formatBoard = {
            id,
            ...data,
            createdAt: data.createdAt?.toDate()?.toISOString() ?? null,
          };

          newBoards.push(formatBoard);
        });

        for (const newBoard of newBoards) {
          const likeResult = await getDocs(
            collection(db, "category", tab, "board", newBoard.id, "like")
          );
          newBoard.likeCount = likeResult.size;
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
    navigate(`/categories/${tab}/board/${boardId}`);
  }

  function gotoWrite() {
    navigate(`/categories/${tab}/write`);
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
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    clickCategory();
  }, [tab]);

  return (
    <div className="flex flex-col">
      <Header user={user} />
      <nav className="flex flex-row items-center mb-6">
        <ul className="flex flex-row items-center gap-4 flex-1">
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
        <div className="flex flex-row items-center gap-2">
          <>
            <div className="relative group">
              <button
                className="w-7 h-auto cursor-pointer"
                onClick={() => {
                  if (user) {
                    gotoWrite();
                  } else {
                    alert("로그인 후 글쓰기가 가능합니다.");
                  }
                }}
              >
                <img src="/board_wirte.svg" alt="글쓰기기"></img>
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-500 text-white text-xs w-13 rounded py-1 px-2">
                글쓰기
              </div>
            </div>
          </>

          <Menu>
            <MenuButton className="focus:outline-none text-[#5F7D7D] text-[13px] px-2 py-1 cursor-pointer border-1 rounded boder-[#5F7D7D]">
              최신순 ▼
            </MenuButton>
            <MenuItems anchor="bottom">
              <MenuItem className="text-[#5F7D7D] text-[13px]">
                <a
                  className="cursor-pointer focus:outline-none focus-visible:outline-none block data-focus:bg-[#e6ecec] py-1 px-4 rounded "
                  // href="/settings"
                >
                  인기순
                </a>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </nav>

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
        <div className="flex flex-col cursor-pointer">
          {currentBoards.map((board) => (
            <div
              key={board.id}
              className="flex flex-col border-b border-gray-300 py-4"
              onClick={() => gotoDetail(board.id)}
            >
              <div className="flex mt-3 flex-row items-center mb-4">
                <h2 className="flex mr-3 font-medium text-[22px] text-gray-600 ">
                  {board.title}
                </h2>
                <span className="flex text-sm text-gray-500">
                  {board.createdAt
                    ? new Date(board.createdAt).toLocaleString()
                    : ""}
                </span>
              </div>

              <div className="flex flex-row flex-wrap">
                <div className="flex flex-1">
                  <p className="text-gray-700 text-[15px] line-clamp-3 leading-5 w-[95%] text-left">
                    {board.contents} <br />
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="mr-[3px]">{board.likeCount}</div>
                  <img src="/full_heart.svg" alt="빈하트" className="w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Pagination
        count={Math.ceil(boards.length / 10)}
        page={currentPage}
        onChange={onPageChange}
        size="medium"
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: "15px 0",
        }}
        renderItem={(item) => (
          <PaginationItem
            slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
            {...item}
          />
        )}
      />
    </div>
  );
}

export default Categories;
