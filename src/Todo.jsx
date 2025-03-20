import { useEffect, useState } from 'react'
import './App.css'
import db from './firebase';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';

function Todo() {
  const [todos, setTodos] = useState([]);
  const [inputTodo, setInputTodo] = useState("");
  const [editId, setEditId] = useState();
  const [tempInput, setTempInput] = useState("");

  const getTodos = async() => {
    const query = await getDocs(collection(db, "todo"));
    const newTodos = [];
    query.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      const todo = {id, ...data};
      newTodos.push(todo);
    });

    setTodos(newTodos);
  };

  function changeInput(e){
    setInputTodo(e.target.value);
  }

  async function saveTodo(){
    console.log("inputTodo ",inputTodo)
    const docRef = await addDoc(collection(db, "todo"), {content: inputTodo});
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()) {
      const newTodos = [...todos, {id: docSnap.id, ...docSnap.data()}]
      setTodos(newTodos);
      setInputTodo("");
    }
  }

  async function editTodo(targetId,content) {
    setEditId(targetId);
    setTempInput(content);
   }
  

  function changeEdit(e){
    setTempInput(e.target.value);
  }

  async function editDone(targetId){
    console.log("완료클릭시",222);
    const docRef = doc(db, "todo",targetId);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()){
      await updateDoc(docRef, { content: tempInput});
      console.log("tempINput", tempInput);

      const updatedTodos = todos.map((todo) =>todo.id ===targetId?
      {...todo, content: tempInput} : todo );
        setTodos(updatedTodos);
      } else {
        alert("존재하지않는 할일입니다.");
    }

    setEditId();
    
  }
  

  async function deleteTodo(targetTodo) {
    console.log(targetTodo);
    const docRef = doc(db, "todo", targetTodo.id);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()) {
      await deleteDoc(docRef);
      const filteredTodo = todos.filter((todo) => todo.id !== targetTodo.id);
      setTodos(filteredTodo);
    } else {
      alert("존재하지않는 할일입니다.")
    }
    
    
  }

  useEffect(() => {
    getTodos();
  }, []);

  return (
      <div>
        {
          todos && todos.length > 0 && todos.map((todo) => (
            <div>
              <div key={todo.id}></div>

      {/* 수정중 일때 -> input으로 전환 */}
            {editId === todo.id?
              <>
              <div className='input-container'>
                <input
                  className='edit-input'
                  type='text'
                  onChange={changeEdit}
                  value={tempInput}
                  />
                  <button className='btn' onClick={() => editDone(todo.id)}>완료</button>
                </div>
              </>
                : 
              <>
              <div className='contents-container'>
                <div className='contents-list'>{todo.content}</div> 
                <button className='btn' onClick={() => editTodo(todo.id, todo.content)}>수정</button>
                <button className='btn' onClick={() => deleteTodo(todo)}>삭제</button>
              </div>
              </>
            }
              
             
              
            </div>
          ))
        }
        <div className='save-input-container'>
        <input
         className='save-input'
          type="text"
          onChange={changeInput}
          value={inputTodo}
          placeholder='등록할 내용을 입력해주세요.'
        />
        <button  className='btn' onClick={saveTodo}>등록</button>
        </div>
    </div>
  )
}

export default Todo;
