import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api';

const AcceptInvite = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);


    useEffect(() => {
        const tokenAuth = localStorage.getItem("access");

        if (!tokenAuth) {
            navigate(`/login?redirect=/invite/${token}`);
            return
        }
    }, [token, navigate]);


    useEffect(() => {
        const fetchInvite = async () => {
            try {
                const res = await api.get(`/api/boards/invite/${token}/`);
                setData(res.data);
            } catch (err) {
                console.log(err.response?.data);
                alert(err.response?.data?.error || "Invalid invite");
            }
        };

        fetchInvite();
    }, [token]);


    const acceptInvite = async () => {
        try {
            await api.post(`/api/boards/accept-invite/${token}/`);

            alert("Joined board!");
            navigate("/dashboard");
        } catch (err) {
            alert("Error joining board");
        }
    };

    if (!data) return <p>Loading...</p>;

    return (
        <div>
            <h2>Join Board</h2>
            <p>Board: {data.board}</p>
            <p>Role: {data.role}</p>

            <button onClick={acceptInvite}>Accept Invite</button>
        </div>
    );
}

export default AcceptInvite