import { collection, deleteDoc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import db from './firebase';

function Board (){

    let navigate = useNavigate();

    const [boards, setBoards] = useState([]);

    async function loadBoards(){
        const query = await getDocs(collection(db, "board"));
        const newBoards = [];
        query.forEach((doc) =>{
            const id = doc.id;
            const data = doc.data();
            const board = {id, ...data};
            newBoards.push(board);
        });
        setBoards(newBoards);

    }

    // function deleteBoards(checkedId){
    //     const docRef = doc(db, "todo", checkedId);
    //     const docSnap = await getDoc(docRef);
    //     if(docSnap.exists()){
    //         await deleteDoc(docRef);
    //         const filteredBoards = boards.filter((board) => board.id !== checkedId );
    //     }

    // }

    function gotoWrite(){
       navigate("/write");
    }

    function gotoDetail(id){
        navigate(`/boards/${id}`);
    }

    useEffect(() => {
        loadBoards();
    },[])

    return(

        <div className='board'>
        <header>
        <p style={{fontSize:'25px', color:'blue'}}><b>게시판</b></p>
        <div className='btns'>
          <button onClick={deleteBoards}>삭제</button>
          <button onClick={gotoWrite}>글쓰기</button>
        </div>
        </header>
        <table className='board-table'>
          <thead>
            <tr>
              <th>선택</th>
              <th>id</th>
              <th>제목</th>
              <th>등록일</th>
            </tr>
          </thead>
          <tbody>
          
          {boards.map((board)=>(
            <tr>
                <td>
                <input 
                type='checkbox'

            
                />
                </td>
                <td onClick={() => gotoDetail(board.id)}>{board.id}</td>
                <td onClick={() => gotoDetail(board.id)}>{board.title}</td>
                <td onClick={() => gotoDetail(board.id)}>{board.creatAt}</td>
            </tr>
          ))

          }
            
          
        
          </tbody>
         
        </table>
    
      </div>
    )
}

export default Board;