import React, { useEffect, useState } from 'react'
import api from '../api';

const AssignedMembers = ({ card }) => {

    const [show, setshow] = useState(false);
    const [members, setMembers] = useState([]);

    const fetchMembers = async () => {

        try {
            const response = await api.get(`/api/cards/${card.id}/assign/`);
            setMembers(response.data)

        }
        catch (error) {
            console.log(error)
        }
    }

    const handleUnassign = async (memberId) => {

        try {

            await api.delete(`/api/cards/${card.id}/assign/`,
                { data: { user_id: memberId } }
            );
            setMembers((prev) =>
                prev.filter((member) => member.id !== memberId)
            );

        }
        catch (error) {
            console.log(error)
        }
    };


    useEffect(() => {

        if (card?.id) {
            fetchMembers();
        }

    }, [card?.id]);

    return (

        <div className="mt-2">
            {members.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {members.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center gap-1 px-2 py-1 bg-[#A2AF9B] text-white rounded-full text-sm"
                        >
                            <span>{member.username}</span>

                            <button
                                onClick={() => handleUnassign(member.id)}
                                className="font-bold hover:text-red-200 transition"
                            >
                                x
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500 italic">
                    No members assigned yet
                </p>
            )}
        </div>
    )
}

export default AssignedMembers