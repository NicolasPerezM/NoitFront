// src/components/RegisterForm.tsx
import { useState } from "react";
import { useRegister } from "@/hooks/useRegister";

export default function RegisterForm() {
  const { mutate, isPending, isSuccess, error } = useRegister();
  console.log("useRegister hook:", { mutate, isPending, isSuccess, error });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      mutate(formData);
    } catch (err) {
      console.error("Error ejecutando mutate:", err);
    }
  };
  

  return (
    <div>
        <h1>Register Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <input
          name="email"
          placeholder="Email"
          className="w-full p-2 border"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 border"
          value={formData.password}
          onChange={handleChange}
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isPending ? "Registrando..." : "Registrarse"}
        </button>

        {isSuccess && <p className="text-green-600">¡Registro exitoso!</p>}
        {error && (
          <p className="text-red-600">Error: {(error as any).message}</p>
        )}
      </form>
    </div>
  );
}
