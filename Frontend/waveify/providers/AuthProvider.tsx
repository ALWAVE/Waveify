"use client";
import AuthModal from "@/component/AuthModal";

import LoadingScreen from "@/component/LoadingScreen";
import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";


interface AuthContextType {
  user: any;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false); // 🔥 Контроль модалки
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    checkAuth();
  }, []);
  const [theme, setTheme] = useState("dark")
    useEffect(() => {
        const stored = localStorage.getItem("theme");
        if(stored) {
            setTheme(stored);
            document.documentElement.classList.add(`theme-${stored}`);
        }
        else
        {
            document.documentElement.classList.add("theme-dark");
        }
    },[]);

  const checkAuth = async () => {
    try {
      await fetchUser();
    } catch (error) {
      console.error("❌ Ошибка проверки аутентификации:", error);
      setAuthModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await fetch("https://localhost:7040/api/User/me", {
        method: "GET",
        credentials: "include",
      });
  
      if (res.status === 401) {
        console.warn("⚠ Токен истёк, открываем модалку входа...");
        setAuthModalOpen(true);
        return;
      }
  
      if (!res.ok) throw new Error("Ошибка при получении данных пользователя");
    
      const userData = await res.json();
      setUser({
        ...userData,  // Это сохранит все данные пользователя
        sub: userData.subscriptionId,  // Пример поля для подписки
        
        subColor: userData.subscription?.color,
        subTitle: userData.subscription?.title ?? "Free",
        subStartDate: userData.subscriptionStart,
        subEndDate: userData.subscriptionEnd,
        role: userData.role
      });
      console.log("✅ Пользователь загружен:", userData);
      // toast.success("Загруженна подписка: " + userData.subscription.title );
      setAuthModalOpen(false); // Закрываем модалку после входа
    } catch (error) {
      console.error("❌ Ошибка авторизации:", error);
      setAuthModalOpen(true);
    }
  };
  
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("https://localhost:7040/api/User/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Ошибка авторизации");
      toast.success("Успешная авторизация!");

      await fetchUser();
    } catch (error) {

      console.error("❌ Ошибка входа:", error);
      toast.error("Ошибка авторизации");
      setAuthModalOpen(true);
    
    }
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      const res = await fetch("https://localhost:7040/api/User/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, userName: username, password })
      });

      if (!res.ok) throw new Error("Ошибка регистрации");
    
      toast.success("Успешная регистрация!");
      await login(email, password);
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      toast.error("Ошибка регистрации: ");
      toast.error("Такой аккаунт с почтой или с логином уже существует!");
    }
  };

  const logout = async () => {
    try {
      await fetch("https://localhost:7040/api/User/logout", {
        method: "POST",
        credentials: "include",
      });

      document.cookie = "jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure;";
      setUser(null);


      toast.success("Вы успешно вышли!");
      setAuthModalOpen(true); // ❗ Открываем модалку после выхода
    } catch (error) {
      toast.error("Ошибка выхода:");
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
    {loading ? (
      <LoadingScreen />
    ) : (
      <>
        {children}
        <AuthModal isOpen={isAuthModalOpen} />
      </>
    )}
  </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
