import { collection, deleteDoc, doc, getDoc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {createUserWithEmailAndPassword, getAuth} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import db from './firebase';

function Join(){

 const [email, setEmail] = useState("");
 const [passwords, setPasswords] = useState("");




 async function join(){

    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, passwords)
    const user = userCredential.user;
    console.log(user)

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

        <button onClick={join}>가입하기</button>
    </div>    

    )

}

export default Join;