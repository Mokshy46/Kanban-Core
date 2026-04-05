import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import api from "../api";

const CreateCards = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        list: "",
    });

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();


        setError("");

        try {
            const response = await api.post("/api/cards/", formData);

            console.log("Card Created Successfully", response.data);
            setSuccess("Card Created Successfully");
            setFormData({
                title: "",
                description: "",
                list: "",
            });
            navigate("/boards")
        }

        catch (error) {
            console.log("Error during card creation:", error.response?.data);

            if (error.response?.data) {
                const data = error.response.data;

                if (data.detail) {
                    setError(data.detail)
                }
                else {
                    const firstKey = Object.keys(data)[0];
                    setError(data[firstKey]?.[0] || "card creation failed");

                }
            }

            else {
                setError("server error");
            }
        };
    }

    return (

        <div className="flex flex-col  min-h-screen items-center justify-center  heading">
            {success && (
                <p className=" text-2xl text-green-600">{success} </p>
            )}

            <div className="border rounded-2xl shadow-2xl shadow-gray-400 items-center ">


                <div className=" text-center m-5">
                    <form onSubmit={handleSubmit}>
                        <div className="p-3">
                            <label>Card Title: </label>
                            <input
                                onChange={handleChange}
                                type="text"
                                name="title"
                                value={formData.title}
                                placeholder="Enter card title"
                                className="py-2 w-full rounded-lg focus:ring-2 focus:ring-gray-600"
                            />
                        </div>



                        <div className="p-3">
                            <label>List: </label>
                            <input
                                onChange={handleChange}
                                type="number"
                                name="list"
                                value={formData.list}
                                placeholder="List"
                                className="py-2 w-full rounded-lg focus:ring-2 focus:ring-gray-600 h-15"
                            />
                        </div>

                        <div className="p-3">
                            <label>Description: </label>
                            <input
                                onChange={handleChange}
                                type="text"
                                name="description"
                                value={formData.description}
                                placeholder="Description"
                                className="py-2 w-full rounded-lg focus:ring-2 focus:ring-gray-600 h-15"
                            />
                        </div>







                        <button type="submit" className=" bg-black text-white p-3 rounded-2xl w-full h-10 active:scale-95 transition transform duration-150">Create</button>

                    </form>

                    <Link to="/boards"> <button className=" bg-black text-white p-3 rounded-2xl mt-3 h-10 active:scale-95 transition transform duration-150">Go Back</button></Link>
                </div>
            </div>
        </div>


    )
}

export default CreateCards