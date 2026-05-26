import React, { useEffect, useState } from 'react'
import api from '../api';

const AssignedMembers = ({ card }) => {

    const [show, setshow] = useState(false);
    const [members, setMembers] = useState([]);

    const fetchMembers = async (e) => {

        try {
            const response = await api.get(`/api/cards/${card.id}/assign/`);
            setMembers(response.data)

            console.log(response.data)

        }
        catch (error) {
            console.log(error)
        }
    }

    const handleUnassign = async (memberId) => {

        try {

            await api.delete(`/api/cards/${card.id}/assign/`,
                {
                    data: { user_id: memberId }
                }
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

            <div>
                {members.map((member) => (
                    <div key={member.id}>
                        <p className='p-2'>
                            {member.username}
                        </p>
                        <button
                            onClick={() => handleUnassign(member.id)}
                        >
                            Unassign
                        </button>
                    </div>
                ))}
                <button onClick={() => setshow(false)}>close</button>
            </div>
        ) :
            (
                <button onClick={() => setshow(true)}> show members assigned</button>
            )

    )
}

export default AssignedMembers