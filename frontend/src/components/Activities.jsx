import React, { useState, useEffect } from 'react'
import api from '../api';

const Activities = ({ board }) => {

    const [activities, setActivities] = useState([]);

    const fetchActivities = async () => {

        try {
            const response = await api.get(`/api/boards/${board.id}/activities/`);

            setActivities(response.data)
        }

        catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        if (!board) return;
        fetchActivities();
    }, [board?.id])

    return (
        <div>
            {activities.map((activity) => (
                <div className='font-semibold m-2' key={activity.id}>
                    <span>{activity.username} </span>{activity.action}
                </div>
            ))}
        </div>
    )
}

export default Activities