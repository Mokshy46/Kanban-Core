import React, { useState } from 'react'
import api from '../api';


const AddBoardMembers = ({ board, refreshMemberLists }) => {
    const [formData, setFormData] = useState({
        email: "",
        role: "",
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })

    }
    const addMember = async (e) => {
        e.preventDefault();
        if (!board?.id) return;

        try {
            const response = await api.post(`/api/boards/${board.id}/add_members/`,
                formData
            )

            setFormData({
                email: "",
                role: "",
            })

            refreshMemberLists();
        }

        catch (error) {
            console.log(error)
        }

    }


    return (
        <div>
            <input
                type="email"
                onChange={handleChange}
                name='email'
                value={formData.email}
                className='m-2 font-medium'
                placeholder='enter member email'
            />


            <input
                type="text"
                onChange={handleChange}
                name='role'
                value={formData.role}
                className='m-2 font-medium'
                placeholder='enter member role'
            />

            <button onClick={addMember} className="bg-blue-500 px-3 py-1 mr-2">
                Add Member
            </button>


        </div>
    )
}

export default AddBoardMembers