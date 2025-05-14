import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import "./App.css";
import React, { useEffect, useRef, useState } from "react";
import db from "./firebase";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Header from "./Components/Header";
import { useDispatch, useSelector } from "react-redux";
import { userAction, userSelector } from "./features/user/slice";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import AWS from "aws-sdk";

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
  const [imageUrl, setImageUrl] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const inputRef = useRef();

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

  async function onChangeFile(event) {
    setUploadLoading(true);
    const file = event.target.files[0];
    const s3 = new AWS.S3({
      region: "ap-northeast-3",
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
      secretAccessKey: import.meta.env.VITE_AWS_PRIVATE_KEY,
    });

    const fileName = `${Date.now()}_${file.name}`;
    const params = {
      ACL: "public-read",
      Body: file,
      Bucket: import.meta.env.VITE_AWS_S3_BUCKET,
      Key: `upload/${fileName}`,
    };

    await s3.putObject(params).promise();

    setImageUrl(
      `https://janes-blog.s3.ap-northeast-3.amazonaws.com/upload/${fileName}`
    );
    setUploadLoading(false);
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
              <div>첨부파일 등록</div>
              <input type="file" onChange={onChangeFile} />
              <div>
                {uploadLoading ? (
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
                  <img width={100} height={100} src={imageUrl} />
                )}
              </div>

              <button className="bg-gray-200 mb-5">+</button>
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
