import api from '../api'
import { useState } from 'react'
import { CiMenuKebab } from "react-icons/ci";
import { toast } from 'react-toastify';

const UandDList = ({ list, refreshList }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(list.title);
    const [showMenu, setShowMenu] = useState(false);

    const handleChange = (e) => {
        setTitle(e.target.value)

    }
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await api.patch(`/api/lists/${list.id}/`, {
                title,
            })

            setTitle(response.data.title);
            setIsEditing(false)
            refreshList();
            toast.success("Updated Successfully")
        }

        catch (error) {
            toast.error("You are not allowed to Update")
        }

    }

    const handleDelete = async (e) => {
        e.preventDefault()

        try {
            await api.delete(`/api/lists/${list.id}/`)

            refreshList();
            toast.success("Delete Successfully")
        }

        catch (error) {
           toast.error("You are not allowed to delete")
        }

    }

    return (
        isEditing ? (
            <div className="space-y-3">
                <input
                    type="text"
                    value={title}
                    onChange={handleChange}
                    className="w-full rounded-xl px-4 py-2 bg-[#FAF9EE] border border-[#A2AF9B] focus:outline-none focus:ring-2 focus:ring-[#A2AF9B]" />

                <div className="flex justify-between gap-2">
                    <button onClick={handleUpdate} className="btn-primary">
                        Save
                    </button>

                    <button onClick={() => setIsEditing(false)} className="btn-danger">
                        Cancel
                    </button>
                </div>
            </div>
        ) : (
            <div className="relative">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="text-2xl font-bold px-2 hover:bg-[#FAF9EE] rounded-lg"
                >
                    <CiMenuKebab />

                </button>

                {showMenu && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-[#A2AF9B] rounded-xl shadow-lg z-50">

                        <button
                            onClick={() => {
                                setIsEditing(true);
                                setShowMenu(false);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-[#FAF9EE] rounded-t-xl"
                        >
                            Edit
                        </button>

                        <button
                            onClick={handleDelete}
                            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-[#FAF9EE] rounded-b-xl"
                        >
                            Delete
                        </button>

                    </div>
                )}
            </div>
        )


    )
}

export default UandDList