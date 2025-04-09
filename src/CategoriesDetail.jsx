import React, {useEffect, useState} from 'react';
import db from './firebase';
import { doc, updateDoc, getDocs, collection, getDoc, addDoc, orderBy, query } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';

function CategoriesDetail(){
   
    let navigate = useNavigate();

    const [board, setBoard] = useState([]);
    const [tempComment, setTempComment] = useState("");
    const [comments, setComments] = useState([]);
 
    const {categoryId} = useParams();
    const {boardId}  = useParams();

    async function getBoard(){
        const docRef = doc(db, "category", categoryId, "board", boardId);
        const docSnap = await getDoc(docRef);

       if(docSnap.exists()){
        const id = docSnap.id;
        const data = docSnap.data();
        const formatBoard = {id,...data};
        setBoard(formatBoard);

       }
       
    }


    function changeComment(e){
        setTempComment(e.target.value);
    }

    async function loadComment(){
        const q = query(collection(db, "category", categoryId, "board", boardId, "comment"), orderBy("createdAt", "asc"));
        const data = await getDocs(q);
        const newComments = [];
        data.forEach((doc)=>{
            console.log(doc.data())
            const id = doc.id;
            const data = doc.data();
            const formatComment ={id, ...data};
            newComments.push(formatComment);
           
        });
        setComments(newComments);
       
    }


    async function saveComment(){
        // 데이터를 불러오기. (밑에서) -> tempComment의 댓글을 가져와서 firebase에 저장 . 
        const commentRef = collection(db,"category",categoryId, "board", boardId, "comment");

        const newComment = {
            content : tempComment,
            createdAt: new Date()
        }
        await addDoc(commentRef, newComment)
        setTempComment("");
        
        setComments(prev => [...prev, newComment]);
    }

    
      useEffect(()=>{
       getBoard();
       loadComment();

      },[])

      
      function count(number) {
        console.log("number :", number);
      }

      function timeout(callbackFn) {
        setTimeout(() => {

            callbackFn(1);
            setTimeout(() => {
                callbackFn(2);
            }, 1000);
        }, 3000);

      }

      timeout(count)

    return(
      
    <div className ='board-detail'>


            <div key ={board.id}></div>
            <div className='board-title'>{board.title}</div>
            <div className='board-contents'>{board.content}</div>
        



    <div className ='btns'>
        <button onClick={()=>navigate(`/categories`)}>목록으로 가기</button>
       
     </div>

        
        {comments.map((comment)=>
        <p key={comment.id}>{comment.content}</p>)}

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