import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import db from './firebase';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';

function App() {
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState([]);
  const [inputTodo, setInputTodo] = useState("");

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

  async function updateTodo() {
    
    // await updateDoc(docRef, {content:"수정할내용"})
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
              <p key={todo.id}>{todo.content}</p>

              <button>수정</button>
              <button onClick={() => deleteTodo(todo)}>삭제</button>
            </div>
          ))
        }
        <input
          type="text"
          onChange={changeInput}
          value={inputTodo}
        />
        <button onClick={saveTodo}>등록</button>
    </div>
  )
}

export default App
