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
  const { number, number2 } = useSelector(testSelector.selectTest2);
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
        {user ? (
          <button
            className="text-m text-gray-600 hover:text-green-800"
            onClick={logout}
          >
            로그아웃
          </button>
        ) : (
          <button onClick={login}>로그인</button>
        )}
      </div>
      <div className="flex justify-center items-center mb-6">
        <b className="text-2xl text-green-800 font-semibold font-inter">
          Jane's Life
        </b>
        {userState && <p>{userState.name}님 환영합니다.</p>}
      </div>
      <p>
        {number}{" "}
        <button onClick={() => dispatch(testAction.sumCount())}>더하기</button>
      </p>
    </>
  );
}
export default Header;
