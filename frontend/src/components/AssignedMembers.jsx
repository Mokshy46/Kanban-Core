import React, { useEffect, useState } from 'react'
import api from '../api';

const AssignedMembers = ({ card }) => {

    const [show, setshow] = useState(false);
    const [members, setMembers] = useState([]);

    const fetchMembers = async (e) => {

        try {
            const response = await api.get(`/api/cards/${card.id}/assign/`);
            setMembers(response.data);
           

        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchMembers();
    }, [show]);

    return (
        show?(

            <div>
                {members.map((member) =>(
                    <div key={member.id}>
                        <p className='p-2'>
                            {member.username}
                        </p>
                    </div>
                ))}
                <button onClick={() => setshow(false)}>close</button>
            </div>
        ):
        (
            <button onClick={() => setshow(true)}> show members assigned</button>
        )
       
    )
}

export default AssignedMembers