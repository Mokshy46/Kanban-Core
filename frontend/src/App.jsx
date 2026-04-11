import { Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Cards from "./components/Boards";
import CreateBoard from "./components/CreateBoard";
import CreateCards from "./components/CreateCards";
import BoardDetail from "./components/BoardDetail";
import CreateLists from "./components/CreateLists";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/boards" element={<Cards />} />
      <Route path="/create" element={<CreateBoard />} />
      {/* <Route path="/lists/:id/create-card" element={<CreateCards />} /> */}
      <Route path="/boards/:id" element={<BoardDetail />} />
      {/* <Route path="boards/:id/lists/" element ={<CreateLists/>} /> */}
      {/* <Route path="/lists/:id/create-card" element={<CreateCards />} /> */}
    </Routes>
  );
}

export default App;