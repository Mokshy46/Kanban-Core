import api from '../api';
import { useState, useEffect } from 'react';
import DeleteBoardMembers from './DeleteBoardMembers';

const BoardMembers = ({ board }) => {
    const [boardMembers, setBoardMembers] = useState([]);


    const fetchBoardMembers = async () => {
        try {
            const response = await api.get(`/api/boards/${board.id}/members/`);
            setBoardMembers(response.data)
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (!board) return;
        fetchBoardMembers();
    }, [board?.id])

    return (
        <div className="space-y-3">

            {boardMembers.map((boardMember) => (
                <div
                    key={boardMember.id}
                    className="flex items-center justify-between bg-[#FAF9EE] border border-[#A2AF9B] rounded-xl p-3 shadow-sm"
                >

                    <div className="flex items-center gap-3">

                        {boardMember.avatar ? (
                            <img
                                src={`https://kanban-core.onrender.com${user.avatar}`} 
                                alt={boardMember.username}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-[#A2AF9B] flex items-center justify-center text-white font-bold">
                                {boardMember.username[0].toUpperCase()}
                            </div>
                        )}

                        <div>
                            <p className="font-bold break-words">
                                {boardMember.username}
                            </p>

                            <p className="text-sm text-gray-600 capitalize">
                                {boardMember.role}
                            </p>
                        </div>

                    </div>

                    <DeleteBoardMembers
                        board={board}
                        refreshBoardMembersList={fetchBoardMembers}
                        userId={boardMember.user}
                        boardMember={boardMember.role} />
               

                </div>
            ))}

        </div>
    )
}

export default BoardMembers