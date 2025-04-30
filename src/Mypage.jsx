import React from "react";
import Header from "./Components/Header";

function Mypage() {
  return (
    <>
      <Header />
      <div className="flex justify-center">
        <div className="flex text-left leading-10 mb-25 bg-gray-100 w-[95%] min-h-100 rounded-2xl mt-30 shadow-md">
          <div className="mt-10 ml-10">
            <div className="flex justify-center bg-[#B8BEBE] h-70 w-60 rounded-2xl">
              <img src="/profile_pic.svg" className="mb-10 w-50 " />
            </div>
          </div>
          <div className="ml-10 mt-10">
            <div className="flex font-semibold text-[20px] mb-5">
              Jane Kim
              <img src="/edit.svg" className="w-5 ml-2 cursor-pointer" />
            </div>
            <div className="flex">
              <span className="mr-4 text-[14px]">이메일</span>
              <span>cross.jane.kim@gmail.com</span>
            </div>
            {/* <button className="bg-white border rounded text-[14px] px-4 mt-5 cursor-pointer">
          비밀번호 변경
        </button> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Mypage;
