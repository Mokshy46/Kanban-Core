import { useState } from 'react'
import api from "../api";
import { Link } from "react-router-dom";

const CreateLists = ({ boardId, setLists }) => {
    const [title, setTitle] = useState("")
    const [isAdding, setIsAdding] = useState(false)
    // const [success, setSuccess] = useState("")
    const [error, setError] = useState("")



    const handleSubmit = async (e) => {
        e.preventDefault();
        // setSuccess("");

        try {
            const response = await api.post(`/api/boards/${boardId}/lists/`, {
                title: title,
            });

            setLists((prev) => [...prev, response.data]);
            setTitle("");
            setIsAdding(false);



        }
        catch (error) {
            console.log(error);
            setError("Failed to create list");


        }
    };

    return isAdding ? (
        <div className="bg-gray-800 p-3 rounded w-64">
            <input
                className="w-full p-2 mb-2"
                placeholder="Enter list title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
            />

            <button onClick={handleSubmit} className="bg-blue-500 px-3 py-1 mr-2">
                Add List
            </button>
            <button onClick={() => setIsAdding(false)}>Cancel</button>
        </div>
    ) : (
        <button
            onClick={() => setIsAdding(true)}
            className="bg-gray-700 p-3 rounded w-64 text-left"
        >
            + Add another list
        </button>
    );
};
export default CreateLists