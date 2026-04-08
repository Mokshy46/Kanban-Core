import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import List from "./List";
import { Link } from "react-router-dom";

const BoardDetail = () => {
  const { id } = useParams();

  const [lists, setLists] = useState([]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await api.get(`/api/lists/?board=${id}`);
        setLists(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchLists();
  }, [id]);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Board {id}</h1>
      <Link to="/createcards" className=" bg-black text-white absolute right-0 rounded-3xl m-3 p-3 active:scale-95 transition transform duration-150"> ADD +</Link>

      <div className="flex gap-4 overflow-x-auto">
        {lists.map((list) => (
          <List key={list.id} list={list} />
        ))}
      </div>
    </div>
  );
};

export default BoardDetail;