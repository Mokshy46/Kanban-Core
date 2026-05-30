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
                    />
                    <div className=' flex justify-between '>
                        <button onClick={updateBoard}>Save</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>

                    </div>
                </>
            ) : (
                <>
                    <div className=' flex justify-between '>
                        <button className=' btn-secondary' onClick={() => setIsEditing(true)}>Edit</button>
                        <button className='btn-danger' onClick={deleteBoard}>Delete</button>

                    </div>
                </>
            )}
        </div>
    );
};


export default UandDBoard