import React, { useEffect, useState } from 'react'
import api from '../api'

const UserProfile = () => {

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        avatar: "",
    })

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

        try {

            const data = new FormData()

            data.append("first_name", formData.first_name)
            data.append("last_name", formData.last_name)

            if (formData.avatar instanceof File) {
                data.append("avatar", formData.avatar)
            }

            const response = await api.patch(
                '/api/user/profile/',
                data
            )

            setFormData({
                first_name: response.data.first_name,
                last_name: response.data.last_name,
                avatar: response.data.avatar,
            })
        }
        catch (error) {
            console.log(error.response?.data)
        }
    }

    return (
        <div>

            <h2 className='text-center font-bold text-2xl'>User Profile</h2>

            <form onSubmit={handleUpdate}>

                <input
                    type="file"
                    name="avatar"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="First Name"
                />

                <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Last Name"
                />

                <button type="submit">
                    Update
                </button>

            </form>
            {formData.avatar && (
                <img
                    src={
                        typeof formData.avatar === "string"
                            ? formData.avatar
                            : URL.createObjectURL(formData.avatar)
                    }
                    className="w-20 h-20 rounded-full"
                />
            )}
        </div>
    )
}

export default UserProfile