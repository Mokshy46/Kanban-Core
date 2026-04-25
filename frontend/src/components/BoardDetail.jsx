import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import List from "./List";
import CreateLists from "./CreateLists";
import UandDList from "./UandDList";
import BoardMembers from "./BoardMembers";
import Activities from "./Activities";
import InviteUser from "./InviteUser";

const BoardDetail = () => {
  const { id } = useParams();

  const [lists, setLists] = useState([]);
  const [board, setBoards] = useState(null);
  const [activities, setActivities] = useState(false);


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

  useEffect(() => {
    fetchLists();
  }, [id]);

  return (
    <div className="p-5">

      <button onClick={() => setActivities(true)} className="font-bold">Show Activity Log</button>

      {activities && (
        <div>
          <Activities board={board} />
          <button onClick={() => setActivities(false)} className="font-bold"> Close </button>
        </div>
      )}

      <InviteUser boardId={id} />
      <h1 className="text-2xl font-bold mb-5">
        {board ? board.title : "Loading..."}
      </h1>
      <BoardMembers board={board} />

      <div className="flex gap-4 overflow-x-auto">
        {lists.map((list) => (
          <div key={list.id}>
            <List list={list} />
            <UandDList list={list} refreshList={fetchLists} />
          </div>
        ))}

        <CreateLists boardId={id} setLists={setLists} />
      </div>
    </div>
  );
};

export default BoardDetail;