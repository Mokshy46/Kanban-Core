import React from 'react'
import { useState, useEffect } from 'react'
import api from '../api'
import { CiMenuKebab } from "react-icons/ci";

const UandDCards = ({ card, setLists, board}) => {

  const [isEditing, setIsEditing] = useState(false)
  const [boardMembers, setBoardMembers] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [formData, setFormData] = useState(
    {
      title: card.title,
      description: card.description,
    }
  )
  const [assignMember, setAssignMember] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const fetchBoardMembers = async () => {
    try {
      const response = await api.get(
        `/api/boards/${board.id}/members/`
      );
      console.log(response.data);

      setBoardMembers(response.data);

    }

    catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {

    if (board?.id) {
      fetchBoardMembers();
    }

  }, [board?.id]);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    }

    )
  }

  const handleAssignChange = (e) => {
    setAssignMember(e.target.value);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {

      const response = await api.patch(
        `/api/cards/${card.id}/`,
        formData
      );

      const updatedCard = response.data;

      setLists((prevLists) =>

        prevLists.map((list) => ({

          ...list,

          cards: list.cards.map((c) => c.id === updatedCard.id ? updatedCard : c),
        }))
      );

      setFormData(updatedCard);

      setIsEditing(false);

    } catch (error) {
      console.log(error);
    }
  };

  const handleAssign = async (e) => {

    try {
      const response = await api.post(`/api/cards/${card.id}/assign/`,
        { user_id: assignMember }
      );
      setAssignMember("");
      setIsAssigning(false);
    }

    catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async () => {
    setLists((prevLists) =>

      prevLists.map((list) => ({

        ...list,

        cards: list.cards.filter((c) => c.id !== card.id),
      }))
    );

    try {
      await api.delete(`/api/cards/${card.id}/`);
    }
    catch (error) {
      console.log(error);
    }
  };

  return (
    isEditing ? (
      <div className="space-y-3">

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Card title"
          className="w-full rounded-xl px-4 py-2 bg-[#FAF9EE] border border-[#A2AF9B] focus:outline-none focus:ring-2 focus:ring-[#A2AF9B]"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          rows={3}
          className="w-full rounded-xl px-4 py-2 bg-[#FAF9EE] border border-[#A2AF9B] focus:outline-none focus:ring-2 focus:ring-[#A2AF9B] resize-none"
        />

        <div className="flex justify-between gap-2">
          <button
            onClick={handleUpdate}
            className="btn-primary"
          >
            Save
          </button>

          <button
            onClick={() => {
              setFormData({
                title: card.title,
                description: card.description
              });
              setIsEditing(false);
            }}
            className="btn-danger"
          >
            Cancel
          </button>
        </div>

      </div>
    ) : (
      <div className="relative">

        <div className="flex justify-end">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-2xl font-bold px-2 py-1 rounded-lg hover:bg-[#FAF9EE]"
          >
            <CiMenuKebab className='text-xl'/>
          </button>
        </div>

        {showMenu && (
          <div className="absolute right-0 top-10 w-40 bg-white border border-[#A2AF9B] rounded-xl shadow-lg z-50">

            <button
              onClick={() => {
                setIsEditing(true);
                setShowMenu(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-[#FAF9EE]"
            >
              Edit
            </button>

            <button
              onClick={() => {
                setIsAssigning(true);
                setShowMenu(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-[#FAF9EE]"
            >
              Assign Member
            </button>

            <button
              onClick={() => {
                handleDelete();
                setShowMenu(false);
              }}
              className="block w-full text-left px-4 py-2 text-red-500 hover:bg-[#FAF9EE]"
            >
              Delete
            </button>

          </div>
        )}

        {isAssigning && (
          <div className="space-y-2 mt-2">

            <select
              value={assignMember}
              onChange={handleAssignChange}
              className="w-full rounded-xl px-3 py-2 bg-[#FAF9EE] border border-[#A2AF9B] focus:outline-none focus:ring-2 focus:ring-[#A2AF9B]"
            >
              <option value="">Select Member</option>

              {boardMembers.map((member) => (
                <option
                  key={member.id}
                  value={member.user}
                >
                  {member.username}
                </option>
              ))}
            </select>

            <div className="flex justify-between gap-2">
              <button
                onClick={handleAssign}
                className="btn-primary"
              >
                Assign
              </button>

              <button
                onClick={() => {
                  setIsAssigning(false);
                  setAssignMember("");
                }}
                className="btn-danger"
              >
                Cancel
              </button>
            </div>

          </div>
        )}

      </div>
    )
  )
}

export default UandDCards