import React, { useState, useEffect } from 'react'
import api from '../api';
const Cards = () => {

    const [cards, setCards] = useState([]);

    useEffect(() => {

        const fetchCards = async () => {
            try {
                const response = await api.get("/api/cards/")
                setCards(response.data);

            }
            catch (error) {
                console.error(error);
            }
        };

        fetchCards();
    }, [])

    return (
        <div className="min-h-screen p-6 heading">
            <h1 className="font-bold text-2xl mb-4">Cards</h1>

            <div className="grid grid-cols-3 gap-4">
                {cards.map((card) => (
                    <div key={card.id} className="p-4 border rounded shadow">
                        <h2 className="font-semibold">{card.title}</h2>
                       
                        <p>{card.description}</p>
                        <p>{card.created_at}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Cards