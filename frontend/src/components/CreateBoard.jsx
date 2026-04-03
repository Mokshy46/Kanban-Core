import { useState } from "react";
import api from "../api";
import { data } from "react-router-dom";

const CreateBoard = () => {
  const [title, setTitle] = useState("");
  const [success, setSuccess] = useState("");
  const [error,setError] = useState("");

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


    } catch (error) {

      console.log("Error during registration", error.res?.data);

      if (error.res?.data) {
        setError(data.detail);

        if (data.detail) {
          setError(data.error);

        }
        else{
          const firstKey = Object.keys(data)[0];
          setError(data[firstKey]?.[0] || "Registration Failed");
        }
      }
      else {
        setError("server error");
      }

      console.error(error);
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
        </div>
      </div>
    </div>

  );
};

export default CreateBoard;