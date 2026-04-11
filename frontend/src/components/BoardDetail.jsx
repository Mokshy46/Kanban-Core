import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import List from "./List";
import CreateLists from "./CreateLists";

const BoardDetail = () => {
  const { id } = useParams();

  const [lists, setLists] = useState([]);
  const [board, setBoards] = useState(null);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await api.get(`/api/boards/${id}/lists/`);
        setLists(res.data);


        const boardResponse = await api.get(`/api/boards/${id}/`);
        setBoards(boardResponse.data);

      } catch (err) {
        console.log(err);
      }
    };

    fetchLists();
  }, [id]);

  return (
    <div className="p-5">
      
        <h1 className="text-2xl font-bold mb-5">
          {board ? board.title : "Loading..."}
        </h1>

      <div className="flex gap-4 overflow-x-auto">
        {lists.map((list) => (
          <List key={list.id} list={list} />
        ))}

        <CreateLists boardId={id} setLists={setLists} />
      </div>
    </div>
  );
};

export default BoardDetail;