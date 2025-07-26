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
  where,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Header from "./Components/Header";
import { useDispatch, useSelector } from "react-redux";
import { userAction, userSelector } from "./features/user/slice";
import ReadonlyEditor from "./Components/Editor/ReadonlyEditor";
import { Editor } from "./Components/Editor";
import { boardAction } from "./features/board/slice";

function CategoriesDetail() {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const [board, setBoard] = useState({});
  const [tempComment, setTempComment] = useState("");
  const [comments, setComments] = useState([]);
  const [detailIsEdit, setDetailIsEdit] = useState(false);
  const [tempDetailText, setTempDetailText] = useState("");
  const [tempDetailHtml, setTempDetailHtml] = useState("");
  const [tempTitle, setTempTitle] = useState("");
  const { categoryId, boardId } = useParams();
  const { user } = useSelector(userSelector.selectUser);

  async function getMe() {
    const auth = getAuth();
    // 현재 로그인한 사용자 가져오기기
    // 근데 redux에 저장하면 - > 어디서 씀 ? 그냥 카테고리 에서 저장한번하면 여기서는 리덕스에서 가져오기만하면되는것아닌가
    // 페이지안에서 로그인할 수도 있기때문인가?
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

  async function getBoard() {
    const docRef = doc(db, "category", categoryId, "board", boardId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const id = docSnap.id;
      const data = docSnap.data();
      const formatBoard = {
        id,
        ...data,
        createdAt: data.createdAt?.toDate() ?? null,
      };

      // formatBoard에 업로드한 format uid를 가져와서 해당 게시글의 작성자 정보를 게시글에 붙이기기
      // 게시물정보 (board)에는 uid와 title. content  create정보만 있기 때문에 이름등을 가져오기 위해.
      // uid 는 자동생성되는데 이것은 firebase의 기능이고 실제 데이터에서는 id를 써야 하는 것이 맞는지지
      const userRef = doc(db, "users", formatBoard.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        formatBoard.user = { ...userSnap.data() };
      }

      if (user) {
        formatBoard.likeId = "";

        const q = query(
          collection(db, "category", categoryId, "board", boardId, "like"),
          where("uid", "==", user.uid)
        );
        const data = await getDocs(q);
        data.forEach((doc) => {
          formatBoard.likeId = doc.id;
          return;
        });
      }

      if (user) {
        formatBoard.bookmarkId = "";

        const q = query(
          collection(db, "category", categoryId, "board", boardId, "bookmark"),
          where("uid", "==", user.uid)
        );
        const data = await getDocs(q);
        data.forEach((doc) => {
          formatBoard.bookmarkId = doc.id;
          return;
        });
      }

      setBoard(formatBoard);
      console.log("formatboard!!!", formatBoard);
    }
  }

  function changeComment(e) {
    setTempComment(e.target.value);
  }

  function changeDetail(e) {
    setTempDetailHtml(e.target.value);
  }

  function changeTitle(e) {
    setTempTitle(e.target.value);
  }

  function detailEdit() {
    console.log("보드!!!", board);
    setDetailIsEdit(true);
    setTempDetailHtml(board.contents);
    setTempTitle(board.title);
    setTempDetailText(board.withoutHtml);
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

  async function bookmark() {
    try {
      //클릭 시, addDoc 으로 firebase에 들어가야함.
      //이때, bookmark id로 관리 되어야 함
      // 그리고 북마크 이미지 전환.
      //북마크 id를 생성, -> board에 넣음 (formatedData-> setBoard)
      if (!board.bookmarkId) {
        const bookmarkRef = collection(
          db,
          "category",
          categoryId,
          "board",
          boardId,
          "bookmark"
        );

        // 어느 유저가가 북마크 했는지 식별위함
        // 현재 로그인한 유저의 uid
        const newLike = {
          uid: user.uid,
        };

        const docRef = await addDoc(bookmarkRef, newLike);
        //  북마크한 고유id를 board에 저장.
        setBoard({ ...board, bookmarkId: docRef.id });
        return;
      }

      await deleteDoc(
        doc(
          db,
          "category",
          categoryId,
          "board",
          boardId,
          "bookmark",
          board.bookmarkId
        )
      );
      setBoard({ ...board, bookmarkId: "" });
    } catch (error) {
      console.log("bookmark error", error);
      alert("북마크를 할 수 없습니다.");
    }
  }

  async function like() {
    try {
      //눌러진 like 가 없다면 newLike add, like 수 증가.
      //like count :board 에 likecount 생성 해서 저장 -> 증가/ 감소 시키기
      //
      if (!board.likeId) {
        const likeRef = collection(
          db,
          "category",
          categoryId,
          "board",
          boardId,
          "like"
        );

        const newLike = {
          uid: user.uid,
          // likeCount: 원래있는 갯수에서 +1을 더해야함
          //라이크 갯수를 어케샘 ?like의갯수
          // likeCount: likeRef.length +1 ? like는 배열 .
        };

        const docRef = await addDoc(likeRef, newLike);
        setBoard((prev) => ({ ...prev, likeId: docRef.id }));
        return;
      }

      await deleteDoc(
        doc(db, "category", categoryId, "board", boardId, "like", board.likeId)
      );
      setBoard({ ...board, likeId: "" });
    } catch (error) {
      console.log("error", error);
      alert("좋아요를 누를 수 없습니다.");
    }
  }

  async function commentLike(commentId) {
    try {
      const commentIndex = comments.findIndex(
        (comment) => commentId === comment.id
      );

      const likeComment = comments[commentIndex];
      const copyComments = [...comments];

      if (!likeComment.likeId) {
        const likeRef = collection(
          db,
          "category",
          categoryId,
          "board",
          boardId,
          "comment",
          commentId,
          "like"
        );

        const newLike = {
          uid: user.uid,
        };

        const docRef = await addDoc(likeRef, newLike);

        copyComments[commentIndex].likeId = docRef.id;
      } else {
        await deleteDoc(
          doc(
            db,
            "category",
            categoryId,
            "board",
            boardId,
            "comment",
            commentId,
            "like",
            likeComment.likeId
          )
        );

        copyComments[commentIndex].likeId = "";
      }

      setComments(copyComments);
    } catch (error) {
      console.log("error", error);
      alert("좋아요를 누를 수 없습니다.");
    }
  }

  console.log("크리에이티드at", board.createdAt);
  async function detailEditSave() {
    try {
      const docRef = doc(db, "category", categoryId, "board", boardId);

      if (tempDetailHtml.trim().length === 0) {
        alert("게시물 내용을 작성해주세요.");
        return;
      }

      await updateDoc(docRef, {
        contents: tempDetailHtml,
        withoutHtml: tempDetailText,
        title: tempTitle,
      });

      setBoard((prev) => ({
        ...prev,
        title: tempTitle,
        contents: tempDetailHtml,
        withoutHtml: tempDetailText,
      }));

      setDetailIsEdit(false);

      console.log("🔥 dispatch payload", {
        id: boardId,
        contents: tempDetailHtml,
        withoutHtml: tempDetailText,
        title: tempTitle,
      });

      dispatch(
        boardAction.updateBoard({
          id: boardId,
          contents: tempDetailHtml,
          withoutHtml: tempDetailText,
          title: tempTitle,
        })
      );
    } catch (error) {
      console.log("🔥 updateDoc error:", error.message, error.code, error);
      alert("글을 수정할 수 없습니다.");
    }

    setTempDetailText("");
    setTempDetailHtml("");
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

      const formatComment = {
        id,
        ...data,
        isEdit: false,
        tempComment: "",
        likeId: "",
        bookmarkId: "",
      };

      newComments.push(formatComment);
    });

    for (const newComment of newComments) {
      if (newComment.uid) {
        const userRef = doc(db, "users", newComment.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          newComment.user = { uid: userSnap.id, ...userSnap.data() };
        }
      }

      // 반복된 코드 정리 가능한지...?

      if (user) {
        const q = query(
          collection(
            db,
            "category",
            categoryId,
            "board",
            boardId,
            "comment",
            newComment.id,
            "like"
          ),
          where("uid", "==", user.uid)
        );

        const result = await getDocs(q);
        result.forEach((doc) => {
          newComment.likeId = doc.id;
        });
      }

      if (user) {
        const q2 = query(
          collection(
            db,
            "category",
            categoryId,
            "board",
            boardId,
            "comment",
            newComment.id,
            "bookmark"
          ),
          where("uid", "==", user.uid)
        );

        const result2 = await getDocs(q2);
        result2.forEach((doc) => {
          newComment.bookmarkId = doc.id;
        });
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

      const docRef = await addDoc(commentRef, newComment);

      const commentWithId = {
        id: docRef.id,
        ...newComment,
        isEdit: false,
        tempComment: "",
        uid: user.uid,
        user: user,
      };

      setTempComment("");
      setComments((prev) => [...prev, commentWithId]);
    } catch (error) {
      console.log("error", error);
      alert("로그인 후 이용해주세요.");
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
  }, []);

  useEffect(() => {
    getBoard();
    loadComment();
  }, [user]);

  return (
    <>
      <Header />

      <div className="flex flex-col bg-[#f6f6f6] shadow-xl rounded-2xl p-10 m-25">
        {/* z컨텐츠 */}
        <div>
          {/* 제목  */}

          <div className="flex flex-col pb-3 border-b border-gray-300">
            {detailIsEdit ? (
              <div className="flex flex-row ">
                <input
                  className="text-left font-bold text-[20px] mb-4 focus:outline-none "
                  value={tempTitle}
                  onChange={changeTitle}
                ></input>
              </div>
            ) : (
              <div>
                <p className="text-left font-bold text-[20px] mb-4">
                  {board.title}
                </p>
              </div>
            )}
            <div className="flex flex-row items-center">
              <div className="flex flex-1 gap-3 items-center">
                <span className=" text-[14px]"> {board.user?.name}</span>
                <span className="text-[14px]">
                  {board.createdAt?.toLocaleString()}
                </span>
              </div>
              <div className="flex">
                <img
                  src={board.likeId ? "/full_heart.svg" : "/empty_heart.svg"}
                  onClick={like}
                  className="w-5 cursor-pointer"
                />
                <img
                  src={
                    board.bookmarkId
                      ? "/bookmark_full.svg"
                      : "/bookmark_empty.svg"
                  }
                  onClick={bookmark}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 내용 */}
          <div className="flex flex-col min-h-80">
            {detailIsEdit ? (
              <div className="board-contents min-h-100 py-6 text-[14px] leading-relaxed whitespace-pre-line">
                <Editor
                  content={tempDetailHtml}
                  onChangeContentWithoutHtml={setTempDetailText}
                  onChangeContent={setTempDetailHtml}
                />
              </div>
            ) : (
              <div className="justify-start text-left py-6 text-[14px] min-h-[300px] leading-relaxed whitespace-pre-line">
                {board.contents && <ReadonlyEditor content={board.contents} />}

                {board.imageUrl && (
                  <img
                    src={board.imageUrl}
                    className="w-[100px] h-[100px]"
                  ></img>
                )}
              </div>
            )}

            <div className="flex justify-end items-center gap-2 mb-2">
              {detailIsEdit ? (
                <button
                  className="hover:font-medium cursor-pointer"
                  onClick={detailEditSave}
                >
                  수정완료
                </button>
              ) : user && user.uid === board.uid ? (
                <>
                  <button
                    className="hover:font-medium cursor-pointer"
                    onClick={detailEdit}
                  >
                    <img src="/edit.svg" className="h-6" />
                  </button>
                  <button
                    className="hover:font-medium cursor-pointer"
                    onClick={detailDelete}
                  >
                    <img src="/delete.svg" className="h-5" />
                  </button>
                </>
              ) : null}
              <button
                className="text-[15px] cursor-pointer hover:font-medium ml-2"
                onClick={() => navigate(`/categories`)}
              >
                목록으로 가기
              </button>
            </div>
          </div>
        </div>

        {/* 댓글 목록 */}
        <div>
          <p className="font-medium text-left text-gray-600 mb-3 ml-1">댓글</p>
          <div className="bg-white border rounded border-gray-300 min-h-30 ">
            {comments.map((comment, index) =>
              comment.isEdit ? (
                <div key={comment.id}>
                  <input
                    type="text"
                    value={comment.tempComment}
                    onChange={(e) => changeEditComment(e, index)}
                  />
                  <button onClick={() => editSaveComment(comment.id)}>
                    저장
                  </button>
                </div>
              ) : (
                <div key={comment.id}>
                  <div className="px-4 py-2 flex flex-col min-h-8 rounded-md ">
                    <div
                      className={`text-left text-[15px] mr-2 pb-2  ${comments.length - 1 === index ? "" : "border-b border-gray-300"}`}
                    >
                      <div className="mt-2">
                        <strong className="text-gray-600 text-[13px]">
                          {comment.user?.name}님
                        </strong>
                        <span className="ml-2 text-[12px] text-gray-500">
                          2025-04-30 18:00
                        </span>
                      </div>
                      <div className="flex flex-row items-center">
                        <div className="flex flex-1">
                          <p className="text-[13px] pt-3 break-all">
                            {comment.content}
                          </p>
                        </div>
                        <div className="flex justify-end gap-2 cursor-pointer">
                          {/* user는 객체.  */}
                          {comment.user && user?.uid === comment.user.uid ? (
                            <>
                              <img
                                src="/edit.svg"
                                className="w-5"
                                onClick={() => editComment(comment.id)}
                              ></img>
                              <img
                                src="/delete.svg"
                                className="w-3.5"
                                onClick={() => deleteComment(comment.id)}
                              ></img>
                            </>
                          ) : null}
                          <img
                            src={
                              comment.likeId
                                ? "/full_heart.svg"
                                : "/empty_heart.svg"
                            }
                            onClick={() => commentLike(comment.id)}
                            className="w-5"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* 댓글 입력 */}
        <div></div>

        {/* 목록으로가기  */}
        <div></div>

        <div className="flex flex-row itmes-center w-full mt-5">
          {/* {user && <span>{user.name}</span>} */}

          <input
            className="flex-1 bg-white border-gray-300 border-1 focus:px-2 rounded-md h-8 mr-3 focus:outline-none"
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
