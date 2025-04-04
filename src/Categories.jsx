import { collection, getDocs } from 'firebase/firestore';
import React , {useEffect, useState} from 'react';
import db from './firebase';
import { useNavigate } from 'react-router-dom';



function Categories(){


  let navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [boards, setBoards] = useState([]);

  async function loadCategories(){
    const query = await getDocs(collection(db, "category"));
    const newCategories =[];
    query.forEach((doc)=>{
      const id = doc.id;
      const data = doc.data();
      const formatCategory = {id,...data};
      newCategories.push(formatCategory);

    })

    setCategories(newCategories);
  }


 async function clickCategory(id){
    const query = await getDocs(collection(db, "category", id,"board" ));
    const newBoards = [];
    query.forEach((doc)=>{
      const id = doc.id;
      const data =doc.data();
      const formatBoard = {id,...data};
      newBoards.push(formatBoard);

    })

    setBoards(newBoards);

  }


  function gotoDetail(id){
    navigate(`/categories/${id}`);
  }


useEffect(()=>{
  loadCategories();

},[]);

return(

    <div className='board'>
    <header>
    <p style={{fontSize:'25px', color:'blue'}}><b>게시판</b></p>
   
    <div className='tab-container'>
        {categories.map((category)=>{
            return (
               
                    <li
                    key = {category.id}
                    // className= {currentTab === index? "tabmenu-focused" : "tabmenu"}
                    onClick={()=>clickCategory(category.id)}
                    >{category.name}</li>
             
            )
        })}
    </div>
  

    <div className='btns'>
      <button >삭제</button>
      <button>글쓰기</button>
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
        {boards.map((board)=>
        <tr key={board.id}>
           <td>
            <input 
            type='checkbox'
            
            />
            </td>
            <td onClick={()=>gotoDetail(board.id)}>{board.id}</td>
            <td onClick={()=>gotoDetail(board.id)}>{board.title}</td>
            <td onClick={()=>gotoDetail(board.id)}>{board.content}</td>
          </tr>
        )}
    
           
          
       
    
    
      </tbody>
     
    </table>
 



  </div>



    )
}

export default Categories;
