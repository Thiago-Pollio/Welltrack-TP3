import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Registro from "./pages/Registro";
import Login from "./pages/Login";
import Home from "./pages/Home";
import RegistroDiario from "./pages/RegistroDiario";

import PerfilUsuario from "./pages/PerfilUsuario";

import Planner from "./pages/Planner";
import PlannerMini from "./pages/PlannerMini";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/registro-diario" element={<RegistroDiario />} />
        <Route path="/perfil" element={<PerfilUsuario />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/planner-mini" element={<PlannerMini />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
