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
        <div className="min-h-screen bg-[#FAF9EE] flex items-center justify-center p-4">

            <div className="bg-white border-2 border-[#A2AF9B] rounded-2xl shadow-lg p-6 w-full max-w-md">

                <h2 className="text-3xl font-bold text-center mb-6">
                    Join Board
                </h2>

                <div className="space-y-3 mb-6">

                    <div className="bg-[#FAF9EE] border border-[#A2AF9B] rounded-xl p-3">
                        <p className="text-sm text-gray-500">
                            Board
                        </p>

                        <p className="font-semibold">
                            {data.board}
                        </p>
                    </div>

                    <div className="bg-[#FAF9EE] border border-[#A2AF9B] rounded-xl p-3">
                        <p className="text-sm text-gray-500">
                            Role
                        </p>

                        <p className="font-semibold capitalize">
                            {data.role}
                        </p>
                    </div>

                </div>

                <button
                    onClick={acceptInvite}
                    className="btn-primary w-full"
                >
                    Accept Invitation
                </button>

            </div>

        </div>
    );
}

export default AcceptInvite