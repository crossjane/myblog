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
import Header from "./Components/Header";
import { useDispatch, useSelector } from "react-redux";
import { userAction, userSelector } from "./features/user/slice";

function CategoriesDetail() {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const [board, setBoard] = useState({});
  const [tempComment, setTempComment] = useState("");
  const [comments, setComments] = useState([]);
  const [detailIsEdit, setDetailIsEdit] = useState(false);
  const [tempDetail, setTempDetail] = useState("");
  const { categoryId } = useParams();
  const { boardId } = useParams();
  const { uid, user } = useSelector(userSelector.selectUser);

  //getMe로 로그인 정보를 가져오고 -> 리덕스(상태)에 해당 정보를 저장->
  // 근데 이건 getDoc? firebase에서 uid를 가져온다음에 저장해야되나?
  async function getMe() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        dispatch(userAction.updateUid(uid));
        dispatch(userAction.updateUser({ uid, ...userSnap.data() }));
      } else {
        dispatch(userAction.updateUid(null));
        dispatch(userAction.updateUser(null));
      }
    });
  }

  // 카테고리 아이디가 안오는것같음..왜?
  async function getBoard() {
    const docRef = doc(db, "category", categoryId, "board", boardId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const id = docSnap.id;
      const data = docSnap.data();
      const formatBoard = { id, ...data };

      console.log("doformatBoard", formatBoard);

      //board는 set이 안되어있을 가능성->
      const userRef = doc(db, "users", formatBoard.uid);
      const userSnap = await getDoc(userRef);

      console.log("userSnap", userSnap);

      if (userSnap.exists()) {
        formatBoard.user = { ...userSnap.data() };
      }

      setBoard(formatBoard);
      console.log("board", board);
    }
  }

  function changeComment(e) {
    setTempComment(e.target.value);
  }

  function changeDetail(e) {
    setTempDetail(e.target.value);
  }

  function detailEdit() {
    setDetailIsEdit(true);
    setTempDetail(board.contents);
  }

  async function detailDelete() {
    if (window.confirm("이 글을 정말 삭제 하시겠습니까?")) {
      try {
        await deleteDoc(doc(db, "category", categoryId, "board", boardId));
        alert("삭제완료");
        navigate("/categories");
      } catch (error) {
        console.log("error", error);
        alert("글을 삭제 할 수 없습니다.");
      }
    } else {
      alert("취소");
    }
  }

  async function detailEditSave() {
    try {
      const docRef = doc(db, "category", categoryId, "board", boardId);

      if (tempDetail.trim().length === 0) {
        alert("게시물 내용을 작성해주세요.");
        return;
      }

      await updateDoc(docRef, {
        contents: tempDetail,
      });

      setBoard((prev) => ({
        ...prev,
        contents: tempDetail,
      }));

      setDetailIsEdit(false);
    } catch (error) {
      console.log("error", error);
      alert("글을 수정할 수 없습니다.");
    }

    setTempDetail("");
  }

  async function loadComment() {
    const q = query(
      collection(db, "category", categoryId, "board", boardId, "comment"),
      orderBy("createdAt", "asc")
    );
    const data = await getDocs(q);
    const newComments = [];
    data.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();

      const formatComment = { id, ...data, isEdit: false, tempComment: "" };

      newComments.push(formatComment);
    });

    for (const newComment of newComments) {
      console.log("newComment", newComment);
      console.log("newComment.uid", newComment.uid);

      if (newComment.uid) {
        console.log("!!!!!!");
        const userRef = doc(db, "users", newComment.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          console.log("@@@@@@");
          newComment.user = { uid: userSnap.id, ...userSnap.data() };
          console.log("newComment.user", newComment.user);
        }
      }
    }
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

      if (tempComment.trim().length === 0) {
        alert("내용을 입력해주세요.");
        return;
      }

      const newComment = {
        content: tempComment,
        createdAt: new Date(),
        uid: user.uid,
      };

      //saveComent()에서 댓글 등록한 후 setComment에 새 댓글을 추가할떄 댓글 id값 부재
      const docRef = await addDoc(commentRef, newComment);

      const commentWithId = {
        id: docRef.id,
        ...newComment,
        isEdit: false,
        tempComment: "",
      };

      setTempComment("");
      setComments((prev) => [...prev, commentWithId]);
    } catch (error) {
      console.log("error", error);
      alert("댓글을 저장할 수 없습니다.");
    }
  }

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
      const comment = comments.find((comment) => comment.id === commentId);

      if (comment.tempComment.trim().length === 0) {
        alert("댓글 내용을 작성해주세요.");
        return;
      }

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
        content: comment.tempComment,
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

  useEffect(() => {
    getMe();
    getBoard();
    loadComment();
  }, []);

  return (
    <>
      <Header />

      <div className="flex flex-col bg-[#f6f6f6] shadow-xl rounded-2xl p-10 m-10">
        {/* z컨텐츠 */}
        <div>
          {/* 제목  */}
          <div className="flex flex-col pb-3 border-b border-gray-300">
            <div>
              <p className="text-left font-bold text-[20px] mb-4">
                {board.title}
              </p>
            </div>
            <div className="flex flex-row items-center">
              <div className="flex flex-1 gap-3 items-center">
                <span className=" text-[14px]"> {board.user?.name}이름</span>
                <span className="text-[14px]">2025-04-29</span>
              </div>
              <div>
                <img src="/empty_heart.svg" className="w-5" />
              </div>
            </div>
          </div>

          {/* 내용 */}
          <div className="flex flex-col min-h-80">
            {detailIsEdit ? (
              <input
                className="border-1 rounded-md"
                type="text"
                value={tempDetail}
                onChange={changeDetail}
              />
            ) : (
              <div className="justify-start text-left py-6">
                {board.contents}
              </div>
            )}
            <div className="flex">
              {detailIsEdit ? (
                <button
                  className="hover:font-medium cursor-pointer"
                  onClick={detailEditSave}
                >
                  수정완료
                </button>
              ) : user && user.uid === board.uid ? (
                <div className="text-[15px] pr-2 gap-2 flex justify-start ml-10 mb-2 cursor-pointer">
                  <button
                    className="hover:font-medium cursor-pointer"
                    onClick={detailEdit}
                  >
                    수정
                  </button>
                  <button
                    className="hover:font-medium cursor-pointer"
                    onClick={detailDelete}
                  >
                    삭제
                  </button>
                </div>
              ) : null}
              <div className="flex ml-auto justify-end mr-10 mb-2">
                <button
                  className="text-[15px] cursor-pointer hover:font-medium"
                  onClick={() => navigate(`/categories`)}
                >
                  목록으로 가기
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 댓글 목록 */}
        <div>
          <p className="font-medium text-left text-gray-600 mb-3 ml-1">댓글</p>
          <div className="bg-white border rounded border-gray-300 min-h-30">
            {comments.map((comment, index) =>
              comment.isEdit ? (
                <>
                  <input
                    type="text"
                    value={comment.tempComment}
                    onChange={(e) => changeEditComment(e, index)}
                  />
                  <button onClick={() => editSaveComment(comment.id)}>
                    저장
                  </button>
                </>
              ) : (
                <>
                  <div key={comment.id}>
                    <div className="px-4 py-2 flex flex-col min-h-8 rounded-md ">
                      <div className="text-left text-[15px] mr-2 ">
                        <div className="mt-2">
                          <strong className="text-gray-600 text-[13px]">
                            {" "}
                            {comment.user?.name}님
                          </strong>
                          <span className="ml-2 text-[12px] text-gray-500">
                            2025-04-30 18:00
                          </span>
                        </div>
                        <div className="flex flex-row items-center">
                          <div className="flex flex-1">
                            <span className="text-[13px]">
                              <br />
                              {comment.content}
                            </span>
                          </div>
                          <div className="flex justify-end gap-2 cursor-pointer">
                            <img src="/public/edit.svg" className="w-5"></img>
                            <img
                              src="/public/delete.svg"
                              className="w-3.5"
                            ></img>
                            <img
                              src="/public/empty_heart.svg"
                              className="w-5"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="w-full pb-2 border-b border-gray-300 " />
                    </div>

                    {comment.user && user === comment.user.uid ? (
                      <>
                        <button
                          className="bg-gray-200 hover:bg-[rgb(233,240,235)] hover:text-green-700 cursor-pointer text-[14px] text-gray-600 font-medium py-2 px-4 rounded-lg my-4 mx-2"
                          onClick={() => deleteComment(comment.id)}
                        >
                          삭제
                        </button>
                        <button
                          className="bg-gray-200 hover:bg-[rgb(233,240,235)] hover:text-green-700 cursor-pointer text-[14px] text-gray-600 font-medium py-2 px-4 rounded-lg"
                          onClick={() => editComment(comment.id)}
                        >
                          수정
                        </button>
                      </>
                    ) : null}
                  </div>
                </>
              )
            )}
          </div>
        </div>

        {/* 댓글 입력 */}
        <div></div>

        {/* 목록으로가기  */}
        <div></div>

        <div className="mt-10">
          {/* {user && <span>{user.name}</span>} */}

          <input
            className="bg-white border-gray-300 border-1 rounded-md h-8 w-[84%] mr-3  focus:outline-none"
            type="text"
            value={tempComment}
            onChange={changeComment}
          />
          <button
            className="h-8 w-25 text-[14px] rounded-md bg-[#5F7D7D] hover:bg-[#435b5b] cursor-pointer text-white"
            onClick={saveComment}
          >
            댓글 등록
          </button>
        </div>
      </div>
    </>
  );
}

export default CategoriesDetail;
