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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    }

    )
  }


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
      <div>
        <button onClick={() => setIsEditing(true)}>edit</button>
        <button onClick={handleDelete}>delete</button>
      </div>
  )
}

export default UandDCards