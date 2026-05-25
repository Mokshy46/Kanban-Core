import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import List from "./List";
import CreateLists from "./CreateLists";
import UandDList from "./UandDList";
import BoardMembers from "./BoardMembers";
import Activities from "./Activities";
import InviteUser from "./InviteUser";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

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


  async function onDragEnd(result) {

    const { source, destination } = result;

    if (!destination) return;

    const currentList = lists.find(
      (list) => String(list.id) === source.droppableId
    );

    const destinationList = lists.find(
      (list) => String(list.id) === destination.droppableId
    );
    const currentItems = [...currentList.cards]

    const [removed] = currentItems.splice(source.index, 1);

    if (
      source.droppableId ===
      destination.droppableId
    ) {
      currentItems.splice(
        destination.index,
        0,
        removed
      );

      const updatedLists = lists.map(
        (list) => {
          if (
            String(list.id) ===
            source.droppableId
          ) {
            return {
              ...list,
              cards: currentItems,
            };
          }

          return list;
        }
      );

      setLists(updatedLists);

      try {
        await api.patch(`/api/cards/${removed.id}/moved/`,
          {
            list_id: destinationList.id,
            position: destination.index,
          }
        );

      }

      catch (error) {
        console.log(error);
      };

      return;
    }

    const destinationCards = [
      ...destinationList.cards,
    ];

    destinationCards.splice(
      destination.index,
      0,
      removed
    );

    const updatedLists = lists.map(
      (list) => {
        if (
          String(list.id) ===
          source.droppableId
        ) {
          return {
            ...list,
            cards: currentItems,
          };
        }

        if (
          String(list.id) ===
          destination.droppableId
        ) {
          return {
            ...list,
            cards: destinationCards,
          };
        }

        return list;
      }
    );

    setLists(updatedLists);

    try {
      await api.patch(`/api/cards/${removed.id}/moved/`,
        {
          list_id: destinationList.id,
          position: destination.index,
        }
      );

    }

    catch (error) {
      console.log(error);
    };


  }
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

      <DragDropContext onDragEnd={onDragEnd}>


        <div className="flex gap-4 overflow-x-auto">
          {lists.map((list) => (
            <Droppable droppableId={String(list.id)} key={list.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <List list={list} board={board} setLists={setLists} />
                  <UandDList list={list} refreshList={fetchLists} />
                  {provided.placeholder}
                </div>
              )}

            </Droppable>
          ))}

          <CreateLists boardId={id} setLists={setLists} />
        </div>
      </DragDropContext>
    </div>
  );
};

export default BoardDetail;