import api from '../api'
import { useState } from 'react'

const UandDList = ({ list, refreshList }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(list.title);


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
        }

        catch (error) {
            console.log(error)
        }

    }

    const handleDelete = async (e) => {
        e.preventDefault()

        try {
            await api.delete(`/api/lists/${list.id}/`)

            refreshList();
        }

        catch (error) {
            console.log(error)
        }

    }

    return (
        isEditing ? (
            <div className="space-y-3">
                <input
                    type="text"
                    value={title}
                    onChange={handleChange}
                    className="w-full rounded-xl px-4 py-2 bg-[#FAF9EE] border border-[#A2AF9B] focus:outline-none focus:ring-2 focus:ring-[#A2AF9B]"/>

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
            <div className="flex justify-between gap-2">
                <button onClick={() => setIsEditing(true)} className="btn-secondary">Edit</button>

                <button onClick={handleDelete} className="btn-danger"> Delete</button>
            </div>
        )


    )
}

export default UandDList