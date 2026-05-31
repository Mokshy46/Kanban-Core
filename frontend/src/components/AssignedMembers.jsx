import React, { useEffect, useState } from 'react'
import api from '../api';

const AssignedMembers = ({ card }) => {

    const [show, setshow] = useState(false);
    const [members, setMembers] = useState([]);

    const fetchMembers = async (e) => {

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

        if (show && card?.id) {
            fetchMembers();
        }

    }, [show, card?.id]);

    return (
        show ? (
            <div className="bg-white border border-[#A2AF9B] rounded-2xl shadow-lg p-4 mt-2">

                <h3 className="font-bold text-lg mb-3">
                    Assigned Members
                </h3>

                <div className="space-y-2">
                    {members.map((member) => (
                        <div
                            key={member.id}
                            className="flex justify-between items-center bg-[#FAF9EE] border border-[#A2AF9B] rounded-xl p-3"
                        >
                            <p className="font-medium break-words">
                                {member.username}
                            </p>

                            <button
                                onClick={() => handleUnassign(member.id)}
                                className="btn-danger"
                            >
                                Unassign
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => setshow(false)}
                    className="btn-secondary mt-4 w-full" >
                    Close
                </button>
            </div>
        ) : (
            <button
                onClick={() => setshow(true)}
                className="btn-primary w-full"
            >
                Show Assigned Members
            </button>
        )
    )
}

export default AssignedMembers