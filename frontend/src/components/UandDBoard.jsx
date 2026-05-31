import { useState } from 'react'
import api from '../api';

const UandDBoard = ({ board, refreshBoard }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(board.title);


    const updateBoard = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/api/boards/${board.id}/`, { title });
            setIsEditing(false);
            refreshBoard();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteBoard = async (e) => {
        e.preventDefault();
        try {
            await api.delete(`/api/boards/${board.id}/`)
            refreshBoard();

        }

        catch (error) {
            console.log(error);
        }
    }


    return (
        <div className=' heading'>
            {isEditing ? (
                <>


                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className=' w-full rounded-2xl px-4 py-3 my-2 bg-[#FAF9EE] border-2 border-[#A2AF9B] focus:outline-none focus:ring-2 focus:ring-[#A2AF9B]'
                    />
                    <div className=' flex justify-between m-3 md:m-0'>
                        <button  className=' btn-secondary' onClick={updateBoard}>Save</button>
                        <button className='btn-danger' onClick={() => setIsEditing(false)}>Cancel</button>

                    </div>
                </>
            ) : (
                <>
                    <div className=' flex justify-between m-3 md:m-0'>
                        <button className=' btn-secondary' onClick={() => setIsEditing(true)}>Edit</button>
                        <button className='btn-danger' onClick={deleteBoard}>Delete</button>

                    </div>
                </>
            )}
        </div>
    );
};


export default UandDBoard