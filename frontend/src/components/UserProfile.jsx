import React, { useEffect, useState } from 'react'
import api from '../api'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'


const UserProfile = () => {

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        avatar: "",
    })

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const response = await api.get('/api/user/profile/')

                setFormData({
                    first_name: response.data.first_name,
                    last_name: response.data.last_name,
                    avatar: response.data.avatar,
                })

            }
            catch (error) {
                console.log(error)
            }
        }

        fetchProfile()

    }, [])


    const handleChange = (e) => {

        const { name, value, files } = e.target

        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        })
    }

    const handleUpdate = async (e) => {

        e.preventDefault()
        setLoading(true);
        setSuccess("");
        setError("");

        try {

            const data = new FormData()

            data.append("first_name", formData.first_name)
            data.append("last_name", formData.last_name)

            if (formData.avatar instanceof File) {
                data.append("avatar", formData.avatar)
            }

            const response = await api.patch('/api/user/profile/', data)

            setFormData({
                first_name: response.data.first_name,
                last_name: response.data.last_name,
                avatar: response.data.avatar,
            })

            toast.success("Profile updated successfully!")
            setTimeout(() => {
                setSuccess("");
            }, 3000);

        }
        catch (error) {
            toast.error("Failed to update profile")
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#FAF9EE] flex items-center justify-center p-4 heading">


            <Link
                to="/boards"
                className="inline-block mb-4 btn-secondary left-0 top-0 absolute m-2">
                ← Back to Boards
            </Link>

            <div className="bg-white border-2 border-[#A2AF9B] rounded-2xl shadow-lg p-6 w-full max-w-md">
                {success && (
                    <div className="mb-4 rounded-xl bg-green-100 border border-green-300 text-green-700 px-4 py-3">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="mb-4 rounded-xl bg-red-100 border border-red-300 text-red-700 px-4 py-3">
                        {error}
                    </div>
                )}
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
                    User Profile
                </h2>

                <div className="flex justify-center mb-6">

                    {formData.avatar ? (
                        <img
                            src={
                                typeof formData.avatar === "string"
                                    ? formData.avatar
                                    : URL.createObjectURL(formData.avatar)
                            }
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border-2 border-[#A2AF9B]" />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-[#A2AF9B] flex items-center justify-center text-white text-3xl font-bold">
                            ?
                        </div>
                    )}
                </div>

                <form onSubmit={handleUpdate} className="space-y-4">

                    <input
                        type="file"
                        name="avatar"
                        onChange={handleChange}
                        className="w-full rounded-xl p-2 bg-[#FAF9EE] border border-[#A2AF9B]" />

                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="First Name"
                        className="w-full rounded-xl px-4 py-3 bg-[#FAF9EE] border border-[#A2AF9B] focus:outline-none focus:ring-2 focus:ring-[#A2AF9B]" />

                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Last Name"
                        className="w-full rounded-xl px-4 py-3 bg-[#FAF9EE] border border-[#A2AF9B] focus:outline-none focus:ring-2 focus:ring-[#A2AF9B]" />
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? "Updating..." : "Update Profile"}
                    </button>

                </form>

            </div>

        </div>
    )
}

export default UserProfile