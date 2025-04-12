import React, {useEffect, useState} from 'react';
import db from './firebase';
import { doc, updateDoc, getDocs, collection, getDoc, addDoc, orderBy, query, deleteDoc } from 'firebase/firestore';
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
            const formatComment ={id, ...data, isEdit: false, tempComment:""};
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

    async function deleteComment(commentId){
        await deleteDoc(doc(db, "category", categoryId, "board", boardId, "comment",commentId));
        setComments(prev => prev.filter((comment) => comment.id !== commentId));

      }


    function editComment(commentId){

        // 수정클릭시 , input창으로변경(하단에서하기).
        //해당하는 코멘트 id값 찾아와서 comments의 id와 같으면 
        // //edit 값 주기 isEdit  tempContent에 input이랑 연결한값주기기
        const editedComment = comments.map((comment)=>comment.id === commentId?
            {...comment, isEdit: true, tempComment: comment.content}: comment
        );
        setComments(editedComment);
    
       

    

      }

     async function editSaveComment(commentId){
        //받아서 , comment 불러와서 -> 해당하는 id map돌려서 찾기 -> tempComment값을을 업데이트 firebase에 업데이트,  수정. 
        const docRef = doc(db, "category", categoryId, "board", boardId, "comment", commentId);
        await updateDoc(docRef,{
            content: tempComment
        });

        loadComment();
        setTempComment("");


      }

      function changeEditComment(e, index){
        const copyComments = [...comments];
        copyComments[index].tempComment = e.target.value;
        setComments(copyComments);
      }

   
      
  

    return(
      
    <div className ='board-detail'>


            <div key ={board.id}></div>
            <div className='board-title'>{board.title}</div>
            <div className='board-contents'>{board.content}</div>
        



    <div className ='btns'>
        <button onClick={()=>navigate(`/categories`)}>목록으로 가기</button>
       
     </div>

        
        {comments.map((comment, index)=>
       
            comment.isEdit?
                <>
                <input
                    type='text'
                    value={comment.tempComment}
                    onChange={(e)=>changeEditComment(e, index)}
                />
                <button onClick={()=>editSaveComment(comment.id)}>저장</button>
                </>
                :

                <>
                 <p key={comment.id}>{comment.content}  
                <button onClick={()=>deleteComment(comment.id)}>삭제</button>
                <button onClick={()=>editComment(comment.id)}>수정</button>
                </p>
                </>
            
        )}

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