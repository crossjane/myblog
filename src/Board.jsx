import { collection, deleteDoc, doc, getDoc, getDocs } from 'firebase/firestore';
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
            const board = {id, ...data, isChecked: false};
            newBoards.push(board);
        });
        setBoards(newBoards);

    }

    // for문 돌면서 가져와서 -> 있으면 -> 삭제시키기. 
    
    // 체크된 것만 골라서->firebase에서 지워-> ui도지워
    async function deleteBoards(){
      const copyBoard =[...boards];
      const filteredBoardId = copyBoard.filter((board)=>board.isChecked)
                                        .map((board) => board.id);

        //체크된 것만 골랏음 -> firebase와 대조해서 지우기. 
        // firebase에서 여러개 게시물 다 가져와서 -> id대조. -> 삭제 
      const docSnap = await getDocs(collection(db,"board"));

      //firebase에서 골라내기 
    for(let i = 0; i < docSnap.docs.length; i++){ 
      const docLists = docSnap.docs[i];// firebase값
      const docId = docLists.id;// firebase에 있는 id들.
     
      // 여기서 firebase id와 실제로 체크된 id를 대조함, 삭제제
     if(filteredBoardId.includes(docId)){
      await deleteDoc(doc(db,"board", docId));
     }

    }

    // UI도지워???앜
    const deletedBoard = copyBoard.filter((board)=>!board.isChecked);
    setBoards(deletedBoard);



    }

    async function clickCheckBox(id, checked){
        const clickBoards = boards.map((board)=>board.id === id?
             {...board, isChecked: checked} : board
        );
        setBoards(clickBoards);

    }

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
            {}
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
            <tr key ={board.id}>
                <td>
                <input 
                type='checkbox'
                checked={board.isChecked}
                onChange={() => clickCheckBox(board.id, e.target.checked)}
                />
                </td>
                <td onClick={() => gotoDetail(board.id)}>{board.id}</td>
                <td onClick={() => gotoDetail(board.id)}>{board.title}</td>
                <td onClick={() => gotoDetail(board.id)}>{board.createdAt}</td>
            </tr>
          ))

          }
            
          
        
          </tbody>
         
        </table>
    
      </div>
    )
}

export default Board;