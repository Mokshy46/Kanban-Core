import { useState } from 'react'
import api from "../api";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

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
            toast.success("List Created Successfully")
            setIsAdding(false);
        }
        catch (error) {
            console.log(error);
            toast.error("A list title is required")


        }
    };

    return isAdding ? (

        <div className="bg-white border-2 border-[#A2AF9B] rounded-2xl shadow-lg p-4 w-[280px] md:w-[320px] shrink-0">

            {error && (
                <p className="mb-3 text-sm font-medium text-red-600">{error} </p>
            )}
            <input
                className="w-full rounded-xl px-4 py-3 mb-3 bg-[#FAF9EE] border border-[#A2AF9B] focus:outline-none focus:ring-2 focus:ring-[#A2AF9B]"
                placeholder="Enter list title..."
                value={title}
                onChange={(e) => {
                    setTitle(e.target.value);
                    setError("");
                }}
                autoFocus
            />

            <div className="flex justify-between gap-2">
                <button
                    onClick={handleSubmit}
                    className="btn-primary"
                >
                    Add List
                </button>

                <button
                    onClick={() => {
                        setIsAdding(false);
                        setError("");
                        setTitle("");
                    }}
                    className="btn-danger"
                >
                    Cancel
                </button>
            </div>
        </div>
    ) : (
        <button
            onClick={() => setIsAdding(true)}
            className="bg-white border-2 border-dashed border-[#A2AF9B] rounded-2xl shadow-md p-4 w-[280px] md:w-[320px] shrink-0 text-left font-semibold hover:bg-[#FAF9EE] transition"
        >
            + Add list
        </button>
    );
};
export default CreateLists