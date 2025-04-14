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
   
    <div className='flex flex-col items-center h-screen gap-4  mt-60'>
        <div className='text-xl text-[rgb(65,117,78)] font-bold mb-10'>회원가입</div>
        <div className='flex gap-2'>
            <input
                className='bg-[rgb(219,230,222)] placeholder-green-700 w-68 h-13 rounded-lg pl-4'
                type='text'
                placeholder='이메일'
                value={email}
                onChange={changeEmail}
            />
            <button className='hover:bg-[rgb(65,117,78)] hover:text-white text-[12px] border-2 border-green-700 font-[600] w-20 h-13 rounded-lg'>이메일 인증</button>
        </div>

        <input
            className='bg-[rgb(219,230,222)] placeholder-green-700 w-90 h-13 rounded-lg pl-4'
            type='text'
            placeholder='비밀번호'
            value={email}
            onChange={changeEmail}
        />




        <input
           className='bg-[rgb(219,230,222)] placeholder-green-700 w-90 h-13 rounded-lg pl-4'
           placeholder='비밀번호 확인'
           type='text'
           value={passwords}
           onChange={changePasswords}
        />

        <button className="bg-[rgb(65,117,78)] text-[15px] text-white w-90 h-13 rounded-full hover:bg-green-900 cursor-pointer mt-10" onClick={join}>회원가입 하기</button>
    </div>    


    )

}

export default Join;