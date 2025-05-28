"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import { useAuth } from "@/providers/AuthProvider";
import toast from "react-hot-toast";
interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  initialMode?: "login" | "register";
}
const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = "login" }) => {
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); // ✅ Добавляем username
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(initialMode === "register");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        console.log("Регистрируем:", { email, username, password }); // ✅ Проверяем username
        await register(email, username, password); // ✅ Передаём username
      } else {
        console.log("Логиним:", { email, password });
        await login(email, password);
      }
      setEmail("");
      setUsername(""); // ✅ Очищаем username
      setPassword("");
      // onClose();
    } catch (err) {
      console.error("Ошибка при авторизации/регистрации:", err);
      toast.error("Ошибка при авторизации/регистрации");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsRegister(initialMode === "register");
  }, [initialMode]);

  return (
    <Modal
      title={isRegister ? "Register" : "Login"}
      description={isRegister ? "Create a new account" : "Sign in to your account"}
      isOpen={isOpen}
      onChange={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* {error && <p className="text-red-500 text-center">{error}</p>} */}
        <div>
          <label className="block text-sm font-medium text-white">Email</label>
          <input
        
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mt-1 bg-neutral-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-violet-400"
            required
          />
        </div>

        {isRegister && ( // ✅ Показываем поле username только при регистрации
          <div>
            <label className="block text-sm font-medium text-white">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-1 bg-neutral-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-violet-400"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-white">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mt-1 bg-neutral-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-violet-400"
            required
          />
        </div>

        <button
          type="submit"
          className="cursor-pointer w-full bg-gradient-to-r from-violet-500 to-rose-500 text-white py-2 rounded-md hover:scale-105 transition-transform disabled:opacity-50  font-bold"
          disabled={loading}
        >
          {loading ? "Loading..." : isRegister ? "Register" : "Log in"}
        </button>
      </form>

      {/* Переключение между логином и регистрацией */}
      <p className="text-center text-sm mt-4 text-gray-400">
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          className={`cursor-pointer text-pink-400 hover:underline`}
        >
          {isRegister ? "Log in" : "Register"}
        </button>
      </p>
    </Modal>
  );
};

export default AuthModal;
