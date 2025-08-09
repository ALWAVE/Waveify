"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Mail, Lock, User, X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";

import { useAuth } from "@/providers/AuthProvider";

/**
 * AuthModal – окно авторизации/регистрации.
 *
 * 🆕 Обновление: на мобильных (до md) модал занимает **всю** область экрана (`w-screen h-[100dvh]`).
 * На планшетах/десктопе остаётся аккуратная карточка в центре.
 */
interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  initialMode?: "login" | "register";
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
  exit: { opacity: 0, scale: 0.95, y: 30 },
};

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const { login, register } = useAuth();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(initialMode === "register");

  useEffect(() => {
    setIsRegister(initialMode === "register");
  }, [initialMode]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        await register(email, username, password);
      } else {
        await login(email, password);
      }
      setEmail("");
      setUsername("");
      setPassword("");
      onClose?.();
    } catch (err) {
      toast.error("Ошибка при авторизации/регистрации");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(o) => !o && onClose?.()}> {/* close on overlay click */}
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            {/* Overlay */}
            <Dialog.Overlay asChild>
              <motion.div
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 z-45 bg-gradient-to-br from-[#0e0e0e]/70 to-[#1a0f1f]/70 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            {/* Content */}
            <Dialog.Content asChild>
              <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed z-50 left-0 top-0 flex h-[100dvh] w-screen flex-col justify-center overflow-y-auto p-6 sm:p-8 border border-white/10 bg-neutral-900/80 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl md:left-1/2 md:top-1/2 md:h-auto md:w-full md:max-w-md md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl"
              >
                {/* Close btn */}
                <Dialog.Close asChild>
                  <button
                    aria-label="Close"
                    className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition hover:bg-white/10 focus:outline-none md:bg-transparent"
                  >
                    <X size={20} />
                  </button>
                </Dialog.Close>

                {/* Title & description */}
                <Dialog.Title asChild>
                  <h2 className="mb-1 text-center text-2xl font-semibold tracking-tight text-white md:mt-2">
                    {isRegister ? "Create account" : "Welcome back"}
                  </h2>
                </Dialog.Title>
                <Dialog.Description asChild>
                  <p className="mb-6 text-center text-sm text-neutral-400">
                    {isRegister ? "Join the groove" : "Log in to keep listening"}
                  </p>
                </Dialog.Description>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <InputField
                    icon={Mail}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={setEmail}
                    required
                  />

                  {isRegister && (
                    <InputField
                      icon={User}
                      type="text"
                      placeholder="nickname"
                      value={username}
                      onChange={setUsername}
                      required
                    />
                  )}

                  <InputField
                    icon={Lock}
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={setPassword}
                    required
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 py-2.5 text-sm font-bold text-white shadow-md transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Loading…" : isRegister ? "Sign Up" : "Sign In"}
                  </button>
                </form>

                {/* Toggle */}
                <p className="mt-6 text-center text-sm text-neutral-400">
                  {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegister((p) => !p)}
                    className="font-medium text-rose-400 hover:underline"
                  >
                    {isRegister ? "Log in" : "Register"}
                  </button>
                </p>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

// ---------------------------------------------------------------
// InputField – input with icon on the left
// ---------------------------------------------------------------
interface InputFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  icon: React.ElementType;
  onChange: (v: string) => void;
}

function InputField({
  icon: Icon,
  onChange,
  className,
  ...rest
}: InputFieldProps) {
  return (
    <label className="flex items-center gap-3 rounded-lg bg-neutral-800/80 px-4 py-3 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-rose-500">
      <Icon size={18} className="text-neutral-400" />
      <input
        {...rest}
        className={twMerge(
          "w-full bg-transparent text-sm text-white placeholder-neutral-500 outline-none",
          className
        )}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
