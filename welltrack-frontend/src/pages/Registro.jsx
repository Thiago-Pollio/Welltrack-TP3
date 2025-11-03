import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Registro() {
  const [formData, setFormData] = useState({
    nombreApellido: "",
    nombreUsuario: "",
    email: "",
    password: "",
    password_confirmation: "", // 👈 agregado
    fechaNac: ""
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          nombreApellido: formData.nombreApellido,
          nombreUsuario: formData.nombreUsuario,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation, // 👈 agregado
          fechaNac: formData.fechaNac,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.mensaje ||
          data.errors?.email?.[0] ||
          data.errors?.password?.[0] ||
          "Error al registrarse"
        );
        return;
      }

      setMessage("Registro exitoso ✅");
      navigate("/login");
    } catch (error) {
      console.error("Error en el registro:", error);
      setMessage("Hubo un problema con el registro");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-12 rounded-3xl shadow-xl w-[500px] flex flex-col items-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Registro</h2>

        {message && <p className="mb-4 text-red-500">{message}</p>}

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <input
            type="text"
            name="nombreApellido"
            placeholder="Nombre completo"
            value={formData.nombreApellido}
            onChange={handleChange}
            className="border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-300 text-lg"
            required
          />
          <input
            type="text"
            name="nombreUsuario"
            placeholder="Nombre de Usuario"
            value={formData.nombreUsuario}
            onChange={handleChange}
            className="border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-300 text-lg"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            className="border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-300 text-lg"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-300 text-lg"
            required
          />
          <input
            type="password"
            name="password_confirmation"
            placeholder="Confirmar contraseña"
            value={formData.password_confirmation}
            onChange={handleChange}
            className="border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-300 text-lg"
            required
          />
          <input
            type="date"
            name="fechaNac"
            value={formData.fechaNac}
            onChange={handleChange}
            className="border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-300 text-lg"
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-green-400 to-blue-400 text-white py-4 rounded-xl shadow hover:scale-105 transition transform font-semibold text-lg"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}
