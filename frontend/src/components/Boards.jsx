import { useEffect, useState } from "react";
import api from "../api"; // your axios instance
import Cards from "./Cards";
import { Link } from "react-router-dom";


const Boards = () => {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await api.get("/api/boards/");
        setBoards(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBoards();
  }, []);

  return (
    <div className=" heading min-h-screen">
      <Link to="/create" className=" bg-black text-white absolute right-0 rounded-3xl m-3 p-3 active:scale-95 transition transform duration-150"> ADD +</Link>

      <h1 className=" text-center text-3xl font-bold m-8">Boards</h1>

      <div className="grid grid-cols-4 justify-center">


        {boards.map((board) => (
          <div key={board.id} className="m-4 rounded-2xl shadow-2xl shadow-gray-400 p-6 text-center">
            <h2>{board.title}</h2>
            <p>Owner: {board.owner}</p>
            <p>{board.created_at}</p>
          </div>
        ))}

      </div>
      <Cards />
    </div>


  );
};

export default Boards;