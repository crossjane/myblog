import React, { useEffect, useState } from "react";
import db from "./firebase";
import {
  doc,
  updateDoc,
  getDocs,
  collection,
  getDoc,
  addDoc,
  orderBy,
  query,
  deleteDoc,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function CategoriesDetail() {
  let navigate = useNavigate();

  const [board, setBoard] = useState([]);
  const [tempComment, setTempComment] = useState("");
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState();

  const { categoryId } = useParams();
  const { boardId } = useParams();

  function getMe() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user", user);
        const uid = user.uid;
        setUser(uid);
      } else {
        setUser("");
      }
    });
  }

  async function getBoard() {
    const docRef = doc(db, "category", categoryId, "board", boardId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const id = docSnap.id;
      const data = docSnap.data();
      const formatBoard = { id, ...data };

      // for (const newBoard of newBoards) {
      //   if (newBoard.uid) {
      //     const userRef = doc(db, "users", newBoard.uid);
      //     const userSnap = await getDoc(userRef);
      //     if (userSnap.exists()) {
      //       newBoard.user = { ...userSnap.data() };
      //     }
      //   }

      //   console.log("newBoard:", newBoard);
      // }

      setBoard(formatBoard);
    }
  }

  function changeComment(e) {
    setTempComment(e.target.value);
  }

  async function loadComment() {
    const q = query(
      collection(db, "category", categoryId, "board", boardId, "comment"),
      orderBy("createdAt", "asc")
    );
    const data = await getDocs(q);
    const newComments = [];
    data.forEach((doc) => {
      console.log(doc.data());
      const id = doc.id;
      const data = doc.data();
      const formatComment = { id, ...data, isEdit: false, tempComment: "" };
      newComments.push(formatComment);
    });
    setComments(newComments);
  }

  async function saveComment() {
    try {
      const commentRef = collection(
        db,
        "category",
        categoryId,
        "board",
        boardId,
        "comment"
      );

      const newComment = {
        content: tempComment,
        createdAt: new Date(),
      };
      await addDoc(commentRef, newComment);
      setTempComment("");

      setComments((prev) => [...prev, newComment]);
    } catch (error) {
      console.log("error", error);
      alert("댓글을 저장할 수 없습니다.");
    }
  }

  useEffect(() => {
    getMe();
    getBoard();
    loadComment();
  }, []);

  async function deleteComment(commentId) {
    try {
      await deleteDoc(
        doc(db, "category", categoryId, "board", boardId, "comment", commentId)
      );
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.log("error", error);
      alert("댓글을 삭제 할 수 없습니다.");
    }
  }

  function editComment(commentId) {
    const editedComment = comments.map((comment) =>
      comment.id === commentId
        ? { ...comment, isEdit: true, tempComment: comment.content }
        : comment
    );
    setComments(editedComment);
  }

  async function editSaveComment(commentId) {
    try {
      const docRef = doc(
        db,
        "category",
        categoryId,
        "board",
        boardId,
        "comment",
        commentId
      );
      await updateDoc(docRef, {
        content: tempComment,
      });
    } catch (error) {
      console.log("error", error);
      alert("댓글을 수정할 수 없습니다.");
    }

    loadComment();
    setTempComment("");
  }

  function changeEditComment(e, index) {
    const copyComments = [...comments];
    copyComments[index].tempComment = e.target.value;
    setComments(copyComments);
  }

  return (
    <div className="board-detail">
      <div key={board.id}></div>
      <div className="board-title">{board.title}</div>
      <div className="board-contents">{board.content}</div>
      <div className="board-contents">{user}</div>

      <div className="btns">
        <button onClick={() => navigate(`/categories`)}>목록으로 가기</button>
      </div>

      {comments.map((comment, index) =>
        comment.isEdit ? (
          <>
            <input
              type="text"
              value={comment.tempComment}
              onChange={(e) => changeEditComment(e, index)}
            />
            <button onClick={() => editSaveComment(comment.id)}>저장</button>
          </>
        ) : (
          <>
            <p key={comment.id}>
              {comment.content}
              <button onClick={() => deleteComment(comment.id)}>삭제</button>
              <button onClick={() => editComment(comment.id)}>수정</button>
            </p>
          </>
        )
      )}

      <div>
        <input type="text" value={tempComment} onChange={changeComment} />
        <button onClick={saveComment}>댓글 등록</button>
      </div>
    </div>
  );
}

export default CategoriesDetail;
