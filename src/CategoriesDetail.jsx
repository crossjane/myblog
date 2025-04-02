import React, {useEffect, useState} from 'react';
import db from './firebase';
import { getDoc, getDocs, collection, deleteDoc,doc, updateDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

function CategoriesDetail(){

    const [board, setBoard] = useState();
    const [tempContent, setTempContent] = useState("");

    const {id} = useParams();

    async function getBoard(){
        const docRef = doc(db, "board", id);
        const docSnap = await getDoc(docRef);
        
        if(docSnap.exists()){
            const id = docSnap.id;
            const data = docSnap.data();
            const formatBoard = {id,...data};
            setBoard(formatBoard);
        }
    }


    async function saveBoard(){
        const docRef = doc(db, "board", board.id );
        await updateDoc(docRef,{
            content: tempContent
        });
        setBoard({...board, content: tempContent});
        setTempContent("");
      }
    
      useEffect(()=>{
        getBoard();

      },[])


    return(
      
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
  
            <input
                type='text'
                value={tempContent}
            />
            <button onClick={saveBoard}>글 올리기</button> 
            
       
        {/* <button onClick={()=>navigate("/boards")}>목록으로 가기</button> */}
       
     </div>
    </div>








    )
}

export default CategoriesDetail;