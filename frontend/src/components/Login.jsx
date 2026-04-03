import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLoading) return;

        setIsLoading(true);
        setError("");

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/user/login/",
                formData
            );

            // ✅ store tokens
            localStorage.setItem("access", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);

            console.log("Login success:", response.data);


            navigate("/boards");

        } catch (error) {
            console.log("Error during Login", error.response?.data);

            if (error.response?.data) {
                const data = error.response.data;

                if (data.detail) {
                    setError(data.detail);
                } else {
                    const firstKey = Object.keys(data)[0];
                    setError(data[firstKey]?.[0] || "Login failed");
                }
            } else {
                setError("Server error");
            }
        }

        setIsLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="rounded-2xl shadow-2xl shadow-gray-400 w-[400px] bg-white">

                <h1 className="text-3xl font-bold text-center p-5">Login</h1>

                <form onSubmit={handleSubmit} className="px-5">


                    <div className="p-3">
                        <label>Email :</label>
                        <input
                            onChange={handleChange}
                            type="email"
                            name="email"
                            placeholder="Enter your Email"
                            className="py-2 w-full rounded-lg focus:ring-2 focus:ring-gray-600"
                        />
                    </div>


                    <div className="p-3">
                        <label>Password :</label>
                        <input
                            onChange={handleChange}
                            type="password"
                            name="password"
                            placeholder="Enter your Password"
                            className="py-2 w-full rounded-lg focus:ring-2 focus:ring-gray-500"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-red-500 text-sm px-3">{error}</p>
                    )}

                    {/* Button */}
                    <div className="p-3">
                        <button
                            disabled={isLoading}
                            type="submit"
                            className="bg-black text-white rounded-2xl w-full p-3"
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                </form>

                <p className="text-sm text-center">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-500">
                        Register
                    </Link>
                </p>


            </div>
        </div>
    );
};

export default Login;