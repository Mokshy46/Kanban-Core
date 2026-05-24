import { useEffect, useState } from "react";
import api from "../api";
import CreateCards from "./CreateCards";
import UandDCards from "./UandDCards";
import AssignedMembers from "./AssignedMembers";
import { Draggable, Droppable } from "@hello-pangea/dnd";

const List = ({ list, board, setLists, }) => {


  

  return (
    <div className="bg-gray-200 p-4 rounded w-64 min-w-[250px]">
      <h2 className="font-bold mb-3">{list.title}</h2>

      {list.cards.map(
        (card, index) => (
          <Draggable
            key={card.id}
            draggableId={String(card.id)}
            index={index}
          >
            {(provided) => (
              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
                <div
                  className="bg-white p-2 rounded mb-2 shadow"

                >
                  {card.title}
                </div>
                <AssignedMembers card={card} />
                <UandDCards card={card} board={board} setLists={setLists} />
                {provided.placeholder}
              </div>
            )}

          </Draggable>

        ))}

      <CreateCards listId={list.id} setLists={setLists} />
    </div>
  );
};

export default List;