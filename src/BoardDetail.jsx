import "./App.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import db from "./firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

function BoardDetail() {
  const navigate = useNavigate();

  const [board, setBoard] = useState();
  const [tempContent, setTempContent] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [comments, setComments] = useState([]);
  const [tempComment, setTempComment] = useState("");

  const { id } = useParams();

  async function getBoard() {
    const docRef = doc(db, "board", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const id = docSnap.id;
      const data = docSnap.data();
      const formatBoard = { id, ...data };
      setBoard(formatBoard);
    }
  }

  async function loadComments() {
    console.log("id", id);
    const query = await getDocs(collection(db, "board", id, "comments"));
    const newComments = [];
    query.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      const comment = { id, ...data };
      newComments.push(comment);
    });

    setComments(newComments);
  }

  function changeEditContent(e) {
    setTempContent(e.target.value);
  }

  function editContent() {
    // 수정 버튼 눌렀을때. => input으로 변하기 . tempContents상태
    setIsEdit(true);
    setTempContent(board.content);
  }

  async function editSave() {
    // 완료버튼 눌렀을떄 -> temp내용이 firebase로 등록됨.
    const docRef = doc(db, "board", board.id);
    await updateDoc(docRef, {
      content: tempContent,
    });
    setBoard({ ...board, content: tempContent });
    setIsEdit(false);
    setTempContent("");
  }

  function changeComment(e) {
    setTempComment(e.target.value);
  }

  async function saveComment() {
    const commentsRef = collection(db, "board", id, "comments");
    await addDoc(commentsRef, {
      comments: tempComment,
    });
    setTempComment("");
  }
  console.log("댓글", comments);

  useEffect(() => {
    getBoard();
    loadComments();
  }, []);

  return (
    <>
      <div className="w-[700px]">
        {board ? (
          <>
            <div className="board-title">{board.title}</div>
            <div className="board-contents">{board.content}</div>
          </>
        ) : null}

        <div className="w-[700px]">
          {isEdit ? (
            <>
              <input
                type="text"
                value={tempContent}
                onChange={changeEditContent}
                className="w-full max-w-[700px] h-[40px]"
              />
              <button onClick={editSave}>완료</button>
            </>
          ) : (
            <button onClick={editContent}>수정</button>
          )}
          <button onClick={() => navigate("/boards")}>목록으로 가기</button>
        </div>

        {comments ? (
          <div>
            {comments.map((comment) => (
              <p key={comment.id}>{comment.comments}</p>
            ))}
          </div>
        ) : null}
        <div>
          <input type="text" value={tempComment} onChange={changeComment} />
          <button onClick={saveComment}>댓글 등록</button>
        </div>
      </div>
    </>
  );
}

export default BoardDetail;
