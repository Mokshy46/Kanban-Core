import React, { useState } from 'react'
import api from "../api";

const CreateCards = ({ listId, setLists }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError("Please enter a card title.");
      return;
    }

    try {
      const response = await api.post(
        `/api/lists/${listId}/cards/`,
        formData
      );

      const newCard = response.data;

      setLists((prevLists) =>

        prevLists.map((list) => {

          if (list.id === listId) {

            return {
              ...list,
              cards: [
                ...list.cards,
                newCard
              ]
            };
          }

          return list;
        })
      );
      setFormData({ title: "", description: "" });
      setError("");
      setIsAdding(false);

    } catch (error) {
      console.log(error);
      setError("Card title is required")
    }
  };

  return isAdding ? (
    <div className="bg-white border-2 border-[#A2AF9B] rounded-2xl shadow-lg p-4">

      {error && (
        <p className="mb-3 text-sm font-medium text-red-600">{error} </p>

      )}
      <input
        name="title"
        className="w-full rounded-xl px-4 py-3 mb-3 bg-[#FAF9EE] border border-[#A2AF9B] focus:outline-none focus:ring-2 focus:ring-[#A2AF9B]"
        placeholder="Enter card title..."
        value={formData.title}
        onChange={handleChange}
        autoFocus />

      <textarea
        name="description"
        className="w-full rounded-xl px-4 py-3 mb-3 bg-[#FAF9EE] border border-[#A2AF9B] focus:outline-none focus:ring-2 focus:ring-[#A2AF9B] resize-none"
        placeholder="Enter description..."
        value={formData.description}
        onChange={handleChange}
        rows={4} />

      <div className="flex justify-between gap-2">
        <button
          onClick={handleSubmit}
          className="btn-primary" >
          Add Card
        </button>

        <button
          onClick={() => {
            setIsAdding(false);
            setError("");
            setFormData({
              title: "",
              description: "",
            });
          }}
          className="btn-danger">
          Cancel
        </button>
      </div>
    </div>
  ) : (
    <button
      onClick={() => setIsAdding(true)}
      className="w-full bg-[#FAF9EE] border border-dashed border-[#A2AF9B] rounded-xl p-3 text-left font-medium hover:bg-[#F2F0E5] transition" >
      + Add card
    </button>
  );

};
export default CreateCards