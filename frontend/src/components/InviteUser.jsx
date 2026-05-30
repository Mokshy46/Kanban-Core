import React, { useState } from 'react'
import api from '../api';

const InviteUser = ({ boardId }) => {

  const [formData, setFormData] = useState({
    email: "",
    role: "",
  });
  const [success,setSuccess] = useState("");
  const [error,setError] = useState("");

 
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  const sendInvite = async () => {
    try {
      await api.post(`/api/boards/${boardId}/invite/`, formData)

      setFormData({
        email: "",
        role: "",
      })
      setSuccess("Email Invite Sent Successfully")
    }

    catch (error) {
      console.log(error.response?.data);

        setSuccess("");

        if (error.response?.data?.detail) {
            setError(error.response.data.detail);
        } else {
            setError("Failed to send invitation.");
        }
    }
    
  }

  return (
    <div>
      {success &&(
        <p className=' text-2xl text-green-600 '>{success}</p>
      )}
      {error &&(
        <p className=' text-2xl text-red-600'>{error} </p>
      )}
      <h3 className=' text-2xl font-bold '>Invite Member</h3>

      <input
        type="email"
        name='email'
        placeholder="Enter email"
        value={formData.email}
        onChange={handleChange}
        className='w-full rounded-2xl px-4 py-3 my-2 bg-[#FAF9EE] border-2 border-[#A2AF9B] focus:outline-none focus:ring-2 focus:ring-[#A2AF9B]'
      />

      <select name='role' value={formData.role} onChange={handleChange} className='border-2 border-[#A2AF9B] rounded-2xl'>
        <option value="">Select Role</option>
        <option value="member">Member</option>
        <option value="admin">Admin</option>
      </select>

      <button onClick={sendInvite} className='btn-primary mx-2'>Send Invite</button>
    </div>
  )
}

export default InviteUser