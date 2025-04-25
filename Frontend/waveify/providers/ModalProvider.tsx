"use client"
import UploadModal from "@/component/UploadModal";
import {useEffect, useState } from "react"

 
const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    if(!isMounted)
        return null;
    
    return (
        <>
        <UploadModal/>
        </>
    )
};
export default ModalProvider;