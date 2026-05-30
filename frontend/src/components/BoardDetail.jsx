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
  const [showActivities, setShowActivities] = useState(false);
  const [showInvites, setShowInvites] = useState(false);

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
    <div className="p-5 bg-[#FAF9EE] min-h-screen heading">

      <nav className="flex justify-between items-center relative">

        <h1 className="text-4xl font-bold mb-5">
          {board ? board.title : "Loading..."}
        </h1>

        <div className="relative">

          <button
            onClick={() => setShowActivities(prev => !prev)}
            className="btn-primary"
          >
            Activity Log
          </button>

          {showActivities && (
            <div
              className="
                    absolute
                    right-0
                    mt-2
                    w-[400px]
                    max-h-[500px]
                    overflow-y-auto
                    bg-white
                    border
                    border-[#A2AF9B]
                    rounded-2xl
                    shadow-xl
                    p-4
                    z-50
                "
            >

              <div className="flex justify-between items-center mb-4">

                <h2 className="font-bold text-lg">
                  Activity Log
                </h2>

                <button
                  onClick={() => setShowActivities(false)}
                  className="text-red-500 font-semibold"
                >
                  X
                </button>

              </div>

              <Activities board={board} />

            </div>
          )}

        </div>

      </nav>

      <div>
        <button className="btn-primary" onClick={() => setShowInvites(true)}>Invite User</button>
      </div>
      {showInvites && (
        <>
          <div
            className="
                fixed inset-0
                bg-black/40
                backdrop-blur-sm
                z-40"
            onClick={() => setShowInvites(false)}
          />

          <div
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div
              className=" bg-white rounded-2xl  p-6  shadow-xl  relative  w-[500px]"
            >
              <button
                onClick={() => setShowInvites(false)}
                className="absolute top-4 right-4 text-xl font-bold text-red-700"
              >
                X
              </button>

              <InviteUser boardId={id} />
            </div>
          </div>
        </>
      )}


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