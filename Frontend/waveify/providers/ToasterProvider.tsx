"use client";

import { Toaster } from "react-hot-toast";

const ToasterProvider = () => {
    return (
        <Toaster
            position="bottom-right" // Устанавливаем положение тостера
            toastOptions={{
                style: {
                    background: '#222',
                    color: '#fff'
                }
            }}
        />
    );
};

export default ToasterProvider;
