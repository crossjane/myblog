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

    // firebase에서 게시물 가져와서 -> 체크된 게시물 선별해서 저장-> firebase에 업데이트하기 ?
    // firebase에서 체크된 게시물 비교해서 삭제하기?
    // async function deleteBoards(){


    // }

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
          {/* <button onClick={deleteBoards}>삭제</button> */}
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
                onChange={(e) => clickCheckBox(board.id, e.target.checked)}
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