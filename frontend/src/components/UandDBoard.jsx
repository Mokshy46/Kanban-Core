import { useState } from 'react'
import api from '../api';

const UandDBoard = ({ board, refreshBoard }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(board.title);
    const [showMenu, setShowMenu] = useState(false);

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
                        <button className=' btn-secondary' onClick={updateBoard}>Save</button>
                        <button className='btn-danger' onClick={() => setIsEditing(false)}>Cancel</button>

                    </div>
                </>
            ) : (
                <>
                    <div className="relative flex justify-end">

                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="text-2xl font-bold px-2 py-1 rounded-lg hover:bg-[#FAF9EE]"
                        >
                            ⋮
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 top-10 w-32 bg-white border border-[#A2AF9B] rounded-xl shadow-lg z-50">

                                <button
                                    onClick={() => {
                                        setIsEditing(true);
                                        setShowMenu(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 hover:bg-[#FAF9EE] rounded-t-xl"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={deleteBoard}
                                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-[#FAF9EE] rounded-b-xl"
                                >
                                    Delete
                                </button>

                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};


export default UandDBoard