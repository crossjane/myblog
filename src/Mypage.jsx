import React, { useEffect } from "react";
import Header from "./Components/Header";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { userSelector } from "./features/user/slice";
import db from "./firebase";
import { useParams } from "react-router-dom";

function Mypage() {
  // const { user } = useSelector(userSelector.selectUser);
  // const { categoryId, boardId } = useParams();

  // async function getBoard() {
  //   const docRef = doc(db, "category", categoryId, "board", boardId, "bookmark");
  //   const docSnap = await getDoc(docRef);

  //   if (docSnap.exists()) {
  //     const id = docSnap.id;
  //     const data = docSnap.data();
  //     const formatBoard = {
  //       id,
  //       ...data,
  //       createdAt: data.createdAt?.toDate() ?? null,
  //     };

  //     const userRef = doc(db, "users", formatBoard.uid);
  //     const userSnap = await getDoc(userRef);

  //     console.log("userSnap", userSnap);

  //     if (userSnap.exists()) {
  //       formatBoard.user = { ...userSnap.data() };
  //     }

  //     if (user) {

  //       const q = query(
  //         collection(db, "category", categoryId, "board", boardId, "bookmark"),
  //         where("uid", "==", user.uid)
  //       );
  //       const data = await getDocs(q);
  //       data.forEach((doc) => {
  //         formatBoard.bookmarkId = doc.id;
  //         return;
  //       });
  //     }

  //     setBoard(formatBoard);
  //     console.log("formatboard!!!", formatBoard);
  //   }
  // }

  // useEffect(() => {
  //   getBoard();
  // }, []);

  return (
    <>
      <Header />
      <div className="flex justify-center">
        <div className="flex text-left  mb-25 bg-gray-100 w-[95%] min-h-100 rounded-2xl mt-30 shadow-md">
          <div className="mt-10 ml-10">
            <div className="flex justify-center bg-[#B8BEBE] h-70 w-60 rounded-2xl">
              <img src="/profile_pic.svg" className="mb-10 w-50 " />
            </div>
          </div>
          <div className="ml-10 mt-10">
            <div className="flex font-semibold text-[20px] mb-5">
              Jane Kim
              <img src="/edit.svg" className="w-5 ml-2 cursor-pointer" />
            </div>
            <div className="flex mb-[10px]">
              <span className="mr-4 text-[14px]">이메일</span>
              <span>cross.jane.kim@gmail.com</span>
            </div>
            <div className="flex mb-[20px]">
              <span className="mr-4 text-[14px]">이메일</span>
              <span>cross.jane.kim@gmail.com</span>
            </div>
            <span className="leading-5 text-[14px] w-[90%]">
              IT 분야에서 UX 기획자와 UI 디자이너로서의 경험을 바탕으로 새로운
              도전을 시작한 프론트엔드 개발 지원자 김화영입니다. 저는
              JavaScript를 기반으로 한 프론트엔드 개발을 중심으로 역량을
              키워왔으며, 기획, 디자인, 개발을 아우르는 통합적인 관점을 저의
              강점으로 삼고 있습니다. 특히, 개발 공부 이전의 다양한 IT프로젝트
              경험에서 얻은 사용자 중심의 사고와 협업 능력을 바탕으로 사용자에게
              가치를 전달하는 최적의 서비스를 개발하는 데 기여하고자 합니다.
            </span>
          </div>
        </div>
      </div>
      <div className="mb-50">
        <span className="text-[18px]">내가 즐겨찾기 한 글</span>

        {/* // 어느 유저가가 북마크 했는지 식별위함
                // 현재 로그인한 유저의 uid
                const newLike = {
                  uid: user.uid,
                };
        
                const docRef = await addDoc(bookmarkRef, newLike);
                //  북마크한 고유id를 board에 저장.
                setBoard({ ...board, bookmarkId: docRef.id });
                return;
 */}
      </div>
    </>
  );
}

export default Mypage;
