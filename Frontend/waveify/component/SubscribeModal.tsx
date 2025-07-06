"use client";


import Modal from "./Modal";

import { Sparkles } from "lucide-react";
import SmartLink from "./SmartLink";

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({ isOpen, onClose }) => {
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
          Subscribe to Premium
        </h1>
        <p className="text-sm text-center text-neutral-300">
          Подписка дает доступ к премиум функциям: неограниченное использование, особые темы и многое другое.
        </p>
        <SmartLink
          className=" w-64 flex items-center justify-center active:scale-95 bg-white hover:scale-90 text-black font-bold py-2 px-4 rounded-full hover:opacity-90 transition"
          href={"/premium"}
          onClick={() => onClose()}
          
        >
          Subscribe
        </SmartLink>
      </div>
    </Modal>
  );
};

export default SubscribeModal;
