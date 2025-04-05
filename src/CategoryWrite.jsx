import './App.css';
import React, { useState } from 'react';


function CategoryWrite(){


    const [title, setTitle] = useState("");
    const [contents, setContents] = useState("");


    function titleChange(e){
        setTitle(e.target.value);
        
    }

    function contentChange(){

    }

    function saveClick(){
        
    }

    
    return(

        <div className='board-detail'>

            <div className='board-title'>
                <input
                    type ='text'
                    placeholder='제목을 입력해주세요.'
                    onChange={titleChange}
                    value={title}

                />
            </div>
            <div className ='board-contents'>
                <input
                    type ='text'
                    placeholder='내용을 입력해주세요.'
                    onChange={contentChange}
                    value={contents}

                />

            </div>

        <button onClick={saveClick}>등록</button>


        </div>



    )

}

export default CategoryWrite;