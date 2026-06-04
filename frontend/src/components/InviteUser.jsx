import React, { useState } from 'react'
import api from '../api';
import { toast } from 'react-toastify';

const InviteUser = ({ boardId }) => {

  const [formData, setFormData] = useState({
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  const sendInvite = async () => {
    setLoading(true);

    try {
      await api.post(`/api/boards/${boardId}/invite/`, formData);

      setFormData({
        email: "",
        role: "",
      });

      toast.success("Email Invite Sent Successfully");
    } catch (error) {
      console.log(error.response?.data);

      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error("Failed to send invitation");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">

      <h3 className="text-2xl font-bold">
        Invite Member
      </h3>

      <input
        type="email"
        name="email"
        placeholder="Enter email address"
        value={formData.email}
        onChange={handleChange}
        className="w-full rounded-2xl px-4 py-3 bg-[#FAF9EE] border-2 border-[#A2AF9B] focus:outline-none focus:ring-2 focus:ring-[#A2AF9B]"
      />

      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="w-full rounded-2xl px-4 py-3 bg-[#FAF9EE] border-2 border-[#A2AF9B] focus:outline-none focus:ring-2 focus:ring-[#A2AF9B]"
      >
        <option value="">Select Role</option>
        <option value="member">Member</option>
        <option value="admin">Admin</option>
      </select>

      <button
        onClick={sendInvite}
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        )}

        {loading ? "Sending Invite..." : "Send Invite"}
      </button>

    </div>
  )
}

export default InviteUser