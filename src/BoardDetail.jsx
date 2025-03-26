import './App.css';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import db from './firebase';
import { addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';



function BoardDetail(){

    const navigate = useNavigate();

    const [board, setBoard] = useState();
    const [tempContent, setTempContent] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentId, setCommentId] = useState();
    const [tempComment, setTempComment] = useState("");

    const {id} = useParams();


    async function getBoard(){
        const docRef = doc(db, "board", id);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
            const id = docSnap.id;
            const data = docSnap.data();
            const formatBoard = {id, ...data};
            setBoard(formatBoard);
        }

    }

    function changeEditContent(e){
        setTempContent(e.target.value);
    }
    


    function editContent(){
        // 수정 버튼 눌렀을때. => input으로 변하기 . tempContents상태 
        setIsEdit(true);
        setTempContent(board.content);
    }

    async function editSave(){
        // 완료버튼 눌렀을떄 -> temp내용이 firebase로 등록됨. 
        const docRef = doc(db, "board", board.id);
        await updateDoc(docRef,{
            content: tempContent
        });
        setBoard({...board, content:tempContent});
        setIsEdit(false);
        setTempContent("");

        }

    function changeComment(e){
        setTempComment(e.target.value);
    }

    function saveComment(){
        setComments(tempComment);
        addDoc
        setTempComment("");
    }



    useEffect(() => {
        getBoard();
    }, []);

    return(
<>


<div className ='board-detail'>

    {board ?
            <>
            
                <div className='board-title'>{board.title}</div>
                <div className='board-contents'>{board.content}</div>
          
            </>
    : 
           null

    }



<div className ='btns'>
    {isEdit?
    <>
    <input
        type='text'
        value={tempContent}
        onChange={changeEditContent}

        />
    <button onClick={editSave}>완료</button> 
       
    </>
    :  
    <button onClick={editContent}>수정</button> 


    }
    <button onClick={()=>navigate("/boards")}>목록으로 가기</button>
</div>

<div>{}</div>
    <div>
        <input
            type='text'
            value={tempComment}
            onChange={changeComment}
        />
        <button onClick={saveComment}>댓글 등록</button>
    </div>

</div>



</>



    )
}

export default BoardDetail;