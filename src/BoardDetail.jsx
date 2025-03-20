import './App.css';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import db from './firebase';
import { doc, getDoc } from 'firebase/firestore';



function BoardDetail(){

    const navigate = useNavigate();

    const [board, setBoard] = useState();

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


    function editSave(){

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
    <button onClick={editSave}>수정</button>
    <button onClick={()=>navigate("/boards")}>목록으로 가기</button>
</div>


</div>



</>



    )
}

export default BoardDetail;