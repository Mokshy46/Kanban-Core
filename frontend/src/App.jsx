import { Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Cards from "./components/Boards";
import CreateBoard from "./components/CreateBoard";
import CreateCards from "./components/CreateCards";
import BoardDetail from "./components/BoardDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/boards" element={<Cards />} />
      <Route path="/create" element={<CreateBoard />} />
      <Route path="/createcards" element={<CreateCards />} />
      <Route path="/boards/:id" element={<BoardDetail />} />

    </Routes>
  );
}

export default App;