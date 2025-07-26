import React, { useState } from "react";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import db from "./firebase";

function Join() {
  const [email, setEmail] = useState("");
  const [passwords, setPasswords] = useState("");
  const [name, setName] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  let navigate = useNavigate();

  async function join() {
    if (passwords !== passwordConfirm) {
      alert("비밀번호가 일치하지않습니다.");
      return;
    }

    if (!email) {
      alert("이메일을 입력해주세요");
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        passwords
      );
      // user로 꺼내서쓰기. 객체.
      //       {
      //   uid: "a1b2c3d4...",
      //   email: "example@email.com",
      //   displayName: null,
      //   emailVerified: false,
      //   ...기타 정보들
      // }
      const user = userCredential.user;

      const userRef = collection(db, "users");
      //  user.uid를 가리키는 경로 참조 객체. 생성되었기 떄문에 참조가 가능한건가 ?
      const ref = doc(userRef, user.uid);
      setDoc(ref, {
        name,
        email,
      });
      alert("회원가입이 완료되었습니다.");
      navigate("/login");
      console.log(user);
    } catch (error) {
      alert(error.message);
    }
  }

  function changeName(e) {
    setName(e.target.value);
  }

  function changeEmail(e) {
    setEmail(e.target.value);
  }

  function changePasswords(e) {
    setPasswords(e.target.value);
  }

  function changePasswordConfirm(e) {
    setPasswordConfirm(e.target.value);
  }

  return (
    <div className="flex flex-col items-center h-screen gap-4  mt-60">
      <div className="text-xl text-[rgb(65,117,78)] font-bold mb-10">
        회원가입
      </div>
      <div className="flex gap-2">
        <input
          className="bg-[rgb(219,230,222)] placeholder-green-700 w-68 h-13 rounded-lg pl-4"
          type="text"
          placeholder="이름"
          value={name}
          onChange={changeName}
        />
        <button className="hover:bg-[rgb(65,117,78)] hover:text-white text-[12px] border-2 border-green-700 font-[600] w-20 h-13 rounded-lg">
          이메일 인증
        </button>
      </div>

      <div className="flex gap-2">
        <input
          className="bg-[rgb(219,230,222)] placeholder-green-700 w-68 h-13 rounded-lg pl-4"
          type="text"
          placeholder="이메일"
          value={email}
          onChange={changeEmail}
        />
        <button className="hover:bg-[rgb(65,117,78)] hover:text-white text-[12px] border-2 border-green-700 font-[600] w-20 h-13 rounded-lg">
          이메일 인증
        </button>
      </div>

      <div
        className={`bg-[rgb(219,230,222)] placeholder-green-700 w-90 h-13 rounded-lg pl-4 ${passwords === "" ? "border-0" : passwords === passwordConfirm ? "border-1 border-green-500" : "border-1 border-red-500"}`}
      >
        <input
          className="w-[100%] h-[100%] outline-none"
          placeholder="비밀번호"
          type="text"
          value={passwords}
          onChange={changePasswords}
        />
      </div>

      <div
        className={`bg-[rgb(219,230,222)] placeholder-green-700 w-90 h-13 rounded-lg pl-4 ${passwords === "" ? "border-0" : passwords === passwordConfirm ? "border-1 border-green-500" : "border-1 border-red-500"}`}
      >
        <input
          className="w-[100%] h-[100%] outline-none"
          placeholder="비밀번호 확인"
          type="text"
          value={passwordConfirm}
          onChange={changePasswordConfirm}
        />
      </div>

      <button
        className="bg-[rgb(65,117,78)] text-[15px] text-white w-90 h-13 rounded-full hover:bg-green-900 cursor-pointer mt-10"
        onClick={join}
      >
        회원가입 하기
      </button>
    </div>
  );
}

export default Join;
