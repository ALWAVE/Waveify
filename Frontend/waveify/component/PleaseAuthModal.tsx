import { useState } from "react";
import AuthModal from "./AuthModal";
import ButtonLogin from "./ButtonLogin";
import Modal from "./Modal";

import { Sparkles } from "lucide-react";
interface PleaseAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PleaseAuthModal: React.FC<PleaseAuthModalProps> = ({ isOpen, onClose }) => {
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<"login" | "register">("login");
    return (
        <Modal
            classNames="bg-gradient-to-r from-purple-400 to-indigo-600"

            isOpen={isOpen}
            onChange={(open) => {
                if (!open) onClose();
            }}
        >
            <div className="flex flex-col items-center gap-y-4">
                <Sparkles className="h-10 w-10 text-purple-300 animate-pulse" />
                <h1 className="font-black text-3xl">
                    Слушайте все что угодно в Waveify
                </h1>
                <p className="text-sm text-center text-neutral-300">
                   В бесплатной версии есть все!
                </p>
                <ButtonLogin
                    onClick={() => {
                        setAuthMode("login");
                        setAuthModalOpen(true);
                    }}

                    className="no-drag bg-white text-black font-semibold px-4 py-2 md:px-5 md:py-2 text-sm md:text-base rounded-full whitespace-nowrap"
                >
                    Log In
                </ButtonLogin>
            </div>
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setAuthModalOpen(false)}
                initialMode={authMode}
            />
        </Modal>

    );
};

export default PleaseAuthModal;