import { addDoc, collection, getDoc } from 'firebase/firestore';
import './App.css';
import React, { useState } from 'react';
import db from './firebase';
import { useNavigate, useParams } from 'react-router-dom';


function CategoryWrite(){


    const [title, setTitle] = useState("");
    const [contents, setContents] = useState("");

    let navigate = useNavigate();

    const {categoryId, boardId} = useParams();



    function titleChange(e){
        setTitle(e.target.value);
        
    }

    function contentChange(e){
        setContents(e.target.value);
    }

    async function saveClick(){
        const docRef = await addDoc(collection(db, "category",categoryId,"board"),{title, contents});
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
            navigate(`/categories/${categoryId}/board/${boardId}`);
        }else{
            alert("존재하지 않는 게시글 입니다.");
            return;
        }

    }

    
    return(
        <div className='board-detail'>

            <div className='board-title'>
                <input
                    type ='text'
                    placeholder='제목을 입력해주세요.'
                    onChange={titleChange}
                    value={title}
                />
                
            </div>
            <div className ='board-contents'>
                <input
                    type ='text'
                    placeholder='내용을 입력해주세요.'
                    onChange={contentChange}
                    value={contents}
                />

            </div>

        <button onClick={saveClick}>등록</button>


        </div>



    )

}

export default CategoryWrite;