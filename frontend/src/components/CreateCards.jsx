import axios from 'axios';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import api from "../api";

const CreateCards = ({ listId, setCards }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [isAdding, setIsAdding] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) return;

    try {
      const response = await api.post(
        `/api/lists/${listId}/cards/`,
        formData
      );

      setCards((prev) => [...prev, response.data]);

      setFormData({ title: "", description: "" });
      setIsAdding(false);
    } catch (error) {
      console.log(error);
    }
  };

  return isAdding ? (
    <div className="bg-gray-800 p-3 rounded w-64">
      <input
        name="title"
        className="w-full p-2 mb-2"
        placeholder="Enter card title..."
        value={formData.title}
        onChange={handleChange}
        autoFocus
      />

      <textarea
        name="description"
        className="w-full p-2 mb-2"
        placeholder="Enter description..."
        value={formData.description}
        onChange={handleChange}
      />

      <button onClick={handleSubmit} className="bg-blue-500 px-3 py-1 mr-2">
        Add Card
      </button>

      <button onClick={() => setIsAdding(false)}>Cancel</button>
    </div>
  ) : (
    <button
      onClick={() => setIsAdding(true)}
      className="bg-gray-700 p-3 rounded w-64 text-left"
    >
      + Add another card
    </button>
  );
};
export default CreateCards