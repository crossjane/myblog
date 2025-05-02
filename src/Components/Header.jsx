import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { testAction, testSelector } from "../features/count/slice";
import { userAction, userSelector } from "../features/user/slice";
import { doc, getDoc } from "firebase/firestore";
import db from "../firebase";

function Header({ user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user: userState } = useSelector(userSelector.selectUser);

  function login() {
    navigate("/login");
  }

  async function logout() {
    try {
      const auth = getAuth();
      const result = await signOut(auth);
      dispatch(userAction.updateUser(null));
      alert("로그아웃되었습니다.");
      navigate("/categories");
    } catch (error) {
      alert(error.message);
    }
  }

  async function getMe() {
    if (userState) {
      return;
    }
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

  useEffect(() => {
    getMe();
  }, []);

  return (
    <>
      <div className="w-full flex justify-end px-6 py-2">
        {userState && (
          <p className="mr-8 leading-relaxed text-[15px]">
            {userState.name}님 환영합니다.
          </p>
        )}

        <button
          className="text-[#5F7D7D] font-semibold text-[16px] rounded-md border-2 px-4 pb-1 mr-4 cursor-pointer hover:bg-[#e6ecec]"
          style={{ fontFamily: '"Josefin Slab"' }}
          onClick={() => navigate("/mypage")}
        >
          my page
        </button>
        {userState ? (
          <button
            className="text-[#5F7D7D] font-semibold text-[16px] rounded-md border-2 px-4 cursor-pointer hover:bg-[#e6ecec]"
            style={{ fontFamily: '"Josefin Slab"' }}
            onClick={logout}
          >
            logout
          </button>
        ) : (
          <button
            className="text-[#5F7D7D] font-semibold text-[16px] rounded-md border-2 px-4 pb-1 cursor-pointer hover:bg-[#e6ecec]"
            style={{ fontFamily: '"Josefin Slab"' }}
            onClick={login}
          >
            login
          </button>
        )}
      </div>
      <div className="flex flex-col justify-center items-center mb-6">
        <b
          onClick={() => navigate("/categories")}
          className="font-medium tracking-wide text-[50px] mb-7 text-[#5F7D7D] cursor-pointer mt-20"
          style={{ fontFamily: '"Josefin Slab", serif' }}
        >
          Jane's Blog
        </b>
        Jane의 개인 블로그입니다.
        <img src="/line_keyboard.png" className="w-80 h-auto" alt={"text"} />
      </div>
    </>
  );
}
export default Header;
