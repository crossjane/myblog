import React, {useEffect, useState} from 'react';
import db from './firebase';
import { doc, updateDoc, getDocs, collection, getDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';

function CategoriesDetail(){
   
    let navigate = useNavigate();

    const [board, setBoard] = useState([]);
    const [tempComment, setTempComment] = useState("");
    const [comments, setComments] = useState([]);
 
    const {id} = useParams();

    // import { doc } from "firebase/firestore"; 

    // const messageRef = doc(db, "rooms", "roomA", "messages", "message1");
    async function getBoard(){
        const docRef = doc(db, "category", id, "board", boardId);
        const docSnap = await getDoc(docRef);

       if(docSnap.exists()){
        const id = docSnap.id;
        const data = docSnap.data();
        const formatBoard = {id,...data};
        setBoard(formatBoard);
         
     
        console.log("id", id)
       }
       console.log("baord",board );
       
    }


    function changeComment(e){
        setTempComment(e.target.value);
    }

    async function loadComment(){
        const query = await getDocs(collection(db, "category", id, "board", boardId, "comments"));
        const newComments = [];
        query.forEach((doc)=>{
            const id = doc.id;
            const data = doc.data();
            const formatComment ={id, ...data};
            newComments.push(formatComment);

        });
        setComments(newComments);
        console.log("코멘트",newComments);

    }

    function saveComment(){
        // 데이터를 불러오기. (밑에서) -> 

    }

    
      useEffect(()=>{
       getBoard();
       loadComment();

      },[])


    return(
      
    <div className ='board-detail'>


            <div key ={board.id}></div>
            <div className='board-title'>{board.title}</div>
            <div className='board-contents'>{board.content}</div>
        



    <div className ='btns'>
        <button onClick={()=>navigate("/categories")}>목록으로 가기</button>
       
     </div>

        
        {comments.map((comment)=>
        <p key={comment.id}>{comment.comment}</p>)}

        <div>
            <input
                type='text'
                value={tempComment}
                onChange={changeComment}
            />
            <button onClick={saveComment}>댓글 등록</button>
        </div>


    </div>








    )
}

export default CategoriesDetail;