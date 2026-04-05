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

      setTimeout (()=>{
      navigate("/boards");

      },1000);

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


    <div className="flex flex-col  min-h-screen items-center justify-center  heading">
      {success && (
        <p className=" text-2xl text-green-600">{success} </p>
      )}

      <div className="border rounded-2xl shadow-2xl shadow-gray-400 items-center ">


        <div className=" text-center m-5">
          <form onSubmit={handleSubmit}>
            <label className=" text-3xl p-3">Create</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter board title"
              className=" rounded-2xl w-full my-7 p-4 "
            />



            <button type="submit" className=" bg-black text-white p-3 rounded-2xl w-full h-10 active:scale-95 transition transform duration-150">Create</button>

          </form>

          <Link to="/boards"> <button className=" bg-black text-white p-3 rounded-3xl mt-3 h-10 active:scale-95 transition transform duration-150">Go Back</button></Link>
        </div>
      </div>
    </div>

  );
};

export default CreateBoard;