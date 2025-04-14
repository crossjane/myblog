import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
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

    try{
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
   
    } catch(error){
      console.error("error", error);
        alert("데이터를 불러올 수 없습니다.");
    }
  }


 async function clickCategory(id){
    setCategoryId(id);

    try{
    const query = await getDocs(collection(db, "category", id,"board" ));
    const newBoards = [];
    query.forEach((doc)=>{
      const id = doc.id;
      const data =doc.data();
      const formatBoard = {id,...data};
      newBoards.push(formatBoard);

    })

    setBoards(newBoards);
    }catch(error){
      console.error("error", error);
      alert("페이지로 이동할 수 없습니다.");
   }

  }


  function changeCheckbox(e,boardId){
    const updatedBoards = boards.map((board)=>board.id === boardId?
    {...board, isChecked: e.target.checked} : board);

    setBoards(updatedBoards);
  }

  async function deleteBoards(){
  
    //isChecked ture인 아이템들을 찾음 . -> 그 외의것만 filter하기 
    //firebase에서도 삭제해야. for문돌면서 -> 삭제 시키기 하나씩. 
    // const filteredBoards = boards.filter((board) => (!board.isChecked));
    // setBoards(filteredBoards);
  const deletedBoards =[];

  //firebase에서 선택된것 삭제 -> 안된것, push.

  try{
    for(const board of boards){
      if(board.isChecked){
        await deleteDoc(doc(db,"category", categoryId,"board", board.id));
      } else{
        deletedBoards.push(board);
      }
    }
   
  setBoards(deletedBoards);
    }catch(error){
      console.log("error", error);
      alert("삭제 할 수 없습니다.");
    }
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
     <div className='flex justify-center items-center mb-6'>
      <b className="text-2xl text-green-800 font-semibold font-inter">Jane's Life</b>
    </div>
    <header>
    
    
    <div className='flex justify-center items-center mb-6'>
      <ul className='flex gap-4'>
          {categories.map((category)=>{
              return (
                
                      <li
                      key = {category.id}
                      className={`px-4 py-2 rounded cursor-pointer 
                        ${category.id === categoryId 
                          ? 'text-green-800 font-semibold' 
                          : 'text-gray-600 hover:text-green-700 hover:font-semibold'}`}
                      onClick={()=>clickCategory(category.id)}
                     
                      >{category.name}</li>
              
              )
          })}
      </ul>
    </div>
  

    <div className='btns'>
      <button className="bg-[rgb(219,230,222)] hover:bg-[rgb(155, 165, 158)] text-green-800 font-medium py-2 px-4 rounded-lg shadow-sm" onClick={deleteBoards}>삭제</button>
      <button  className="bg-[rgb(219,230,222)] hover:bg-[rgb(219,230,222)] text-green-800 font-medium py-2 px-4 rounded-lg shadow-sm" onClick={gotoWrite}>글쓰기</button>
    </div>
    </header>
    <table className='min-w-full divide-y divide-gray-200'>
      <thead className='bg-gray-100'>
        <tr>
          <th className='px-6 py-3 text-left text-[13px] front-mediu text-gray-500 tracking-wider'>선택</th>
          <th className="px-6 py-3 text-left text-[13px] font-medium text-gray-500 tracking-wider">id</th>
          <th className="px-6 py-3 text-left text-[13px] font-medium text-gray-500 tracking-wider">제목</th>
          <th className="px-6 py-3 text-left text-[13px] font-medium text-gray-500 tracking-wider">작성자</th>
          <th className="px-6 py-3 text-left text-[13px] font-medium text-gray-500 tracking-wider">등록일</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {boards.map((board)=>
        <tr key={board.id}>
           <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-900">
            <input 
            type='checkbox'
            checked={board.isChecked}
            onChange={(e)=>changeCheckbox(e,board.id)}
      
            
            />
            </td>
            <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-900" onClick={()=>gotoDetail(board.id)}>{board.id}</td>
            <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-900" onClick={()=>gotoDetail(board.id)}>{board.title}</td>
            <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-900" onClick={()=>gotoDetail(board.id)}>{board.content}</td>
          </tr>
        )}
    
           
          
       
    
    
      </tbody>
     
    </table>
 



  </div>



    )
}

export default Categories;
