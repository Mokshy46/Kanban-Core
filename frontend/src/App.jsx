import { Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Cards from "./components/Boards";
import CreateBoard from "./components/CreateBoard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/boards" element={<Cards />} />
      <Route path="/create" element={<CreateBoard />} />
    </Routes>
  );
}

export default App;