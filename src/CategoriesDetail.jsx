import React, {useEffect, useState} from 'react';
import db from './firebase';
import { getDoc, doc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';

function CategoriesDetail(){
   
    let navigate = useNavigate();

    const [board, setBoard] = useState([]);

    const {id} = useParams();

    async function loadBoard(){
        const query = await getDocs(collection(db, "category", id, "board"));
        const newBoard = [];  
        query.forEach((doc)=>{
            const id = doc.id;
            const data = doc.data();
            const formatBoard = {id,...data};
            newBoard.push(formatBoard);
        })
        setBoard(newBoard);
        
        console.log("baord", newBoard);
    }


    
      useEffect(()=>{
       loadBoard();

      },[])


    return(
      
    <div className ='board-detail'>

        {board.map((board)=>
                    <>
                    <div key ={board.id}></div>
                    <div className='board-title'>{board.title}</div>
                    <div className='board-contents'>{board.content}</div>
                    </>
                ) 

        }



    <div className ='btns'>
  
       
            
       
        <button onClick={()=>navigate("/categories")}>목록으로 가기</button>
       
     </div>
    </div>








    )
}

export default CategoriesDetail;