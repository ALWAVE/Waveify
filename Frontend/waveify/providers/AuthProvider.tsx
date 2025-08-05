"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import usePlayer from "@/hooks/usePlayer";
import LoadingScreen from "@/component/LoadingScreen";
import GenreSelectModal from "@/component/GenreSelectionModal";
import AuthModal from "@/component/AuthModal";
import ElectronGate from "@/component/ElectronGate";

interface AuthContextType {
  user: any;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  openLogin: () => void; // Открыть модалку
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const player = usePlayer();
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [showGenreModal, setShowGenreModal] = useState(false);

  const isElectron =
    typeof navigator !== "undefined" &&
    navigator.userAgent.toLowerCase().includes("electron");

  // Темы
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) {
      document.documentElement.classList.add(`theme-${stored}`);
    } else {
      document.documentElement.classList.add("theme-dark");
    }
  }, []);

  // Проверка жанров
  useEffect(() => {
    const isGenresChosen = localStorage.getItem("userGenres");
    if (!isGenresChosen) {
      setShowGenreModal(true);
    }
  }, []);

  // Проверка авторизации
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await fetchUser();
    } catch (error) {
      console.error("❌ Ошибка проверки аутентификации:", error);
      // В вебе не блокируем, в Electron блокируем
      if (isElectron) {
        setAuthModalOpen(false); // Покажем кнопку "Войти" в ElectronGate
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await fetch("http://77.94.203.78:5000/api/User/me", {
        method: "GET",
        credentials: "include",
      });

      if (res.status === 401) {
        if (isElectron) {
          setAuthModalOpen(false); // Не модалка сразу, а кнопка входа
        }
        return;
      }

      if (!res.ok) throw new Error("Ошибка при получении данных пользователя");

      const userData = await res.json();
      setUser({
        ...userData,
        sub: userData.subscriptionId,
        subColor: userData.subscription?.color,
        subTitle: userData.subscription?.title ?? "Free",
        subStartDate: userData.subscriptionStart,
        subEndDate: userData.subscriptionEnd,
        role: userData.role,
      });
      setAuthModalOpen(false);
    } catch (error) {
      console.error("❌ Ошибка авторизации:", error);
      if (isElectron) {
        setAuthModalOpen(false);
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("http://77.94.203.78:5000/api/User/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Ошибка авторизации");
      toast.success("Успешная авторизация!");

      player.reset();
      await fetchUser();
    } catch (error) {
      toast.error("Ошибка авторизации");
    }
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      const res = await fetch("http://77.94.203.78:5000/api/User/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, userName: username, password }),
      });

      if (!res.ok) throw new Error("Ошибка регистрации");

      toast.success("Успешная регистрация!");
      await login(email, password);
    } catch (error) {
      toast.error("Ошибка регистрации: аккаунт уже существует!");
    }
  };

  const logout = async () => {
    try {
      await fetch("http://77.94.203.78:5000/api/User/logout", {
        method: "POST",
        credentials: "include",
      });
      document.cookie = "jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure;";
      setUser(null);
      toast.success("Вы успешно вышли!");
      if (isElectron) {
        setAuthModalOpen(false);
      }
    } catch {
      toast.error("Ошибка выхода");
    }
  };

  const openLogin = () => {
    setAuthModalOpen(true);
  };

  if (loading) return <LoadingScreen />;

  if (isElectron && !user) {
    return (
      <AuthContext.Provider value={{ user, token, login, register, logout, openLogin }}>
        <ElectronGate onLoginClick={openLogin} />
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
      </AuthContext.Provider>
    );
  }

  // Если браузер или пользователь авторизован
  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, openLogin }}>
      {children}
      <GenreSelectModal
        isOpen={showGenreModal}
        onClose={() => setShowGenreModal(false)}
        onSave={(genres) => {
          localStorage.setItem("userGenres", JSON.stringify(genres));
        }}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
