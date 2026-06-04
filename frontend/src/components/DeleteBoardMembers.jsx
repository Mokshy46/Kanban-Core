import React, { useState } from 'react'
import api from '../api'
import { toast } from 'react-toastify';

const DeleteBoardMembers = ({ board, userId, refreshBoardMembersList, boardMember }) => {

    const [role, setRole] = useState(boardMember.role);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        e.preventDefault();
        setRole(e.target.value)
    }

    const handleUpdate = async (e) => {

        e.preventDefault();

        try {
            const response = await api.patch(`/api/boards/${board.id}/update_role/${userId}/`, {
                role
            })

            setRole("");
            refreshBoardMembersList();
            toast.success("Role updated successfully")
        }

        catch (error) {
            toast.error("You do not have permission to change this member's role")
        }

    }

    const handleDelete = async () => {
        if (!board?.id || !userId) return;

        try {
            await api.delete(`/api/boards/${board.id}/remove_member/${userId}/`)
            refreshBoardMembersList();
            toast.success("Member deleted successfully")
        }

        catch (error) {
            toast.error("You do not have permission to remove this member")
        }


    }
    return (
        <div>
            {error && (
                <p className="text-red-500 text-sm">
                    {error}
                </p>
            )}
            {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-3">

                    <select
                        value={role}
                        onChange={handleChange}
                        className="w-full rounded-xl px-3 py-2 bg-[#FAF9EE] border border-[#A2AF9B] focus:outline-none focus:ring-2 focus:ring-[#A2AF9B]"
                    >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                        <option value="owner">Owner</option>
                    </select>

                    <div className="flex justify-between gap-2">

                        <button
                            type="submit"
                            className="btn-primary"
                        >
                            Save
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="btn-danger"
                        >
                            Cancel
                        </button>

                    </div>

                </form>
            ) : (
                <div className="flex gap-2">

                    <button
                        onClick={() => setIsEditing(true)}
                        className="btn-secondary"
                    >
                        Edit Role
                    </button>

                    <button
                        onClick={handleDelete}
                        className="btn-danger"
                    >
                        Remove
                    </button>

                </div>
            )}
        </div>
    )
}

export default DeleteBoardMembers