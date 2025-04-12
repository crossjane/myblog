import { collection, deleteDoc, doc, getDoc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import db from './firebase';

function Login(){

 const [email, setEmail] = useState("");
 const [passwords, setPasswords] = useState("");




 async function login(){
    try {
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, email, passwords)
        const user = userCredential.user;
        console.log(user)
    } catch(error) {
        const code = error.code;
        if(code === "auth/invalid-email") {
            alert("이메일이 잘못되었습니다");
        } else if(code === "auth/invalid-credential") {
            alert("로그인 입력정보가 잘못되었습니다");
        }
    }
    

 }

 function changeEmail(e){
    setEmail(e.target.value);
 }

 function changePasswords(e){
    setPasswords(e.target.value);
 }


    return(
    <div>
        <div>이메일</div>
        <input
            type='text'
            value={email}
            onChange={changeEmail}
        

        />
        <div>비밀번호</div>
        <input
           type='text'
           value={passwords}
           onChange={changePasswords}
        />

        <button onClick={login}>로그인하기</button>
    </div>    

    )

}

export default Login;