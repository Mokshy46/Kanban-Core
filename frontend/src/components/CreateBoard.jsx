import { useState } from "react";
import api from "../api";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const CreateBoard = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    try {
      const res = await api.post("/api/create_board/", {
        title: title,
      });

      console.log("Created:", res.data);
      setTitle("");
      setSuccess("Board Added");

      setTimeout(() => {
        navigate("/boards");

      }, 1000);

    } catch (error) {
      console.log("Error:", error.response?.data);

      if (error.response?.data) {
        const data = error.response.data;

        if (data.detail) {
          setError(data.detail);
        }
        else if (data.error) {
          setError(data.error);
        }
        else {
          const firstKey = Object.keys(data)[0];
          setError(data[firstKey]?.[0] || "Something went wrong");
        }

      } else {
        setError("Server error");
      }
    }
  };

  return (


    <div className="flex flex-col  min-h-screen items-center justify-center bg-[#FAF9EE] heading">
      {success && (
        <p className=" text-2xl text-green-600">{success} </p>
      )}
        {
          error &&(
            <p className=" text-2xl text-red-600">{error}</p>
          )
        }
      <div className=" rounded-2xl shadow-gray-400 items-center bg-white shadow-lg border-2 border-[#A2AF9B] focus:ring-2 focus:ring-[#A2AF9B] focus:border-[#A2AF9B]">


        <div className=" text-center m-5">
          <form onSubmit={handleSubmit}>
            <label className=" text-3xl p-3">Create</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter board title"
              className=" w-full rounded-2xl px-4 py-3 my-2 bg-[#FAF9EE] border-2 border-[#A2AF9B] focus:outline-none focus:ring-2 focus:ring-[#A2AF9B]" />
            <button type="submit" className="btn-primary text-black">Create</button>

          </form>

          <Link to="/boards"> <button className="btn-secondary my-2">Go Back</button></Link>
        </div>
      </div>
    </div>

  );
};

export default CreateBoard;