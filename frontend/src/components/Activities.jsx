import React, { useState, useEffect } from 'react'
import api from '../api';

const Activities = ({ board }) => {

    const [activities, setActivities] = useState(
        {
            results: []
        }
    );

    const fetchActivities = async () => {

        try {
            const response = await api.get(`/api/boards/${board.id}/activities/`);

            setActivities(response.data);
        }

        catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        if (!board?.id) return;

        fetchActivities();

        const socket = new WebSocket(
            `ws://127.0.0.1:8000/ws/boards/${board.id}/`
        );

        socket.onopen = () => {
            console.log("webscoket connected");

        };

        socket.onclose = () => {
            console.log("wbescoket disconnected");
        };
        socket.onerror = (e) => console.log("ERROR", e);


        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);

            if (data.type === "activity") {

                setActivities(prev => ({
                    ...prev,
                    results: [
                        ...prev.results,
                        {
                            id: Date.now(),
                            username: data.user,
                            action: data.action,
                        }
                    ]
                }));
            }
        }
        return () => {
            socket.close();
        };


    }, [board?.id])

    return (
        <div>
            {activities.results.map((activity) => (
                <div className='font-semibold m-2' key={activity.id}>
                    <span>{activity.username} </span>{activity.action}
                </div>
            ))}
        </div>
    )
}

export default Activities