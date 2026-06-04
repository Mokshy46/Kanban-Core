import { useEffect, useState } from "react";
import api from "../api";
import CreateCards from "./CreateCards";
import UandDCards from "./UandDCards";
import AssignedMembers from "./AssignedMembers";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import UandDList from "./UandDList";
const List = ({ list, board, setLists, refreshList }) => {


  const [members, setMembers] = useState([]);

  const fetchMembers = async () => {
    const res = await api.get(`/api/cards/${card.id}/assign/`);
    setMembers(res.data);
  };

  return (
    <div className="bg-white border-2 border-[#A2AF9B] rounded-2xl shadow-lg p-4 w-[280px] md:w-[320px] shrink-0">

      <div className=" flex justify-between">
        <h2 className="font-bold text-xl mb-4 break-words">
          {list.title}
        </h2>
        <UandDList list={list} refreshList={refreshList} />
      </div>


      {list.cards.map(
        (card, index) => (
          <Draggable
            key={card.id}
            draggableId={String(card.id)}
            index={index} >
            {(provided) => (
              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="my-3" >

                <div className="bg-[#FAF9EE] border flex justify-between border-[#A2AF9B] rounded-xl p-3 mb-2 shadow-sm break-words font-medium">
                  <h>
                    {card.title}
                  </h>
                  <div>
                    <UandDCards card={card} board={board} setLists={setLists} fetchMembers={fetchMembers} />

                  </div>
                </div>

                <AssignedMembers card={card} members={members} setMembers={setMembers} />
              </div>
            )}

          </Draggable>

        ))}
      <CreateCards listId={list.id} setLists={setLists} />


    </div>
  );
};

export default List;