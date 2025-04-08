import { collection, getDocs } from 'firebase/firestore';
import React , {useEffect, useState} from 'react';
import db from './firebase';
import { useNavigate } from 'react-router-dom';

// 포인트 : category.id / board.id 각각 받아서 categoryid는 상태로 저장= > 상태로 받기 -> 보드id는 바로 이동
// 왜 목록으로 다시올때, ? 재로드 하면 loadCategory가 안됨 
//콜백??

function Categories(){


  let navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [boards, setBoards] = useState([]);
  const [categoryId, setCategoryId] = useState();


  async function loadCategories(){
    const query = await getDocs(collection(db, "category"));
    const newCategories =[];
    query.forEach((doc)=>{
      const id = doc.id;
      const data = doc.data();
      const formatCategory = {id,...data, isChecked: false};
      newCategories.push(formatCategory);

    })

    setCategories(newCategories);

    if (newCategories.length > 0) {
      const firstCategoryId = newCategories[0].id;
      clickCategory(firstCategoryId);
    }
   
  }


 async function clickCategory(id){
    setCategoryId(id);
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


  function changeCheckbox(e,boardId){
    const updatedBoards = boards.map((board)=>board.id === boardId?
    {...board, isChecked: e.target.checked} : board);

    setBoards(updatedBoards);
  }

  function deleteBoards(){
  
    //isChecked ture인 아이템들을 찾음 . -> 그 외의것만 filter하기 
    //firebase에서도 삭제를 해야함. !!!
    const filteredBoards = boards.filter((board) => (!board.isChecked));
    setBoards(filteredBoards);

  }

//q보드를 눌러씅ㄹ떄 카테고리 아이디를 같이 넘겨줘야지 
//상태로 관리하라고 누른 탭을  category by board  탭을 눌렀을때 뭘눌렀는지를 상태 
//상태로 받아서 넘겨야한다 i카테고리 아이디를. 지금은 보드 id만 넘기는데 뭘눌렀는지 상태로 받아오기 . 

  function gotoDetail(boardId){
    navigate(`/categories/${categoryId}/board/${boardId}`);
  
  }

  function gotoWrite(){
    navigate(`/categories/${categoryId}/write`);
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
        {boards.map((board)=>
        <tr key={board.id}>
           <td>
            <input 
            type='checkbox'
            checked={board.isChecked}
            onChange={(e)=>changeCheckbox(e,board.id)}
      
            
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
