import api from '../api'
import { useState } from 'react'

const UandDList = ({ list, refreshList }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(list.title);


    const handleChange =  (e) => {
        setTitle(e.target.value)

    }
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await api.patch(`/api/lists/${list.id}/`, {
                title,
            })

            setTitle(response.data.title);
            setIsEditing(false)
            refreshList();
        }

        catch (error) {
            console.log(error)
        }

    }

    const handleDelete = async (e) => {
        e.preventDefault()

        try{
        await api.delete(`/api/lists/${list.id}/`)

        refreshList();
        }

        catch(error){
            console.log(error)
        }
        
    }

    return (
        isEditing ? (
            <div>
                <input
                    type="text"
                    value={title}
                    onChange={handleChange}
                />
                <button onClick={handleUpdate}>save</button>
                <button onClick={() => setIsEditing(false)}>cancel</button>
            </div>

        ) :
            <div>
                <button onClick={() => setIsEditing(true)}>edit</button>
                <button onClick={handleDelete}>delete</button>
            </div>


    )
}

export default UandDList