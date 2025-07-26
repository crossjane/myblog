import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import db from "./firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [passwords, setPasswords] = useState("");

  const navigate = useNavigate();

  async function login() {
    try {
      const auth = getAuth();
      // .then 대신 await으로 임의로 바꾼것인지? 여기서의 차이점? 크게 있는지.
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        passwords
      );
      // 지워도 될것같은데 공식문서에는 왜있을까.
      const user = userCredential.user;
      console.log(user);
      navigate("/categories?tab=OfLdJf7dkBswF0756yBw");
    } catch (error) {
      const code = error.code;
      if (code === "auth/invalid-email") {
        alert("이메일이 잘못되었습니다");
      } else if (code === "auth/invalid-credential") {
        alert("로그인 입력정보가 잘못되었습니다");
      }
    }
  }

  function changeEmail(e) {
    setEmail(e.target.value);
  }

  function changePasswords(e) {
    setPasswords(e.target.value);
  }

  return (
    <div className="flex flex-col items-center h-screen gap-4  mt-60">
      <div className="text-xl text-[rgb(65,117,78)] font-bold mb-4">
        Jane's Blog
      </div>
      <input
        className="bg-[rgb(219,230,222)] placeholder-green-700 w-72 h-13 rounded-lg pl-4"
        type="text"
        placeholder="이메일"
        value={email}
        onChange={changeEmail}
      />
      <input
        className="bg-[rgb(219,230,222)] placeholder-green-700 w-72 h-13 rounded-lg pl-4"
        placeholder="비밀번호"
        type="text"
        value={passwords}
        onChange={changePasswords}
      />

      <button
        className="bg-[rgb(65,117,78)] text-[15px] text-white w-72 h-13 rounded-full hover:bg-green-900 cursor-pointer mt-6"
        onClick={login}
      >
        로그인 하기
      </button>
      <button
        className=" text-[rgb(65,117,78)] mt-2 hover:font-medium cursor-pointer "
        onClick={() => navigate("/join")}
      >
        회원가입 하기
      </button>
      <button
        className=" text-gray-600 mt-2 hover:font-medium cursor-pointer "
        onClick={() => navigate("/categories?tab=OfLdJf7dkBswF0756yBw")}
      >
        로그인 없이 진행
      </button>
    </div>
  );
}

export default Login;
