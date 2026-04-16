import { useEffect, useState } from "react";
import api from "../api"; 
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UandDBoard from "./UandDBoard";

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
    <div className=" heading min-h-screen">
      <Link to="/create" className=" bg-black text-white absolute right-0 rounded-3xl m-3 p-3 active:scale-95 transition transform duration-150"> ADD +</Link>

      <h1 className=" text-center text-3xl font-bold m-8">Boards</h1>

      <div className="grid grid-cols-4 justify-center">


        {boards.map((board) => (
          
          <div key={board.id}
            className="m-4 rounded-2xl shadow-2xl shadow-gray-400 p-6 text-center">
            <h2>{board.title}</h2>
            <p>Owner: {board.owner}</p>
            <p>{board.created_at}</p>
            <UandDBoard  board={board} refreshBoard={fetchBoards} />

            <button className="font-extrabold" onClick={() => navigate(`/boards/${board.id}`)}> view</button>
          </div>
        ))}

      </div>

    </div>


  );
};

export default Boards;