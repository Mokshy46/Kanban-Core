import React, { useState } from "react";
import axios from "axios";

const Register = () => {
    const [formData, setFormData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        password_2: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
        setSuccess("");

        // ✅ basic frontend validation
        if (formData.password !== formData.password_2) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/user/register/",
                formData
            );

            console.log("Registration success:", response.data);

            setSuccess("Account created successfully 🎉");

            // optional: auto redirect to login
            setTimeout(() => {
                window.location.href = "/login";
            }, 1500);

        } catch (error) {
            console.log("Error during registration:", error.response?.data);

            if (error.response?.data) {
                const data = error.response.data;

                if (data.detail) {
                    setError(data.detail);
                } else {
                    const firstKey = Object.keys(data)[0];
                    setError(data[firstKey]?.[0] || "Registration failed");
                }
            } else {
                setError("Server error");
            }
        }

        setIsLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="rounded-2xl shadow-2xl shadow-gray-400 w-[400px] bg-white m-8">

                <h1 className="text-3xl font-bold text-center p-5">Register</h1>

                <form onSubmit={handleSubmit} className="px-5">

                    {/* Email */}
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
                        <label>Firts Name :</label>
                        <input
                            onChange={handleChange}
                            type="text"
                            name="first_name"
                            placeholder="Enter your Firstname"
                            className="py-2 w-full rounded-lg focus:ring-2 focus:ring-gray-600"
                        />
                    </div>




                    <div className="p-3">
                        <label>Last Name :</label>
                        <input
                            onChange={handleChange}
                            type="text"
                            name="last_name"
                            placeholder="Enter your Lastname"
                            className="py-2 w-full rounded-lg focus:ring-2 focus:ring-gray-600"
                        />
                    </div>

                    {/* Password */}
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

                    {/* Confirm Password */}
                    <div className="p-3">
                        <label>Confirm Password :</label>
                        <input
                            onChange={handleChange}
                            type="password"
                            name="password_2"
                            placeholder="Confirm your Password"
                            className="py-2 w-full rounded-lg focus:ring-2 focus:ring-gray-500"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-red-500 text-sm px-3">{error}</p>
                    )}

                    {/* Success */}
                    {success && (
                        <p className="text-green-500 text-sm px-3">{success}</p>
                    )}

                    {/* Button */}
                    <div className="p-3">
                        <button
                            disabled={isLoading}
                            type="submit"
                            className="bg-black text-white rounded-2xl w-full p-3"
                        >
                            {isLoading ? "Creating..." : "Register"}
                        </button>
                    </div>
                </form>

                <p className="text-sm text-center">
                    Already have an account?{" "}
                    <Link to="/" className="text-blue-500">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;