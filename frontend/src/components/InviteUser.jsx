import React, { useState } from 'react'
import api from '../api';

const InviteUser = ({ boardId }) => {

  const [formData, setFormData] = useState({
    email: "",
    role: "",
  });

 
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
    }

    catch (error) {
      console.log(error.response.data)
    }
  }

  return (
    <div>
      <h3>Invite Member</h3>

      <input
        type="email"
        name='email'
        placeholder="Enter email"
        value={formData.email}
        onChange={handleChange}
      />

      <select name='role' value={formData.role} onChange={handleChange}>
        <option value="">Select Role</option>
        <option value="member">Member</option>
        <option value="admin">Admin</option>
      </select>

      <button onClick={sendInvite}>Send Invite</button>
    </div>
  )
}

export default InviteUser