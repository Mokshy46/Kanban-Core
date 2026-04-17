import React, { useState } from 'react'
import api from '../api'

const DeleteBoardMembers = ({ board, userId, refreshBoardMembersList, boardMember }) => {

    const [role, setRole] = useState(boardMember.role);
    const [isEditing, setIsEditing] = useState(false);

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
        }

        catch (error) {
            console.log(error)
        }

    }

    const handleDelete = async () => {
        if (!board?.id || !userId) return;

        try {
            await api.delete(`/api/boards/${board.id}/remove_member/${userId}/`)
            refreshBoardMembersList();
        }

        catch (error) {
            console.log(error)
        }

    }
    return (
        <div>
            {isEditing ?
                (
                    <div>

                        <form onSubmit={handleUpdate}>
                            <select value={role} onChange={handleChange}>
                                <option value="member">Member</option>
                                <option value="admin">Admin</option>
                                <option value="owner">Owner</option>

                            </select>
                            <button onClick={handleUpdate}>save</button>
                            <button type="button" onClick={() => setIsEditing(false)}> cancel</button>
                        </form>


                    </div>)
                :
                (
                    <div>
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                        <button onClick={handleDelete} className="bg-blue-500 px-3 py-1 mr-2">
                            Delete Member
                        </button>
                    </div>
                )}

        </div>
    )
}

export default DeleteBoardMembers