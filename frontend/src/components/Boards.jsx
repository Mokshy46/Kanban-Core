import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UandDBoard from "./UandDBoard";
import LogoutButton from "./Logout";
import { VscAccount } from "react-icons/vsc";

const Boards = () => {
  const [boards, setBoards] = useState([]);

  const navigate = useNavigate();

  const fetchBoards = async () => {
    try {
      const res = await api.get("/api/boards/");
      setBoards(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <div className=" heading min-h-screen bg-[#FAF9EE] w-full">
      <div className="justify-between flex gap-2 mx-3 items-center">

        <div className="flex items-center gap-2 my-3">

          <Link
            to="/profile"
            className="btn-secondary inline-flex gap-1">
           <VscAccount className=" font-bold text-2xl"/> 
           <h1>Profile</h1>
          </Link>

          <LogoutButton />

        </div>

        <h1 className="text-center text-3xl md:text-5xl font-bold my-6">
          Boards
        </h1>

        <Link
          to="/create"
          className="btn-primary text-white shrink-0 p-2 px-3 rounded-3xl mt-3 h-10 active:scale-95 transition transform duration-150" >
          ADD +
        </Link>

      </div>


      {boards.length === 0 ? (
        <div className="flex heading text-3xl md:text-7xl text-center items-center justify-center min-h-[70vh] font-bold text-gray-300">
          <p>No Boards to Show </p>
        </div>
      ) : (<div>
        <div className=" flex text-4xl text-center justify-center font-bold items-center underline">
          <p>Your Boards</p>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 m-4 items-start">
          {boards.map((board) => (
            <div key={board.id}
              className=" md:m-4 rounded-2xl shadow-gray-400 md:p-6 text-center items-center bg-white border-2 border-[#A2AF9B] shadow-lg">
              <h2 className="text-xl w-full break-words">{board.title}</h2>
              <p className=" text-gray-600">Owner: {board.owner}</p>
              <button className="font-extrabold my-2 btn-primary" onClick={() => navigate(`/boards/${board.id}`)}> view</button>

              <UandDBoard board={board} refreshBoard={fetchBoards} />

            </div>
          ))}

        </div>
      </div>)}

    </div>


  );
};

export default Boards;