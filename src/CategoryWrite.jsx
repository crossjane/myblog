import { addDoc, collection, getDoc } from "firebase/firestore";
import "./App.css";
import React, { useEffect, useState } from "react";
import db from "./firebase";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function CategoryWrite() {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");

  let navigate = useNavigate();

  const { categoryId, boardId } = useParams();

  const [uid, setUid] = useState("");

  async function getMe() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUid(uid);
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
    uid && (
      <div className="board-detail">
        <div className="board-title">
          <input
            type="text"
            placeholder="제목을 입력해주세요."
            onChange={titleChange}
            value={title}
          />
        </div>
        <div className="board-contents">
          <input
            type="text"
            placeholder="내용을 입력해주세요."
            onChange={contentChange}
            value={contents}
          />
        </div>

        <button onClick={saveClick}>등록</button>
      </div>
    )
  );
}

export default CategoryWrite;
