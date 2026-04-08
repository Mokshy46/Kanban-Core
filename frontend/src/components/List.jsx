import { useEffect, useState } from "react";
import api from "../api";

const List = ({ list }) => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await api.get(`/api/cards/?list=${list.id}`);
        setCards(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCards();
  }, [list.id]);

  return (
    <div className="bg-gray-200 p-4 rounded w-64 min-w-[250px]">
      <h2 className="font-bold mb-3">{list.title}</h2>

      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-white p-2 rounded mb-2 shadow"
        >
          {card.title}
        </div>
      ))}
    </div>
  );
};

export default List;