import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UandDBoard from "./UandDBoard";
import LogoutButton from "./Logout";

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
    <div className=" heading min-h-screen bg-[#FAF9EE]">
      <div className="justify-between flex gap-2 m-3">

        <div><LogoutButton /></div>

        <div>
          <h1 className=" text-center text-5xl font-bold m-8">Boards</h1>
        </div>

        <Link
          to="/create"
          className=" btn-primary text-white p-2 px-3 rounded-3xl mt-3 h-10 active:scale-95 transition transform duration-150">
          ADD +
        </Link>
      </div>


      {boards.length === 0 ? (
        <div className=" flex heading text-7xl text-center items-center justify-center min-h-screen font-bold text-gray-300">
          <p>No Boards to Show </p>
        </div>
      ) : (<div>
        <div className=" flex text-4xl text-center justify-center font-bold items-center underline">
          <p>Your Boards</p>
        </div>
        <div className="grid grid-cols-4 justify-center ">
          {boards.map((board) => (

            <div key={board.id}
              className="m-4 rounded-2xl shadow-gray-400 p-6 text-center bg-white border-2
            border-[#A2AF9B] shadow-lg">
              <h2 className=" text-xl">{board.title}</h2>
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