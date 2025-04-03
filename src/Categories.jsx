
import { collection,  doc,  getDocs } from 'firebase/firestore';
import React , {useEffect, useState} from 'react';
import db from './firebase';
import { useNavigate, useParams } from 'react-router-dom';



function Categories(){

  let navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState(0);
  const [board, setBoard] = useState([]);

  const {id} = useParams();

  const menuArr = [
    {name : '질문' , content : '질문입니다.'},
    {name : '자유게시판', content : '자유게시판입니다.'},
    {name : '공지사항', content : '공지사항입니다.'}
  ];

  const selectMenuHandler = (index) => {
    setCurrentTab(index);
  }


async function loadBoard(){
    const query = doc((db,"category", id, "board"));
    const newBoard = [];
    query.forEach((doc)=>{
        const id = doc.id;
        const data = doc.data();
        const formatBoard = {id,...data};
        newBoard.push(formatBoard);
    });

    setBoard(newBoard);

}

function gotoDetail(){
  navigate(`/categories/${id}`);
}





useEffect(()=>{
    loadBoard();
},[]);

return(

    <div className='board'>
    <header>
    <p style={{fontSize:'25px', color:'blue'}}><b>게시판</b></p>
   
    <div className='tab-container'>
        {menuArr.map((menu, index)=>{
            return (
               
                    <li
                    key = {index}
                    className= {currentTab === index? "tabmenu-focused" : "tabmenu"}
                    onClick={()=>selectMenuHandler(index)}
                    >{menu.name}</li>
             
            )
        })}
    </div>
    <h1 style={{fontSize:'14px'}}>{menuArr[currentTab].content}</h1>

    <div className='btns'>
      <button >삭제</button>
      <button>글쓰기</button>
    </div>
    </header>

    {currentTab === 0 &&(
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
        {board.map((boards)=>
        <tr key={boards.id}>
           <td>
            <input 
            type='checkbox'
            
            />
            </td>
            <td onClick={()=>gotoDetail(board.id)}>{board.id}</td>
            <td onClick={()=>gotoDetail(board.id)}>{boards.title}</td>
            <td onClick={()=>gotoDetail(board.id)}>{boards.content}</td>
          </tr>
        )}
    
           
          
       
    
    
      </tbody>
     
    </table>
      )
    }

    {currentTab === 1 &&(
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
        
    
            <tr>
                <td>
                <input 
                type='checkbox'
                />
                </td>
                <td>아이디디</td>
                <td>자유게시판입니다다.</td>
            
            </tr>
        
        
        </tbody>
        
        </table>
      )
    }

    {currentTab === 2 &&(
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
        
    
            <tr>
                <td>
                <input 
                type='checkbox'
                />
                </td>
                <td>아이디디</td>
                <td>공지사항입니다.</td>
            
            </tr>
        
        
        </tbody>
        
        </table>
      )
    }

  </div>



    )
}

export default Categories;
