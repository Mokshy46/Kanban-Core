import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import api from '../api';

const AcceptInvite = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect");


    useEffect(() => {
        const tokenAuth = localStorage.getItem("access");

        if (!tokenAuth) {
            navigate(`/?redirect=/invite/${token}`);
        } else {
            setIsAuthenticated(true);
        }
    }, [token, navigate]);

    useEffect(() => {
        if (!isAuthenticated) return;
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
    }, [token, isAuthenticated]);


    const acceptInvite = async () => {
        try {
            await api.post(`/api/boards/accept_invite/${token}/`);

            alert("Joined board!");
            navigate("/boards");

        } catch (error) {
            const err = error.response?.data;

            console.log(err);

            if (err?.error === "This invite is not for you") {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");

                navigate(`/?redirect=/invite/${token}`);
            }
        }

    };
    if (!isAuthenticated) return <p>Checking authentication...</p>;

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