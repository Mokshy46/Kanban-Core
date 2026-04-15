import api from '../api';
import { useState, useEffect } from 'react';
import AddBoardMembers from './AddBoardMembers';
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
            <AddBoardMembers board={board} refreshMemberLists={fetchBoardMembers} />

            {boardMembers.map((boardMember) => (
                <div className='m-3 flex gap-2' key={boardMember.id}>
                    <p className=' font-bold'>

                        {boardMember.username}
                        
                    </p>
                    <p className='font-semibold'>{boardMember.role} </p>

                    <DeleteBoardMembers board={board} refreshBoardMembersList={fetchBoardMembers} userId={boardMember.user}/>
                </div>

            ))}
        </div>
    )
}

export default BoardMembers