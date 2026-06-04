import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import List from "./List";
import CreateLists from "./CreateLists";
import BoardMembers from "./BoardMembers";
import Activities from "./Activities";
import InviteUser from "./InviteUser";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { IoMdPerson } from "react-icons/io";
import { IoMdPersonAdd } from "react-icons/io";
import { RxActivityLog } from "react-icons/rx";
import { HiMenu } from "react-icons/hi";
import { Link } from "react-router-dom";

const BoardDetail = () => {
  const { id } = useParams();

  const [lists, setLists] = useState([]);
  const [board, setBoards] = useState(null);
  const [activities, setActivities] = useState(false);
  const [showActivities, setShowActivities] = useState(false);
  const [showInvites, setShowInvites] = useState(false);
  const [showBoardMembers, setShowBoardMembers] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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
            String(list.id) === source.droppableId
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
    <div className="p-5 heading min-h-screen bg-[#FAF9EE] w-full">

      <nav className="flex justify-between md:flex-row md:justify-between gap-4 relative m-3">

        <div className="flex items-center gap-3">

          <Link
            to="/boards"
            className="btn-secondary">
            ← Boards
          </Link>

          <h1 className="text-2xl md:text-3xl font-bold break-words">
            {board ? board.title : "Loading..."}
          </h1>

        </div>

        {/* HAMBURGER */}
        <div className="relative md:hidden">
          <button
            onClick={() => setShowMenu(prev => !prev)}
            className="btn-primary p-2"
          >
            <HiMenu className="text-2xl" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-12 bg-white border border-[#A2AF9B] rounded-xl shadow-lg p-2 z-50 w-48">

              <button
                onClick={() => {
                  setShowBoardMembers(true);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg"
              >
                Members
              </button>

              <button
                onClick={() => {
                  setShowInvites(true);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg"
              >
                Invite User
              </button>

              <button
                onClick={() => {
                  setShowActivities(true);

                }}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg"
              >
                Activity Log
              </button>

            </div>
          )}
        </div>


        <div className="hidden md:flex flex-wrap gap-2 relative">
          <div>
            <button className="btn-primary" onClick={() => setShowBoardMembers(true)}>
              <div className=" flex ">
                <IoMdPerson className="text-xl mx-1" />
                Members
              </div>
            </button>
          </div>


          <div>
            <button className="btn-primary" onClick={() => setShowInvites(true)}>
              <div className=" flex ">
                <IoMdPersonAdd className="text-xl mx-1" />
                Invite User
              </div>
            </button>
          </div>


          <div>
            <button
              onClick={() => setShowActivities(prev => !prev)}
              className="btn-primary">
              <div className=" flex ">
                <RxActivityLog className="text-xl mx-1" />
                Activity Log
              </div>
            </button>
          </div>




        </div>

        {/* BOARD MEMBERS */}
        {showBoardMembers && (
          <>

            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setShowBoardMembers(false)}
            />

            <div className=" fixed md:absolute inset-x-4 top-20 md:inset-auto md:right-8 md:top-14 w-auto md:w-[500px] max-h-[70vh] md:max-h-[500px] overflow-y-auto bg-white border border-[#A2AF9B] rounded-2xl shadow-xl p-4 z-50 ">

              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">Board Members</h2>
                <button
                  onClick={() => setShowBoardMembers(false)}
                  className=" absolute  top-4  right-4  text-red-500 text-3xl  font-bold  hover:scale-110  transition ">
                  X
                </button>
              </div>
              <BoardMembers board={board} />
            </div>
          </>
        )}

        {/* INVITE MEMBERS */}
        {showInvites && (
          <>
            <div className=" fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setShowInvites(false)} />
            <div
              className="fixed inset-0 flex items-center justify-center z-50">
              <div className=" bg-white rounded-2xl p-6 shadow-xl relative w-[95vw] max-w-[500px]">
                <button
                  onClick={() => setShowInvites(false)}
                  className=" absolute  top-4  right-4  text-red-500 text-3xl  font-bold  hover:scale-110  transition">
                  X
                </button>

                <InviteUser boardId={id} />
              </div>
            </div>
          </>
        )}


        {/* ACTIVITIES */}
        {showActivities && (
          <>
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setShowActivities(false)}
            />

            <div
              className=" fixed md:absolute inset-x-4 top-20 md:inset-auto md:right-8 md:top-14 w-auto md:w-[400px] max-h-[70vh] md:max-h-[500px] overflow-y-auto bg-white border border-[#A2AF9B] rounded-2xl shadow-xl p-4 z-50 ">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">Activity Log</h2>

                <button
                  onClick={() => setShowActivities(false)}
                  className="absolute top-4 right-4 text-red-500 text-3xl font-bold hover:scale-110 transition">
                  X
                </button>
              </div>

              <Activities board={board} />
            </div>
          </>
        )}

      </nav>


      <DragDropContext onDragEnd={onDragEnd}>

        <div className="flex gap-4 overflow-x-auto pb-4 items-start">
          {lists.map((list) => (
            <Droppable droppableId={String(list.id)} key={list.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="shrink-0 w-[280px] md:w-[320px]">
                  <List list={list} board={board} setLists={setLists} refreshList={fetchLists} />
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