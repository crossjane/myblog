import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import "./App.css";
import React, { useEffect, useState } from "react";
import db from "./firebase";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Header from "./Components/Header";
import { useDispatch, useSelector } from "react-redux";
import { userAction, userSelector } from "./features/user/slice";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

function CategoryWrite() {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");

  const dispatch = useDispatch();
  let navigate = useNavigate();

  const { categoryId, boardId } = useParams();

  // const [uid, setUid] = useState("");
  // const [user, setUser] = useState("");
  // 여기서 담긴 user의 정보? 모든 user의정보?
  const { uid, user } = useSelector(userSelector.selectUser);

  async function getMe() {
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
        alert("로그인 정보가 없습니다.");
        navigate("/login");
      }
    });
  }
  function titleChange(e) {
    setTitle(e.target.value);
  }

  function contentChange(e) {
    setContents(e.target.value);
  }

  async function saveClick() {
    try {
      const docRef = await addDoc(
        collection(db, "category", categoryId, "board"),
        { title, contents, uid }
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        navigate(
          `/categories/${categoryId}/board/${boardId ? boardId : docSnap.id}`
        );
      } else {
        alert("존재하지 않는 게시글 입니다.");
        return;
      }
    } catch (error) {
      console.log("error", error);
      alert("게시글을 저장할 수 없습니다.");
    }
  }

  useEffect(() => {
    getMe();
  }, []);

  return (
    <>
      <Header user={user} />
      {uid && (
        <div className="flex justify-center">
          <div className="container-board">
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
            <div className="board-detail mt-20 ">
              <div className="board-title">
                <input
                  className="flex focus:outline-none focus:border-none"
                  type="text"
                  placeholder="제목을 입력해주세요."
                  onChange={titleChange}
                  value={title}
                />
                <div className="board-title-line"></div>
              </div>
              <div className="board-contents min-h-100">
                <input
                  className="flex focus:outline-none focus:border-none"
                  type="text"
                  placeholder="내용을 입력해주세요."
                  onChange={contentChange}
                  value={contents}
                />
              </div>
            </div>
            <div className="flex justify-center mb-7">
              <button
                className="text-[14px] h-9 w-40 mt-10 rounded-4xl bg-[#5F7D7D] text-white hover:bg-[#435b5b] cursor-pointer"
                onClick={saveClick}
              >
                등록 하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CategoryWrite;
