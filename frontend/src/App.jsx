import { Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Cards from "./components/Boards";
import CreateBoard from "./components/CreateBoard";
import CreateCards from "./components/CreateCards";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/boards" element={<Cards />} />
      <Route path="/create" element={<CreateBoard />} />
      <Route path="/createcards" element={<CreateCards />} />

    </Routes>
  );
}

export default App;