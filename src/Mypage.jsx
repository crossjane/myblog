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
        <div className="flex text-left leading-10 mb-25 bg-gray-100 w-[95%] min-h-100 rounded-2xl mt-30 shadow-md">
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
            <div className="flex">
              <span className="mr-4 text-[14px]">이메일</span>
              <span>cross.jane.kim@gmail.com</span>
            </div>
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
