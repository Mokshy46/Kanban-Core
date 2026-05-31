import { useEffect, useState } from "react";
import api from "../api";
import CreateCards from "./CreateCards";
import UandDCards from "./UandDCards";
import AssignedMembers from "./AssignedMembers";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import UandDList from "./UandDList";
const List = ({ list, board, setLists, refreshList }) => {




  return (
    <div className="bg-white border-2 border-[#A2AF9B] rounded-2xl shadow-lg p-4 w-[280px] md:w-[320px] shrink-0">
      <h2 className="font-bold text-xl mb-4 break-words">
        {list.title}
      </h2>

      {list.cards.map(
        (card, index) => (
          <Draggable
            key={card.id}
            draggableId={String(card.id)}
            index={index} >
            {(provided) => (
              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >

                <div className="bg-[#FAF9EE] border border-[#A2AF9B] rounded-xl p-3 mb-2 shadow-sm break-words font-medium">
                  {card.title}
                </div>

                <AssignedMembers card={card} />
                <UandDCards card={card} board={board} setLists={setLists} />
              </div>
            )}

          </Draggable>

        ))}
      <CreateCards listId={list.id} setLists={setLists} />
      <UandDList list={list} refreshList={refreshList} />

    </div>
  );
};

export default List;