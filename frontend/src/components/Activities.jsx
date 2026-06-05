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
            `wss:https://kanban-core.onrender.com/ws/boards/${board.id}/`
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
        <div className="space-y-2">
            {activities.results.map((activity) => (
                <div
                    key={activity.id}
                    className="bg-[#FAF9EE] border border-[#A2AF9B] rounded-xl p-3 shadow-sm"
                >
                    <span className="font-bold text-[#556052]">
                        {activity.username}
                    </span>

                    <span className="ml-1 text-gray-700">
                        {activity.action}
                    </span>
                </div>
            ))}
        </div>
    )
}

export default Activities