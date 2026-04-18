import React from 'react'
import { useState } from 'react'
import api from '../api'

const UandDCards = ({ card, refreshCards }) => {

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(
    {
      title: card.title,
      description: card.description,
    }
  )
  const [assignMember, setAssignMember] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

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
    e.preventDefault()

    try {
      const response = await api.patch(`/api/cards/${card.id}/`, formData)

      setFormData(response.data)
      setIsEditing(false)
      refreshCards();
    }

    catch (error) {
      console.log(error)
    }
  }

  const handleAssign = async (e) => {

    try {
      const response = await api.post(`/api/cards/${card.id}/assign/`,
        { email: assignMember, }
      );
      setAssignMember("");
      setIsAssigning(false);
      refreshCards();
    }

    catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (e) => {

    try {
      await api.delete(`/api/cards/${card.id}/`)
      refreshCards();
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    isEditing ? (
      <div>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />

        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <button onClick={handleUpdate}>Save</button>
        <button onClick={() => {
          setFormData({
            title: card.title,
            description: card.description
          });
          setIsEditing(false)
        }}>Cancel</button>
      </div>

    ) :
      <div className='flex'>
        <div className='gap-1'>
          <button onClick={() => setIsEditing(true)}>edit</button>
          <button onClick={handleDelete}>delete</button>
        </div>

        {isAssigning ? (
          <div>
            <input
              type="email"
              value={assignMember}
              onChange={handleAssignChange}
              placeholder="Enter email"
            />

            <button onClick={handleAssign}>Assign</button>
            <button onClick={() => {
              setIsAssigning(false);
              setAssignMember("");
            }}>
              Cancel
            </button>
          </div>
        ) : (
          <div>
            <button onClick={() => setIsAssigning(true)}>
              Assign Member
            </button>
          </div>
        )}
      </div>
  )
}

export default UandDCards