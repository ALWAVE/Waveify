"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import LoadingScreen from "@/component/LoadingScreen";
import GenreSelectModal from "@/component/GenreSelectionModal";
import AuthModal from "@/component/AuthModal";
import ElectronGate from "@/component/ElectronGate";
import usePlayer from "@/hooks/usePlayer";
import { apiFetch } from "@/libs/apiClient";

type SongDto = {
  id: string;
  title: string;
  author: string;
  duration: number | string;
  createdAt: string;
  imagePath?: string;
  songPath?: string;
  tags?: { id: string; name: string }[];
  moderationStatus?: string;
};

type UserMeDto = {
  id: string;
  userName: string;
  email: string;
  role: string;
  subscriptionId?: string | null;
  subscriptionStart?: string | null;
  subscriptionEnd?: string | null;
  subscriptionTitle?: string | null;
  subscriptionColor?: string | null;

  // 🔽 добавь
  songs?: SongDto[];
};

interface AuthContextType {
  user: any;
  mySongs: SongDto[] | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  openLogin: () => void;
  refreshUser: () => Promise<void>;
  loadMySongs: (onlyPublished?: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const player = usePlayer();
  const [user, setUser] = useState<any>(null);
  const [mySongs, setMySongs] = useState<SongDto[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [showGenreModal, setShowGenreModal] = useState(false);

  const isElectron =
    typeof navigator !== "undefined" &&
    navigator.userAgent.toLowerCase().includes("electron");

  // Тема
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    document.documentElement.classList.add(`theme-${stored || "dark"}`);
  }, []);

  // Проверка жанров
  useEffect(() => {
    const isGenresChosen = typeof window !== "undefined" ? localStorage.getItem("userGenres") : null;
    if (!isGenresChosen) setShowGenreModal(true);
  }, []);

  // Первичная проверка авторизации
  useEffect(() => {
    (async () => {
      try {
        await fetchUser();
      } catch (e) {
        console.error("❌ Ошибка проверки аутентификации:", e);
        if (isElectron) setAuthModalOpen(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Тихий авто-refresh раз в 10 минут (опционально)
  useEffect(() => {
    const id = setInterval(() => {
      apiFetch("/api/User/refresh-token", { method: "POST", retry: false }).catch(() => { });
    }, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

const mapUserForUI = (dto: UserMeDto) => {
  const hasSub = !!dto.subscriptionId;

  const subTitle = dto.subscriptionTitle ?? (hasSub ? "Waveify Premium" : "Free");
  const subColor = dto.subscriptionColor ?? (hasSub ? "#FFD700" : undefined);

  // роль приходит строкой -> нормализуем и ещё даём числовой код для совместимости
  const roleName = (dto.role ?? "User").toString(); // "Moderator" / "User" / ...
  const roleCodeMap: Record<string, number> = {
    User: 0,
    Artist: 1,
    Beatmaker: 2,
    Moderator: 3,
    Label: 4,
  };
  const roleCode = roleCodeMap[roleName] ?? 0;

  return {
    ...dto, // тут останутся и songs, если backend их отдаёт

    // новое:
    roleName,      // строковая роль (удобно для UI)
    roleCode,      // числовой код (если где-то используется)

    sub: dto.subscriptionId ?? null,
    subTitle,
    subColor,

    // ВАЖНО: даты подписки прокидываем в поля, которые читает UI
    subStartDate: dto.subscriptionStart ?? null,
    subEndDate: dto.subscriptionEnd ?? null,

    // для старого UI с объектом subscription
    subscription: hasSub ? { title: subTitle, color: subColor } : null,
  };
};



  const fetchUser = async () => {
    try {
      const res = await apiFetch("/api/User/me", { method: "GET" });

      // Диагностика
      const clone = res.clone();
      let debugText = "";
      try { debugText = await clone.text(); } catch { }

      if (res.status === 401) {
        console.warn("GET /me => 401. Body:", debugText);
        if (isElectron) setAuthModalOpen(false);
        setUser(null);
        setMySongs(null);
        return;
      }
      if (!res.ok) {
        console.error("GET /me =>", res.status, res.statusText, "Body:", debugText);
        toast.error("Ошибка при получении данных пользователя");
        setUser(null);
        setMySongs(null);
        return;
      }

      const userData: UserMeDto = JSON.parse(debugText || "{}");
      const mapped = mapUserForUI(userData);
      setUser(mapped);
      setAuthModalOpen(false);
    } catch (e) {
      console.error("❌ fetchUser exception:", e);
      if (isElectron) setAuthModalOpen(false);
      setUser(null);
      setMySongs(null);
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  const loadMySongs = async (onlyPublished = false) => {
    try {
      const url = `/api/User/me/songs${onlyPublished ? "?onlyPublished=true" : ""}`;
      const res = await apiFetch(url, { method: "GET" });
      if (res.status === 401) {
        setMySongs(null);
        return;
      }
      if (!res.ok) throw new Error("failed to load songs");
      const data: SongDto[] = await res.json();
      setMySongs(data);
    } catch (e) {
      console.error("❌ loadMySongs:", e);
      setMySongs(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await apiFetch("/api/User/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Ошибка авторизации");
      toast.success("Успешная авторизация!");
      player.reset();
      await fetchUser();      // сервер выставит куки
      await loadMySongs();    // сразу подтянем песни (если нужно)
    } catch {
      toast.error("Ошибка авторизации");
    }
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      const res = await apiFetch("/api/User/register", {
        method: "POST",
        body: JSON.stringify({ email, userName: username, password }),
      });
      if (!res.ok) throw new Error("Ошибка регистрации");
      toast.success("Успешная регистрация!");
      await login(email, password);
    } catch {
      toast.error("Ошибка регистрации: аккаунт уже существует!");
    }
  };

  const logout = async () => {
    try {
      await apiFetch("/api/User/logout", { method: "POST" });
      setUser(null);
      setMySongs(null);
      toast.success("Вы успешно вышли!");
      if (isElectron) setAuthModalOpen(false);
    } catch {
      toast.error("Ошибка выхода");
    }
  };

  const openLogin = () => setAuthModalOpen(true);

  if (loading) return <LoadingScreen />;

  if (isElectron && !user) {
    return (
      <AuthContext.Provider
        value={{ user, mySongs, login, register, logout, openLogin, refreshUser, loadMySongs }}
      >
        <ElectronGate onLoginClick={openLogin} />
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, mySongs, login, register, logout, openLogin, refreshUser, loadMySongs }}
    >
      {children}
      <GenreSelectModal
        isOpen={showGenreModal}
        onClose={() => setShowGenreModal(false)}
        onSave={(genres) => {
          if (typeof window !== "undefined") {
            localStorage.setItem("userGenres", JSON.stringify(genres));
          }
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
