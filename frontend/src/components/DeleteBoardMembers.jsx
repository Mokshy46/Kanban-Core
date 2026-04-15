import React from 'react'
import api from '../api'

const DeleteBoardMembers = ({ board, userId, refreshBoardMembersList }) => {

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
            <button onClick={handleDelete} className="bg-blue-500 px-3 py-1 mr-2">
                Delete Member
            </button>

        </div>
    )
}

export default DeleteBoardMembers