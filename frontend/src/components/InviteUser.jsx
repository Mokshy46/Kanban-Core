import React, { useState } from 'react'
import api from '../api';
import { toast } from 'react-toastify';

const InviteUser = ({ boardId }) => {

  const [formData, setFormData] = useState({
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState("");


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  const sendInvite = async () => {
    setLoading(true);

    try {
      const response = await api.post(
        `/api/boards/${boardId}/invite/`,
        formData
      );

      setFormData({
        email: "",
        role: "",
      });

      if (response.data.email_sent) {
        toast.success("Invitation email sent!");
      } else {
        setInviteLink(response.data.invite_link);

        await navigator.clipboard.writeText(
          response.data.invite_link
        );

        toast.info(
          "Email unavailable. Invite link copied to clipboard."
        );
      }

    } catch (error) {
      console.log(error.response?.data);

      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error("Failed to create invitation");
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

      {inviteLink && (
        <div className="bg-[#FAF9EE] border-2 border-[#A2AF9B] rounded-2xl p-4 space-y-3">
          <p className="font-semibold text-[#4A5A46]">
            Invite Link Generated
          </p>

          <input
            value={inviteLink}
            readOnly
            onClick={(e) => e.target.select()}
            className="w-full rounded-xl px-3 py-2 bg-white border border-[#A2AF9B] text-sm"
          />

          <button
            onClick={() => {
              navigator.clipboard.writeText(inviteLink);
              toast.success("Invite link copied!");
            }}
            className="btn-primary w-full"
          >
            Copy Invite Link
          </button>
        </div>
      )}

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