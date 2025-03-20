
import { useState } from 'react';
import './App.css';
import { useNavigate, useParams } from 'react-router-dom';
import { addDoc, collection, getDoc } from 'firebase/firestore';
import db from './firebase';

function Write(){

    let navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const {id} = useParams();

    function titleChange(e){
        setTitle(e.target.value)

    }

    function contentChange(e){
        setContent(e.target.value)
    }

    async function saveClick(){
        const docRef = await addDoc(collection(db ,"board"),{title, content, createAt: "2025-03-20"});
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
            navigate(`/boards/${docSnap.id}`);
        }else{
            alert("존재하지 않는 게시글 입니다.");
            return;
        }



    }

return(
    

<>
<div className ='board-detail'>

     
    <div className='board-title'>
        <input
            type='text'
            placeholder="제목을 입력해주세요."
            onChange={titleChange}
            value={title}
           
        />
         
    </div>
    <div className='board-contents'>
        <input
            type="text"
            placeholder='내용을 입력해주세요.'
            onChange={contentChange}
            value={content}
            
        />
    </div>
        
      <button
       onClick={saveClick}>
        {id? "수정완료":"등록"}
      </button>
      

</div>
</>

)



} 

export default Write;