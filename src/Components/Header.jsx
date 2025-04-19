import React from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

function Header({ user }) {
  const navigate = useNavigate();

  function login() {
    navigate("/login");
  }

  async function logout() {
    try {
      const auth = getAuth();
      const result = await signOut(auth);
      alert("로그아웃되었습니다.");
      navigate("/categories");
    } catch (error) {
      alert(error.message);
    }
  }

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
      </div>
    </>
  );
}
export default Header;
