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
        <div>

            {boardMembers.map((boardMember) => (
                <div className='m-3 flex gap-2' key={boardMember.id}>

                    {boardMember.avatar && (
                        <img
                            src={boardMember.avatar}
                            className='w-8 h-8 rounded-full object-cover'
                        />
                    )}
                    <p className=' font-bold'>

                        {boardMember.username}

                    </p>
                    <p className='font-semibold'>{boardMember.role} </p>

                    <DeleteBoardMembers
                        board={board}
                        refreshBoardMembersList={fetchBoardMembers}
                        userId={boardMember.user}
                        boardMember={boardMember.role}

                    />
                </div>

            ))}
        </div>
    )
}

export default BoardMembers