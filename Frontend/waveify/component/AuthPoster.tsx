"use client"
import { useAuth } from "@/providers/AuthProvider";
import ButtonLogin from "./ButtonLogin";
import AuthModal from "./AuthModal";
import { useState } from "react";

const AuthPoster = () => {
    const { user } = useAuth();
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<"login" | "register">("register");
    // Если пользователь уже зарегистрирован, ничего не отображаем
    if (user) {
        return null;
    }

    return (
        <div className="fixed bottom-0 bg-gradient-to-r w-full from-fuchsia-500 to-purple-400  flex items-center justify-between p-4 shadow-lg z-100">
            <div className="flex flex-col">
                <h2 className="text-lg font-black text-white">Welcome to Waveify</h2>
                <p className="text-sm text-white/50">
                    Sign up to enjoy unlimited music streaming and personalized playlists!
                </p>
            </div>
            <ButtonLogin onClick={() => setAuthModalOpen(true)} className="bg-white w-64  text-black font-semibold py-2 px-4 rounded-full transition duration-200">
                Sign Up
            </ButtonLogin>
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setAuthModalOpen(false)}
                initialMode={authMode}
            />
        </div>
    );
};

export default AuthPoster;
